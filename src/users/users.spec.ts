import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../app.module';

describe('Users & Posts API - Performance (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /api/users (performance)', () => {
    it('should return all users with posts in less than 200ms', async () => {
      const startTime = Date.now();

      const response = await request(app.getHttpServer())
        .get('/api/users');

      const endTime = Date.now();
      const duration = endTime - startTime;

      // BUG: Currently takes 5000+ms, should be < 200ms
      expect(duration).toBeLessThan(200);
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(100);
    });

    it('should load all users with their posts', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/users');

      expect(response.status).toBe(200);
      expect(response.body[0]).toHaveProperty('posts');
      expect(Array.isArray(response.body[0].posts)).toBe(true);
    });
  });
});
