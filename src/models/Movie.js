import mongoose from 'mongoose';
const schema = new mongoose.Schema({ title: { type: String, required: true, trim: true }, description: { type: String, default: '' }, year: { type: Number, default: 2026 }, rating: { type: String, default: 'TV-MA' }, duration: { type: String, default: '1h 45m' }, genre: [String], posterUrl: { type: String, required: true }, backdropUrl: { type: String, default: '' }, trailerId: { type: String, default: '' }, featured: { type: Boolean, default: false }, popularity: { type: Number, default: 0 }, createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } }, { timestamps: true });
schema.index({ title: 'text', description: 'text', genre: 'text' });
export default mongoose.model('Movie', schema);
