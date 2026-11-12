import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from './models/User.js';
import Movie from './models/Movie.js';
dotenv.config();
const movies = [
  { title: 'Stranger Things', year: 2022, rating: 'TV-14', duration: '4 Seasons', genre: ['Sci-Fi', 'Drama'], description: 'Friends uncover a strange mystery in their small town.', posterUrl: 'https://image.tmdb.org/t/p/w500/x2LSRK2Cm7MZhjluni1msVJ3wDF.jpg', backdropUrl: 'https://image.tmdb.org/t/p/w1280/56v2KjBlU4XaOv9rVYEQypROD7P.jpg', trailerId: 'b9EkMc79ZSU', featured: true, popularity: 96 },
  { title: 'Wednesday', year: 2022, rating: 'TV-14', duration: '1 Season', genre: ['Mystery', 'Comedy'], description: 'A clever outcast investigates a supernatural mystery at her new school.', posterUrl: 'https://image.tmdb.org/t/p/w500/jeGtaMwGxPmQN5xM4ClnwPQcNQz.jpg', backdropUrl: 'https://image.tmdb.org/t/p/w1280/iHSwvRVsRyxpX7FE7GbviaDvgGZ.jpg', trailerId: 'Di310WS8zLk', featured: true, popularity: 92 },
  { title: 'Extraction 2', year: 2023, rating: 'R', duration: '2h 3m', genre: ['Action', 'Thriller'], description: 'A black-ops mercenary takes on a dangerous extraction mission.', posterUrl: 'https://image.tmdb.org/t/p/w500/7gKI9hpEMcZUQpNgKrkDzJpbnNS.jpg', backdropUrl: 'https://image.tmdb.org/t/p/w1280/7I6VUdPj6tQECNHdviJkUHD2u89.jpg', trailerId: 'Y274jZs5s7s', popularity: 89 },
  { title: 'The Adam Project', year: 2022, rating: 'PG-13', duration: '1h 46m', genre: ['Sci-Fi', 'Adventure'], description: 'A time-traveling pilot teams up with his younger self.', posterUrl: 'https://image.tmdb.org/t/p/w500/wFjboE0aFZNb7jwy0U00Qocqo6E.jpg', backdropUrl: 'https://image.tmdb.org/t/p/w1280/ewUqXnwiRLhgmGhuksOdLgh49Ch.jpg', trailerId: 'IE8HIsIrq4o', popularity: 84 }
];
async function run() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    let admin = await User.findOne({ email: 'admin@streamflix.local' });
    if (!admin) admin = await User.create({ name: 'StreamFlix Admin', email: 'admin@streamflix.local', passwordHash: await bcrypt.hash('Admin123!', 12), role: 'admin' });
    if (!await Movie.countDocuments()) await Movie.insertMany(movies.map(m => ({ ...m, createdBy: admin._id })));
    console.log('Seed complete: admin@streamflix.local / Admin123!')
  } catch (e) {
    console.error(e);
    process.exitCode = 1
  } finally { await mongoose.disconnect() }
} run();
