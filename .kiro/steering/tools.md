# External Tools & Library References

## Context7 Library IDs

When using Context7 tools for documentation lookups, use these predefined library IDs to avoid unnecessary resolve-library-id calls. This improves efficiency and ensures consistent documentation sources.

### Astro Documentation

- **Library ID**: `/withastro/astro`
- **Usage**: For all Astro framework documentation, configuration, and component examples
- **Why Preferred**: Official Astro repository with comprehensive documentation and high trust score
- **Alternative**: `/withastro/docs` (for docs-specific content)

### Mermaid Diagrams

- **Library ID**: `/mermaid-js/mermaid`
- **Usage**: For diagram syntax, chart types, and Mermaid configuration
- **Why Preferred**: Official Mermaid repository with extensive examples and highest code snippet coverage (2080+)
- **Trust Score**: 7.8 with active maintenance

## Tool Usage Guidelines

### When to Use Direct Library IDs

- **Astro queries**: Always use `/withastro/astro` for framework questions
- **Mermaid diagrams**: Always use `/mermaid-js/mermaid` for diagram syntax and examples
- **Repeat lookups**: If you've already resolved a library ID in the conversation, reuse it

### When to Use resolve-library-id

- **New libraries**: When working with libraries not listed above
- **Specific versions**: When you need a particular version (e.g., `/mermaid-js/mermaid/v11_0_0`)
- **Alternative sources**: When the primary library doesn't have the specific information needed

## Documentation Patterns

### Astro Documentation Requests

```bash
# Preferred approach
get-library-docs --library-id="/withastro/astro" --topic="themes"

# Avoid this (unnecessary step)
resolve-library-id --name="astro"
# then get-library-docs...
```

### Mermaid Diagram Requests

```bash
# Preferred approach
get-library-docs --library-id="/mermaid-js/mermaid" --topic="flowcharts"

# For specific diagram types
get-library-docs --library-id="/mermaid-js/mermaid" --topic="sequence diagrams"
```

## Additional Tool Preferences

### Git CLI

- Always use the --no-pager flag immediately after any `git` terminal command and before the command name, so the terminal doesn't get stuck

### GitHub Actions

- Use official GitHub documentation and `@actions/*` package docs
- Reference GitHub's official action examples and marketplace

### Node.js & JavaScript

- Prefer Context7 tools over npm for documentation and examples
- Use official Node.js documentation for runtime features
- Reference npm package documentation directly when needed

## Efficiency Tips

1. **Bookmark Common IDs**: Keep frequently used library IDs readily available
2. **Topic Specificity**: Use specific topics in get-library-docs for focused results
3. **Token Management**: Adjust token limits based on complexity (3000-8000 typical range)
4. **Version Awareness**: Only specify versions when compatibility is critical
