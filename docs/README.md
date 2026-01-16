# Documentation Site

This directory contains the documentation website for React Query Key Factory.

## Viewing the Documentation

### Option 1: Open in Browser

Simply open `index.html` in your web browser:

```bash
# On macOS
open index.html

# On Linux
xdg-open index.html

# On Windows
start index.html
```

### Option 2: Using a Local Server

For the best experience, serve the files using a local web server:

#### Using Python

```bash
# Python 3
python3 -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

Then open `http://localhost:8000` in your browser.

#### Using Node.js (http-server)

```bash
# Install http-server globally
npm install -g http-server

# Run the server
http-server -p 8000
```

Then open `http://localhost:8000` in your browser.

#### Using PHP

```bash
php -S localhost:8000
```

Then open `http://localhost:8000` in your browser.

## File Structure

```
docs/
├── index.html      # Main documentation page
├── styles.css      # Styling for the documentation
├── script.js       # JavaScript for interactivity
└── README.md       # This file
```

## Features

- 📱 **Responsive Design**: Works on desktop, tablet, and mobile devices
- 🎨 **Modern UI**: Clean, professional design
- 🔍 **Easy Navigation**: Sidebar navigation with active section highlighting
- 📋 **Copy Code**: Click any code block to copy to clipboard
- 🚀 **Fast**: Lightweight and fast-loading
- ♿ **Accessible**: Built with accessibility in mind

## Deployment

To deploy this documentation site:

1. Upload all files in the `docs/` directory to your web server
2. Ensure `index.html` is set as the default page
3. The site works as a static site - no build process required

### GitHub Pages

If you want to deploy to GitHub Pages:

1. Push the `docs/` folder to your repository
2. Go to repository Settings > Pages
3. Set source to `/docs` folder
4. The site will be available at `https://yourusername.github.io/repo-name/`

### Netlify / Vercel

Simply drag and drop the `docs/` folder to deploy, or connect your repository and set the build directory to `docs`.
