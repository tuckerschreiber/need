import type { ToolResult } from './types.js';

export function formatResults(results: ToolResult[]): string {
  if (results.length === 0) {
    return '\n  No tools found for that query. Try different words.\n';
  }

  const lines = results.map((tool, i) => {
    const num = `  ${i + 1}.`;
    const name = tool.name.padEnd(16);
    const cmd = tool.install_command.padEnd(35);
    const rate = `${Math.round(tool.success_rate * 100)}% success`;
    const uses = tool.use_count > 0 ? `  ${formatCount(tool.use_count)} uses` : '  new';
    return `${num} ${name} ${cmd} ${rate}${uses}`;
  });

  return '\n' + lines.join('\n') + '\n';
}

function formatCount(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}
