import mongoose from 'mongoose';
import {guardReadOnlyDatabase} from './readOnly.js';
import dns from 'node:dns';
import { env, resolveDatabaseName } from './env.js';

mongoose.set('bufferCommands', false);
export function databaseTarget(uri = env.MONGODB_URI, explicitName = env.MONGODB_DB_NAME) {
  return { name: resolveDatabaseName(uri, explicitName) };
}
export async function connectDB(uri = env.MONGODB_URI, { dbName = env.MONGODB_DB_NAME, allowLegacyReadOnly = env.DATABASE_READ_ONLY==='true' } = {}) {
  const target = databaseTarget(uri, dbName);
  const legacy = env.LEGACY_MONGODB_DB_NAME;
  if (!allowLegacyReadOnly && env.DENY_LEGACY_DB_WRITES === 'true' && legacy && target.name === legacy) {
    throw Object.assign(new Error('Legacy database writes are disabled. Use the explicitly named demo database.'), { category: 'LEGACY_DATABASE_WRITE_DENIED' });
  }
  try {
    // Optional process-only resolver selection for SRV connections. Never alter
    // machine DNS, TLS verification, database authentication or local test URIs.
    if (uri.startsWith('mongodb+srv:') && env.MONGODB_DNS_SERVERS.trim()) {
      dns.setServers(env.MONGODB_DNS_SERVERS.split(',').map(server => server.trim()));
    }
    await mongoose.connect(uri, { autoCreate:false,autoIndex:false,dbName: target.name, serverSelectionTimeoutMS: uri.startsWith('mongodb+srv:') ? 10000 : 3000, connectTimeoutMS: 5000 });
    if (mongoose.connection.name !== target.name) {
      await mongoose.disconnect();
      throw Object.assign(new Error('Connected database does not match the configured target.'), { category: 'DATABASE_TARGET_MISMATCH' });
    }
    if(env.DATABASE_READ_ONLY==='true'||allowLegacyReadOnly&&legacy&&target.name===legacy){mongoose.connection.readOnly=true;guardReadOnlyDatabase(mongoose.connection.db);for(const collection of Object.values(mongoose.connection.collections))collection.collection=mongoose.connection.db.collection(collection.name);}
    else mongoose.connection.readOnly=false;
    return mongoose.connection;
  } catch (cause) {
    if (cause.category) throw cause;
    const category = cause.code === 18 ? 'AUTHENTICATION_FAILED' : /querySrv|ENOTFOUND|ECONNREFUSED|DNS/i.test(cause.message) ? 'DNS_OR_CONNECTION_FAILED' : /timed out|server selection/i.test(cause.message) ? 'SERVER_SELECTION_TIMEOUT' : 'CONNECTION_FAILED';
    throw Object.assign(new Error('MongoDB unavailable. Start the local database or configure MONGODB_URI in backend/.env.'), { category });
  }
}
export async function requireTransactions() {
  const hello = await mongoose.connection.db.admin().command({ hello: 1 });
  if (!hello.setName && hello.msg !== 'isdbgrid') {
    throw new Error('Writes require a MongoDB replica set for atomic version/audit updates. Run npm run db:local; see backend/README.md.');
  }
}
export async function disconnectDB() { await mongoose.disconnect(); }
