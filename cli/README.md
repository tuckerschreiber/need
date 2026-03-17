<p align="center">
  <img src="https://raw.githubusercontent.com/tuckerschreiber/need/main/assets/logo.svg" alt="need" width="400" />
</p>

<p align="center">Discover the right CLI tool for any task using plain English.</p>

Semantic search across 10,000+ CLI tools. Works standalone or as an MCP server for AI coding agents.

## Install

```bash
npm install -g @agentneeds/need
```

That's it. MCP servers are automatically configured for **Claude Code**, **Cursor**, and **Claude Desktop** on install. Your AI tools can immediately discover and install CLI tools.

Or run directly: `npx @agentneeds/need "compress png images"`

## Commands

### Search

```bash
need convert pdf to png
need compress video files
need find duplicate files
```

### Install

Search and install interactively:

```bash
need install "compress png images"
```

### Report

Help improve results by reporting whether a tool worked:

```bash
need report jq --success
need report sometool --fail
```

### Project integration

Add `need` instructions to your project so AI tools use it automatically:

```bash
need init
```

Generates config files for Claude Code, Cursor, GitHub Copilot, and Windsurf.

### MCP setup

Manually configure MCP servers (already done automatically on install):

```bash
need setup
```

Supports **Claude Code**, **Cursor**, and **Claude Desktop**.

### MCP server

Run the MCP server directly (used by `need setup` under the hood):

```bash
need serve
```

Exposes three tools:
- `search_tools` — semantic search across CLI tools
- `install_tool` — install with a security allowlist (brew, apt, npm, pip, cargo only)
- `report_tool_usage` — report success or failure to improve rankings

## How it works

Queries are converted to embeddings and matched against a vector database of CLI tools using pgvector. Results are ranked by semantic similarity combined with community success/failure signals.

No API keys required. No accounts. Just install and search.

## Links

- [GitHub](https://github.com/tuckerschreiber/need)
- [Website](https://agentneed.dev)
- [npm](https://www.npmjs.com/package/@agentneeds/need)

## License

MIT
