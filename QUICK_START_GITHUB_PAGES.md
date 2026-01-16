# Quick Start: Deploy to GitHub Pages

Get your documentation live on GitHub Pages in 5 minutes!

## 🚀 Quick Setup

### 1. Initialize Git (if not done)

```bash
git init
git add .
git commit -m "Add Starlight documentation"
```

### 2. Create GitHub Repository

1. Go to https://github.com/new
2. Create repository: `react-query-key-factory`
3. **Don't** initialize with README

### 3. Push to GitHub

```bash
git remote add origin https://github.com/YOUR_USERNAME/react-query-key-factory.git
git branch -M main
git push -u origin main
```

**Replace `YOUR_USERNAME` with your GitHub username!**

### 4. Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** → **Pages**
3. Under **Source**, select **GitHub Actions**
4. Save

### 5. Deploy!

The GitHub Actions workflow will automatically:
- ✅ Build your documentation
- ✅ Deploy to GitHub Pages
- ✅ Update on every push to `main`

## 📍 Your Documentation URL

After deployment (usually 1-2 minutes):

```
https://YOUR_USERNAME.github.io/react-query-key-factory/
```

## ✅ Verify It Works

1. Go to **Actions** tab in your repository
2. You should see "Deploy Starlight Docs to GitHub Pages" running
3. Wait for green checkmark ✅
4. Visit your URL!

## 🎉 Done!

Your documentation is now live! Every time you push changes, it will automatically update.

## 📝 Next Steps

- Update `starlight-docs/astro.config.mjs` line 15 with your actual GitHub URL
- Customize the documentation in `starlight-docs/src/content/docs/`
- Share your documentation URL!

## 🆘 Need Help?

See [GITHUB_PAGES_SETUP.md](./GITHUB_PAGES_SETUP.md) for detailed instructions and troubleshooting.
