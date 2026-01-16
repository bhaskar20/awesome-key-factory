# Starlight Documentation

This directory contains the Starlight documentation site for React Query Key Factory.

[Starlight](https://starlight.astro.build/) is a documentation framework built on Astro that provides a beautiful, fast, and accessible documentation experience.

## Getting Started

### Development Server

Run the development server from the project root:

```bash
yarn docs:dev
```

Or from this directory:

```bash
cd starlight-docs
yarn dev
```

The site will be available at `http://localhost:4321`

### Building

Build the documentation site:

```bash
yarn docs:build
```

The built site will be in `starlight-docs/dist/`

### Preview Production Build

Preview the production build:

```bash
yarn docs:preview
```

## Project Structure

```
starlight-docs/
├── src/
│   └── content/
│       └── docs/          # Documentation pages (MDX files)
├── astro.config.mjs       # Astro and Starlight configuration
├── package.json           # Project dependencies
└── tsconfig.json          # TypeScript configuration
```

## Adding Content

Documentation pages are written in MDX (Markdown with JSX) and located in `src/content/docs/`.

Each page should have frontmatter:

```mdx
---
title: Page Title
description: Page description
---
```

## Features

- 📱 **Responsive Design**: Works on all devices
- 🎨 **Modern UI**: Beautiful, clean design
- 🔍 **Search**: Built-in full-text search
- 🌙 **Dark Mode**: Automatic dark mode support
- ♿ **Accessible**: WCAG compliant
- ⚡ **Fast**: Built on Astro for optimal performance

## Deployment

The built site in `dist/` can be deployed to:

- **Netlify**: Already configured with `netlify.toml` - just connect your repository
- **Vercel**: Already configured with `vercel.json` - just connect your repository
- **GitHub Pages**: Already configured with GitHub Actions workflow - enable Pages in settings
- **Cloudflare Pages**: Connect repository and set build directory to `starlight-docs`
- **Any static host**: Upload the `dist/` folder

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

## Learn More

- [Starlight Documentation](https://starlight.astro.build/)
- [Astro Documentation](https://docs.astro.build/)
