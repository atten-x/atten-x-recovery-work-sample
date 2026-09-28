import { mkdirSync, rmSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';
import { openDb } from './db.ts';
import { runScenario } from './scenario.ts';
import { scenarios, type Scenario } from './simulator.ts';
const root=fileURLToPath(new URL('../',import.meta.url));const local=join(root,'.local');
const [command,name]=process.argv.slice(2);
if(command==='setup'||command==='reset'){
 if(command==='reset')rmSync(local,{recursive:true,force:true});
 mkdirSync(local,{recursive:true});openDb(join(local,'recovery.sqlite')).close();
 console.log(command==='reset'?'Local runtime state reset; submissions untouched.':'SQLite schema ready.');
}else if(['scenario','verify:starter','verify:assignment'].includes(command)){
 if(command==='scenario'&&!scenarios.includes(name as Scenario))throw Error('Choose: '+scenarios.join(', '));
 const targets=command==='scenario'?[name as Scenario]:command==='verify:starter'?['baseline' as Scenario]:[...scenarios];
 let failed=false;
 for(const scenario of targets){const result=await runScenario(scenario);console.log(JSON.stringify(result,null,2));failed||=!result.passed;}
 if(command==='verify:starter')console.log('Starter check covers baseline only, not recovery correctness.');
 process.exitCode=failed?1:0;
}else{console.error('Commands: setup, reset, scenario NAME, verify:starter, verify:assignment');process.exitCode=1;}
