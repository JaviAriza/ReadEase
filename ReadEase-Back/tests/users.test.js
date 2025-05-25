import request from 'supertest';
import app from '../app.js';

describe('Users API', () => {
  let createdUserId;

  beforeAll(async () => {
    const newUser = {
      name: 'Test User',
      email: `testuser${Date.now()}@mail.com`,
      password: '123456'
    };
    const res = await request(app).post('/api/users').send(newUser);
    expect([200, 201]).toContain(res.statusCode);

    createdUserId = res.body.id_user || null;
    if (!createdUserId) {
      const listRes = await request(app).get('/api/users');
      createdUserId = listRes.body[0]?.id_user;
    }
    expect(createdUserId).toBeDefined();
  });

  it('GET /api/users - should return an array of users', async () => {
    const res = await request(app).get('/api/users');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('GET /api/users/:id - should get a user by ID', async () => {
    const res = await request(app).get(`/api/users/${createdUserId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('id_user', createdUserId);
  });

  it('PUT /api/users/:id - should update a user by ID', async () => {
    const updates = { name: 'Updated Test User' };
    const res = await request(app).put(`/api/users/${createdUserId}`).send(updates);
    expect(res.statusCode).toBe(200);

    const getRes = await request(app).get(`/api/users/${createdUserId}`);
    expect(getRes.body.name).toBe(updates.name);
  });

  it('DELETE /api/users/:id - should delete a user by ID', async () => {
    const res = await request(app).delete(`/api/users/${createdUserId}`);
    expect([200, 204]).toContain(res.statusCode);
  });
});
