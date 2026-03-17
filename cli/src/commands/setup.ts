import * as fs from 'node:fs';
import * as path from 'node:path';
import * as os from 'node:os';

const MCP_CONFIG = { command: 'npx', args: ['@needtools/need', 'serve'] };

interface McpConfig {
  mcpServers?: Record<string, unknown>;
  [key: string]: unknown;
}

type ConfigResult = 'configured' | 'already configured' | 'skipped';

function ensureDir(dirPath: string): void {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function configureMcpServer(filePath: string, key: string): ConfigResult {
  let config: McpConfig;

  if (fs.existsSync(filePath)) {
    const raw = fs.readFileSync(filePath, 'utf-8');
    config = JSON.parse(raw) as McpConfig;

    if (config.mcpServers && key in config.mcpServers) {
      return 'already configured';
    }

    if (!config.mcpServers) {
      config.mcpServers = {};
    }
  } else {
    config = { mcpServers: {} };
  }

  config.mcpServers![key] = MCP_CONFIG;

  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, JSON.stringify(config, null, 2) + '\n', 'utf-8');
  return 'configured';
}

export async function setupCommand(): Promise<void> {
  const home = os.homedir();
  const results: Array<{ name: string; result: ConfigResult; reason?: string }> = [];

  // Claude Code
  const claudeConfigPath = path.join(home, '.claude.json');
  const claudeResult = configureMcpServer(claudeConfigPath, 'need');
  results.push({ name: 'Claude Code', result: claudeResult });

  // Cursor
  const cursorDir = path.join(home, '.cursor');
  if (fs.existsSync(cursorDir) && fs.statSync(cursorDir).isDirectory()) {
    const cursorConfigPath = path.join(cursorDir, 'mcp.json');
    const cursorResult = configureMcpServer(cursorConfigPath, 'need');
    results.push({ name: 'Cursor', result: cursorResult });
  } else {
    results.push({ name: 'Cursor', result: 'skipped', reason: 'not installed' });
  }

  for (const { name, result, reason } of results) {
    if (result === 'skipped') {
      console.log(`\u2013 ${name} \u2014 skipped (${reason})`);
    } else {
      console.log(`\u2713 ${name} \u2014 ${result}`);
    }
  }
}
