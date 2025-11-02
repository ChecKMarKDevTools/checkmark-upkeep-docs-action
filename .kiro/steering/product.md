---
inclusion: always
---

# Product Overview

Upkeep Docs (two words) is a GitHub Action that leverages the GitHub Copilot coding agent to automatically generate markdown documentation for repositories. The action acts as a prompter for GitHub's coding agent deployment, using predefined prompts to instruct the agent to analyze repositories and generate comprehensive documentation directly in the user's repository via pull requests.

## Core Architecture Patterns

### GitHub Action Structure

- **Entry Point**: `src/main.js` orchestrates the entire action flow
- **CLI Integration**: `src/copilot-cli.js` handles all Copilot CLI interactions
- **Utilities**: `src/utils.js` provides common error handling and validation
- **Action Metadata**: `action.yml` defines inputs, outputs, and execution configuration

### Authentication Flow

- Uses `GITHUB_TOKEN` from action context (no external API keys)
- Authenticates with GitHub Copilot CLI using GitHub's native authentication
- Validates token permissions before executing CLI commands

### Error Handling Conventions

- All functions must implement comprehensive try/catch blocks
- Use `@actions/core.setFailed()` for action failures
- Log errors without exposing sensitive information
- Provide actionable error messages to users

## Key Features & Implementation Rules

### Automated Documentation Generation

- **Coding Agent Integration**: Use GitHub Copilot coding agent deployment for documentation generation
- **Prompt Engineering**: Craft specific prompts for documentation tasks
- **Output Validation**: Verify generated content before committing
- **File Handling**: Create/update markdown files in appropriate directories

### Pull Request Integration

- **Branch Strategy**: Create feature branches for documentation updates
- **PR Creation**: Use GitHub API to create pull requests with generated content
- **Review Process**: Include descriptive PR titles and bodies
- **Conflict Resolution**: Handle existing documentation gracefully

### Security Requirements

- **Token Validation**: Verify GitHub token has required permissions
- **Input Sanitization**: Validate all user inputs before processing
- **Secret Management**: Never log tokens or sensitive information
- **Minimal Permissions**: Request only necessary GitHub permissions

## Development Conventions

### Code Style

- **No TypeScript**: Project explicitly uses vanilla JavaScript
- **ES6+ Features**: Use modern JavaScript syntax (async/await, destructuring)
- **Function Naming**: Use descriptive verb-noun patterns (`validateInputs`, `generateDocs`)
- **Error Messages**: Provide clear, actionable feedback to users

### Testing Requirements

- **Unit Tests**: Test individual functions in isolation
- **Integration Tests**: Test complete action workflows
- **Mock Strategy**: Mock GitHub API and Copilot CLI responses
- **Coverage**: Maintain high test coverage for critical paths

### Documentation Standards

- **JSDoc Comments**: Document all public functions with parameters and return values
- **README Updates**: Keep usage examples current with code changes
- **Action Metadata**: Ensure `action.yml` accurately reflects current functionality
- **Security Documentation**: Document security considerations and best practices

## Marketplace Considerations

### Publication Requirements

- **Semantic Versioning**: Follow semver for all releases
- **Action Branding**: Use consistent branding in `action.yml`
- **Usage Examples**: Provide comprehensive workflow examples
- **License Compliance**: Ensure Polyform Shield 1.0.0 license is properly applied

### User Experience

- **Zero Configuration**: Work with minimal user setup
- **Clear Outputs**: Provide meaningful action outputs and logs
- **Error Recovery**: Handle common failure scenarios gracefully
- **Performance**: Optimize for reasonable execution times

## Target Users & Use Cases

- **Repository Maintainers**: Seeking automated documentation solutions
- **Development Teams**: Wanting consistent documentation standards
- **Open Source Projects**: Needing comprehensive documentation coverage
- **Enterprise Teams**: Requiring scalable documentation workflows
