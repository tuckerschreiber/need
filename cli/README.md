<p align="center">
  <img src="https://raw.githubusercontent.com/tuckerschreiber/need/main/assets/logo.svg" alt="need" width="400" />
</p>

<p align="center">Tool discovery for AI agents.</p>

<p align="center">
  <a href="https://github.com/tuckerschreiber/need/actions/workflows/ci.yml"><img src="https://github.com/tuckerschreiber/need/actions/workflows/ci.yml/badge.svg" alt="CI" /></a>
  <a href="https://www.npmjs.com/package/@agentneeds/need"><img src="https://img.shields.io/npm/v/%40agentneeds/need?color=c8e64a&label=npm" alt="npm version" /></a>
  <a href="https://github.com/tuckerschreiber/need/blob/main/LICENSE"><img src="https://img.shields.io/github/license/tuckerschreiber/need?color=c8e64a" alt="license" /></a>
  <a href="https://www.npmjs.com/package/@agentneeds/need"><img src="https://img.shields.io/npm/dm/%40agentneeds/need?color=c8e64a&label=downloads" alt="downloads" /></a>
</p>

AI agents hallucinate package names. `need` gives them a verified index of 10,000+ CLI tools — and a closed feedback loop that gets smarter with every install.

## What happens

You ask Claude to "compress these PNGs". Claude doesn't have `pngquant` installed and doesn't know what the best tool is. But `need` is running as an MCP server in the background, so Claude automatically:

1. **Searches** need for "compress png images"
2. **Installs** the top result (`brew install pngquant`)
3. **Runs** it on your files
4. **Reports** that it worked — so the next agent's search ranks `pngquant` higher

You never interact with `need` directly. You just see the result.

```
  search → install → use → report
    ↑                        |
    └────── rankings ────────┘
```

## Install

```bash
npm install -g @agentneeds/need
```

That's it. MCP servers are automatically configured for **Claude Code**, **Cursor**, and **Claude Desktop** on install. Your AI agent can immediately discover and install CLI tools without you doing anything.

Or run with npx: `npx @agentneeds/need "compress png images"`

## How agents use it

Under the hood, `need` exposes three MCP tools that agents call autonomously:

1. **`search_tools`** — semantic search across 10,000+ CLI tools
2. **`install_tool`** — install the best match (security allowlist: brew, apt, npm, pip, cargo only)
3. **`report_tool_usage`** — report success or failure, improving rankings for every future agent

No API keys. No accounts. No configuration.

### Setup

MCP is configured automatically on install. To manually reconfigure:

```bash
need setup
```

To add project-level config files for GitHub Copilot and Windsurf:

```bash
need init
```

## Works for humans too

`need` also works as a standalone CLI — semantic search that understands intent, not just keywords.

```bash
need convert pdf to png
need find duplicate files
need compress video without losing quality
```

## How it works

Queries are embedded and matched against a pgvector database of CLI tools. Results are ranked by semantic similarity combined with community success/failure signals from `report_tool_usage`.

## Links

- [GitHub](https://github.com/tuckerschreiber/need)
- [Website](https://agentneed.dev)
- [npm](https://www.npmjs.com/package/@agentneeds/need)

## License

MIT
