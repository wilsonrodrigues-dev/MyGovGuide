import { spawn } from 'node:child_process';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import mongoose from 'mongoose';
import { setTimeout as sleep } from 'node:timers/promises';
import { projectRoot } from '../src/config/env.js';
const uri = 'mongodb://127.0.0.1:27018/admin?directConnection=true';
async function open() { await mongoose.connect(uri, { serverSelectionTimeoutMS: 700 }); }
let existing = false;
try {
  await open(); existing = true;
  const hello = await mongoose.connection.db.admin().command({ hello: 1 });
  if (!hello.setName) throw new Error('Port 27018 is already occupied by a standalone database. No changes made.');
  console.log('A local replica set is already running on 127.0.0.1:27018. No changes made.');
} catch (error) {
  if (existing) { console.error(error.message); process.exitCode = 1; }
} finally { await mongoose.disconnect(); }
if (!existing) {
  const directory = path.join(projectRoot, '.local/mongo-test');
  await mkdir(directory, { recursive: true });
  const executable = process.env.MONGOD_PATH || (process.platform === 'win32' ? 'C:\\Program Files\\MongoDB\\Server\\8.0\\bin\\mongod.exe' : 'mongod');
  const child = spawn(executable, ['--dbpath', directory, '--port', '27018', '--bind_ip', '127.0.0.1',
    '--replSet', 'mygovguide-test', '--logpath', path.join(projectRoot, '.local/mongo-test.log')],
  { stdio: 'inherit', windowsHide: true });
  let stopped = false;
  child.on('error', () => { stopped = true; console.error('Cannot launch mongod. Install MongoDB Community or set MONGOD_PATH.'); process.exitCode = 1; });
  child.on('exit', code => { stopped = true; process.exitCode = code || 0; });
  for (let attempt = 0; attempt < 25 && !stopped; attempt++) {
    await sleep(500);
    try {
      await open();
      if (stopped) break;
      try { await mongoose.connection.db.admin().command({ replSetInitiate: { _id: 'mygovguide-test', members: [{ _id: 0, host: '127.0.0.1:27018' }] } }); }
      catch (error) { if (error.codeName !== 'AlreadyInitialized') throw error; }
      console.log('Local MongoDB replica set started. Keep this terminal open; allow a few seconds for primary election.');
      break;
    } catch { /* mongod is still starting */ }
    finally { await mongoose.disconnect(); }
  }
  process.on('SIGINT', () => child.kill('SIGINT'));
  process.on('SIGTERM', () => child.kill('SIGTERM'));
}
