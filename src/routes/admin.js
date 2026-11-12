import { Router } from "express";
import User from "../models/User.js";
import WatchHistory from "../models/WatchHistory.js";
import { requireAuth, requireAdmin } from "../middleware/auth.js";

const router = Router();

// Password hashes are never returned by admin endpoints.
router.get("/users", requireAuth, requireAdmin, async (_req, res, next) => {
  try {
    const users = await User.find({ role: "user" })
      .select("name email role subscription createdAt")
      .sort({ createdAt: -1 })
      .lean();
    const history = await WatchHistory.find({ user: { $in: users.map((user) => user._id) } })
      .populate("movie", "title posterUrl year")
      .sort({ watchedAt: -1 })
      .lean();
    const byUser = new Map();
    for (const item of history) {
      if (!item.movie) continue;
      const key = String(item.user);
      if (!byUser.has(key)) byUser.set(key, []);
      byUser.get(key).push({
        movieId: item.movie._id,
        title: item.movie.title,
        posterUrl: item.movie.posterUrl,
        year: item.movie.year,
        watchedAt: item.watchedAt,
      });
    }
    res.json({ users: users.map((user) => ({ ...user, watchHistory: byUser.get(String(user._id)) || [] })) });
  } catch (error) {
    next(error);
  }
});

router.delete("/users/:id", requireAuth, requireAdmin, async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: req.params.id, role: "user" });
    if (!user) return res.status(404).json({ message: "User not found or cannot be deleted." });
    await WatchHistory.deleteMany({ user: user._id });
    await user.deleteOne();
    res.json({ message: "User and their watch history have been deleted." });
  } catch (error) {
    next(error);
  }
});

export default router;
