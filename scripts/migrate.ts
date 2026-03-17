import { neon } from "@neondatabase/serverless";

const sql = neon(
  "REDACTED_DATABASE_URL"
);

async function migrate() {
  console.log("Starting migration...\n");

  // 1. Enable pgvector (Neon-compatible syntax)
  console.log("1. Enabling pgvector extension...");
  await sql`create extension if not exists vector`;
  console.log("   Done.\n");

  // 2. Create tools table
  console.log("2. Creating tools table...");
  await sql`
    create table if not exists public.tools (
      id bigint generated always as identity primary key,
      name text not null,
      description text not null,
      install_command text not null,
      package_manager text not null,
      platform text[] default '{}',
      category text,
      source_url text,
      embedding vector(1536),
      created_at timestamptz default now()
    )
  `;
  console.log("   Done.\n");

  // 3. Create unique index on tools
  console.log("3. Creating tools_name_pm_idx...");
  await sql`
    create unique index if not exists tools_name_pm_idx on public.tools (name, package_manager)
  `;
  console.log("   Done.\n");

  // 4. Create ivfflat index on embeddings
  console.log("4. Creating tools_embedding_idx...");
  try {
    await sql`
      create index if not exists tools_embedding_idx on public.tools
        using ivfflat (embedding vector_cosine_ops) with (lists = 100)
    `;
    console.log("   Done.\n");
  } catch (e: any) {
    // ivfflat index may fail on empty table; that's ok
    console.log(`   Skipped (${e.message}). Can be created after data is loaded.\n`);
  }

  // 5. Create FTS index on description
  console.log("5. Creating tools_description_fts_idx...");
  await sql`
    create index if not exists tools_description_fts_idx on public.tools
      using gin (to_tsvector('english', description))
  `;
  console.log("   Done.\n");

  // 6. Create queries table
  console.log("6. Creating queries table...");
  await sql`
    create table if not exists public.queries (
      id bigint generated always as identity primary key,
      query_text text not null,
      results_count int default 0,
      created_at timestamptz default now()
    )
  `;
  console.log("   Done.\n");

  // 7. Create signals table
  console.log("7. Creating signals table...");
  await sql`
    create table if not exists public.signals (
      id bigint generated always as identity primary key,
      tool_id bigint references public.tools(id) on delete cascade,
      query_text text,
      success boolean not null,
      agent_type text,
      created_at timestamptz default now()
    )
  `;
  console.log("   Done.\n");

  // 8. Create index on signals.tool_id
  console.log("8. Creating signals_tool_id_idx...");
  await sql`
    create index if not exists signals_tool_id_idx on public.signals (tool_id)
  `;
  console.log("   Done.\n");

  // 9. Create search_tools function
  console.log("9. Creating search_tools function...");
  await sql`
    create or replace function search_tools(
      query_embedding vector(1536),
      match_threshold float default 0.3,
      match_count int default 10
    )
    returns table (
      id bigint,
      name text,
      description text,
      install_command text,
      package_manager text,
      platform text[],
      category text,
      source_url text,
      similarity float,
      success_rate float,
      use_count bigint
    )
    language sql stable
    as $$
      select
        t.id,
        t.name,
        t.description,
        t.install_command,
        t.package_manager,
        t.platform,
        t.category,
        t.source_url,
        1 - (t.embedding <=> query_embedding) as similarity,
        coalesce(
          sum(case when s.success then 1 else 0 end)::float /
          nullif(count(s.id), 0),
          0.5
        ) as success_rate,
        count(s.id) as use_count
      from public.tools t
      left join public.signals s on s.tool_id = t.id
      where 1 - (t.embedding <=> query_embedding) > match_threshold
      group by t.id
      order by
        (1 - (t.embedding <=> query_embedding)) * 0.5 +
        coalesce(
          sum(case when s.success then 1 else 0 end)::float /
          nullif(count(s.id), 0),
          0.5
        ) * 0.5
        desc
      limit match_count;
    $$
  `;
  console.log("   Done.\n");

  // Verify
  console.log("--- Verification ---");
  const tables = await sql`
    select table_name from information_schema.tables
    where table_schema = 'public' and table_type = 'BASE TABLE'
    order by table_name
  `;
  console.log("Tables:", tables.map((r: any) => r.table_name));

  const funcs = await sql`
    select routine_name from information_schema.routines
    where routine_schema = 'public' and routine_type = 'FUNCTION'
    order by routine_name
  `;
  console.log("Functions:", funcs.map((r: any) => r.routine_name));

  const exts = await sql`
    select extname from pg_extension where extname = 'vector'
  `;
  console.log("Extensions:", exts.map((r: any) => r.extname));

  console.log("\nMigration complete!");
}

migrate().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
