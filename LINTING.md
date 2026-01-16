# Linting and Type Checking

This project uses ESLint and TypeScript for code quality checks.

## Setup

- **ESLint**: Code linting with TypeScript support
- **TypeScript**: Type checking without emitting files

## Commands

### Linting

```bash
# Run ESLint
yarn lint

# Run ESLint and auto-fix issues
yarn lint:fix
```

### Type Checking

```bash
# Run TypeScript type checking
yarn type-check
```

### Combined Check

```bash
# Run both type checking and linting
yarn check
```

## Configuration

### ESLint

- Configuration: `eslint.config.js` (ESLint 9 flat config format)
- TypeScript parser: `@typescript-eslint/parser`
- Plugins: TypeScript ESLint rules
- Rules: Configured for TypeScript best practices

### TypeScript

- Configuration: `tsconfig.json`
- Additional config for ESLint: `tsconfig.eslint.json`
- Strict mode: Enabled
- Additional checks:
  - `noUnusedLocals`: true
  - `noUnusedParameters`: true
  - `noImplicitReturns`: true
  - `noFallthroughCasesInSwitch`: true

## Ignored Files

The following are excluded from linting:
- `dist/` - Build output
- `node_modules/` - Dependencies
- `coverage/` - Test coverage
- `starlight-docs/` - Documentation site
- `docs/` - HTML documentation
- Config files (`*.config.js`, `*.config.mjs`)

## CI/CD Integration

You can add these checks to your CI/CD pipeline:

```yaml
# Example GitHub Actions
- name: Type Check
  run: yarn type-check

- name: Lint
  run: yarn lint
```

## Pre-commit Hooks (Optional)

To run checks before commits, you can use `husky` and `lint-staged`:

```bash
yarn add -D husky lint-staged
```

Then configure in `package.json`:
```json
{
  "lint-staged": {
    "*.ts": ["eslint --fix", "git add"]
  }
}
```

## Warnings vs Errors

- **Errors**: Must be fixed (e.g., unused variables, type errors)
- **Warnings**: Should be reviewed but don't block builds (e.g., `any` types in factory code)

The factory implementation uses `any` types intentionally for dynamic key generation, which is why some warnings are expected and acceptable.
