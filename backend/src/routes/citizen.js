import { Router } from 'express';
import { rateLimit } from 'express-rate-limit';
import { createSession, readSession, readProfile, updateProfile, deleteSession } from '../controllers/profileController.js';
import { schemePreviews } from '../controllers/schemePreviewController.js';
import { requireDatabase, requireTrustedMutation, requireSession } from '../middleware/citizenSecurity.js';
const router = Router();
router.use(['/session', '/profile', '/schemes/preview'], requireDatabase);
const writes = rateLimit({ windowMs: 15 * 60 * 1000, limit: 120, standardHeaders: 'draft-8', legacyHeaders: false,
  message: { error: { code: 'RATE_LIMITED', message: 'Please wait before saving more preferences' } } });
router.post('/session', writes, requireTrustedMutation, createSession);
router.get('/session', requireSession, readSession);
router.delete('/session', writes, requireTrustedMutation, requireSession, deleteSession);
router.get('/profile', requireSession, readProfile);
router.put('/profile', writes, requireTrustedMutation, requireSession, updateProfile);
router.get('/schemes/preview', requireSession, schemePreviews);
export default router;
