# Assignment: recover a failing data import

Investigate why an inherited importer works in a simple run but fails during retries and restart. Make a focused repair and prove that it preserves exact data and reports failures truthfully.

## Your work

1. Read the contracts and run the baseline, then reproduce a failing scenario. After about two active working hours, send a short checkpoint: command/input, actual versus expected result, current hypothesis and next experiment.
2. Repair the importer, run the other scenarios, and use contradictory evidence to revise your approach. Around four active hours, share the current commit/snapshot, progress and remaining blocker. If finished earlier, submit rather than inventing extra work.
3. Add regression tests, run the complete assignment checks, and prepare a reproducible handoff. Record meaningful turning points while you work: hypothesis → experiment → result → next decision. You need not record every keystroke or force multiple failed attempts.

Read [the exact contract](contracts/import-and-recovery.md) and [all required scenarios](contracts/scenario-catalog.md). You may change importer code, add helpers/tests, and propose a justified additive migration. Do not change the protected source fixtures, simulator, scenario runner, supplied constraints or expected results to obtain a pass. Report a real harness defect instead of working around it silently.

AI tools and focused clarification/hint requests are welcome. Note what assistance you used and how you verified its suggestions. Productive investigation and verified follow-through matter more than hours spent or an unsupported completion claim.

## Evidence and live follow-up

Include code/tests, actual command results and checkpoints in the combined private handoff. Add a recovery section to the shared work log; [work notes](submission/WORK_SAMPLE_NOTES.md) is an optional formatting aid, not a second required report. Distinguish completed work from remaining failures.

Reserve the final 45 minutes of the agreed cap for a live session. We may combine documented failure conditions; no new business rule is introduced. Investigate a result, explain evidence and choose a next step. If your repair already handles it, demonstrate why; we will not require artificial failure. Quiet investigation is welcome.

## Time, payment and submission

This and [the Cursor assignment](https://github.com/atten-x/atten-x-cursor-work-sample) are required for every candidate.

This is paid work at your **Hirexe hourly rate**, up to **6 working hours for this assignment**, including setup, familiarization, implementation, notes and a **45-minute live follow-up**. Complete **both assignments within a 12-hour total cap per candidate**; each assignment has its own 6-hour cap. Do not exceed the cap without a separate agreement. Aim to submit within about one week after you receive the complete materials and working access; confirm the exact dates and submission channel with the Hirexe/Atten-X coordinator before starting. Stop and contact that coordinator if access, setup or learning time would prevent a fair attempt. No unbounded unpaid troubleshooting.

Email **one ZIP file containing both assignment project folders**, including their source, tests and notes, to the coordinator. This starter repository is public: do not post your solution, personal details, credentials, complete AI chat exports or compensation information in public issues/PRs. Exclude `node_modules`, local databases and build output. A candid partial result and precise next step are useful at the cap.
