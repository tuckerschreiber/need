import type { ToolResult } from './types.js';

export function formatResults(results: ToolResult[]): string {
  if (results.length === 0) {
    return '\n  No tools found for that query. Try different words.\n';
  }

  const lines = results.map((tool, i) => {
    const num = `  ${i + 1}.`;
    const name = tool.name;
    const rate = `${Math.round(tool.success_rate * 100)}% success`;
    const uses = tool.use_count > 0 ? `  ${formatCount(tool.use_count)} uses` : '';

    let block = `${num} ${name}\n     ${tool.install_command}    ${rate}${uses}`;

    if (tool.usage_examples && tool.usage_examples.length > 0) {
      const examples = tool.usage_examples
        .slice(0, 3)
        .map((ex) => `       ${ex.command}  # ${ex.description}`)
        .join('\n');
      block += '\n     Usage:\n' + examples;
    }

    return block;
  });

  return '\n' + lines.join('\n\n') + '\n';
}

function formatCount(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}
