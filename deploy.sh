#!/bin/bash

# Klara Flow Deployment Script
# Developed by Klara AI SL
echo "🚀 Setting up Klara Flow for GitHub Pages deployment..."
echo "Developed by Klara AI SL"

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "❌ Git repository not found. Please initialize git first:"
    echo "   git init"
    echo "   git add ."
    echo "   git commit -m 'Initial commit'"
    exit 1
fi

# Check if remote is set
if ! git remote get-url origin > /dev/null 2>&1; then
    echo "❌ No remote repository found. Please add your GitHub repository:"
    echo "   git remote add origin https://github.com/[username]/[repo-name].git"
    exit 1
fi

# Get repository info
REPO_URL=$(git remote get-url origin)
REPO_NAME=$(basename -s .git "$REPO_URL")
USERNAME=$(echo "$REPO_URL" | sed -n 's/.*github\.com[:/]\([^/]*\)\/.*/\1/p')

echo "📦 Building the project..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed. Please fix the errors and try again."
    exit 1
fi

echo "✅ Build successful!"

# Update package.json homepage
echo "🔧 Updating package.json homepage..."
sed -i.bak "s|https://\[your-username\].github.io/\[your-repo-name\]|https://$USERNAME.github.io/$REPO_NAME|g" package.json

echo "📝 Committing changes..."
git add .
git commit -m "Setup for GitHub Pages deployment - Klara AI SL"

echo "🚀 Pushing to GitHub..."
git push origin main

echo ""
echo "🎉 Deployment setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Go to https://github.com/$USERNAME/$REPO_NAME/settings/pages"
echo "2. Set Source to 'Deploy from a branch'"
echo "3. Select 'gh-pages' branch"
echo "4. Click Save"
echo ""
echo "🌐 Your app will be available at: https://$USERNAME.github.io/$REPO_NAME"
echo ""
echo "💡 The GitHub Action will automatically deploy on future pushes to main branch."
echo ""
echo "Developed by Klara AI SL • Built with React, TypeScript & Tailwind CSS" 