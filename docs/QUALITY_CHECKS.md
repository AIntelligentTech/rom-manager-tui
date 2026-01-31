# Quality Checks Quick Reference

Fast reference for running quality checks locally and understanding CI failures.

## Quick Commands

```bash
# Run everything CI runs (before pushing)
bun run ci

# Individual checks
bun run lint              # Check ESLint violations
bun run lint:fix          # Auto-fix ESLint violations
bun run format            # Auto-format code with Prettier
bun run format:check      # Check formatting without changes
bun run type-check        # Check TypeScript types
bun test                  # Run unit tests
bun test:coverage         # Run tests with coverage report
```

## Pre-Push Checklist

Before pushing to a branch:

```bash
# 1. Run all checks
bun run ci

# 2. If there are failures:

# For lint failures
bun run lint:fix
bun run format

# For type errors
# Edit code to fix types
bun run type-check

# For test failures
bun test
# Debug and fix failing tests

# 3. Run checks again to verify
bun run ci

# 4. If everything passes, push!
git push origin branch-name
```

## Common Failures & Fixes

### ESLint Violations

**Error Messages:**
```
error  unused variable 'foo'
error  Unsafe non-null assertion
error  Missing explicit return type
```

**Fix:**
```bash
bun run lint:fix      # Auto-fixes most issues
bun run lint          # Check remaining issues

# Manual fixes for complex issues:
# - Add type annotations
# - Remove unused code
# - Use proper type guards
```

### Formatting Issues

**Error:**
```
Checking formatting...
error: File is not formatted correctly
```

**Fix:**
```bash
bun run format        # Format all files
```

### Type Errors

**Error:**
```
error TS2322: Type 'string | null' is not assignable to type 'string'
```

**Fix:**
```bash
# Edit the code to handle the type correctly
# Examples:
foo = bar ?? 'default'        // Use nullish coalescing
foo = bar as string           // Type assertion (use carefully)
if (bar) foo = bar            // Type guard
```

### Test Failures

**Error:**
```
error: test "should render component" failed
```

**Debug:**
```bash
bun test                    # Run all tests
bun test --rerun           # Re-run failed tests
# Edit test file to debug
```

## Understanding CI Status

### Status Badge

In GitHub, PRs show workflow status:

```
✓ Test on ubuntu-latest
✓ Test on macos-latest
✓ ESLint
✓ TypeScript Type Check
✓ Prettier Format Check
```

All checks must pass (green) before merging.

### Viewing Failure Details

1. Click on failing check name
2. Expand "Annotations" section
3. Click on file path to see exact error
4. Fix locally using commands above
5. Push again to re-run checks

## Git Hook Setup (Optional)

Pre-commit hooks can catch issues before pushing:

**Create `.git/hooks/pre-commit`:**
```bash
#!/bin/bash
set -e

echo "Running pre-commit checks..."
bun run lint > /dev/null 2>&1 || { echo "Linting failed. Run 'bun run lint:fix'"; exit 1; }
bun run type-check > /dev/null 2>&1 || { echo "Type check failed"; exit 1; }
bun run format:check > /dev/null 2>&1 || { echo "Formatting failed. Run 'bun run format'"; exit 1; }

echo "All checks passed!"
```

**Make executable:**
```bash
chmod +x .git/hooks/pre-commit
```

## Performance Tips

**Faster local testing:**
```bash
# Only check changed files
bun run lint src/changed-file.tsx

# Run specific test file
bun test tests/specific.test.ts

# Watch mode for development
bun test --watch
```

**Parallel execution:**
```bash
# Run checks in parallel (bash)
(bun run lint &) && (bun run type-check &) && wait
```

## Integration with Editors

### VS Code - Auto-fix on Save

Install extensions and update `.vscode/settings.json`:

```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "[typescript]": {
    "editor.codeActionsOnSave": {
      "source.fixAll.eslint": true
    }
  }
}
```

### WebStorm - Auto-fix on Save

**Settings → Languages & Frameworks:**
1. TypeScript → ESLint: Enable and set "Run ESLint on save"
2. JavaScript → Prettier: Enable and set "Run on save"

## Troubleshooting

### "Cannot find module" in CI

**Cause:** Dependency lock file is stale

**Fix:**
```bash
rm -rf node_modules bun.lock
bun install
git add bun.lock
git commit -m "chore: update lockfile"
```

### Tests pass locally but fail in CI

**Cause:** Different environment (Node version, OS, etc.)

**Debug:**
```bash
# Run test with same Node version as CI
node --version

# If different, update or use nvm
nvm use 20
bun test
```

### Workflow not starting

**Check:**
1. Branch matches trigger conditions (push to main/develop)
2. GitHub Actions is enabled in repository settings
3. Workflow file syntax is valid (check `.github/workflows/*.yml`)

## Need Help?

- **ESLint Rules:** https://eslint.org/docs/rules
- **Prettier Options:** https://prettier.io/docs/en/options.html
- **TypeScript Errors:** https://www.typescriptlang.org/docs/handbook/error-index.html
- **Bun Docs:** https://bun.sh

## Related Files

- `.eslintrc.js` — ESLint configuration
- `.prettierrc` — Prettier configuration
- `tsconfig.json` — TypeScript configuration
- `.github/workflows/` — CI/CD workflow definitions
- `package.json` — npm scripts
