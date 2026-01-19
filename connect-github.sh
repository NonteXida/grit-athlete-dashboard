#!/bin/bash

# Script to connect your local repository to GitHub
# Replace YOUR_USERNAME with your GitHub username and REPO_NAME with your repository name

echo "Connecting to GitHub repository..."
echo "Replace YOUR_USERNAME and REPO_NAME in the commands below:"
echo ""
echo "# Add remote origin:"
echo "git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git"
echo ""
echo "# Rename branch to main (GitHub's default):"
echo "git branch -M main"
echo ""
echo "# Push to GitHub:"
echo "git push -u origin main"
echo ""
echo "Example (if your GitHub username is 'NonteXida' and repo is 'grit-athlete-dashboard'):"
echo "git remote add origin https://github.com/NonteXida/grit-athlete-dashboard.git"
echo "git branch -M main"
echo "git push -u origin main"