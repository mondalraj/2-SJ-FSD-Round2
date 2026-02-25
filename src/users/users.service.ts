import { Injectable, Inject } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { users } from './entities/user.entity';
import { posts } from '../posts/entities/post.entity';
import * as schema from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @Inject('DRIZZLE_DB')
    private db: NodePgDatabase<typeof schema>,
  ) {}

  // BUG: This method causes N+1 queries
  // It fetches all users first, then queries for posts of each user separately
  async findAllWithPosts() {
    const allUsers = await this.db.select().from(users);

    // This loop causes N additional queries (one per user)
    for (const user of allUsers) {
      const userPosts = await this.db.select().from(posts).where(eq(posts.userId, user.id));
      (user as any).posts = userPosts;
    }

    return allUsers;
  }

  // CORRECT approach (not implemented - candidate needs to add this)
  // async findAllWithPostsOptimized() {
  //   return this.db.query.users.findMany({
  //     with: {
  //       posts: true,
  //     },
  //   });
  // }
}
