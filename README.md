<p align="center">
  <img src="assets/logo.svg" alt="need" width="400" />
</p>

<p align="center">Find the right CLI tool in plain English.</p>

AI agents hallucinate package names. Developers waste time Googling. `need` fixes both — semantic search across 10,000+ CLI tools, with an MCP server so AI agents can discover and install tools autonomously.

```bash
npx @agentneeds/need "compress png images"
```

```
  1. pngquant         brew install pngquant       92% success
  2. optipng          brew install optipng         87% success
  3. imagemagick      brew install imagemagick     94% success
```

## Install

```bash
npm install -g @agentneeds/need
```

Or use directly with `npx @agentneeds/need`.

## Usage

### Search

Describe what you need. Get ranked results with install commands and success rates.

```bash
need convert pdf to png
need find duplicate files
need compress video without losing quality
```

### Install

Search and install interactively:

```bash
need install "compress png images"
```

### Report

Tell us if a tool worked. Every signal improves results for everyone.

```bash
need report pngquant --success
need report sometool --fail
```

### MCP for AI agents

One command configures `need` as an MCP server for your AI tools:

```bash
need setup
```

```
  ✓ Claude Code — configured
  ✓ Cursor — configured
```

Now your AI agent can:
1. **Search** for the right tool via `search_tools`
2. **Install** it via `install_tool` (security allowlist — only safe package manager commands)
3. **Report** whether it worked via `report_tool_usage`

The entire loop happens without leaving your editor.

## How it works

1. You describe what you need in plain English
2. Your query is converted to an embedding and matched against a vector database of CLI tools
3. Results are ranked by semantic similarity + community success signals
4. Install directly, or let your AI agent handle it

## Browse tools

Explore all 10,000+ indexed tools at [agentneed.dev](https://agentneed.dev).

## Architecture

| Package | Description |
|---------|-------------|
| [`cli/`](./cli) | The `need` CLI and MCP server ([npm](https://www.npmjs.com/package/@agentneeds/need)) |
| [`api/`](./api) | Search API — Cloudflare Workers + Neon Postgres + pgvector |
| [`site/`](./site) | Marketing site and tool directory ([agentneed.dev](https://agentneed.dev)) |

## Contributing

```bash
git clone https://github.com/tuckerschreiber/need.git
cd need
npm install
cd cli && npm run build && npm test
```

## License

MIT
