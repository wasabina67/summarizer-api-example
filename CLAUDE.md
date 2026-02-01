# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Install dependencies
npm i

# Run server
node server.js
```

The server runs on http://localhost:3000.

## Architecture

This is a demo application for Chrome's built-in Summarizer API (a browser AI feature).

- `server.js` - Express 5 server that serves static files from `/docs`
- `docs/` - Frontend static files:
  - `index.html` - UI with settings (type, format, length) and text input
  - `app.js` - Uses the browser's `Summarizer` API for text summarization with streaming output
  - `styles.css` - Styling

The Summarizer API is a Chrome-specific browser API (not a backend service). The app checks availability, downloads the model if needed, and performs summarization client-side.
