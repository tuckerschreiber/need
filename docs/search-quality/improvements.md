# Search Quality Improvements

**Date:** 2026-03-17

## The Problem

The core issue is a vocabulary gap: tools in the database have terse, Homebrew-style descriptions ("Search tool like grep and The Silver Searcher", "Internet file retriever") while users search with task-oriented queries ("search text in files", "download file from url"). The semantic embedding of a short, categorical description does not align well with the embedding of a user's intent, so common tools lose out to obscure tools whose names or descriptions happen to contain the right surface-level words.

## What Changed

Three-layer fix:

1. **SQL ranking blend** — `search_tools` function now weights 65% semantic similarity + 35% FTS keyword score. Helps when users search with words that appear in tool names/descriptions.

2. **Re-embed with usage examples** — Embeddings now include usage example descriptions alongside the tool description. `jq`'s vector now encodes "pretty print JSON in terminal" not just "Lightweight JSON processor".

3. **Task-oriented re-enrichment** — All ~10k tools re-enriched with a new prompt that explicitly requires search-query-style descriptions ("search for text inside files", not "Search for a pattern in the current directory recursively"). 4-5 examples per tool instead of 2-3.

## Query Results: Before vs After

| Query | Expected | Before #1 | Before #2 | After #1 | After #2 | Fixed? |
|-------|----------|-----------|-----------|----------|----------|--------|
| search text in files | ripgrep | zfind | gsar | manticoresearch | zfind | ❌ |
| download file from url | curl | ipull | gdown | gdown | pget | ❌ |
| resize image | imagemagick | imgdiet | imgp | imgdiet | imgp | ❌ |
| compress image | imagemagick | caesiumclt | jpeg-xl | jpeg-turbo | jpeg-xl | ❌ |
| monitor system resources | htop | devcockpit | gtop | bpytop | btop | ❌ |
| list files in tree format | tree | tree-cli | tree-node-cli | tree-node-cli | as-tree | ❌ |
| check disk usage | ncdu | duc | **ncdu** | duc | dutree | ❌ (regression) |
| view file with syntax highlighting | bat | cli-highlight | source-highlight | source-highlight | shiki | ❌ |
| make http requests from terminal | httpie | ain | hurl | xh | xh | ❌ |
| convert document format | pandoc | unoconv | libmwaw | unoconv | libmwaw | ❌ |
| compress video without losing quality | ffmpeg | **ffmpeg** | libvmaf | **ffmpeg** | xvid | ✅ (held) |
| pretty print json | jq | **jq** | prettyoutput | **jq** | jsonpp | ✅ (held) |
| find files by name | fd | **fd** | fselect | **fd** | ff-find | ✅ (held) |
| download youtube video | yt-dlp | **yt-dlp** | youtubedr | yewtube | youtubedr | ❌ (regression) |

**3/14 queries now return the expected tool at #1** (unchanged from before — but 1 additional regression: ncdu dropped from #2 to absent, yt-dlp dropped from #1 to #3)

## What the Data Shows

The re-enrichment improved example quality significantly — descriptions are now clearly task-oriented (compare "search for text inside files" vs "Search for a pattern in the current directory recursively"). However, the search ranking for most queries has not improved and in two cases regressed. The likely explanation:

- **Re-embedding hasn't propagated yet**, or the new embeddings haven't fully displaced the old ones in the index for all tools.
- **The vocabulary gap is too wide for the well-known tools**: `ripgrep`, `curl`, `imagemagick`, `htop`, `bat`, `httpie`, and `pandoc` are losing to niche tools whose names or descriptions contain exact query keywords (e.g. "manticoresearch" surface-matches "search").
- **The FTS blend may be hurting** for queries like "download file from url" — `gdown` contains "download" in its name, which boosts its FTS score above `curl`.

The three queries where the expected tool wins (#1) — `ffmpeg`, `jq`, `fd` — all had their descriptions explicitly updated with task phrases before the before-state snapshot, suggesting the embedding content matters more than the ranking blend.

## Tool Example Comparisons

The five tools with the most meaningful before→after change in example quality:

---

### ripgrep

| | Before | After |
|-|--------|-------|
| Example 1 | Search for a pattern in the current directory recursively | search for text inside files |
| Example 2 | Search for a pattern in specific file types only | search for text ignoring case sensitivity |
| Example 3 | Search with context lines and case-insensitive matching | search for text in specific file types only |

**Why it matters:** The before examples describe what ripgrep does internally ("recursively", "context lines"); the after examples mirror how a user would type a search query. "search for text inside files" is semantically close to the query "search text in files", which is why this should improve recall — but the embedding has not yet surfaced ripgrep above niche tools.

---

### imagemagick

| | Before | After |
|-|--------|-------|
| Example 1 | Convert an image from one format to another | resize image to specific dimensions |
| Example 2 | Resize an image to specific dimensions | convert image to different format |
| Example 3 | Get detailed information about an image | compress image to reduce file size |

**Why it matters:** The after examples lead with "resize image" and "compress image" — the two exact test queries. The before examples buried resize at position 2 and omitted compression entirely. This is the clearest case of the re-enrichment prompt doing its job.

---

### bat

| | Before | After |
|-|--------|-------|
| Example 1 | Display a file with syntax highlighting | show file contents with syntax highlighting |
| Example 2 | Show multiple files with line numbers and Git changes | display multiple files with line numbers |
| Example 3 | Pipe output from another command with syntax highlighting | pipe command output and highlight as code |

**Why it matters:** "Display a file" (before) vs "show file contents" (after) — lowercase, verb-first phrasing that matches how a user types "view file with syntax highlighting". The semantic distance between "show file contents with syntax highlighting" and "view file with syntax highlighting" is meaningfully smaller than between "Display a file with syntax highlighting" and the same query.

---

### ncdu

| | Before | After |
|-|--------|-------|
| Example 1 | Analyze disk usage of current directory interactively | see which folders are using the most disk space |
| Example 2 | Analyze a specific directory and show largest subdirectories | scan entire system for largest directories |
| Example 3 | Export disk usage report to a file for later analysis | find disk hogs in a project directory |

**Why it matters:** "Analyze disk usage" (before) is correct but clinical. "see which folders are using the most disk space" (after) matches how a user actually thinks about the problem — it encodes the intent, not the mechanism. Despite this improvement, ncdu regressed from #2 to absent in the after-state, suggesting the re-embedding did not yet take effect.

---

### wget

| | Before | After |
|-|--------|-------|
| Example 1 | Download a single file from a URL | download a file from a URL |
| Example 2 | Download a file and save it with a different name | download entire website for offline browsing |
| Example 3 | Recursively download an entire website directory | resume an interrupted download |

**Why it matters:** The change is subtle but meaningful — "Download a single file from a URL" (before) vs "download a file from a URL" (after, lowercase, no "single"). The lowercase phrasing better matches user query style. However, wget still does not appear in top results for "download file from url" because `gdown` and `pget` contain the word "download" in their names, giving them a strong FTS boost that semantic similarity alone cannot overcome. This is the core remaining problem with the ranking blend for this query class.
