PRAGMA foreign_keys = ON;
CREATE TABLE IF NOT EXISTS import_runs (
 run_id TEXT PRIMARY KEY, snapshot_id TEXT NOT NULL, scenario_id TEXT NOT NULL,
 next_cursor TEXT, status TEXT NOT NULL CHECK(status IN ('running','failed','complete')),
 last_error TEXT, updated_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS imported_records (
 run_id TEXT NOT NULL REFERENCES import_runs(run_id), source_id TEXT NOT NULL,
 full_name TEXT NOT NULL, email TEXT NOT NULL, company TEXT NOT NULL,
 source_updated_at TEXT NOT NULL, PRIMARY KEY(run_id, source_id)
);
