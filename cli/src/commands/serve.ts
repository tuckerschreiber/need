import { execFileSync } from 'child_process';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { NeedApiClient } from '../lib/api-client.js';

export async function serveCommand(): Promise<void> {
  const server = new McpServer({
    name: 'need',
    version: '0.1.0',
  });

  const client = new NeedApiClient();

  server.tool(
    'search_tools',
    'Search for CLI tools by describing what you need in plain English',
    {
      query: z.string().describe('What you need the tool to do, in plain English'),
      limit: z.number().optional().default(5).describe('Max results to return'),
    },
    async ({ query, limit }) => {
      try {
        const { results } = await client.search(query, limit);

        if (results.length === 0) {
          return {
            content: [{ type: 'text' as const, text: 'No tools found for that query. Try different words.' }],
          };
        }

        const text = results
          .map(
            (t, i) =>
              `${i + 1}. **${t.name}** (id: ${t.id}) — ${t.description}\n   Install: \`${t.install_command}\`\n   Success rate: ${Math.round(t.success_rate * 100)}% (${t.use_count} uses)`
          )
          .join('\n\n');

        const footer = '\n\n---\n\u{1F4A1} Use report_tool_usage with the tool id to report whether a tool worked.';

        return { content: [{ type: 'text' as const, text: text + footer }] };
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error';
        return { content: [{ type: 'text' as const, text: `Error searching: ${message}` }], isError: true };
      }
    }
  );

  server.tool(
    'report_tool_usage',
    'Report whether a discovered tool worked for your task',
    {
      tool_id: z.number().describe('The tool ID from search results'),
      success: z.boolean().describe('Whether the tool worked'),
      query_text: z.string().optional().describe('The original search query'),
    },
    async ({ tool_id, success, query_text }) => {
      try {
        await client.reportSignal(tool_id, success, query_text);
        return {
          content: [{ type: 'text' as const, text: `Signal recorded: ${success ? 'success' : 'failure'} for tool ${tool_id}` }],
        };
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error';
        return { content: [{ type: 'text' as const, text: `Error reporting: ${message}` }], isError: true };
      }
    }
  );

  const ALLOWED_COMMANDS: Record<string, string[]> = {
    'brew': ['install'],
    'apt': ['install'],
    'apt-get': ['install'],
    'npm': ['install'],
    'pip': ['install'],
    'pip3': ['install'],
    'cargo': ['install'],
  };

  function parseAndValidateCommand(command: string): { bin: string; args: string[] } | null {
    const parts = command.split(/\s+/).filter(Boolean);
    if (parts.length < 2) return null;
    const [bin, subcommand, ...rest] = parts;
    const allowedSubs = ALLOWED_COMMANDS[bin];
    if (!allowedSubs || !allowedSubs.includes(subcommand)) return null;
    // Reject shell metacharacters in any argument
    const dangerous = /[;&|`$()><\n\\]/;
    if (rest.some((arg) => dangerous.test(arg))) return null;
    return { bin, args: [subcommand, ...rest] };
  }

  server.tool(
    'install_tool',
    'Install a CLI tool using a package manager. Only allows safe install commands.',
    {
      command: z.string().describe('The install command to run (e.g. "brew install jq")'),
      tool_id: z.number().optional().describe('Tool ID from search results, for auto-reporting success/failure'),
    },
    async ({ command, tool_id }) => {
      const parsed = parseAndValidateCommand(command);
      if (!parsed) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `Error: command not allowed. Must be a simple install command using: ${Object.keys(ALLOWED_COMMANDS).join(', ')}`,
            },
          ],
          isError: true,
        };
      }

      try {
        const output = execFileSync(parsed.bin, parsed.args, { encoding: 'utf-8', timeout: 120000 });

        if (tool_id !== undefined) {
          try {
            await client.reportSignal(tool_id, true);
          } catch {
            // best-effort reporting
          }
        }

        return {
          content: [{ type: 'text' as const, text: output || 'Install completed successfully.' }],
        };
      } catch (err) {
        if (tool_id !== undefined) {
          try {
            await client.reportSignal(tool_id, false);
          } catch {
            // best-effort reporting
          }
        }

        const message = err instanceof Error ? err.message : 'Unknown error';
        return {
          content: [{ type: 'text' as const, text: `Install failed: ${message}` }],
          isError: true,
        };
      }
    }
  );

  const transport = new StdioServerTransport();
  await server.connect(transport);
}
