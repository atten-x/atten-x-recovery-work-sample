import { createServer } from 'node:http';
import { readFileSync } from 'node:fs';
export const scenarios=['baseline','retry-and-repeat','retry-limit','retry-exhaustion','interruption','terminal-failure'] as const;
export type Scenario=typeof scenarios[number];
export const records=JSON.parse(readFileSync(new URL('../data/source-records.json',import.meta.url),'utf8'));
export async function simulator(scenario:Scenario) {
 const attempts=new Map<string,number>(); let requests=0;
 const server=createServer((req,res)=>{
  const url=new URL(req.url||'/', 'http://localhost');
  res.setHeader('Content-Type','application/json');
  if(url.pathname!='/records'){res.writeHead(404);res.end(JSON.stringify({error:'not found'}));return;}
  const cursor=url.searchParams.get('cursor')||'start';
  if(!['start','10','20','30'].includes(cursor)){res.writeHead(400);res.end(JSON.stringify({error:'invalid cursor'}));return;}
  requests++; const attempt=(attempts.get(cursor)||0)+1;attempts.set(cursor,attempt);
  if(cursor==='10'&&((scenario==='retry-and-repeat'&&attempt===1)||(scenario==='retry-limit'&&attempt<=2)||scenario==='retry-exhaustion')){res.writeHead(503);res.end(JSON.stringify({error:'temporary source failure'}));return;}
  if(scenario==='terminal-failure'&&cursor==='10'){res.writeHead(400);res.end(JSON.stringify({error:'permanent source failure'}));return;}
  const offset=cursor==='start'?0:Number(cursor);
  let page=records.slice(offset,offset+10);
  if(scenario==='retry-and-repeat'&&cursor==='10') page=[...records.slice(8,10),...page];
  res.end(JSON.stringify({snapshot_id:'snapshot-v1',records:page,next_cursor:offset+10<records.length?String(offset+10):null}));
 });
 await new Promise<void>(resolve=>server.listen(0,'127.0.0.1',resolve));
 const address=server.address(); if(!address||typeof address==='string')throw Error('No server address');
 return {url:`http://127.0.0.1:${address.port}`,attempts,get requests(){return requests;},close:()=>new Promise<void>((resolve,reject)=>{server.close(err=>err?reject(err):resolve());server.closeAllConnections();})};
}
