import { Controller, Get } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('api/users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  // BUG: This endpoint triggers N+1 queries
  // It fetches all users, then for each user it makes a separate query for posts
  // With 100 users: 1 query (all users) + 100 queries (one per user) = 101 queries total
  // Should use Drizzle relational queries with `with` clause instead
  @Get()
  async findAll() {
    return this.usersService.findAllWithPosts();
  }
}
