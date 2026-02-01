# Quick Reference - Git History Simulation

## One-Line Setup & Run
```bash
cd /path/to/project && chmod +x simulate_project_history.sh && ./simulate_project_history.sh
```

## Quick Verification
```bash
git shortlog -sn                    # Commits per author
git log --oneline | wc -l          # Total commits
git log --format='%ai' | head -1   # First commit date
git log --format='%ai' | tail -1   # Last commit date
```

## Key Statistics
- **Total Commits**: ~160-180
- **Time Span**: Feb 1 - Apr 17, 2026 (76 days)
- **Authors**: 4 team members
- **Weekly Syncs**: Every Friday (4 commits each)

## Author Emails
```
Fabio Giacomello       → fabio.giacomello@example.com
Emanuele Biasi         → emanuele.biasi@example.com
Davide Prosser         → davide.prosser@example.com
Cristopher Facchinelli → cristopher.facchinelli@example.com
```

## Need Help?
Read full documentation: `GIT_HISTORY_SIMULATION_GUIDE.md`
