---
inclusion: manual
---

# Commit Message Generation Rules

## RAI Attribution Footer (REQUIRED)

When generating commit messages, always include an RAI (Responsible AI) attribution footer based on AI contribution level:

### Attribution Rules

Choose exactly one footer from this list; higher entries override lower ones:

- **Generated-by**: Most/all lines changed were AI-written (AI wrote all modified/added code)
- **Co-authored-by**: Roughly half of lines changed were AI-written (substantial AI contribution)
- **Assisted-by**: Some lines were AI-written (targeted/directed AI edits or fixes)
- **Commit-generated-by**: Only message generation or trivial changes (whitespace, comments, renames)

Format: `<attribution-footer>: Kiro <noreply@kiro.ai>`

## Conventional Commit Format

```plaintext
type(scope): Subject line ≤ 72 characters

- Body bullet points explaining WHAT and WHY
- Each bullet on its own line
- Lines ≤ 100 characters maximum

BREAKING CHANGE: Description if applicable; must require user action
Fixes #123
Generated-by: Kiro <kiro@example.com>
```

## Formatting Rules

- Subject: ≤ 72 characters, imperative present tense
- Body: ≤ 100 characters per line, bullet points only
- Single blank line after subject and before footers
- No other blank lines

## Footer Types

- `BREAKING CHANGE:` for incompatibilities
- `Fixes #123` for issues that will be closed
- `Refs #123` for related issues that won't be closed
- RAI attribution (always required)

## Tools to Use

- `get_changed_files` (filter for staged; if none, use unstaged)
- `runInTerminal` with `git --no-pager diff --cached` as fallback
- Save final message to `./commit.tmp`
