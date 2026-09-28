import { DatabaseSync } from 'node:sqlite';
import { readFileSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
export const fixedTime='2026-01-15T12:00:00.000Z';
export function openDb(path:string) {
 mkdirSync(dirname(path),{recursive:true});
 const db=new DatabaseSync(path);
 db.exec(readFileSync(new URL('../schema/001-initial.sql',import.meta.url),'utf8'));
 return db;
}
