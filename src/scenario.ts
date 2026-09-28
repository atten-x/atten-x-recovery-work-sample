import { spawn } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { openDb } from './db.ts';
import { simulator, type Scenario } from './simulator.ts';
const root=fileURLToPath(new URL('../',import.meta.url));
export async function runScenario(name:Scenario){
 const folder=mkdtempSync(join(tmpdir(),'attenx recovery '));const database=join(folder,'scenario.sqlite');
 const api=await simulator(name);let killed=false;let boundaries=0;const logs:string[]=[];
 async function invoke(interrupt:boolean){
  return await new Promise<{code:number|null,timeout:boolean}>((resolve,reject)=>{
   const child=spawn(process.execPath,['--import','tsx','src/importer/main.ts',database,api.url,name],{cwd:root,stdio:['ignore','pipe','pipe','ipc']});
   let timedOut=false;
   const timer=setTimeout(()=>{timedOut=true;child.kill();},10000);
   child.stdout!.on('data',data=>logs.push(String(data)));child.stderr!.on('data',data=>logs.push(String(data)));
   child.on('message',(message:any)=>{
    if(message?.event==='page-boundary'){
     if(interrupt&&!killed&&++boundaries===2){killed=true;child.kill();}else if(child.connected)child.send({continue:true});
    }
   });
   child.on('error',error=>{clearTimeout(timer);reject(error);});
   child.on('close',code=>{clearTimeout(timer);resolve({code,timeout:timedOut});});
  });
 }
 try{
  let result=await invoke(name==='interruption');
  if(name==='interruption'&&killed&&!result.timeout){
   const audit=openDb(database);
   audit.exec(`CREATE TABLE _harness_retention (event TEXT NOT NULL);
    INSERT INTO _harness_retention VALUES ('marker');
    CREATE TRIGGER _retain_records AFTER DELETE ON imported_records BEGIN INSERT INTO _harness_retention VALUES ('deleted-record'); END;
    CREATE TRIGGER _retain_run AFTER DELETE ON import_runs BEGIN INSERT INTO _harness_retention VALUES ('deleted-run'); END;`);
   audit.close(); result=await invoke(false);
  }
  const db=openDb(database);
  const run=db.prepare('SELECT * FROM import_runs').get() as any;
  const rows=db.prepare('SELECT source_id,full_name,email,company,source_updated_at FROM imported_records ORDER BY source_id').all();
  let retained=true;
  if(name==='interruption'){
   try{const events=db.prepare('SELECT event FROM _harness_retention').all() as {event:string}[];
    const triggers=db.prepare("SELECT name FROM sqlite_master WHERE type='trigger' AND name IN ('_retain_records','_retain_run')").all();
    retained=events.length===1&&events[0].event==='marker'&&triggers.length===2;
   }catch{retained=false;}
  }
  db.close();
  const expected=JSON.parse(readFileSync(new URL('../fixtures/expected-records.json',import.meta.url),'utf8'));
  const fullMatch=JSON.stringify(rows)===JSON.stringify(expected);
  const terminal=name==='terminal-failure'||name==='retry-exhaustion';
  const prefixMatch=JSON.stringify(rows)===JSON.stringify(expected.slice(0,10));
  const retryBound=[...api.attempts.values()].every(n=>n<=3);
  const passed=!result.timeout&&retained&&retryBound&&(terminal
   ? result.code!==null&&result.code!==0&&run?.status==='failed'&&!!run.last_error&&api.attempts.get('10')===(name==='terminal-failure'?1:3)&&prefixMatch
   : result.code===0&&run?.status==='complete'&&run.next_cursor===null&&fullMatch&&(!name.includes('interruption')||killed));
  return {scenario:name,passed,exitCode:result.code,status:run?.status,records:rows.length,exactDataMatch:terminal?prefixMatch:fullMatch,sourceRequests:api.requests,retained,attempts:Object.fromEntries(api.attempts),interrupted:killed,timedOut:result.timeout,logs:logs.join('')};
 }finally{await api.close();rmSync(folder,{recursive:true,force:true});}
}
