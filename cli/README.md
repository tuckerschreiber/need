# need

Discover the right CLI tool for any task using plain English.

## Install

```bash
npm install -g @needtools/need
```

## Usage

### Search for tools

Describe what you want to do and `need` finds the right CLI tool:

```bash
need convert pdf to png
need compress video files
need find duplicate files
```

### Report tool success or failure

Help improve recommendations by reporting whether a tool worked:

```bash
need report jq --success
need report jq --fail
```

### Interactive install

Search for a tool and install it interactively:

```bash
need install "compress png images"
```

### MCP server

Run `need` as a Model Context Protocol server so AI agents can discover tools programmatically:

```bash
need serve
```

### MCP setup

Automatically configure the MCP server for supported AI clients:

```bash
need setup
```

This registers `need` as an MCP server with:

- **Claude Code** -- adds the server to Claude Code's MCP configuration
- **Cursor** -- adds the server to Cursor's MCP configuration

After setup, your AI assistant can call `need` to discover CLI tools on your behalf.
