# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Chime Language Linter is a text analysis tool that enforces Chime People Development content style rules. It ships as both a Node.js CLI and a single-page React web app, sharing a core linting engine.

## Commands

```bash
npm install          # Install dependencies
npm run build        # Build both CLI and web
npm run build:cli    # Build CLI only (esbuild -> dist/cli/chime-lint.mjs)
npm run build:web    # Build web only (Vite -> dist/web/)
npm run dev:web      # Vite dev server for the web app
npm run lint         # TypeScript type check (tsc --noEmit)
npm test             # Run all tests (vitest)
npm run test:watch   # Run tests in watch mode
```

CLI usage:
```bash
node dist/cli/chime-lint.mjs <file>        # Lint a file
cat file.txt | node dist/cli/chime-lint.mjs  # Lint from stdin
node dist/cli/chime-lint.mjs --json <file>   # JSON output
```

## Architecture

```
src/
  core/           # Shared linting engine (used by both CLI and web)
    types.ts      # LintIssue, LintResult, LintRule, Severity types
    utils.ts      # findMatches() helper: regex -> positioned LintIssues
    linter.ts     # lint(text) orchestrator: runs all rules, sorts, scores
    rules/        # One file per rule category (11 rules total)
  cli/index.ts    # Node CLI entry point (file/stdin input, coloured output, --json)
  web/            # React SPA (Vite)
    App.tsx       # Single-component app: textarea input, issue cards, score badge
    main.tsx      # React root mount
```

The core engine is framework-agnostic. Each rule in `src/core/rules/` implements the `LintRule` interface (`name` + `check(text) -> LintIssue[]`). Most rules use the shared `findMatches()` utility for regex-based scanning with automatic line/column position calculation.

## Lint Rules

All 11 rule categories and their severities:

| Rule | Severity | What it catches |
|------|----------|----------------|
| em-dashes | error | Em dashes (suggests en dashes) |
| struggle | warning | "struggle" and variants |
| identity-labels | warning | "drivers," "rockstars," "pro," etc. |
| loaded-language | warning | "addiction," "secret weapon," "game-changer," etc. |
| shame-framing | error | "lowest score," "worst performing," etc. |
| clinical-terms | warning | Clinical/scientific terms without plain-English pairing |
| debrief-language | warning | Diagnostic-feeling debrief terms ("ego," "catastrophizing") |
| profanity | error | Profanity and overly casual language |
| framework-claims | error | Claiming industry frameworks (SBI, SARA) as Chime-proprietary |
| unattributed-stats | error | "Research shows" without a named source |
| chime-values | error | Incorrect Chime value names (fuzzy-matched against 5 official values) |

## Scoring

Score starts at 100. Each error deducts 10 points, each warning deducts 5. Floor is 0.

## Style Conventions

- Use en dashes (\u2013), never em dashes (\u2014), in all output text.
- The five official Chime values: Member Obsessed, Be Bold, Win Together, Respect the Rules, Be an Owner.
