import mongoose from 'mongoose';
import { writeFile } from 'node:fs/promises';
import { connectDB, disconnectDB, requireTransactions } from '../src/config/db.js';
import { models, initModels } from '../src/models/index.js';
import { initAdminModels } from '../src/models/admin.js';
import { importResearch } from '../src/services/ingestion/importResearch.js';
import { MongoStore } from '../src/services/ingestion/store.js';
import { phase1Dir } from '../src/config/env.js';
try {
  await connectDB(undefined, { allowLegacyReadOnly: true }); await requireTransactions();
  const collections = await mongoose.connection.db.listCollections({}, { nameOnly: true }).toArray();
  const counts = {};
  for (const c of collections) counts[c.name] = await mongoose.connection.db.collection(c.name).countDocuments();
  const result = { checkedAt: new Date().toISOString(), connected: true, database: mongoose.connection.name, transactions: true, collections: counts, empty: !Object.values(counts).some(Boolean) };
  if (process.argv.includes('--initialize-empty')) {
    await initModels(); await initAdminModels();
    if (result.empty) result.import = (await importResearch(new MongoStore(), phase1Dir)).counters;
    else result.note = 'Existing records preserved; only missing indexes initialized. Use explicit idempotent import after review.';
  }
  console.log(JSON.stringify(result, null, 2));
} catch (error) { console.error(JSON.stringify({ status: 'BLOCKED', category: error.category || 'CAPABILITY_CHECK_FAILED', note: 'No writes performed. Check private configuration, network access and replica-set capabilities. No credentials logged.' })); process.exitCode = 1; }
finally { await disconnectDB(); }
