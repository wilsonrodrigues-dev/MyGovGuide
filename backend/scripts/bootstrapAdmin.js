import {adminConfigured} from '../src/services/admin/auth.js';
if(adminConfigured())console.log('Environment admin login is configured. No database bootstrap is needed.');
else {console.error('Set ADMIN_USERNAME and ADMIN_PASSWORD privately in backend/.env, then restart the backend. No database bootstrap is needed.');process.exitCode=1;}
