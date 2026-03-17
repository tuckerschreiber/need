import { NeedApiClient } from '../lib/api-client.js';
import { formatResults } from '../lib/formatter.js';

export async function searchCommand(query: string): Promise<void> {
  const client = new NeedApiClient();

  try {
    const { results } = await client.search(query);
    console.log(formatResults(results));
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error(`\n  Error: ${message}\n`);
    process.exit(1);
  }
}
