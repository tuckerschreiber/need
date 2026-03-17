import { neon } from '@neondatabase/serverless';

const DATABASE_URL = process.env.DATABASE_URL!;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY!;

const sql = neon(DATABASE_URL);

interface BrewFormula {
  name: string;
  desc: string;
  homepage: string;
  versions: { stable: string };
}

async function fetchBrewFormulae(): Promise<BrewFormula[]> {
  console.log('Fetching Homebrew formulae...');
  const res = await fetch('https://formulae.brew.sh/api/formula.json');
  if (!res.ok) throw new Error(`Homebrew API error: ${res.status}`);
  const data = await res.json() as BrewFormula[];
  console.log(`Fetched ${data.length} formulae`);
  return data;
}

async function getEmbeddings(texts: string[]): Promise<number[][]> {
  const res = await fetch('https://api.openai.com/v1/embeddings', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      input: texts,
      model: 'text-embedding-3-small',
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`OpenAI error (${res.status}): ${body}`);
  }

  const data = await res.json() as {
    data: Array<{ embedding: number[]; index: number }>;
  };

  return data.data
    .sort((a, b) => a.index - b.index)
    .map((d) => d.embedding);
}

async function seed() {
  const formulae = await fetchBrewFormulae();

  const tools = formulae
    .filter((f) => f.desc && f.desc.length > 0)
    .map((f) => ({
      name: f.name,
      description: f.desc,
      install_command: `brew install ${f.name}`,
      package_manager: 'brew',
      platform: ['macos', 'linux'],
      source_url: f.homepage,
    }));

  console.log(`Processing ${tools.length} tools with descriptions`);

  const BATCH_SIZE = 100;
  let inserted = 0;

  for (let i = 0; i < tools.length; i += BATCH_SIZE) {
    const batch = tools.slice(i, i + BATCH_SIZE);
    const texts = batch.map((t) => `${t.name}: ${t.description}`);

    console.log(`Embedding batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(tools.length / BATCH_SIZE)}...`);
    const embeddings = await getEmbeddings(texts);

    for (let j = 0; j < batch.length; j++) {
      const tool = batch[j];
      const embedding = JSON.stringify(embeddings[j]);
      try {
        await sql`
          INSERT INTO tools (name, description, install_command, package_manager, platform, source_url, embedding)
          VALUES (${tool.name}, ${tool.description}, ${tool.install_command}, ${tool.package_manager}, ${['macos', 'linux']}, ${tool.source_url}, ${embedding}::vector(1536))
          ON CONFLICT (name, package_manager) DO UPDATE SET
            description = EXCLUDED.description,
            install_command = EXCLUDED.install_command,
            source_url = EXCLUDED.source_url,
            embedding = EXCLUDED.embedding
        `;
        inserted++;
      } catch (err) {
        console.error(`Error inserting ${tool.name}:`, err);
      }
    }

    console.log(`Inserted ${inserted}/${tools.length}`);
    await new Promise((r) => setTimeout(r, 200));
  }

  console.log(`\nDone! Seeded ${inserted} tools.`);
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
