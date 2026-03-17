export interface ToolResult {
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

/** Alias used by api-client */
export type SearchResult = ToolResult;
