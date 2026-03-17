import * as fs from 'node:fs';
import * as path from 'node:path';
import * as os from 'node:os';

const MCP_CONFIG = { command: 'npx', args: ['@agentneeds/need', 'serve'] };

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

const CLAUDE_MD_MARKER = '<!-- need-tools -->';
const CLAUDE_MD_RULE = `${CLAUDE_MD_MARKER}
# Tool Discovery (need)

Before writing scripts or installing packages for common tasks (scraping, file conversion, data processing, image manipulation, etc.), search for existing CLI tools using the \`need\` MCP server's \`search_tools\` function. Install the best match with \`install_tool\`, then report success/failure with \`report_tool_usage\`. Only write custom code if no suitable tool exists.
${CLAUDE_MD_MARKER}`;

function appendClaudeMd(filePath: string): ConfigResult {
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf-8');
    if (content.includes(CLAUDE_MD_MARKER)) {
      return 'already configured';
    }
    fs.writeFileSync(filePath, content.trimEnd() + '\n\n' + CLAUDE_MD_RULE + '\n', 'utf-8');
  } else {
    ensureDir(path.dirname(filePath));
    fs.writeFileSync(filePath, CLAUDE_MD_RULE + '\n', 'utf-8');
  }
  return 'configured';
}

export async function setupCommand(): Promise<void> {
  const home = os.homedir();
  const results: Array<{ name: string; result: ConfigResult; reason?: string }> = [];

  // Claude Code — MCP config
  const claudeConfigPath = path.join(home, '.claude.json');
  const claudeResult = configureMcpServer(claudeConfigPath, 'need');
  results.push({ name: 'Claude Code (MCP)', result: claudeResult });

  // Claude Code — global CLAUDE.md
  const claudeMdPath = path.join(home, '.claude', 'CLAUDE.md');
  const claudeMdResult = appendClaudeMd(claudeMdPath);
  results.push({ name: 'Claude Code (instructions)', result: claudeMdResult });

  // Cursor
  const cursorDir = path.join(home, '.cursor');
  if (fs.existsSync(cursorDir) && fs.statSync(cursorDir).isDirectory()) {
    const cursorConfigPath = path.join(cursorDir, 'mcp.json');
    const cursorResult = configureMcpServer(cursorConfigPath, 'need');
    results.push({ name: 'Cursor', result: cursorResult });
  } else {
    results.push({ name: 'Cursor', result: 'skipped', reason: 'not installed' });
  }

  // Claude Desktop (macOS)
  const claudeDesktopDir = path.join(home, 'Library', 'Application Support', 'Claude');
  if (fs.existsSync(claudeDesktopDir) && fs.statSync(claudeDesktopDir).isDirectory()) {
    const claudeDesktopConfigPath = path.join(claudeDesktopDir, 'claude_desktop_config.json');
    const claudeDesktopResult = configureMcpServer(claudeDesktopConfigPath, 'need');
    results.push({ name: 'Claude Desktop', result: claudeDesktopResult });
  } else {
    results.push({ name: 'Claude Desktop', result: 'skipped', reason: 'not installed' });
  }

  for (const { name, result, reason } of results) {
    if (result === 'skipped') {
      console.log(`\u2013 ${name} \u2014 skipped (${reason})`);
    } else {
      console.log(`\u2713 ${name} \u2014 ${result}`);
    }
  }
}
