import request from 'supertest';
import app from '../app.js';

describe('Login API', () => {
  beforeAll(async () => {
    await request(app).post('/api/users').send({
      name: 'Test User',
      email: 'testuser@mail.com',
      password: '123456',
    });
  });

  it('POST /api/users/login - should fail with invalid credentials', async () => {
    const res = await request(app)
      .post('/api/users/login')
      .send({ email: 'fake@mail.com', password: 'wrong' });
    expect([400, 401, 404]).toContain(res.statusCode);
  });

  it('POST /api/users/login - should authenticate with valid credentials', async () => {
    const validUser = { email: 'testuser@mail.com', password: '123456' };

    const res = await request(app)
      .post('/api/users/login')
      .send(validUser);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
  });
});
