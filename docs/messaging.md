# need — Messaging & Website Copy

## Positioning

**One-liner:** The tool discovery layer for AI agents and developers.

**Elevator pitch:** AI coding agents are great at writing code but terrible at knowing which CLI tools exist. `need` gives them (and you) semantic search across thousands of tools, with install and feedback built in.

**Category:** Developer infrastructure / AI agent tooling

**Narrative:** Every day, developers and AI agents waste time Googling for CLI tools, guessing package names, and installing the wrong thing. `need` is a searchable index of CLI tools that understands what you mean, not just what you type. It works from the terminal or as an MCP server that lets AI agents discover, install, and report on tools autonomously.

**Website:** [agentneed.dev](https://agentneed.dev)

---

## Core Message

**"AI agents shouldn't be blocked by not knowing a tool exists."**

Your AI agent can write a PDF converter from scratch in 30 seconds. Or it could just install one. The problem isn't capability — it's discovery.

---

## What's Live

- **CLI** — `npx @needtools/need` with search, install, report, serve, setup commands
- **API** — Cloudflare Workers at need-api.schreibertucbiz.workers.dev
- **6,000+ tools** — Seeded from Homebrew, enriched with LLM-generated descriptions and usage examples
- **MCP server** — 3 tools (search_tools, install_tool, report_tool_usage) with security allowlist
- **Auto-setup** — One command configures Claude Code + Cursor
- **Marketing site** — Landing page, browsable tool directory, individual tool pages, search
- **Community signals** — Success/failure reporting that improves search rankings

---

## Website Sections

### Hero

**Headline:** Find the right CLI tool in plain English.

**Subhead:** `need` searches thousands of tools using semantic similarity. Works from your terminal or as an MCP server for AI coding agents.

**Badges:** Open Source · No API Keys · MCP Native · Works with Any Agent

**Primary CTA:**
```
npx @needtools/need "compress png images"
```

**Secondary CTA:** View on GitHub →

---

### The Problem

**"There are 500,000+ packages on npm alone. Good luck finding the right one."**

Developers Google. AI agents hallucinate. Both waste time.

- You describe what you need. Search engines match keywords, not intent.
- AI agents invent packages that don't exist or suggest deprecated ones.
- Even when you find a tool, you don't know if it actually works well.

---

### How It Works

**1. Search**
Describe what you need. Get ranked results based on semantic similarity and community signals.
```bash
$ need compress png images without losing quality

  1. pngquant         brew install pngquant       92% success  1.2k uses
  2. optipng          brew install optipng         87% success  800 uses
  3. imagemagick      brew install imagemagick     94% success  4.1k uses
```

**2. Install**
Pick a tool and install it directly. Or let the interactive flow handle it.
```bash
$ need install "convert video to gif"
  Install which tool? [1-5/n] 1
  Running: brew install ffmpeg
  ✓ Installed ffmpeg successfully.
```

**3. Report**
Tell us if it worked. Every signal improves results for everyone.
```bash
$ need report pngquant --success
  ✓ Reported success for "pngquant". Thanks for the feedback!
```

---

### For AI Agents (MCP)

**"Your AI agent just learned how to find any CLI tool."**

One command configures `need` as an MCP server for your AI tools:

```bash
need setup
  ✓ Claude Code — configured
  ✓ Cursor — configured
```

Now when you ask your agent to "compress these PNGs" or "find duplicate files," it can:

1. **Search** for the right tool via `search_tools`
2. **Install** it via `install_tool` (with a security allowlist)
3. **Report** whether it worked via `report_tool_usage`

The entire loop happens without you leaving your editor.

**Supported agents:** Claude Code, Cursor — more coming.

---

### Browse Tools

**"Explore 6,000+ CLI tools."**

The full tool directory is browsable at [agentneed.dev/tools](https://agentneed.dev/tools):
- Search by name or description
- Browse by category
- View install commands, usage examples, and success rates
- Individual tool pages with related tools

---

### Features

| | |
|---|---|
| **Semantic search** | Describe what you need in plain English. No exact package names required. |
| **Community signals** | Results are ranked by what actually works, not just text similarity. |
| **MCP native** | Built as a Model Context Protocol server from day one. |
| **Security allowlist** | `install_tool` only runs safe package manager commands. No arbitrary code execution. |
| **Zero config** | No API keys, no accounts, no setup. Just `npx` and go. |
| **Browsable directory** | Explore all 6,000+ tools on the web at agentneed.dev. |
| **Open source** | MIT licensed. Run it, fork it, improve it. |

---

### Objection Handling / FAQ

**"Can't I just Google this?"**
You can. You'll get a Stack Overflow answer from 2019, three Medium articles behind paywalls, and a GitHub repo with 2 stars that was last updated in 2021. `need` gives you ranked, current results with install commands and success rates.

**"Can't AI agents just know which tools exist?"**
They can't. LLMs have a training cutoff and frequently hallucinate package names. `need` gives them a real-time, verified index to search against.

**"What if I don't use AI agents?"**
`need` works great as a standalone CLI. Think of it as `tldr` meets `brew search` with semantic understanding. The MCP integration is a bonus, not a requirement.

**"How is this different from package manager search?"**
`brew search` and `apt search` match keywords. `need` understands intent. Search "make images smaller" and you'll get `pngquant`, `optipng`, and `jpegoptim` — not just packages with "image" in the name.

**"How do you rank results?"**
Semantic similarity (via embeddings) combined with community success/failure signals. The more people report that a tool worked for a given task, the higher it ranks.

**"Is it safe to let AI agents install things?"**
The MCP `install_tool` only allows commands from a strict allowlist: `brew install`, `apt install`, `npm install -g`, `pip install`, `cargo install`. Shell metacharacters are rejected. No arbitrary code execution.

---

### CTA (Bottom)

**"Try it in 10 seconds."**

```bash
npx @needtools/need "convert pdf to png"
```

Then add it to your AI agent:

```bash
npx @needtools/need setup
```

[GitHub](https://github.com/tuckerschreiber/need) · [npm](https://www.npmjs.com/package/@needtools/need) · [agentneed.dev](https://agentneed.dev) · MIT License

---

## Who It's For

### Primary: Developers using AI coding agents
- Use Claude Code, Cursor, or similar AI tools daily
- Hit the "agent doesn't know this tool exists" problem regularly
- Want their agent to autonomously find and install the right CLI tool
- **Message:** "One command. Your agent never gets stuck on tool discovery again."

### Secondary: CLI-heavy developers
- Spend time in the terminal
- Know tools exist but can't remember names
- Tired of Googling "best tool for X"
- **Message:** "Like brew search, but it actually understands what you mean."

### Tertiary: Tool authors
- Built a CLI tool that nobody can find
- Want discoverability beyond package manager listings
- **Message:** "Get your tool in front of developers and AI agents who need it." (Future — tool submission not yet live)

---

## Tone Guide

- **Pragmatic, not hype.** Don't say "revolutionary" or "game-changing." Say what it does.
- **Developer-first language.** Write like you're explaining it to a coworker, not pitching to a VC.
- **Show, don't tell.** Every claim has a code example next to it.
- **Honest about scope.** This is a search tool with good UX, not AGI. Don't oversell.
- **Address skepticism directly.** The FAQ isn't defensive — it's "yeah, good question, here's why."

---

## Distribution Ideas

1. **Launch on Product Hunt + Hacker News** — "Show HN: need — CLI tool discovery for AI agents"
2. **Claude Code / Cursor communities** — position as "the MCP server every agent should have"
3. **Twitter/X threads** — demo video of agent discovering + installing + using a tool autonomously
4. **README-driven discovery** — people see `need setup` in other people's dotfiles and get curious
5. **Integrate into other MCP server lists** — get listed on awesome-mcp-servers, MCP directories
6. **agentneed.dev SEO** — individual tool pages create long-tail search traffic (6,000+ pages)
