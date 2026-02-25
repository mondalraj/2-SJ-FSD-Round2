import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { users } from './src/users/entities/user.entity';
import { posts } from './src/posts/entities/post.entity';

async function seed() {
  const pool = new Pool({
    host: process.env.DATABASE_HOST || 'localhost',
    port: parseInt(process.env.DATABASE_PORT) || 5432,
    user: process.env.DATABASE_USER || 'postgres',
    password: process.env.DATABASE_PASSWORD || 'postgres',
    database: process.env.DATABASE_NAME || 'users_posts_db',
  });
  const db = drizzle(pool);

  // Create 100 users
  const insertedUsers = await db.insert(users).values(
    Array.from({ length: 100 }, (_, i) => ({
      name: `User ${i + 1}`,
      email: `user${i + 1}@example.com`,
    })),
  ).returning();

  // Create 5 posts per user
  const postValues = [];
  for (const user of insertedUsers) {
    for (let i = 0; i < 5; i++) {
      postValues.push({
        title: `Post ${i + 1} by ${user.name}`,
        content: `Content for post ${i + 1}`,
        userId: user.id,
      });
    }
  }

  await db.insert(posts).values(postValues);
  console.log('Seed completed: 100 users with 5 posts each');

  await pool.end();
}

seed().catch(console.error);
