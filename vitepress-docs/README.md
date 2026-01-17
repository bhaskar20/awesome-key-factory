# VitePress Documentation

This folder contains the VitePress documentation for Awesome key factory.

## Getting Started

### Install Dependencies

```bash
yarn install
```

### Development

Start the development server:

```bash
yarn dev
```

The documentation will be available at `http://localhost:5173`

### Build

Build the documentation for production:

```bash
yarn build
```

The built files will be in the `.vitepress/dist` directory.

### Preview

Preview the production build:

```bash
yarn preview
```

## Structure

- `index.md` - Homepage
- `guides/` - Getting started guides
- `core-concepts/` - Core concepts documentation
- `usage-guide/` - Usage guides
- `typescript/` - TypeScript-specific documentation
- `api-reference/` - API reference
- `examples/` - Usage examples
- `.vitepress/config.ts` - VitePress configuration

## Content Migration

All content has been migrated from the Starlight documentation (`starlight-docs`) to this VitePress setup. The content structure and organization remain the same.

## GitHub Pages Deployment

The documentation is automatically deployed to GitHub Pages via GitHub Actions when changes are pushed to the `main` branch.

### Setup Instructions

1. **Enable GitHub Pages** in your repository settings:
   - Go to Settings → Pages
   - Source: Select "GitHub Actions"

2. **Push the workflow file** - The workflow file (`.github/workflows/deploy-vitepress.yml`) is already configured and will automatically deploy when you push to the main branch.

3. **Access your docs** - Once deployed, your documentation will be available at:
   ```
   https://bhaskar20.github.io/awesome-key-factory/
   ```

### Manual Deployment

If you need to manually trigger a deployment:

1. Go to the Actions tab in your GitHub repository
2. Select "Deploy VitePress Docs to GitHub Pages"
3. Click "Run workflow"

The workflow will:
- Build the VitePress documentation
- Deploy it to the `gh-pages` branch
- Make it available on GitHub Pages
