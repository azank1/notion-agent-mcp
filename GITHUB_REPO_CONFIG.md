# Repository Configuration

This file contains suggested metadata for the GitHub repository.

## Repository Description

**Suggested Description**:
```
Model Context Protocol (MCP) server for Notion integration. Enables AI assistants to create pages, query databases, and search content in Notion workspaces.
```

## Topics/Tags

Add these topics to help with discoverability:

- `mcp`
- `notion`
- `typescript`
- `ai`
- `claude`
- `model-context-protocol`
- `notion-api`
- `llm-tools`

## About Section

**Website**: Leave blank or add documentation site URL when available

**Social Preview**: Consider adding a custom social preview image showing the MCP + Notion integration

## Settings Recommendations

### General

- **Description**: Use the suggested description above
- **Website**: Can link to MetaOrcha docs when available
- **Topics**: Add all suggested topics
- **Releases**: Enable GitHub Releases for version tracking
- **Packages**: Disable (not publishing npm packages yet)
- **Environments**: Can be used for Railway deployments later

### Features

- **Wikis**: Disable (documentation in README)
- **Issues**: Enable (for bug reports and feature requests)
- **Sponsorship**: Disable
- **Projects**: Enable (for MVP tracking)
- **Discussions**: Enable (for community support)

### Pull Requests

- **Allow merge commits**: Enable
- **Allow squash merging**: Enable (recommended)
- **Allow rebase merging**: Enable
- **Automatically delete head branches**: Enable

### Branch Protection

Protect `main` and `develop` branches:

**Branch protection rules for `main`**:
- Require pull request reviews before merging (1 approval)
- Require status checks to pass (build, tests, lint)
- Require branches to be up to date before merging
- Do not allow force pushes
- Do not allow deletions

**Branch protection rules for `develop`**:
- Require status checks to pass (build, tests)
- Allow force pushes for administrators only

### Collaborators

Add team members with appropriate permissions:
- **Admin**: Repository owners
- **Write**: Core contributors
- **Read**: External contributors

---

## Manual Setup Instructions

Since the GitHub CLI doesn't have admin permissions, follow these steps:

1. Go to [Repository Settings](https://github.com/azank1/notion-agent-mcp/settings)

2. **Add Description**:
   - Scroll to "About" section (top right of repo page)
   - Click gear icon
   - Paste description from above
   - Add topics listed above
   - Save changes

3. **Configure Settings**:
   - Follow the recommendations above
   - Enable/disable features as needed

4. **Set Up Branch Protection**:
   - Go to Settings > Branches
   - Add protection rules for `main` and `develop`

---

**Last Updated**: February 14, 2026
