# Project Structure

## Repository Organization

This repository follows GitHub Action conventions with additional infrastructure for documentation and CI/CD.

```plaintext
/
├── .github/
│   └── workflows/          # CI/CD workflows (security, testing, releases)
├── .kiro/
│   ├── specs/             # Project specifications and requirements
│   └── steering/          # AI assistant guidance rules
├── src/
│   ├── main.js           # Primary action entry point
│   ├── copilot-cli.js    # Copilot CLI integration wrapper
│   └── utils.js          # Common utilities and error handling
├── tests/
│   ├── unit/             # Unit tests for individual components
│   ├── integration/      # End-to-end integration tests
│   └── fixtures/         # Test data and mock responses
├── docs/                 # Astro documentation site
│   ├── src/
│   │   └── pages/        # Documentation pages
│   ├── public/           # Static assets
│   └── astro.config.mjs  # Astro configuration
├── action.yml            # GitHub Action metadata
├── package.json          # Node.js dependencies and scripts
├── LICENSE               # Polyform Shield 1.0.0 license
└── README.md             # Repository documentation with badges
```

## Key Files & Conventions

### GitHub Action Files

- **action.yml**: Contains action metadata, inputs, outputs, and execution configuration
- **src/main.js**: Primary entry point that orchestrates the entire action flow
- **src/copilot-cli.js**: Handles all Copilot CLI interactions and authentication

### Configuration Files

- **package.json**: Must include Volta configuration for Node.js 22
- **LICENSE**: Custom Polyform Shield 1.0.0 license file
- **.github/workflows/**: All CI/CD workflows for security, testing, and releases

### Documentation Structure

- **README.md**: Must include shields.io badges and social links
- **docs/**: Astro-based documentation site deployed to GitHub Pages
- **.kiro/specs/**: Comprehensive project specifications and requirements

## Naming Conventions

### Files

- Use kebab-case for file names: `copilot-cli.js`, `action-execution.test.js`
- Use descriptive names that indicate purpose: `utils.js`, `main.js`

### Functions

- Use camelCase: `authenticateCopilotCLI()`, `promptCodingAgent()`
- Use descriptive verb-noun patterns: `validateInputs()`, `handleErrors()`

### Variables

- Use camelCase for variables: `githubToken`, `executionContext`
- Use UPPER_CASE for constants: `DEFAULT_TIMEOUT`, `CLI_VERSION`

### Comments

- DO NOT add unnecessary inline comments without explaining WHY OR HOW
- Use JSDocs as the standard for documenting all JavaScript files
- All functionality should be documented appropriately in the `/docs` directory

### Principles to Code By

- YAGNI EVER!
- KISS cause I hate complicated!
- DRY (Don't Repeat Yourself Without A Very Good Reason)
- Prefer tools over rebuilding from scratch
- Security is the most important concern
- Keep the codebase simple and maintainable

## Directory Guidelines

### Source Code (`src/`)

- Keep modules focused and single-purpose
- Separate concerns: CLI integration, utilities, main orchestration
- Include comprehensive error handling in all modules

### Tests (`tests/`)

- Mirror source structure in test organization
- Use descriptive test file names ending in `.test.js`
- Include both unit and integration test coverage

### Documentation (`docs/`)

- Follow Astro conventions for page organization
- Include comprehensive usage examples and API documentation
- Maintain security documentation and troubleshooting guides

## Security Considerations

- Never commit tokens or sensitive information
- All user inputs must be validated before processing
- Use minimal required permissions for GitHub tokens
- Implement comprehensive logging without exposing secrets