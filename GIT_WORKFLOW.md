# Git Workflow Guide

## Initial Setup (Already Done ✅)
Your code is now on GitHub at: https://github.com/DictatorHeadass/2HOLSite

## Full Update Workflow

Here's the complete step-by-step process to push your changes to GitHub:

### Step 1: Check What Changed
```powershell
git status
```
This shows you which files have been modified, added, or deleted.

### Step 2: Review Your Changes (Optional)
```powershell
# See what changed in all files
git diff

# See what changed in a specific file
git diff path/to/file.tsx
```

### Step 3: Stage Your Changes
```powershell
# Add all changes (recommended for most updates)
git add .

# Or add specific files only
git add components/Status/StatusView.tsx
git add app/actions.ts
```

### Step 4: Commit Your Changes
```powershell
# Write a clear, descriptive commit message
git commit -m "Add new feature: admin status panel"

# For multi-line messages (more detailed)
git commit -m "Fix ESLint errors" -m "- Removed unused imports
- Fixed unescaped quotes
- Updated type definitions"
```

**Good Commit Message Examples:**
- `"Add status panel with resource indicators"`
- `"Fix: resolve database connection issue"`
- `"Update: improve mobile responsive layout"`
- `"Refactor: extract common components"`

### Step 5: Push to GitHub
```powershell
git push
```

If this is your first push on a new branch:
```powershell
git push -u origin main
```

### Complete Example
```powershell
# 1. Check status
git status

# 2. Add all changes
git add .

# 3. Commit with message
git commit -m "Add infrastructure management panel"

# 4. Push to GitHub
git push
```

## Making Future Updates (Quick Reference)

### Quick Update (3 Commands)
```powershell
git add .
git commit -m "Your change description"
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
