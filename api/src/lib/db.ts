import { neon } from '@neondatabase/serverless';

export interface SearchResult {
  id: number;
  name: string;
  description: string;
  install_command: string;
  package_manager: string;
  platform: string[];
  category: string | null;
  source_url: string | null;
  similarity: number;
  success_rate: number;
  use_count: number;
  github_stars: number;
  short_description: string | null;
  binaries: string[];
  usage_examples: Array<{ description: string; command: string }>;
}

export function createDb(databaseUrl: string) {
  const sql = neon(databaseUrl);

  return {
    async searchTools(queryEmbedding: number[], limit: number = 10, queryText: string = ''): Promise<SearchResult[]> {
      const results = await sql`
        SELECT * FROM search_tools(
          ${JSON.stringify(queryEmbedding)}::vector(1536),
          ${queryText},
          0.4,
          ${limit}
        )
      `;
      return results as SearchResult[];
    },

    async searchToolsFTS(query: string, limit: number = 10): Promise<SearchResult[]> {
      const results = await sql`
        SELECT t.id, t.name, t.description, t.short_description,
               t.install_command, t.package_manager, t.platform,
               t.category, t.source_url, t.binaries, t.usage_examples,
               t.github_stars,
               ts_rank(to_tsvector('english', t.description), plainto_tsquery('english', ${query})) AS similarity,
               COALESCE(
                 SUM(CASE WHEN sig.success THEN 1 ELSE 0 END)::float /
                 NULLIF(COUNT(sig.id), 0),
                 0.5
               ) AS success_rate,
               COUNT(sig.id) AS use_count
        FROM public.tools t
        LEFT JOIN public.signals sig ON sig.tool_id = t.id
        WHERE to_tsvector('english', t.description) @@ plainto_tsquery('english', ${query})
        GROUP BY t.id, t.name, t.description, t.short_description,
                 t.install_command, t.package_manager, t.platform,
                 t.category, t.source_url, t.binaries, t.usage_examples,
                 t.github_stars
        ORDER BY similarity DESC
        LIMIT ${limit}
      `;
      return results as SearchResult[];
    },

    async logQuery(queryText: string, resultsCount: number): Promise<void> {
      await sql`
        INSERT INTO queries (query_text, results_count)
        VALUES (${queryText}, ${resultsCount})
      `;
    },

    async insertSignal(toolId: number, success: boolean, queryText?: string, agentType?: string, commandRan?: string, context?: string, queryEmbedding?: number[]): Promise<void> {
      if (queryEmbedding) {
        await sql`
          INSERT INTO signals (tool_id, query_text, success, agent_type, command_ran, context, query_embedding)
          VALUES (${toolId}, ${queryText ?? null}, ${success}, ${agentType ?? null}, ${commandRan ?? null}, ${context ?? null}, ${JSON.stringify(queryEmbedding)}::vector(1536))
        `;
      } else {
        await sql`
          INSERT INTO signals (tool_id, query_text, success, agent_type, command_ran, context)
          VALUES (${toolId}, ${queryText ?? null}, ${success}, ${agentType ?? null}, ${commandRan ?? null}, ${context ?? null})
        `;
      }
    },

    async getToolByName(name: string): Promise<SearchResult | null> {
      const results = await sql`
        SELECT
          t.id, t.name, t.description, t.short_description,
          t.install_command, t.package_manager, t.platform,
          t.category, t.source_url, t.binaries, t.usage_examples,
          t.github_stars,
          0 AS similarity,
          COALESCE(
            SUM(CASE WHEN sig.success THEN 1 ELSE 0 END)::float /
            NULLIF(COUNT(sig.id), 0),
            0.5
          ) AS success_rate,
          COUNT(sig.id) AS use_count
        FROM tools t
        LEFT JOIN signals sig ON sig.tool_id = t.id
        WHERE lower(t.name) = lower(${name})
        GROUP BY t.id, t.name, t.description, t.short_description,
                 t.install_command, t.package_manager, t.platform,
                 t.category, t.source_url, t.binaries, t.usage_examples,
                 t.github_stars
        LIMIT 1
      `;
      return (results[0] as SearchResult) ?? null;
    },

    async listTools(options: { category?: string; limit?: number; offset?: number } = {}): Promise<{ tools: SearchResult[]; total: number }> {
      const limit = options.limit ?? 50;
      const offset = options.offset ?? 0;

      const results = options.category
        ? await sql`
            SELECT t.id, t.name, t.description, t.short_description,
                   t.install_command, t.package_manager, t.platform,
                   t.category, t.source_url, t.binaries, t.usage_examples,
                   t.github_stars,
                   0 AS similarity,
                   COALESCE(
                     SUM(CASE WHEN sig.success THEN 1 ELSE 0 END)::float /
                     NULLIF(COUNT(sig.id), 0),
                     0.5
                   ) AS success_rate,
                   COUNT(sig.id) AS use_count,
                   COUNT(*) OVER()::int AS total_count
            FROM tools t
            LEFT JOIN signals sig ON sig.tool_id = t.id
            WHERE t.category = ${options.category}
            GROUP BY t.id, t.name, t.description, t.short_description,
                     t.install_command, t.package_manager, t.platform,
                     t.category, t.source_url, t.binaries, t.usage_examples,
                     t.github_stars
            ORDER BY t.name ASC
            LIMIT ${limit} OFFSET ${offset}
          `
        : await sql`
            SELECT t.id, t.name, t.description, t.short_description,
                   t.install_command, t.package_manager, t.platform,
                   t.category, t.source_url, t.binaries, t.usage_examples,
                   t.github_stars,
                   0 AS similarity,
                   COALESCE(
                     SUM(CASE WHEN sig.success THEN 1 ELSE 0 END)::float /
                     NULLIF(COUNT(sig.id), 0),
                     0.5
                   ) AS success_rate,
                   COUNT(sig.id) AS use_count,
                   COUNT(*) OVER()::int AS total_count
            FROM tools t
            LEFT JOIN signals sig ON sig.tool_id = t.id
            GROUP BY t.id, t.name, t.description, t.short_description,
                     t.install_command, t.package_manager, t.platform,
                     t.category, t.source_url, t.binaries, t.usage_examples,
                     t.github_stars
            ORDER BY t.name ASC
            LIMIT ${limit} OFFSET ${offset}
          `;

      const total = results.length > 0 ? (results[0] as any).total_count : 0;
      return { tools: results as SearchResult[], total };
    },

    async getCategories(): Promise<Array<{ category: string; count: number }>> {
      const results = await sql`
        SELECT category, COUNT(*)::int as count
        FROM tools
        WHERE category IS NOT NULL AND category != ''
        GROUP BY category
        ORDER BY count DESC
      `;
      return results as Array<{ category: string; count: number }>;
    },

    async getTrendingTools(days: number = 7, limit: number = 10): Promise<Array<{
      id: number;
      name: string;
      install_command: string;
      github_stars: number;
      agent_uses: number;
      success_rate: number;
    }>> {
      const results = await sql`
        SELECT * FROM trending_tools(${days}, ${limit})
      `;
      return results as any[];
    },
  };
}
