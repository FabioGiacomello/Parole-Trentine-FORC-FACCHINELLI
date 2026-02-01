# Git History Simulation - Usage Guide

## Overview

This script simulates a realistic project evolution history for the Parole Trentine Dictionary application, demonstrating how a team of 4 developers collaboratively built the project from February 1, 2026 to April 17, 2026.

## What This Script Does

- **Generates 160-180 commits** across a 76-day period
- **Simulates 4 team members** with different roles and commit patterns
- **Creates realistic commit messages** specific to each developer's expertise
- **Distributes commits organically** across morning, afternoon, and evening hours
- **Includes weekly sync commits** every Friday for team coordination
- **Maintains code evolution** from basic boilerplate to production-ready features

## Team Members

| Name | Role | Focus Area | Expected Commits |
|------|------|------------|------------------|
| Fabio Giacomello | Lead Developer | Architecture, Core Components, Code Review | 42-48 |
| Emanuele Biasi | UI/UX Designer | CSS Styling, Refactoring, Interfaces | 40-45 |
| Davide Prosser | Backend Developer | SQL Schema, CSV Logic, Data Integration | 40-45 |
| Cristopher Facchinelli | Documentation/QA | JSDoc, README, Assets, Figma→CSS | 38-42 |

## Project Phases

### Phase 1: Foundation (February 2026)
- React + Vite project initialization
- TypeScript configuration
- Tailwind CSS setup
- Basic component structure (Header, Footer, Layout)
- Supabase client configuration
- Initial database schema

### Phase 2: Core Features (March 2026)
- useDictionary hook with Supabase integration
- Search functionality with filters
- Admin dashboard components
- Authentication flow
- Excel/CSV import functionality
- User suggestions system

### Phase 3: Polish & Documentation (April 2026)
- JSDoc comments throughout codebase
- Accessibility improvements (ARIA, keyboard navigation)
- Dark mode implementation
- Additional pages (ChiSiamo, Contatti, Progetto, Crediti)
- Performance optimizations
- Final code review and cleanup

## Prerequisites

- **Git** installed and configured
- **macOS** or **Linux** (Bash shell)
- **Existing Git repository** (the script must run inside a git repo)

## Usage Instructions

### Option 1: Run in Current Project (Will Modify History)

⚠️ **WARNING**: This will add commits to your current branch. Make sure you have a backup!

```bash
# Navigate to your project directory
cd /path/to/Parole-Trentine-FORC-FACCHINELLI

# Make sure the script is executable
chmod +x simulate_project_history.sh

# Run the script
./simulate_project_history.sh
```

### Option 2: Run in a Separate Test Repository (Recommended)

```bash
# Create a new directory for testing
mkdir ~/test-dictionary-project
cd ~/test-dictionary-project

# Initialize git repository
git init

# Copy the script
cp /path/to/Parole-Trentine-FORC-FACCHINELLI/simulate_project_history.sh .

# Run the script
./simulate_project_history.sh
```

### Option 3: Run on a New Branch

```bash
# Navigate to your project
cd /path/to/Parole-Trentine-FORC-FACCHINELLI

# Create a new branch
git checkout -b git-history-simulation

# Run the script
./simulate_project_history.sh

# Review the history
git log --oneline --all --graph
```

## Verification Commands

After running the script, verify the results:

```bash
# View complete commit history with graph
git log --oneline --all --graph

# View commits per author
git shortlog -sn

# View detailed commit count per author
git log --format='%an' | sort | uniq -c | sort -rn

# View commits in date range
git log --since="2026-02-01" --until="2026-04-17" --oneline

# View commits by specific author
git log --author="Fabio Giacomello" --oneline

# View Friday weekly sync commits
git log --grep="Weekly sync" --oneline
```

## Expected Output

```
======================================
✅ Git History Simulation Complete!
======================================

📊 Summary:
  Total commits: 165

👥 Commits per author:
  Fabio Giacomello: 43 commits
  Emanuele Biasi: 41 commits
  Davide Prosser: 42 commits
  Cristopher Facchinelli: 39 commits

📅 Date range: 2026-02-01 to 2026-04-17
```

## Commit Message Examples

### Fabio (Lead Developer)
- "Initialize React project with Vite and TypeScript configuration"
- "Implement useDictionary hook with Supabase integration"
- "Add debounce utility for search input optimization"
- "Code review: optimize dictionary search algorithm complexity"

### Emanuele (UI/UX)
- "Style SearchBar component with focus animations"
- "Implement dark mode toggle with smooth transitions"
- "Add ARIA labels to all interactive components"
- "Refactor all components for WCAG 2.1 AA compliance"

### Davide (Backend)
- "Create initial Supabase schema for dictionary_entries table"
- "Add CSV parser utility for Excel import"
- "Implement has_role() security definer function"
- "Add full-text search optimization with tsvector"

### Cristopher (Docs/QA)
- "Create comprehensive README with project overview"
- "Add JSDoc comments to all React components"
- "Translate Figma design specs to Tailwind classes documentation"
- "Final documentation review and polish"

## Customization

You can customize the script by editing these sections:

### Change Date Range
```bash
START_DATE="2026-02-01"
END_DATE="2026-04-17"
```

### Add More Commit Messages
Edit the arrays at lines 80-400:
```bash
declare -a FABIO_FEB=(
  "Your custom commit message 1"
  "Your custom commit message 2"
)
```

### Adjust Commit Frequency
Modify line ~470:
```bash
# Change from 2-3 commits to 3-4 per day
commits_today=$((RANDOM % 2 + 3))
```

## Troubleshooting

### Error: "Not a git repository"
Make sure you're running the script inside a directory initialized with Git:
```bash
git init
```

### Error: "date: illegal time format" (macOS)
The script uses `date -j` for macOS compatibility. If you encounter issues, ensure your system date format is correct.

### Commits Not Showing Correct Dates
Verify the `--date` flag is working:
```bash
git log --format="%ai %s" | head -20
```

### Too Few/Too Many Commits
Adjust the `commits_today` variable or add more commit messages to the arrays.

## Safety Notes

- ✅ The script **does not delete** existing commits
- ✅ The script **does not force push** to remote repositories
- ✅ All commits use **proper ISO 8601 date formatting**
- ✅ Each commit has **unique timestamps** (randomized hours/minutes)
- ⚠️ The script **will modify** your local Git history
- ⚠️ Always **backup your repository** before running

## Rollback Instructions

If you need to undo the simulation:

```bash
# Option 1: Reset to before simulation (if on separate branch)
git checkout main
git branch -D git-history-simulation

# Option 2: Interactive rebase to remove simulation commits
git rebase -i <commit-hash-before-simulation>

# Option 3: Restore from backup
rm -rf .git
mv .git-backup .git
```

## Technical Details

### Date Distribution
- **Morning commits**: 08:00 - 12:59
- **Afternoon commits**: 13:00 - 17:59
- **Evening commits**: 18:00 - 22:59

### Weekly Sync Pattern
Every Friday generates 4 commits (one per team member):
1. "Weekly sync: review progress and merge feature branches"
2. "Weekly sync: update documentation and assets"
3. "Weekly sync: database schema review and optimization"
4. "Weekly sync: UI polish and responsive testing"

### Timezone
All commits use **CET (Central European Time)**: `+01:00`

## License

This script is provided for educational and demonstration purposes as part of the Parole Trentine Dictionary project.

## Support

For issues or questions about this script, please refer to the project documentation or contact the development team.
