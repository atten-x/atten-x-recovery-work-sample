# Atten-X: Recover a failing data import

A paid engineering work sample. The normal import works; recovery behavior needs repair. This is a local laboratory with synthetic data, not a live client system.

## Start here on Windows

1. Install **Node.js 22.22.3** using the matching Windows installer from https://nodejs.org/dist/v22.22.3/. No separate SQLite, Python, Docker or database server is required. Reopen PowerShell after installation.
2. Download/extract this repo ZIP, then open the extracted folder containing `package.json`. Do not work inside the ZIP preview. Use Cursor or your preferred editor; AI use is welcome.
3. In PowerShell in that folder, run these one at a time:

```powershell
node --version
npm.cmd ci
npm.cmd run setup
npm.cmd run build
npm.cmd test
npm.cmd run verify:starter
```

Node should report `v22.22.3`. The expected SQLite experimental warning is not a failed check. Use `npm.cmd` if PowerShell blocks `npm.ps1`; do not change execution policy. On macOS/Linux use `npm` instead. Package installation needs internet; the laboratory has no external service calls after that.

**All commands above should pass.** If not, send the failing command and sanitized output privately to your coordinator. Start the assignment only once the starter works.

Read [ASSIGNMENT.md](ASSIGNMENT.md), the [data/recovery contract](contracts/import-and-recovery.md), and the [scenario catalog](contracts/scenario-catalog.md). [overview.html](overview.html) is the one-page summary.

```powershell
npm.cmd run scenario -- baseline
npm.cmd run scenario -- retry-and-repeat
npm.cmd run scenario -- interruption
npm.cmd run verify:assignment
```

The baseline passes. The other assessment cases intentionally fail initially; this is not a setup error. Your task is to make all documented cases pass without weakening their expectations. Full JSON results show real data/state comparisons. Run individual cases while investigating.

## Map

- `schema/001-initial.sql`: actual tables and constraints.
- `data/source-records.json`: 40 synthetic records; `fixtures/expected-records.json`: full expected result.
- `src/importer/main.ts`: existing importer to investigate.
- `src/simulator.ts`, `src/scenario.ts`: protected local source and runner.
- `submission/`: short notes and checkpoint templates.

Each scenario uses an isolated temporary database. The interruption scenario terminates and resumes the same import. `npm.cmd run reset` removes only this repo's `.local` runtime state, not your source or submission notes. It is not a way to resume a scenario.

Verification status: this package has been exercised on macOS with the pinned Node runtime. A Windows starter CI workflow is included; a passing native Windows run must still be confirmed. Starter CI checks the starting environment, not completion of the assessed repair.
