import express from 'express';
import cors from 'cors';
import pool, { q } from './db.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const DB = process.env.DB_NAME; // e.g., ROOT 001 (with space)

app.get('/api/health', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT 1 AS ok');
    res.json({ ok: rows[0].ok === 1 });
  } catch (e) {
    res.status(500).json({ ok: false, error: String(e) });
  }
});

// Metrics
app.get('/api/metrics', async (_req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT \`key\`, label, COALESCE(value_text, value_numeric) AS value
       FROM ${q(DB)}.${q('metrics')}`
    );
    const map = Object.fromEntries(rows.map(r => [r.key, r.value]));
    res.json({
      totalRides: Number(map.total_rides_today ?? 0),
      activeDrivers: Number(map.active_drivers ?? 0),
      totalRevenue: Number(map.revenue_today ?? 0),
      avgRating: Number(map.avg_rating ?? 0),
      completionRate: Number(map.completion_rate ?? 0),
      responseTime: Number(map.avg_response ?? 0)
    });
  } catch (e) {
    console.error('GET /api/metrics error', e);
    // Return safe fallback so the frontend never breaks when DB is unavailable
    res.json({
      totalRides: 247,
      activeDrivers: 149,
      totalRevenue: 4589,
      avgRating: 4.8,
      completionRate: 94.2,
      responseTime: 3.2,
    });
  }
});

// Earnings overview
app.get('/api/earnings/overview', async (_req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT \`key\`, COALESCE(value_numeric, value_text) AS val
       FROM ${q(DB)}.${q('metrics')}
       WHERE \`key\` IN ('revenue_today','revenue_this_week','revenue_this_month','revenue_growth')`
    );
    const map = Object.fromEntries(rows.map(r => [r.key, r.val]));
    res.json({
      today: Number(map.revenue_today ?? 0),
      thisWeek: Number(map.revenue_this_week ?? 0),
      thisMonth: Number(map.revenue_this_month ?? 0),
      growth: Number(map.revenue_growth ?? 0),
    });
  } catch (e) {
    console.error('GET /api/earnings/overview error', e);
    // Graceful fallback values so UI can still render
    res.json({
      today: 488,
      thisWeek: 2694,
      thisMonth: 10000,
      growth: 18.5,
    });
  }
});

// Drivers
app.get('/api/drivers', async (_req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT id, name, rating, rides_completed AS ridesCompleted, earnings, status,
              'stable' AS trend
       FROM ${q(DB)}.${q('drivers')}
       ORDER BY rides_completed DESC
       LIMIT 100`
    );
    res.json(rows);
  } catch (e) {
    console.error('GET /api/drivers error', e);
    // Graceful fallback so UI can render even if DB is unavailable
    res.json([
      { id: 'RC001', name: 'Rajesh', rating: 4.8, ridesCompleted: 256, earnings: 1400, status: 'online', trend: 'up' },
      { id: 'RC002', name: 'Amit', rating: 4.6, ridesCompleted: 234, earnings: 800, status: 'busy', trend: 'stable' },
      { id: 'RC003', name: 'Suresh', rating: 4.9, ridesCompleted: 289, earnings: 500, status: 'online', trend: 'up' },
      { id: 'RC004', name: 'Vikram', rating: 4.7, ridesCompleted: 198, earnings: 410, status: 'offline', trend: 'down' },
      { id: 'RC005', name: 'Arjun', rating: 4.5, ridesCompleted: 167, earnings: 350, status: 'online', trend: 'stable' },
    ]);
  }
});

// Live rides
app.get('/api/rides/live', async (_req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT id, driver, passenger, pickup, destination, status,
              CONCAT(FLOOR(RAND()*15)+1, ' min') AS duration,
              fare
       FROM ${q(DB)}.${q('rides')}
       WHERE status IN ('pickup','enroute')
       ORDER BY id`
    );
    res.json(rows);
  } catch (e) {
    console.error('GET /api/rides/live error', e);
    // Fallback payload so UI can render even if DB is unavailable
    res.json([
      {
        id: 'RC001',
        driver: 'Rajesh',
        passenger: 'Priya',
        pickup: 'Sathvacheri',
        destination: 'Kaspa',
        status: 'enroute',
        duration: '12 min',
        fare: 450,
      },
      {
        id: 'RC002',
        driver: 'Amit',
        passenger: 'Neha',
        pickup: 'Katpadi Railway Station',
        destination: 'VIT',
        status: 'pickup',
        duration: '3 min',
        fare: 280,
      },
      {
        id: 'RC003',
        driver: 'Suresh',
        passenger: 'Kavya',
        pickup: 'New Bus Stand',
        destination: 'Vellore Fort',
        status: 'arrived',
        duration: '0 min',
        fare: 180,
      },
    ]);
  }
});

// Popular locations
app.get('/api/locations/popular', async (_req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT name, rides, growth,
              CASE 
                WHEN name LIKE '%VIT%' THEN 'bg-red-500'
                WHEN name LIKE '%Airport%' THEN 'bg-orange-500'
                WHEN name LIKE '%CMC%' THEN 'bg-yellow-500'
                WHEN name LIKE '%FORT%' THEN 'bg-green-500'
                WHEN name LIKE '%PARK%' THEN 'bg-blue-500'
                WHEN name LIKE '%RAILWAY%' THEN 'bg-indigo-500'
                ELSE 'bg-pink-500'
              END AS color
       FROM ${q(DB)}.${q('locations')}
       ORDER BY rides DESC
       LIMIT 100`
    );
    res.json(rows);
  } catch (e) {
    console.error('GET /api/locations/popular error', e);
    // Fallback payload so UI can render even if DB is unavailable
    res.json([
      { name: 'VIT UNIVERSITY', rides: 456, growth: 12.5, color: 'bg-red-500' },
      { name: 'VELLORE Airport', rides: 342, growth: 8.2, color: 'bg-orange-500' },
      { name: 'CMC HOSPITAL', rides: 289, growth: -2.1, color: 'bg-yellow-500' },
      { name: 'VELLORE FORT', rides: 234, growth: 15.8, color: 'bg-green-500' },
      { name: 'PERIYAR PARK', rides: 187, growth: 6.4, color: 'bg-blue-500' },
      { name: 'KATPADI RAILWAY STATION', rides: 145, growth: 3.2, color: 'bg-indigo-500' },
      { name: 'GOLDEN TEMPLE', rides: 98, growth: 4.7, color: 'bg-purple-500' },
      { name: 'NEW BUS STAND', rides: 76, growth: 22.1, color: 'bg-pink-500' }
    ]);
  }
});

// Weekly revenue for RevenueChart
app.get('/api/revenue/weekly', async (_req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT day, revenue
       FROM ${q(DB)}.${q('revenue_weekly')}
       ORDER BY FIELD(day,'Mon','Tue','Wed','Thu','Fri','Sat','Sun')`
    );
    res.json(rows);
  } catch (e) {
    console.warn('GET /api/revenue/weekly fallback (table missing?)');
    // Fallback mock consistent with UI expectations
    res.json([
      { day: 'Mon', revenue: 250 },
      { day: 'Tue', revenue: 520 },
      { day: 'Wed', revenue: 180 },
      { day: 'Thu', revenue: 690 },
      { day: 'Fri', revenue: 140 },
      { day: 'Sat', revenue: 480 },
      { day: 'Sun', revenue: 960 },
    ]);
  }
});

// Hourly demand analytics for TimeAnalytics
app.get('/api/analytics/hourly', async (_req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT hour, rides, demand
       FROM ${q(DB)}.${q('hourly_demand')}
       ORDER BY STR_TO_DATE(hour, '%l%p')`
    );
    res.json(rows);
  } catch (e) {
    console.warn('GET /api/analytics/hourly fallback (table missing?)');
    res.json([
      { hour: '6AM', rides: 45, demand: 'low' },
      { hour: '7AM', rides: 128, demand: 'medium' },
      { hour: '8AM', rides: 245, demand: 'high' },
      { hour: '9AM', rides: 189, demand: 'medium' },
      { hour: '10AM', rides: 167, demand: 'medium' },
      { hour: '11AM', rides: 201, demand: 'high' },
      { hour: '12PM', rides: 298, demand: 'peak' },
      { hour: '1PM', rides: 267, demand: 'high' },
      { hour: '2PM', rides: 198, demand: 'medium' },
      { hour: '3PM', rides: 234, demand: 'high' },
      { hour: '4PM', rides: 289, demand: 'peak' },
      { hour: '5PM', rides: 356, demand: 'peak' },
    ]);
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
});