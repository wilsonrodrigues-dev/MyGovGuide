import { app } from './app.js';
import { connectDB, disconnectDB, requireTransactions } from './config/db.js';
import mongoose from 'mongoose';
import { env } from './config/env.js';
import { log } from './utils/logger.js';
import { initAdminModels } from './models/admin.js';
import { initContentModels } from './models/content.js';

try { await connectDB(); await requireTransactions(); await mongoose.connection.db.listCollections({}, { nameOnly: true }).toArray(); await initAdminModels(); await initContentModels(); log('database', { status: 'connected' }); }
catch { await disconnectDB(); console.error('Database initialization unavailable. Check private configuration, connectivity and replica-set capabilities.'); }
const server = app.listen(env.PORT, env.HOST, () => log('server_started', { status: 'ready' }));
server.on('error', () => { console.error('Server could not bind. Check HOST/PORT and other running servers.'); process.exitCode = 1; });
async function stop() { server.close(async () => { await disconnectDB(); process.exit(0); }); }
process.on('SIGINT', stop); process.on('SIGTERM', stop);
