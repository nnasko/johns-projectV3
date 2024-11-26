import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';
import { run, getDb } from './index.js';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, 'database.sqlite');

async function seedDatabase() {
  try {
    // Remove existing database if it exists
    if (fs.existsSync(dbPath)) {
      fs.unlinkSync(dbPath);
    }

    const db = await getDb();

    // Create tables
    await db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        name TEXT NOT NULL,
        role TEXT DEFAULT 'user',
        avatar TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await db.exec(`
      CREATE TABLE IF NOT EXISTS events (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        date DATETIME NOT NULL,
        location TEXT NOT NULL,
        image TEXT NOT NULL,
        price REAL NOT NULL,
        capacity INTEGER NOT NULL,
        category TEXT NOT NULL,
        host_id TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (host_id) REFERENCES users (id)
      )
    `);

    await db.exec(`
      CREATE TABLE IF NOT EXISTS event_registrations (
        event_id TEXT NOT NULL,
        user_id TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (event_id, user_id),
        FOREIGN KEY (event_id) REFERENCES events (id),
        FOREIGN KEY (user_id) REFERENCES users (id)
      )
    `);

    // Create default users
    const password = await bcrypt.hash('password123', 10);
    const users = [
      {
        id: uuidv4(),
        email: 'admin@example.com',
        password,
        name: 'Admin User',
        role: 'admin',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop'
      },
      {
        id: uuidv4(),
        email: 'host@example.com',
        password,
        name: 'Event Host',
        role: 'host',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop'
      },
      {
        id: uuidv4(),
        email: 'user@example.com',
        password,
        name: 'Regular User',
        role: 'user',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop'
      }
    ];

    for (const user of users) {
      await run(
        'INSERT INTO users (id, email, password, name, role, avatar) VALUES (?, ?, ?, ?, ?, ?)',
        [user.id, user.email, user.password, user.name, user.role, user.avatar]
      );
    }

    // Create sample events
    const events = [
      {
        id: uuidv4(),
        title: 'Tech Conference 2024',
        description: 'Join us for the biggest tech conference of the year! Learn about the latest technologies, network with industry leaders, and participate in hands-on workshops.',
        date: '2024-06-15T09:00:00.000Z',
        location: 'San Francisco Convention Center',
        image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop',
        price: 299.99,
        capacity: 500,
        category: 'Conference',
        host_id: users[1].id // host user
      },
      {
        id: uuidv4(),
        title: 'Music Festival',
        description: 'Experience an unforgettable weekend of live music performances from top artists across multiple genres. Food, drinks, and amazing atmosphere included!',
        date: '2024-07-20T16:00:00.000Z',
        location: 'Central Park',
        image: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800&h=600&fit=crop',
        price: 149.99,
        capacity: 1000,
        category: 'Concert',
        host_id: users[1].id
      },
      {
        id: uuidv4(),
        title: 'Startup Workshop',
        description: 'Learn essential skills for launching and growing your startup. Topics include fundraising, marketing, and product development.',
        date: '2024-05-10T13:00:00.000Z',
        location: 'Innovation Hub',
        image: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800&h=600&fit=crop',
        price: 99.99,
        capacity: 50,
        category: 'Workshop',
        host_id: users[1].id
      }
    ];

    for (const event of events) {
      await run(
        'INSERT INTO events (id, title, description, date, location, image, price, capacity, category, host_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [event.id, event.title, event.description, event.date, event.location, event.image, event.price, event.capacity, event.category, event.host_id]
      );
    }

    // Add some registrations
    await run(
      'INSERT INTO event_registrations (event_id, user_id) VALUES (?, ?)',
      [events[0].id, users[2].id]
    );

    console.log('Database seeded successfully!');
    console.log('\nDefault accounts:');
    console.log('Admin - admin@example.com / password123');
    console.log('Host  - host@example.com / password123');
    console.log('User  - user@example.com / password123');

    await db.close();
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();