import mongoose from 'mongoose';
import dns from 'node:dns';
import { env } from './env.js';

mongoose.set('bufferCommands', false);
export async function connectDB(uri = env.MONGODB_URI) {
  try {
    // Optional process-only resolver selection for SRV connections. Never alter
    // machine DNS, TLS verification, database authentication or local test URIs.
    if (uri.startsWith('mongodb+srv:') && env.MONGODB_DNS_SERVERS.trim()) {
      dns.setServers(env.MONGODB_DNS_SERVERS.split(',').map(server => server.trim()));
    }
    await mongoose.connect(uri, { serverSelectionTimeoutMS: uri.startsWith('mongodb+srv:') ? 10000 : 3000, connectTimeoutMS: 5000 });
    return mongoose.connection;
  } catch (cause) {
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
