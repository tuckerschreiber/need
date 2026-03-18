# Search Quality: After State

Captured: 2026-03-17 (after systematic re-enrichment + re-embed)

## Tool Descriptions & Examples

### ripgrep
**Description:** Search tool like grep and The Silver Searcher
**Usage examples:**
- search for text inside files
- search for text ignoring case sensitivity
- search for text in specific file types only
- search with regex and show context lines
- find files containing specific text and list filenames

### wget
**Description:** Internet file retriever
**Usage examples:**
- download a file from a URL
- download entire website for offline browsing
- resume an interrupted download
- download file with a custom output filename
- download multiple files from a list

### curl
**Description:** Get a file from an HTTP, HTTPS or FTP server
**Usage examples:**
- download a file from a website
- save downloaded file with a different name
- send data to a server with POST request
- view webpage content in terminal
- test API endpoint with custom headers

### imagemagick
**Description:** Tools and libraries to manipulate images in select formats
**Usage examples:**
- resize image to specific dimensions
- convert image to different format
- compress image to reduce file size
- crop image to specific area
- get image dimensions and file info

### ffmpeg
**Description:** Play, record, convert, compress, and stream audio and video. Compress video without losing quality, convert formats, extract audio, and process media files.
**Usage examples:**
- compress video without losing quality
- convert video to different format
- extract audio from video file
- resize and scale video resolution
- get video information and duration

### jq
**Description:** Lightweight and flexible command-line JSON processor. Pretty print JSON, parse and query JSON data, filter and transform JSON on the command line.
**Usage examples:**
- pretty print JSON in terminal
- extract a specific field from JSON
- filter JSON array by condition
- transform JSON structure
- parse JSON from file and count array elements

### fd
**Description:** Simple, fast and user-friendly tool to find files by name. A fast alternative to the find command for searching files by name, pattern, or extension.
**Usage examples:**
- find files by name recursively
- search for files with specific extension
- find files matching pattern in specific directory
- search for files excluding certain directories
- find hidden files and directories

### yt-dlp
**Description:** Feature-rich command-line audio/video downloader. Download YouTube videos, playlists, and content from 1000+ sites including Vimeo, Twitter, and TikTok.
**Usage examples:**
- download YouTube video
- download entire YouTube playlist
- download video as audio file
- download video with best quality
- download video and save with custom filename

### git-lfs
**Description:** Git extension for versioning large files
**Usage examples:**
- track large video files in git
- initialize git lfs in a repository
- see which files are tracked by lfs
- download lfs file contents from remote
- push large files to remote lfs storage

### rsync
**Description:** Rsync cli wrapper
**Usage examples:**
- copy files to another computer over ssh
- backup folder to external drive with compression
- sync two local directories keeping them identical
- download files from remote server only if changed
- exclude certain file types when syncing folders

### htop
**Description:** Improved top (interactive process viewer)
**Usage examples:**
- see all running processes sorted by memory usage
- monitor processes for a specific user
- kill a process from the interactive interface
- view processes in tree structure showing parent child relationships
- sort processes by CPU usage in real time

### tree
**Description:** Display directories as trees (with optional color/HTML output)
**Usage examples:**
- show folder structure of current directory
- show directory tree with file sizes
- limit tree depth to 2 levels
- show only directories in tree view
- show directory tree with colors

### ncdu
**Description:** NCurses Disk Usage
**Usage examples:**
- see which folders are using the most disk space
- scan entire system for largest directories
- find disk hogs in a project directory
- exclude certain directories while scanning
- export disk usage report to a file

### bat
**Description:** A cat(1) clone with wings.
**Usage examples:**
- show file contents with syntax highlighting
- display multiple files with line numbers
- pipe command output and highlight as code
- show file with git changes highlighted
- display specific line range of a file

### exa
**Description:** A modern replacement for ls
**Usage examples:**
- list files and folders with colors and icons
- show file details with size and modification date
- list all files including hidden ones
- show directory tree structure recursively
- list files sorted by size largest first

### httpie
**Description:** User-friendly cURL replacement (command-line HTTP client)
**Usage examples:**
- make a simple GET request to a URL
- send JSON data with a POST request
- pretty print JSON response from an API
- add custom headers to an HTTP request
- save response to a file

### nmap
**Description:** Port scanning utility for large networks
**Usage examples:**
- scan a single host for open ports
- scan an entire subnet to find active hosts
- detect what services are running on open ports
- scan specific ports on a target host
- identify operating system of a remote machine

### pandoc
**Description:** Swiss-army knife of markup format conversion
**Usage examples:**
- convert markdown file to HTML
- convert markdown to PDF document
- convert HTML to markdown
- convert markdown to Word document
- convert multiple markdown files to single HTML with table of contents

### sox
**Description:** SOund eXchange: universal sound sample translator
**Usage examples:**
- convert audio file between different formats
- record audio from microphone to a file
- play audio file in terminal
- trim silence from beginning and end of audio
- change audio volume and convert format at once

### ghostscript
**Description:** Interpreter for PostScript and PDF
**Usage examples:**
- convert PDF to PNG images
- merge multiple PDF files together
- compress PDF to reduce file size
- extract specific pages from PDF
- convert PDF to grayscale

## Test Query Results

| Query | Expected | #1 | #2 | #3 |
|-------|----------|----|----|----| 
| search text in files | ripgrep | manticoresearch | zfind | gsar |
| download file from url | curl | gdown | pget | ipull |
| resize image | imagemagick | imgdiet | imgp | caire |
| compress image | imagemagick | jpeg-turbo | jpeg-xl | ecm |
| monitor system resources | htop | bpytop | btop | gkrellm |
| list files in tree format | tree | tree-node-cli | as-tree | tree-cli |
| check disk usage | ncdu | duc | dutree | parallel-disk-usage |
| view file with syntax highlighting | bat | source-highlight | shiki | cli-highlight |
| make http requests from terminal | httpie | xh | xh | ain |
| convert document format | pandoc | unoconv | libmwaw | texinfo |
| compress video without losing quality | ffmpeg | **ffmpeg** | xvid | libvmaf |
| pretty print json | jq | **jq** | jsonpp | prettyoutput |
| find files by name | fd | **fd** | ff-find | fselect |
| download youtube video | yt-dlp | yewtube | youtubedr | **yt-dlp** |
