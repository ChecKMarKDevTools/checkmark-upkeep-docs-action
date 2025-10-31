# Technology Stack

## Core Technologies

- **Language**: JavaScript (Node.js 22) - NO TypeScript
- **Runtime**: Node.js with Volta for version management
- **Package Manager**: npm
- **Documentation Site**: Astro static site generator
- **Testing**: Jest for unit and integration testing
- **CI/CD**: GitHub Actions workflows

## Key Dependencies

- **@actions/core**: GitHub Actions toolkit for inputs/outputs
- **@actions/github**: GitHub API interactions
- **GitHub Copilot CLI**: Core integration for documentation generation

## Build & Development Commands

### Setup

```bash
# Install dependencies
npm install

# Set up Volta (if not already installed)
volta install node@22
```

### Testing

```bash
# Run unit tests
npm test

# Run integration tests
npm run test:integration

# Run all tests with coverage
npm run test:coverage
```

### Development

```bash
# Lint code
npm run lint

# Format code
npm run format

# Build action (if needed)
npm run build
```

### Documentation Site

```bash
# Navigate to docs site
cd docs

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Code Style & Standards

- **No TypeScript**: Project explicitly uses vanilla JavaScript
- **ES6+ Features**: Modern JavaScript syntax and features
- **Async/Await**: Preferred over Promises for asynchronous operations
- **Error Handling**: Comprehensive try/catch blocks with meaningful error messages
- **Input Validation**: All user inputs must be validated and sanitized
- **Security First**: Never log tokens or sensitive information

## Task Completion Validation Requirements

**MANDATORY**: Before marking any task as completed, you MUST run the complete validation sequence:

**Single Command**: `npm run validate` - Runs format, lint, unit tests with coverage, and integration tests

**Individual Steps** (if needed):

1. **Format Code**: `npm run format` - Must complete without errors
2. **Lint Code**: `npm run lint` - Must show 0 errors, 0 warnings
3. **Run Unit Tests**: `npm test` - All tests must pass
4. **Run Integration Tests**: `npm run test:integration` - All tests must pass

**Failure Policy**: If ANY step in the validation sequence fails, the task CANNOT be marked as completed. Fix all issues and re-run the complete validation sequence.

**Prettier-ESLint Integration**:

- Uses `eslint-config-prettier` to disable conflicting ESLint formatting rules
- Prettier handles all code formatting, ESLint handles code quality
- No conflicts between Prettier and ESLint formatting rules

**ESLint Strict Rules**:

- **No ESLint Disable Comments**: Any attempt to disable ESLint rules with comments will result in hard errors
- **No Try-Catch in Tests**: Test files must use accurate assertions instead of error handling
- **Airbnb Base Standards**: All code must conform to airbnb-base ESLint configuration

## Astro Documentation Site Guidelines

### Theme & Styling

- **Dark/Light Mode**: Implement theme toggle with localStorage persistence
- **CSS Variables**: Use CSS custom properties for theme switching
- **Shiki Syntax Highlighting**: Configure dual themes (light/dark) for code blocks
- **Responsive Design**: Ensure mobile-first responsive layouts

### Astro Configuration

```js
// astro.config.mjs example
export default defineConfig({
  markdown: {
    shikiConfig: {
      themes: {
        light: 'github-light',
        dark: 'github-dark',
      },
    },
  },
});
```

### Theme Toggle Implementation

- Use `is:inline` scripts for theme persistence
- Listen to `astro:after-swap` for view transitions
- Store theme preference in localStorage
- Apply theme class to document.documentElement

### Content Structure

- Use content collections for organized documentation
- Implement proper frontmatter schemas with Zod
- Create reusable layout components
- Include comprehensive navigation and search

## GitHub Action Conventions

- Use `@actions/core` for all input/output operations
- Implement proper exit codes (0 for success, 1 for failure)
- Provide clear, actionable error messages
- Follow semantic versioning for releases
- Include comprehensive action metadata in `action.yml`
