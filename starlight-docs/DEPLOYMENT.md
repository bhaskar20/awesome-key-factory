# Deployment Guide

This guide explains how to deploy your Starlight documentation site to various platforms.

## Prerequisites

1. Build the documentation site:
   ```bash
   yarn docs:build
   ```

2. The built site will be in the `dist/` directory.

## Deployment Options

### Netlify

1. **Via Netlify Dashboard:**
   - Go to [Netlify](https://app.netlify.com/)
   - Click "Add new site" > "Import an existing project"
   - Connect your Git repository
   - Set build settings:
     - **Base directory**: `starlight-docs`
     - **Build command**: `yarn build`
     - **Publish directory**: `starlight-docs/dist`
   - Click "Deploy site"

2. **Via Netlify CLI:**
   ```bash
   cd starlight-docs
   netlify deploy --prod --dir=dist
   ```

3. **Via `netlify.toml`:**
   The `netlify.toml` file is already configured. Just connect your repository to Netlify.

### Vercel

1. **Via Vercel Dashboard:**
   - Go to [Vercel](https://vercel.com/)
   - Click "Add New Project"
   - Import your Git repository
   - Configure:
     - **Root Directory**: `starlight-docs`
     - **Build Command**: `yarn build`
     - **Output Directory**: `dist`
   - Click "Deploy"

2. **Via Vercel CLI:**
   ```bash
   cd starlight-docs
   vercel --prod
   ```

3. **Via `vercel.json`:**
   The `vercel.json` file is already configured. Just connect your repository to Vercel.

### Cloudflare Pages

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Navigate to Pages > Create a project
3. Connect your Git repository
4. Configure:
   - **Build command**: `yarn build`
   - **Build output directory**: `dist`
   - **Root directory**: `starlight-docs`
5. Click "Save and Deploy"

### Any Static Host

1. Build the site:
   ```bash
   cd starlight-docs
   yarn build
   ```

2. Upload the contents of the `dist/` directory to your static host:
   - AWS S3 + CloudFront
   - Azure Static Web Apps
   - Google Cloud Storage
   - Any web server

## Custom Domain

### Netlify
1. Go to Site settings > Domain management
2. Add your custom domain
3. Follow the DNS configuration instructions

### Vercel
1. Go to Project settings > Domains
2. Add your custom domain
3. Configure DNS as instructed

## Environment Variables

If you need environment variables:

- **Netlify**: Site settings > Environment variables
- **Vercel**: Project settings > Environment Variables
- **GitHub Actions**: Repository Settings > Secrets and variables > Actions

## Continuous Deployment

All platforms support automatic deployments when you push to your repository:

- **Netlify**: Automatic on push to connected branch
- **Vercel**: Automatic on push to main branch

## Troubleshooting

### Build Fails

1. Check Node.js version (requires Node 18+)
2. Clear cache and rebuild:
   ```bash
   rm -rf node_modules dist .astro
   yarn install --ignore-engines
   yarn build
   ```

### 404 Errors

- Ensure your hosting platform is configured to serve `index.html` for all routes
- Check that the `dist/` directory contains all files
- Verify base path configuration in `astro.config.mjs` if using a subdirectory

### Styling Issues

- Clear browser cache
- Verify `custom.css` is being loaded
- Check browser console for errors

## Updating Documentation

1. Edit files in `src/content/docs/`
2. Test locally: `yarn docs:dev`
3. Build: `yarn docs:build`
4. Commit and push (auto-deploys if configured)
