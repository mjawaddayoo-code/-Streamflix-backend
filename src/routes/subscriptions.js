import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import User from '../models/User.js';
const router = Router();
const plans = [{ id: 'basic', name: 'Basic', price: 499, quality: '720p', screens: 1 }, { id: 'standard', name: 'Standard', price: 899, quality: '1080p', screens: 2 }, { id: 'premium', name: 'Premium', price: 1299, quality: '4K + HDR', screens: 4 }];
router.get('/plans', (_req, res) => res.json({ plans }));
router.post('/subscribe', requireAuth, async (req, res, next) => {
  try {
    const p = plans.find(x => x.id === req.body.planId);
    if (!p) return res.status(400).json({ message: 'Choose a valid plan.' });
    const u = await User.findByIdAndUpdate(req.user._id, { subscription: { planId: p.id, status: 'active', startedAt: new Date() } }, { new: true }).select('-passwordHash');
    res.json({ message: 'Demo plan activated. No payment was processed.', subscription: u.subscription })
  } catch (e) { next(e) }
});
export default router;
