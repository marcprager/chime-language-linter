# Chime Language Linter

> **Internal use only** – This tool is for Chime People Development content authors and reviewers.

## Project Structure

Monorepo with three packages:
- `packages/core` – Shared rules engine (pure functions, no DOM/Node deps)
- `packages/cli` – Command-line interface
- `packages/web` – Single-page React app (Vite + Tailwind)

## Commands

```bash
npm install              # Install all workspace dependencies
npm run build            # Build all packages
npm test                 # Run all tests
npm run dev -w packages/web  # Start web dev server
```

## Official Chime Values (exact text)

1. **Member Obsessed**
2. **Be Bold**
3. **Win Together**
4. **Respect the Rules**
5. **Be an Owner**

### Win Together Official Quote

> "We hold each other accountable. We ask for open, honest feedback, and Chime In to provide it to others. We believe that clarity is kindness."

## Linting Rules

### Errors (must fix)

| Rule | Flags | Suggestion |
|------|-------|------------|
| `em-dash` | Em dash (—, U+2014) | Replace with en dash (–, U+2013). Auto-fixable. |
| `struggle` | The word "struggle" | Use "challenge," "stretch," or "difficulty." Auto-fixable (→ "challenge"). |
| `chime-values` | Misspelled or incorrect Chime value names | Use the exact official value name. |
| `win-together-quote` | Misquoted Win Together value text | Use the exact official quote. |
| `proprietary-framework` | "Chime's SBI," "our SBI framework," "Chime's SARA model" | SBI and SARA are industry-standard frameworks, not proprietary. |
| `unattributed-stats` | "Research shows," "studies find," "data suggests" without citation | Include a named source, author, or year. |
| `profanity` | Common profanity | Remove or replace with appropriate language. |

### Warnings (should fix)

| Rule | Flags | Suggestion |
|------|-------|------------|
| `identity-labels` | "rockstars," "top performers," "low performers," "underperformers," etc. | Use "with confidence," "with clarity," or opportunity-framed language. |
| `shame-framing` | "lowest score," "worst performing," "weakest," "failed" | Use "area for growth," "opportunity to develop." |
| `loaded-language` | "addiction," "secret weapon," "game-changer," "crushing it," "killing it" | Use measured, precise language. |
| `clinical-terms` | "ego," "catastrophizing," "spiral," "panic," "shrink," "triggered" (non-clinical) | Use plain-English alternatives. |
| `hard-mode` | "Hard Mode" | Use "Advanced." Auto-fixable. |
| `fabricated-green-heart` | 💚 in CSS `::before`/`::after` content | Avoid decorative emoji in pseudo-elements. |

### Info (style suggestions)

| Rule | Flags | Suggestion |
|------|-------|------------|
| `level-labels` | "L2 IC," "L3," "M3," etc. in learner-facing content | Avoid internal level labels in user-facing content. |

## Smart Filtering

The linter skips non-user-facing content:
- `<script>` tags and `<style>` blocks in HTML
- Code blocks and inline code in Markdown
- Import paths, function names, and prop names in TSX/JSX
- Only lints text nodes, alt text, title attributes, aria-labels, JSX string literals, and prose

## Writing Style for This Tool

- Use en dashes, never em dashes
- No "struggle" – use "challenge"
- Coaching tone in suggestions: helpful, not scolding
- Good: "Consider replacing 'rockstars' with 'team members who consistently deliver'"
- Bad: "ERROR: Do not use identity labels"
