# GitHub Pages Setup Guide

This guide will help you deploy your Starlight documentation to GitHub Pages.

## Prerequisites

1. A GitHub account
2. Your repository pushed to GitHub
3. GitHub Actions enabled (enabled by default)

## Step-by-Step Setup

### Step 1: Initialize Git Repository (if not already done)

```bash
# From the project root
git init
git add .
git commit -m "Initial commit with Starlight documentation"
```

### Step 2: Create GitHub Repository

1. Go to [GitHub](https://github.com/new)
2. Create a new repository (e.g., `react-query-key-factory`)
3. **Do NOT** initialize with README, .gitignore, or license (if you already have files)

### Step 3: Push to GitHub

```bash
# Add your GitHub repository as remote
git remote add origin https://github.com/YOUR_USERNAME/react-query-key-factory.git

# Push to GitHub
git branch -M main
git push -u origin main
```

Replace `YOUR_USERNAME` with your GitHub username.

### Step 4: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** (top menu)
3. Scroll down to **Pages** (left sidebar)
4. Under **Source**, select **GitHub Actions**
5. The workflow will automatically deploy when you push to `main` or `master`

### Step 5: Update Configuration (Optional)

The configuration automatically detects your repository name. However, if you want to customize:

1. Edit `starlight-docs/astro.config.mjs`
2. Update the `site` URL with your actual GitHub Pages URL:
   ```javascript
   site: 'https://YOUR_USERNAME.github.io/react-query-key-factory',
   ```

### Step 6: Trigger Deployment

The deployment will automatically trigger when you:
- Push to `main` or `master` branch
- Or manually trigger it:
  1. Go to **Actions** tab in your repository
  2. Select **Deploy Starlight Docs to GitHub Pages**
  3. Click **Run workflow**

## Your Documentation URL

After deployment, your documentation will be available at:

```
https://YOUR_USERNAME.github.io/react-query-key-factory/
```

Replace:
- `YOUR_USERNAME` with your GitHub username
- `react-query-key-factory` with your repository name

## Verifying Deployment

1. Go to the **Actions** tab in your repository
2. You should see the workflow running
3. Once complete (green checkmark), visit your GitHub Pages URL
4. The documentation should be live!

## Troubleshooting

### Build Fails

1. Check the **Actions** tab for error messages
2. Common issues:
   - Node version mismatch (should be 20+)
   - Missing dependencies
   - Build errors in the code

### 404 Errors

1. Ensure the base path is correct in `astro.config.mjs`
2. Check that the repository name matches the base path
3. Clear browser cache

### Pages Not Updating

1. Check if the workflow completed successfully
2. Wait a few minutes for GitHub Pages to update
3. Hard refresh your browser (Ctrl+Shift+R or Cmd+Shift+R)

### Custom Domain

If you want to use a custom domain:

1. Add a `CNAME` file in `starlight-docs/public/` with your domain
2. Update DNS settings with your domain provider
3. Update `site` in `astro.config.mjs` to your custom domain

## Updating Documentation

To update your documentation:

1. Make changes to files in `starlight-docs/src/content/docs/`
2. Commit and push:
   ```bash
   git add .
   git commit -m "Update documentation"
   git push
   ```
3. GitHub Actions will automatically rebuild and deploy

## Manual Deployment

If you want to deploy manually:

```bash
cd starlight-docs
yarn build
# Then upload the dist/ folder to GitHub Pages
```

But the automated workflow is recommended!

## Next Steps

- ✅ Your documentation is now live on GitHub Pages!
- 📝 Continue updating content in `starlight-docs/src/content/docs/`
- 🎨 Customize styling in `starlight-docs/src/custom.css`
- 🔗 Share your documentation URL with others

## Support

If you encounter issues:
1. Check GitHub Actions logs
2. Verify repository settings
3. Ensure GitHub Pages is enabled
4. Check the [GitHub Pages documentation](https://docs.github.com/en/pages)

Happy documenting! 🚀
