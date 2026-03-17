import { NeedApiClient } from '../lib/api-client.js';
import type { SearchResult } from '../lib/types.js';

export async function reportCommand(
  toolName: string,
  opts: { success?: boolean; fail?: boolean },
): Promise<void> {
  if (!opts.success && !opts.fail) {
    console.error('\n  Error: Please specify --success or --fail\n');
    process.exit(1);
  }

  const success = !!opts.success;
  const client = new NeedApiClient();

  try {
    const { results } = await client.search(toolName, 10);

    if (results.length === 0) {
      console.error(`\n  Error: No tool found matching "${toolName}"\n`);
      process.exit(1);
    }

    // Prefer exact match (case-insensitive), fall back to first result
    const exact = results.find(
      (r) => r.name.toLowerCase() === toolName.toLowerCase(),
    );
    const tool: SearchResult = exact ?? results[0];

    await client.reportSignal(tool.id, success, toolName);

    const outcome = success ? 'success' : 'failure';
    console.log(`\n  Reported ${outcome} for "${tool.name}". Thanks for the feedback!\n`);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error(`\n  Error: ${message}\n`);
    process.exit(1);
  }
}
