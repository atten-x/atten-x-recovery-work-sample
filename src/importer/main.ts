import { openDb, fixedTime } from '../db.ts';
const [database,baseUrl,scenario]=process.argv.slice(2);
if(!database||!baseUrl||!scenario)throw Error('Use the scenario runner.');
const db=openDb(database);const runId='run-1';
db.prepare('INSERT OR IGNORE INTO import_runs VALUES (?,?,?,?,?,?,?)').run(runId,'snapshot-v1',scenario,'start','running',null,fixedTime);
let cursor=(db.prepare('SELECT next_cursor FROM import_runs WHERE run_id=?').get(runId) as any).next_cursor;
try {
 while(cursor!==null){
  const response=await fetch(`${baseUrl}/records?cursor=${encodeURIComponent(cursor)}`);
  if(!response.ok)break;
  const page=await response.json() as any;
  db.prepare('UPDATE import_runs SET next_cursor=?,updated_at=? WHERE run_id=?').run(page.next_cursor,fixedTime,runId);
  // Documented runner hook: tests can terminate the process at a page boundary.
  if(process.send){process.send({event:'page-boundary',cursor}); await new Promise<void>(resolve=>process.once('message',()=>resolve()));}
  for(const row of page.records)db.prepare('INSERT OR REPLACE INTO imported_records VALUES (?,?,?,?,?,?)').run(runId,row.source_id,row.full_name,row.email,row.company,row.source_updated_at);
  cursor=page.next_cursor;
 }
 db.prepare("UPDATE import_runs SET status='complete',last_error=NULL WHERE run_id=?").run(runId);
}catch(error){
 db.prepare("UPDATE import_runs SET status='failed',last_error=? WHERE run_id=?").run(String(error),runId);
 console.error(String(error));process.exitCode=1;
}finally{db.close();if(process.connected)process.disconnect();}
