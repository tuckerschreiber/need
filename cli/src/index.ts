#!/usr/bin/env node
import { program } from 'commander';
import { searchCommand } from './commands/search.js';
import { reportCommand } from './commands/report.js';

program
  .name('need')
  .description('Discover the right CLI tool for any task')
  .version('0.1.0')
  .argument('[query...]', 'What you need (in plain English)')
  .action(async (queryParts: string[]) => {
    if (queryParts.length === 0) {
      program.help();
      return;
    }
    const query = queryParts.join(' ');
    await searchCommand(query);
  });

program
  .command('report <tool>')
  .description('Report whether a tool worked')
  .option('--success', 'The tool worked')
  .option('--fail', 'The tool did not work')
  .action(async (tool: string, opts: { success?: boolean; fail?: boolean }) => {
    await reportCommand(tool, opts);
  });

program
  .command('serve')
  .description('Run as MCP server (for Claude Code, Cursor, etc.)')
  .action(async () => {
    const { serveCommand } = await import('./commands/serve.js');
    await serveCommand();
  });

program
  .command('setup')
  .description('Configure need as MCP server for your AI tools')
  .action(async () => {
    const { setupCommand } = await import('./commands/setup.js');
    await setupCommand();
  });

program
  .command('install <query...>')
  .description('Search and install a CLI tool interactively')
  .action(async (queryParts: string[]) => {
    const { installCommand } = await import('./commands/install.js');
    const query = queryParts.join(' ');
    await installCommand(query);
  });

program.parse();
