import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { requireAuth } from '../middleware/auth.js';
const router = Router();
const safe = u => ({ id: u._id, name: u.name, email: u.email, role: u.role, subscription: u.subscription });
const token = u => jwt.sign({ id: u._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
router.post('/register', async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name?.trim() || !email?.trim() || !password) return res.status(400).json({ message: 'Name, email and password are required.' });
    if (password.length < 8) return res.status(400).json({ message: 'Password must be at least 8 characters.' });
    if (await User.findOne({ email: email.toLowerCase() })) return res.status(409).json({ message: 'Email already registered.' });
    const u = await User.create({ name: name.trim(), email, passwordHash: await bcrypt.hash(password, 12) });
    res.status(201).json({ token: token(u), user: safe(u) })
  } catch (e) { next(e) }
});
router.post('/login', async (req, res, next) => {
  try {
    const u = await User.findOne({ email: req.body.email?.toLowerCase() });
    if (!u || !(await bcrypt.compare(req.body.password || '', u.passwordHash))) return res.status(401).json({ message: 'Invalid email or password.' });
    res.json({ token: token(u), user: safe(u) })
  } catch (e) { next(e) }
});
router.get('/me', requireAuth, (req, res) => res.json({ user: safe(req.user) }));
export default router;
