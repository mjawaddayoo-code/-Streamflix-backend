import { Router } from "express";
import mongoose from "mongoose";
import Movie from "../models/Movie.js";
import WatchHistory from "../models/WatchHistory.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.get("/", requireAuth, async (req, res, next) => {
  try {
    const history = await WatchHistory.find({ user: req.user._id })
      .populate("movie", "title description year rating duration genre posterUrl backdropUrl trailerId")
      .sort({ watchedAt: -1 })
      .limit(100)
      .lean();
    res.json({ history: history.filter((item) => item.movie) });
  } catch (error) {
    next(error);
  }
});

router.post("/:movieId", requireAuth, async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.movieId)) {
      return res.status(400).json({ message: "Invalid movie ID." });
    }
    const movie = await Movie.findById(req.params.movieId).select("_id");
    if (!movie) return res.status(404).json({ message: "Movie not found." });
    const item = await WatchHistory.findOneAndUpdate(
      { user: req.user._id, movie: movie._id },
      { $set: { watchedAt: new Date() } },
      { new: true, upsert: true, setDefaultsOnInsert: true },
    );
    res.status(200).json({ message: "Watch history updated.", watchedAt: item.watchedAt });
  } catch (error) {
    next(error);
  }
});

router.delete("/:movieId", requireAuth, async (req, res, next) => {
  try {
    await WatchHistory.deleteOne({ user: req.user._id, movie: req.params.movieId });
    res.json({ message: "Removed from watch history." });
  } catch (error) {
    next(error);
  }
});

router.delete("/", requireAuth, async (req, res, next) => {
  try {
    await WatchHistory.deleteMany({ user: req.user._id });
    res.json({ message: "Watch history cleared." });
  } catch (error) {
    next(error);
  }
});

export default router;
