import { Module } from '@nestjs/common';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as userSchema from '../users/entities/user.entity';
import * as postSchema from '../posts/entities/post.entity';

const schema = { ...userSchema, ...postSchema };

export const DrizzleProvider = {
  provide: 'DRIZZLE_DB',
  useFactory: () => {
    const pool = new Pool({
      host: process.env.DATABASE_HOST || 'localhost',
      port: parseInt(process.env.DATABASE_PORT) || 5432,
      user: process.env.DATABASE_USER || 'postgres',
      password: process.env.DATABASE_PASSWORD || 'postgres',
      database: process.env.DATABASE_NAME || 'users_posts_db',
    });
    return drizzle(pool, { schema, logger: true });
  },
};

@Module({
  providers: [DrizzleProvider],
  exports: [DrizzleProvider],
})
export class DatabaseModule { }
