# ChecKMarK Upkeep Docs Action

[![License: Polyform Shield](https://img.shields.io/badge/License-Polyform%20Shield%201.0.0-yellow.svg?style=for-the-badge)](LICENSE) ![Static Badge](https://img.shields.io/badge/project_type-toy-blue?style=for-the-badge) ![GitHub Created At](https://img.shields.io/github/created-at/checkmarkdevtools/checkmark-upkeep-docs-action?style=for-the-badge) ![GitHub last commit](https://img.shields.io/github/last-commit/checkmarkdevtools/checkmark-upkeep-docs-action?display_timestamp=committer&style=for-the-badge) ![GitHub Release](https://img.shields.io/github/v/release/checkmarkdevtools/checkmark-upkeep-docs-action?include_prereleases&display_name=release&style=for-the-badge) ![CodeFactor Grade](https://img.shields.io/codefactor/grade/github/checkmarkdevtools/checkmark-upkeep-docs-action?style=for-the-badge)

![Node.js Badge](https://img.shields.io/badge/Node.js-v22-5FA04E?logo=nodedotjs&logoColor=fff&style=for-the-badge) ![GitHub Copilot Badge](https://img.shields.io/badge/GitHub%20Copilot-Enabled-brightgreen?logo=githubcopilot&logoColor=fff&style=for-the-badge) ![gitignore.io Badge](https://img.shields.io/badge/gitignore.io-204ECF?logo=gitignoredotio&logoColor=fff&style=for-the-badge)

> 🦄 I’ve been threatening to build this for months, and here it finally is — ChecKMarK Upkeep Docs Action. Built to play nice with GitHub, using your own rules, tokens, and permissions. I’m just the orchestrator in the situation: you pull the trigger, I hand it straight to the Coding Agent with my documentation prompts. From there, the plan is simple—_magic_. 🪄

**ChecKMarK Upkeep Docs Action** is a GitHub Action that leverages the GitHub Copilot CLI to send Coding Agent on a mission to create the perfect systems documentation automatically. It’s the first step toward full doc orchestration—an intelligent prompter for GitHub’s coding agent that analyzes your codebase and builds documentation through pull requests.

I plan to expand into other areas (test cases are probably next), but this one already works well enough to stand on its own.

Your data is yours. I don’t log or store anything, ever. At some point, I may enable anonymous statistics, but all activity is visible directly inside your workflow runs—no hidden analytics, no surprises. This repo is scanned regularly for vulnerabilities, and every prompt sent to Coding Agent is hand-written by me and scrubbed again by GitHub before it ever looks at your repo.

Once Coding Agent takes over, my job is done here—that means it's up to you to iterate on results with the `@copilot` mention and report back any strangeness—I'll get it on the list.

## ✨ Features

- **🤖 AI-Powered**: Uses GitHub Copilot CLI for intelligent documentation generation
- **📝 Zero Configuration**: Works out of the box with the default GitHub token (at least, that's the plan!)
- **🔄 Pull Request Integration**: Creates reviewable pull requests with generated docs
- **🔒 Security First**: Comprehensive security scanning and best practices

## 🚀 Quick Start

```yaml
name: Generate Documentation
on:
  workflow_dispatch:
  pull_request:
    types: [opened, edited, reopened, synchronize]

jobs:
  upkeep-docs:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v
      - uses: actions/upkeep-docs@v1
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}
```

## 📖 Usage

### Basic Usage

```yaml
- uses: actions/upkeep-docs@v1
  with:
    github-token: ${{ secrets.GITHUB_TOKEN }}
```

## 🔧 Inputs

| Input          | Description                 | Required | Default               |
| -------------- | --------------------------- | -------- | --------------------- |
| `github-token` | GitHub token for API access | ✅       | `${{ github.token }}` |

## 🏗️ Development

### Prerequisites

- Node.js 22 (managed with Volta)
- npm
- GitHub Copilot

### Setup

```bash
# Clone the repository
git clone https://github.com/ChecKMarKDevTools/checkmark-upkeep-docs-action
cd checkmark-upkeep-docs-action

# Install dependencies
npm install

# Run tests
npm test
```

### Project Structure

```plaintext
├── .github/workflows/    # CI/CD workflows
├── .kiro/               # AI assistant configuration
├── src/                 # Source code
│   ├── main.js         # Action entry point
│   ├── copilot-cli.js  # Copilot CLI integration
│   └── utils.js        # Utilities
├── tests/              # Test suites
├── docs/               # Astro documentation site
└── action.yml          # Action metadata
```

## 🧪 Testing

```bash
# Unit tests
npm test

# Integration tests
npm run test:integration

# Prettier formatting
npm run format

# ESLint
npm run lint
```

## 📚 Documentation

Documentation site is coming soon for comprehensive guides, examples, and more. Stay tuned!

## 🔒 Security

Security is a top priority. Please see our [Security Policy](SECURITY.md) for reporting vulnerabilities.

## 📄 License

Licensed under my personal [Polyform Shield 1.0.0](LICENSE) - allows free use with appropriate restrictions. That means this project isn’t here for resale or repackaging. You can build with it, learn from it, fork it, remix it — just don’t slap a logo on top and call it your startup. I built this for the community, not for recycling relabeled as entrenupership. 💅

---

**[📖 Documentation](./docs/)**
**[🐛 Issues](https://github.com/ChecKMarKDevTools/checkmark-upkeep-docs-action/issues)**

> Kiro says he made this with ❤️ — like I wasn't helping 🙄
