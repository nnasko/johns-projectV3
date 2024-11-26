import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { query, get, run } from './db/index.js';

dotenv.config();

const app = express();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

app.use(cors());
app.use(express.json());

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ error: 'Access denied' });

  try {
    const verified = jwt.verify(token, JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).json({ error: 'Invalid token' });
  }
};

// Auth routes
app.post('/api/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Check if user already exists
    const existingUser = await get('SELECT id FROM users WHERE email = ?', [email]);
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const id = uuidv4();
    
    await run(
      'INSERT INTO users (id, email, password, name) VALUES (?, ?, ?, ?)',
      [id, email, hashedPassword, name]
    );

    const user = await get('SELECT id, email, name, role FROM users WHERE id = ?', [id]);
    const token = jwt.sign({ id: user.id }, JWT_SECRET);
    
    res.json({ token, user });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Failed to create account' });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await get('SELECT * FROM users WHERE email = ?', [email]);
    
    if (!user) {
      return res.status(400).json({ error: 'User not found' });
    }
    
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ error: 'Invalid password' });
    }
    
    const token = jwt.sign({ id: user.id }, JWT_SECRET);
    const { password: _, ...userWithoutPassword } = user;
    
    res.json({ token, user: userWithoutPassword });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Failed to login' });
  }
});

// Events routes
app.get('/api/events', async (req, res) => {
  try {
    const events = await query(`
      SELECT e.*, u.name as host_name, u.avatar as host_avatar,
      (SELECT COUNT(*) FROM event_registrations WHERE event_id = e.id) as registered_count
      FROM events e
      JOIN users u ON e.host_id = u.id
    `);
    
    res.json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});

app.post('/api/events', authenticateToken, async (req, res) => {
  try {
    const { title, description, date, location, image, price, capacity, category } = req.body;
    const id = uuidv4();
    
    await run(`
      INSERT INTO events (id, title, description, date, location, image, price, capacity, category, host_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [id, title, description, date, location, image, price, capacity, category, req.user.id]);
    
    const event = await get(`
      SELECT e.*, u.name as host_name, u.avatar as host_avatar
      FROM events e
      JOIN users u ON e.host_id = u.id
      WHERE e.id = ?
    `, [id]);
    
    res.json(event);
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({ error: 'Failed to create event' });
  }
});

app.post('/api/events/:id/register', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    await run(
      'INSERT INTO event_registrations (event_id, user_id) VALUES (?, ?)',
      [id, req.user.id]
    );
    
    const event = await get(`
      SELECT e.*, u.name as host_name, u.avatar as host_avatar,
      (SELECT COUNT(*) FROM event_registrations WHERE event_id = e.id) as registered_count
      FROM events e
      JOIN users u ON e.host_id = u.id
      WHERE e.id = ?
    `, [id]);
    
    res.json(event);
  } catch (error) {
    console.error('Error registering for event:', error);
    res.status(500).json({ error: 'Failed to register for event' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));