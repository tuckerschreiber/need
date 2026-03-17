import { createInterface } from 'node:readline';
import { execSync } from 'node:child_process';
import { NeedApiClient } from '../lib/api-client.js';
import { formatResults } from '../lib/formatter.js';

export async function installCommand(query: string): Promise<void> {
  const client = new NeedApiClient();

  const { results } = await client.search(query, 5);

  if (results.length === 0) {
    console.log(formatResults(results));
    return;
  }

  console.log(formatResults(results));

  const rl = createInterface({ input: process.stdin, output: process.stdout });

  const answer = await new Promise<string>((resolve) => {
    rl.question(`  Install which tool? [1-${results.length}/n] `, (ans) => {
      resolve(ans.trim());
      rl.close();
    });
  });

  if (!answer || answer.toLowerCase() === 'n') {
    return;
  }

  const index = parseInt(answer, 10);
  if (isNaN(index) || index < 1 || index > results.length) {
    console.error(`\n  Invalid selection: ${answer}\n`);
    return;
  }

  const tool = results[index - 1];
  console.log(`\n  Running: ${tool.install_command}\n`);

  try {
    execSync(tool.install_command, { stdio: 'inherit' });
    console.log(`\n  Installed ${tool.name} successfully.\n`);
    try { await client.reportSignal(tool.id, true, query); } catch { /* best-effort */ }
  } catch {
    console.error(`\n  Failed to install ${tool.name}.\n`);
    try { await client.reportSignal(tool.id, false, query); } catch { /* best-effort */ }
  }
}
