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
}

export function createDb(databaseUrl: string) {
  const sql = neon(databaseUrl);

  return {
    async searchTools(queryEmbedding: number[], limit: number = 10): Promise<SearchResult[]> {
      const results = await sql`
        SELECT * FROM search_tools(
          ${JSON.stringify(queryEmbedding)}::vector(1536),
          0.3,
          ${limit}
        )
      `;
      return results as SearchResult[];
    },

    async logQuery(queryText: string, resultsCount: number): Promise<void> {
      await sql`
        INSERT INTO queries (query_text, results_count)
        VALUES (${queryText}, ${resultsCount})
      `;
    },

    async insertSignal(toolId: number, success: boolean, queryText?: string, agentType?: string): Promise<void> {
      await sql`
        INSERT INTO signals (tool_id, query_text, success, agent_type)
        VALUES (${toolId}, ${queryText ?? null}, ${success}, ${agentType ?? null})
      `;
    },
  };
}
