# need

> Discover the right CLI tool for any task — in plain English.

AI agents and developers constantly need CLI tools but don't know which ones exist. `need` solves this with semantic search across thousands of tools, an MCP server for AI agent integration, and community-driven quality signals.

## Quick start

```bash
npx @needtools/need "compress png images"
```

## What it does

**For developers** — find and install tools without Googling:

```bash
need convert pdf to png
need install "compress video files"
need report jq --success
```

**For AI agents** — discover tools programmatically via MCP:

```bash
need setup    # configures Claude Code + Cursor
need serve    # runs the MCP server
```

After setup, your AI agent can search for, install, and report on CLI tools autonomously.

## How it works

1. Describe what you need in plain English
2. `need` searches a vector database of CLI tools using semantic similarity
3. Results are ranked by relevance and community success signals
4. Install directly, or let your AI agent handle it via MCP

## Architecture

| Package | Description |
|---------|-------------|
| [`cli/`](./cli) | The `need` CLI and MCP server ([npm](https://www.npmjs.com/package/@needtools/need)) |
| [`api/`](./api) | Search API powered by Cloudflare Workers + pgvector |
| [`site/`](./site) | Marketing site |

## Contributing

```bash
git clone https://github.com/tuckerschreiber/need.git
cd need
npm install
cd cli && npm run build && npm test
```

## License

MIT
