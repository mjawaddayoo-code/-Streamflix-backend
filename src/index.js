import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import morgan from 'morgan';
import authRoutes from './routes/auth.js';
import movieRoutes from './routes/movies.js';
import subscriptionRoutes from './routes/subscriptions.js';
import adminRoutes from './routes/admin.js';
import historyRoutes from './routes/history.js';
dotenv.config();
const app = express();
app.use(cors({ origin: process.env.CLIENT_ORIGIN?.split(',') || true }));
app.use(express.json({ limit: '1mb' }));
app.use(morgan('dev'));
app.get('/api/health', (_req, res) => res.json({ status: 'ok', service: 'StreamFlix API' }));
app.use('/api/auth', authRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/history', historyRoutes);
app.use((req, res) => res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` }));
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || 'Server error' });
});
const port = process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_URI).then(() => app.listen(port, () => console.log(`API running at http://localhost:${port}`))).catch(e => {
  console.error('MongoDB connection failed:', e.message);
  process.exit(1)
});
