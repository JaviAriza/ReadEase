import request from 'supertest';
import app from '../app.js';

describe('Carts API', () => {
  let createdCartId;

  beforeAll(async () => {
    const newCart = { userId: 1 };
    const res = await request(app).post('/api/carts').send(newCart);
    expect([200, 201]).toContain(res.statusCode);

    createdCartId = res.body.id || null;
    if (!createdCartId) {
      const listRes = await request(app).get('/api/carts');
      createdCartId = listRes.body[0]?.id;
    }
    expect(createdCartId).toBeDefined();
  });

  it('GET /api/carts - should return an array of carts', async () => {
    const res = await request(app).get('/api/carts');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('GET /api/carts/:id - should get a cart by ID', async () => {
    const res = await request(app).get(`/api/carts/${createdCartId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('id', createdCartId);
  });

  it('PUT /api/carts/:id - should update a cart by ID', async () => {
    const updates = { userId: 2 };
    const res = await request(app).put(`/api/carts/${createdCartId}`).send(updates);
    expect(res.statusCode).toBe(200);

    const getRes = await request(app).get(`/api/carts/${createdCartId}`);
    expect(getRes.body.user_id).toBe(updates.userId);
  });

  it('DELETE /api/carts/:id - should delete a cart by ID', async () => {
    const res = await request(app).delete(`/api/carts/${createdCartId}`);
    expect([200, 204]).toContain(res.statusCode);
  });
});
