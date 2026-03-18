# Signals + Stars Ranking Design

**Date:** 2026-03-17

## Goal

Fix search ranking so canonical tools (curl, ripgrep, imagemagick) surface first, and make the system self-improving as agents report results.

## The Problem

37 signals in the DB, 3 with query text. Not enough real feedback to learn from. Meanwhile niche tools with exact keyword matches (ipull, zfind, imgdiet) beat well-known tools on FTS. The 35% FTS weight introduced earlier does more harm than good.

## Solution: Two-signal hybrid ranking

### Cold-start: GitHub stars
Fetch star counts for all ~10k tools. Log-normalize so curl (36k stars) naturally beats ipull (100 stars) for generic download queries. Stars are real, external, verifiable — not fabricated.

### Learned ranking: Query embeddings on signals
When an agent reports success/failure via `/signal`, store the embedding of `query_text` alongside the signal. Future searches find signals where stored query_embedding ≈ current query_embedding, compute success rate for those matching signals → `proven_score`. Defaults to 0.5 (neutral) when no similar past queries exist.

## Ranking Formula

```
final_score = semantic_similarity * 0.50
            + star_score           * 0.25
            + proven_score         * 0.15
            + fts_norm             * 0.10
```

- **semantic** (0.50): cosine similarity between query embedding and tool embedding
- **star_score** (0.25): `LOG(github_stars + 1) / LOG(max_stars + 1)` — log scale, 0–1
- **proven_score** (0.15): success rate of this tool for semantically similar past queries (similarity > 0.75), defaults to 0.5
- **fts_norm** (0.10): FTS tiebreaker, down from 35% — stops keyword-heavy niche tools from dominating

## Schema Changes

```sql
-- tools table
ALTER TABLE public.tools ADD COLUMN github_stars int NOT NULL DEFAULT 0;

-- signals table
ALTER TABLE public.signals ADD COLUMN query_embedding vector(1536);
CREATE INDEX signals_query_embedding_idx ON public.signals
  USING ivfflat (query_embedding vector_cosine_ops) WITH (lists = 10);
```

## New Components

**`scripts/fetch-stars.ts`**
- Reads all tools from DB
- Extracts GitHub owner/repo from `source_url` via regex
- Calls GitHub REST API `/repos/{owner}/{repo}` in batches
- Writes `github_stars` back to DB
- Needs `GITHUB_TOKEN` env var (5000 req/hr vs 60 unauthenticated)
- Tools without GitHub URL keep `github_stars = 0`

**Updated `/signal` endpoint**
- When `query_text` is present, call `getEmbedding()` (already exists in `api/src/lib/embeddings.ts`)
- Pass embedding to `insertSignal()`
- One extra OpenAI call per signal, only when query text provided

**`supabase/migrations/003_stars_and_proven_score.sql`**
- Adds `github_stars` and `query_embedding` columns
- New `search_tools` function with 4-signal formula
- `proven_score` CTE: for each candidate tool, find signals with similar `query_embedding`, compute success rate

## Trade-offs

| | Stars approach | Synthetic signals |
|-|----------------|------------------|
| Data quality | Real, external, verifiable | Fabricated |
| Cold-start | Immediate | Immediate |
| Self-improving | No (static until refresh) | Yes but fake |
| Defensibility | High | Low |

Stars + real query embeddings = best of both: immediate fix + genuine learning loop.

## Success Criteria

After implementation, all 14 test queries return expected canonical tool in top 2.
