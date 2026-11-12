import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    movie: { type: mongoose.Schema.Types.ObjectId, ref: "Movie", required: true },
    watchedAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

schema.index({ user: 1, movie: 1 }, { unique: true });

export default mongoose.model("WatchHistory", schema);
