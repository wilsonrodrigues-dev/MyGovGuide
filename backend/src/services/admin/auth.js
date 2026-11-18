import { randomBytes, randomUUID, createHash, timingSafeEqual } from 'node:crypto';
import { AdminAudit } from '../../models/admin.js';
import { env } from '../../config/env.js';
export const cookieName = env.NODE_ENV === 'production' ? '__Host-mgg_admin' : 'mgg_admin';
export const cookieOptions = { httpOnly: true, secure: env.NODE_ENV === 'production', sameSite: 'strict', path: '/', maxAge: 8 * 3600000 };
const sessions = new Map();
export const digest = value => createHash('sha256').update(value).digest('hex');
const equal = (a,b) => timingSafeEqual(Buffer.from(digest(a)),Buffer.from(digest(b)));
const credentialVersion = () => digest(JSON.stringify([env.ADMIN_USERNAME,env.ADMIN_PASSWORD]));
export const adminConfigured = () => Boolean(env.ADMIN_USERNAME && env.ADMIN_PASSWORD);
export function credentialsMatch(username,password) {return adminConfigured() && equal(String(username),env.ADMIN_USERNAME) && equal(String(password),env.ADMIN_PASSWORD);}
export function tokenFrom(req) {const value=req.headers.cookie?.split(';').map(x=>x.trim()).find(x=>x.startsWith(cookieName+'='))?.slice(cookieName.length+1);return /^[\w-]{43}$/.test(value||'')?value:null;}
export function revokeSession(token) {if(token)sessions.delete(digest(token));}
export function createSession() {
 for(const [id,s]of sessions)if(s.expiresAt<=Date.now())sessions.delete(id);
 const token=randomBytes(32).toString('base64url');sessions.set(digest(token),{expiresAt:Date.now()+cookieOptions.maxAge,credentialVersion:credentialVersion()});return token;
}
export function authenticate(req,res,next) {
 const token=tokenFrom(req),session=token&&sessions.get(digest(token));
 if(!adminConfigured()||!session||session.expiresAt<=Date.now()||session.credentialVersion!==credentialVersion()){revokeSession(token);return res.status(401).json({error:{code:'ADMIN_AUTH_REQUIRED',message:'Administrator sign-in required'}});}
 req.admin={_id:'environment-admin',username:env.ADMIN_USERNAME};req.adminToken=token;next();
}
export async function audit(actor,action,target,details={},session){await AdminAudit.create([{_id:randomUUID(),actor,action,target,details}],{session});}
