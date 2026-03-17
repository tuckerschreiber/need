import type { ToolResult } from './types.js';

const DEFAULT_API_URL = 'https://api.agentneed.dev';

interface SearchResponse {
  results: ToolResult[];
  query: string;
}

export class NeedApiClient {
  private baseUrl: string;

  constructor(baseUrl?: string) {
    this.baseUrl = baseUrl ?? process.env.NEED_API_URL ?? DEFAULT_API_URL;
  }

  async search(query: string, limit = 10): Promise<SearchResponse> {
    const url = new URL('/search', this.baseUrl);
    url.searchParams.set('q', query);
    url.searchParams.set('limit', String(limit));

    const res = await fetch(url.toString());
    if (!res.ok) {
      const body = await res.text();
      throw new Error(`API error (${res.status}): ${body}`);
    }
    return res.json() as Promise<SearchResponse>;
  }

  async reportSignal(toolId: number, success: boolean, queryText?: string, commandRan?: string, context?: string): Promise<void> {
    const res = await fetch(new URL('/signal', this.baseUrl).toString(), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        tool_id: toolId,
        success,
        query_text: queryText,
        agent_type: 'cli',
        command_ran: commandRan,
        context: context,
      }),
    });

    if (!res.ok) {
      const body = await res.text();
      throw new Error(`Signal error (${res.status}): ${body}`);
    }
  }
}
