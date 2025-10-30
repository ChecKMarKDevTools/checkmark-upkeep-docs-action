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
