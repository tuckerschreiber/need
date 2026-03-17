-- Improved search_tools: blends semantic similarity (65%) with FTS rank (35%)
-- Signature matches the deployed version the API already calls.
CREATE OR REPLACE FUNCTION search_tools(
  query_embedding vector(1536),
  query_text text DEFAULT '',
  match_threshold float DEFAULT 0.4,
  match_count int DEFAULT 10
)
RETURNS TABLE (
  id bigint,
  name text,
  description text,
  short_description text,
  install_command text,
  package_manager text,
  platform text[],
  category text,
  source_url text,
  binaries text[],
  usage_examples jsonb,
  similarity float,
  success_rate float,
  use_count bigint
)
LANGUAGE sql STABLE
AS $$
  WITH semantic AS (
    SELECT
      t.id,
      1 - (t.embedding <=> query_embedding) AS sem_score
    FROM public.tools t
    WHERE 1 - (t.embedding <=> query_embedding) > match_threshold
  ),
  fts AS (
    SELECT
      s.id,
      CASE
        WHEN query_text IS NULL OR query_text = '' THEN 0.0
        ELSE COALESCE(
          ts_rank(
            to_tsvector('english', t.name || ' ' || t.description),
            plainto_tsquery('english', query_text)
          ),
          0.0
        )
      END AS fts_score
    FROM public.tools t
    JOIN semantic s ON s.id = t.id
  ),
  combined AS (
    SELECT
      t.id,
      t.name,
      t.description,
      t.short_description,
      t.install_command,
      t.package_manager,
      t.platform,
      t.category,
      t.source_url,
      t.binaries,
      t.usage_examples,
      s.sem_score,
      f.fts_score,
      -- ts_rank typically returns small values (~0.01-0.1); scale to [0,1] range
      LEAST(f.fts_score * 10, 1.0) AS fts_norm,
      COALESCE(
        SUM(CASE WHEN sig.success THEN 1 ELSE 0 END)::float /
        NULLIF(COUNT(sig.id), 0),
        0.5
      ) AS success_rate,
      COUNT(sig.id) AS use_count
    FROM public.tools t
    JOIN semantic s ON s.id = t.id
    JOIN fts f ON f.id = t.id
    LEFT JOIN public.signals sig ON sig.tool_id = t.id
    GROUP BY t.id, t.name, t.description, t.short_description,
             t.install_command, t.package_manager, t.platform,
             t.category, t.source_url, t.binaries, t.usage_examples,
             s.sem_score, f.fts_score
  )
  SELECT
    id, name, description, short_description, install_command,
    package_manager, platform, category, source_url, binaries, usage_examples,
    sem_score AS similarity,
    success_rate,
    use_count
  FROM combined
  ORDER BY (sem_score * 0.65 + fts_norm * 0.35) DESC
  LIMIT match_count;
$$;
