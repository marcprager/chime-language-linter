# chime-language-linter

A lightweight CLI and web-based text linter for Chime People Development content. Enforces content style rules across text files, Slack drafts, presentation copy, module scripts, and emails.

## Quick Start

```bash
npm install
npm run build

# Lint a file
node packages/cli/dist/index.js content/guide.md

# Lint a directory
node packages/cli/dist/index.js content/

# Lint from stdin
echo "Our rockstars struggle with feedback" | node packages/cli/dist/index.js

# Auto-fix
node packages/cli/dist/index.js content/guide.md --fix

# JSON output
node packages/cli/dist/index.js content/ --format json

# Filter by severity
node packages/cli/dist/index.js content/ --severity error
```

## Web Version

```bash
npm run dev -w packages/web
```

Open the local dev server URL and paste or type content to lint in real time.

## Project Structure

```
packages/
  core/   Shared rules engine (pure functions, works in browser and Node)
  cli/    Command-line interface
  web/    Single-page React app (Vite + Tailwind)
```

## Rules

**Errors:** em dashes, "struggle", incorrect Chime values, misquoted Win Together, proprietary framework claims, unattributed statistics, profanity

**Warnings:** identity labels, shame-y framing, loaded/hyperbolic language, clinical terms in coaching, "Hard Mode", decorative green heart emoji

**Info:** level labels in learner-facing content

## Testing

```bash
npm test
```
