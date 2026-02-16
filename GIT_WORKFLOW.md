# Git Workflow Guide

## Initial Setup (Already Done ✅)
Your code is now on GitHub at: https://github.com/DictatorHeadass/2HOLSite

## Making Future Updates

### 1. Check Status
```powershell
git status
```

### 2. Add Changes
```powershell
# Add all changes
git add .

# Or add specific files
git add path/to/file.tsx
```

### 3. Commit Changes
```powershell
git commit -m "Description of your changes"
```

### 4. Push to GitHub
```powershell
git push
```

## Common Commands

### View Commit History
```powershell
git log --oneline -10
```

### Undo Last Commit (Keep Changes)
```powershell
git reset --soft HEAD~1
```

### Pull Latest Changes
```powershell
git pull
```

### Create a New Branch
```powershell
git checkout -b feature-name
```

### Switch Branches
```powershell
git checkout main
```

## Quick Update Workflow
```powershell
# 1. Make your code changes
# 2. Stage and commit
git add .
git commit -m "Add new feature"

# 3. Push to GitHub
git push
```

## Tips
- Commit often with clear messages
- Pull before starting new work
- Use branches for experimental features
- Keep commits focused on one change
