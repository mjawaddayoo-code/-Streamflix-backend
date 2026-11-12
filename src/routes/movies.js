import { Router } from 'express';
import Movie from '../models/Movie.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';
import WatchHistory from '../models/WatchHistory.js';
const router = Router();
router.get('/', async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.search) filter.$text = { $search: req.query.search };
    if (req.query.genre) filter.genre = req.query.genre;
    let q = Movie.find(filter);
    q = req.query.sort === 'newest' ? q.sort({ createdAt: -1 }) : q.sort({ featured: -1, popularity: -1, createdAt: -1 });
    res.json({ movies: await q.limit(100) })
  } catch (e) { next(e) }
});
router.get('/:id', async (req, res, next) => {
  try {
    const m = await Movie.findById(req.params.id);
    if (!m) return res.status(404).json({ message: 'Movie not found.' });
    m.popularity++;
    await m.save();
    res.json({ movie: m })
  } catch (e) { next(e) }
});
router.post('/', requireAuth, requireAdmin, async (req, res, next) => { try { res.status(201).json({ movie: await Movie.create({ ...req.body, createdBy: req.user._id }) }) } catch (e) { next(e) } });
router.put('/:id', requireAuth, requireAdmin, async (req, res, next) => {
  try {
    const m = await Movie.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!m) return res.status(404).json({ message: 'Movie not found.' });
    res.json({ movie: m })
  } catch (e) { next(e) }
});
router.delete('/:id', requireAuth, requireAdmin, async (req, res, next) => {
  try {
    const m = await Movie.findByIdAndDelete(req.params.id);
    if (!m) return res.status(404).json({ message: 'Movie not found.' });
    await WatchHistory.deleteMany({ movie: m._id });
    res.json({ message: 'Movie deleted.' })
  } catch (e) { next(e) }
});
export default router;
