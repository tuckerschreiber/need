import { neon } from '@neondatabase/serverless';

const DATABASE_URL = process.env.DATABASE_URL!;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY!;

if (!DATABASE_URL || !OPENAI_API_KEY) {
  console.error('Required: DATABASE_URL, OPENAI_API_KEY');
  process.exit(1);
}

const sql = neon(DATABASE_URL);

interface Tool {
  name: string;
  description: string;
  install_command: string;
  package_manager: string;
  platform: string[];
  source_url: string | null;
}

// ── Embedding ──────────────────────────────────────────────

async function getEmbeddings(texts: string[]): Promise<number[][]> {
  const res = await fetch('https://api.openai.com/v1/embeddings', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ input: texts, model: 'text-embedding-3-small' }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`OpenAI error (${res.status}): ${body}`);
  }

  const data = (await res.json()) as {
    data: Array<{ embedding: number[]; index: number }>;
  };
  return data.data.sort((a, b) => a.index - b.index).map((d) => d.embedding);
}

// ── Insert ─────────────────────────────────────────────────

async function insertBatch(tools: Tool[]): Promise<number> {
  const BATCH_SIZE = 50;
  let inserted = 0;

  for (let i = 0; i < tools.length; i += BATCH_SIZE) {
    const batch = tools.slice(i, i + BATCH_SIZE);
    const texts = batch.map((t) => `${t.name}: ${t.description}`);

    const batchNum = Math.floor(i / BATCH_SIZE) + 1;
    const totalBatches = Math.ceil(tools.length / BATCH_SIZE);
    console.log(`  Embedding batch ${batchNum}/${totalBatches}...`);

    const embeddings = await getEmbeddings(texts);

    const results = await Promise.allSettled(
      batch.map((tool, j) => {
        const embedding = JSON.stringify(embeddings[j]);
        return sql`
          INSERT INTO tools (name, description, install_command, package_manager, platform, source_url, embedding)
          VALUES (${tool.name}, ${tool.description}, ${tool.install_command}, ${tool.package_manager}, ${tool.platform}, ${tool.source_url}, ${embedding}::vector(1536))
          ON CONFLICT (name, package_manager) DO UPDATE SET
            description = EXCLUDED.description,
            install_command = EXCLUDED.install_command,
            source_url = EXCLUDED.source_url,
            embedding = EXCLUDED.embedding
        `;
      })
    );

    for (const r of results) {
      if (r.status === 'fulfilled') inserted++;
      else console.error('  Insert failed:', (r as PromiseRejectedResult).reason);
    }
  }

  return inserted;
}

// ── npm ────────────────────────────────────────────────────

async function fetchNpmCliTools(maxTools: number = 500): Promise<Tool[]> {
  console.log('\n📦 Fetching npm CLI tools...');
  const tools: Tool[] = [];
  const PAGE_SIZE = 250;

  for (let from = 0; tools.length < maxTools; from += PAGE_SIZE) {
    const url = `https://registry.npmjs.org/-/v1/search?text=keywords:cli&size=${PAGE_SIZE}&from=${from}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`npm API error: ${res.status}`);

    const data = (await res.json()) as {
      total: number;
      objects: Array<{
        package: {
          name: string;
          description?: string;
          links: { homepage?: string; repository?: string; npm?: string };
        };
        score: { detail: { popularity: number } };
      }>;
    };

    if (data.objects.length === 0) break;

    for (const obj of data.objects) {
      const pkg = obj.package;
      if (!pkg.description || pkg.description.length < 5) continue;
      // Skip scoped packages that are likely internal
      if (pkg.name.startsWith('@') && obj.score.detail.popularity < 0.1) continue;

      tools.push({
        name: pkg.name,
        description: pkg.description,
        install_command: `npm install -g ${pkg.name}`,
        package_manager: 'npm',
        platform: ['macos', 'linux', 'windows'],
        source_url: pkg.links.homepage || pkg.links.repository || pkg.links.npm || null,
      });

      if (tools.length >= maxTools) break;
    }
  }

  console.log(`  Found ${tools.length} npm CLI tools`);
  return tools;
}

// ── Cargo/crates.io ────────────────────────────────────────

async function fetchCargoCliTools(maxTools: number = 500): Promise<Tool[]> {
  console.log('\n🦀 Fetching Cargo CLI tools...');
  const tools: Tool[] = [];
  const PER_PAGE = 100;

  for (let page = 1; tools.length < maxTools; page++) {
    const url = `https://crates.io/api/v1/crates?category=command-line-utilities&per_page=${PER_PAGE}&sort=downloads&page=${page}`;
    const res = await fetch(url, {
      headers: { 'User-Agent': 'need-seed-script (https://github.com/tuckerschreiber/need)' },
    });
    if (!res.ok) throw new Error(`crates.io API error: ${res.status}`);

    const data = (await res.json()) as {
      crates: Array<{
        name: string;
        description: string | null;
        homepage: string | null;
        repository: string | null;
        documentation: string | null;
      }>;
      meta: { total: number };
    };

    if (data.crates.length === 0) break;

    for (const crate of data.crates) {
      if (!crate.description || crate.description.length < 5) continue;

      tools.push({
        name: crate.name,
        description: crate.description,
        install_command: `cargo install ${crate.name}`,
        package_manager: 'cargo',
        platform: ['macos', 'linux', 'windows'],
        source_url: crate.homepage || crate.repository || crate.documentation || null,
      });

      if (tools.length >= maxTools) break;
    }

    // crates.io rate limit: 1 req/sec
    await new Promise((r) => setTimeout(r, 1100));
  }

  console.log(`  Found ${tools.length} Cargo CLI tools`);
  return tools;
}

// ── PyPI ───────────────────────────────────────────────────

async function fetchPypiCliTools(maxTools: number = 500): Promise<Tool[]> {
  console.log('\n🐍 Fetching PyPI CLI tools...');

  // Step 1: Get top packages list
  const topRes = await fetch('https://hugovk.github.io/top-pypi-packages/top-pypi-packages-30-days.min.json');
  if (!topRes.ok) throw new Error(`Top PyPI packages fetch failed: ${topRes.status}`);

  const topData = (await topRes.json()) as {
    rows: Array<{ project: string; download_count: number }>;
  };

  console.log(`  Scanning top ${topData.rows.length} PyPI packages for CLI tools...`);

  const tools: Tool[] = [];
  let checked = 0;

  for (const row of topData.rows) {
    if (tools.length >= maxTools) break;

    try {
      const res = await fetch(`https://pypi.org/pypi/${row.project}/json`);
      if (!res.ok) continue;

      const data = (await res.json()) as {
        info: {
          name: string;
          summary: string;
          classifiers: string[];
          project_urls: Record<string, string> | null;
          home_page: string | null;
        };
      };

      const info = data.info;
      const isConsole = info.classifiers.some(
        (c) => c.includes('Environment :: Console') || c.includes('Topic :: Utilities')
      );

      if (!isConsole || !info.summary || info.summary.length < 5) continue;

      const sourceUrl =
        info.project_urls?.Homepage ||
        info.project_urls?.Repository ||
        info.project_urls?.['Source Code'] ||
        info.project_urls?.Source ||
        info.home_page ||
        null;

      tools.push({
        name: info.name,
        description: info.summary,
        install_command: `pip install ${info.name}`,
        package_manager: 'pip',
        platform: ['macos', 'linux', 'windows'],
        source_url: sourceUrl,
      });

      checked++;
      if (checked % 100 === 0) {
        console.log(`  Checked ${checked} packages, found ${tools.length} CLI tools so far...`);
      }
    } catch {
      // Skip packages that fail
      continue;
    }
  }

  console.log(`  Found ${tools.length} PyPI CLI tools (checked ${checked} packages)`);
  return tools;
}

// ── Main ───────────────────────────────────────────────────

const SOURCES = process.argv.slice(2);
const VALID_SOURCES = ['npm', 'cargo', 'pip', 'all'];

if (SOURCES.length === 0 || SOURCES.some((s) => !VALID_SOURCES.includes(s))) {
  console.log('Usage: tsx seed-ecosystems.ts <npm|cargo|pip|all>');
  process.exit(1);
}

const runAll = SOURCES.includes('all');

async function main() {
  let totalInserted = 0;

  if (runAll || SOURCES.includes('npm')) {
    const tools = await fetchNpmCliTools(750);
    const n = await insertBatch(tools);
    console.log(`✅ npm: inserted ${n} tools`);
    totalInserted += n;
  }

  if (runAll || SOURCES.includes('cargo')) {
    const tools = await fetchCargoCliTools(750);
    const n = await insertBatch(tools);
    console.log(`✅ cargo: inserted ${n} tools`);
    totalInserted += n;
  }

  if (runAll || SOURCES.includes('pip')) {
    const tools = await fetchPypiCliTools(500);
    const n = await insertBatch(tools);
    console.log(`✅ pip: inserted ${n} tools`);
    totalInserted += n;
  }

  console.log(`\n🎉 Done! Total inserted: ${totalInserted}`);
}

main().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
