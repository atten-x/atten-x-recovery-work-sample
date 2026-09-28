import test from 'node:test';
import assert from 'node:assert/strict';
import { records,simulator } from '../src/simulator.ts';
import { runScenario } from '../src/scenario.ts';
test('fixtures have stable distinct IDs and synthetic addresses',()=>{assert.equal(records.length,40);assert.equal(new Set(records.map((r:any)=>r.source_id)).size,40);assert.ok(records.every((r:any)=>r.email.endsWith('.example')));});
test('simulator transient response recovers without resetting history',async()=>{const s=await simulator('retry-and-repeat');try{assert.equal((await fetch(s.url+'/records?cursor=10')).status,503);const res=await fetch(s.url+'/records?cursor=10');assert.equal(res.status,200);const page=await res.json() as any;assert.equal(page.records.length,12);assert.equal(page.next_cursor,'20');}finally{await s.close();}});
test('permanent errors remain permanent and invalid cursors reject',async()=>{const s=await simulator('terminal-failure');try{for(const cursor of ['10','10','wrong'])assert.equal((await fetch(s.url+'/records?cursor='+cursor)).status,400);}finally{await s.close();}});
test('baseline importer round trip',async()=>{assert.equal((await runScenario('baseline')).passed,true);});
