# need

> Discover the right CLI tool for any task using plain English.

Semantic search across 6,000+ CLI tools. Works standalone or as an MCP server for AI coding agents.

## Install

```bash
npm install -g @needtools/need
```

Or run directly: `npx @needtools/need "compress png images"`

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

### MCP setup

Configure `need` as an MCP server for your AI tools:

```bash
need setup
```

Supports **Claude Code** and **Cursor**. After setup, your AI agent can discover, install, and report on tools autonomously.

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
- [npm](https://www.npmjs.com/package/@needtools/need)

## License

MIT
