# Scenarios and honest starter status

Run from PowerShell with `npm.cmd run scenario -- NAME`.

| Name | Fault | Required result | Delivered starter |
|---|---|---|---|
| baseline | Ordinary page sequence | Complete, 40 exact rows | PASS |
| retry-and-repeat | Cursor10 returns503 once; recovered page repeats prior IDs | Recover, all exact rows, no duplicates | FAIL |
| retry-limit | Cursor10 returns503 twice, then succeeds | Recover within three attempts | FAIL |
| retry-exhaustion | Cursor10 always returns503 | Failed state and nonzero child exit after exactly three attempts; retain first10 rows | FAIL |
| interruption | Terminate first child at second page-boundary; resume same DB | Complete, 40 exact rows | FAIL |
| terminal-failure | Cursor10 returns400 | Nonzero child exit; failed state, useful error, first10 correct rows retained, one request to failed cursor | FAIL |

`npm.cmd test` and `verify:starter` test healthy infrastructure and baseline. They do not establish assignment completion. `verify:assignment` is intentionally red initially; after your repair all scenarios should pass. Each new scenario uses its own temporary database; only the two invocations inside interruption share their state. The JSON report contains actual exit code, status, exact-data comparison and request count. Nonzero scenario runner exit means its required outcome was not met. A terminal scenario PASS therefore requires the importer itself to fail correctly.

The live session may combine these documented conditions without new data rules. There is no hidden requirement to produce failed attempts if your first solution is correct.
