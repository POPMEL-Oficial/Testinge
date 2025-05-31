# Hosting on GitHub Pages

This project is designed to work perfectly on GitHub Pages since it's a static site using only HTML, CSS, and JavaScript.

## Setup Instructions

1. Create a GitHub repository
2. Push the code to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/REPOSITORY-NAME.git
   git push -u origin main
   ```

3. Enable GitHub Pages:
   - Go to your repository on GitHub
   - Click on "Settings"
   - Scroll down to "GitHub Pages" section
   - Select "main" branch as the source
   - Click Save

4. Your site will be published at: `https://YOUR-USERNAME.github.io/REPOSITORY-NAME/`

## Important Notes for GitHub Pages

- The site is already configured to work without a server
- No need for the `index.js` Node.js server file in GitHub Pages deployment
- All paths are relative, so they work correctly in a subdirectory
- The site uses pure frontend technologies (HTML, CSS, JavaScript) with no backend requirements

## Making Changes

After making changes to your site:

1. Commit and push the changes:
   ```bash
   git add .
   git commit -m "Update site"
   git push
   ```

2. GitHub Pages will automatically rebuild and deploy your site
3. It might take a few minutes for changes to appear 