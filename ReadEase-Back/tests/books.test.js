import request from 'supertest';
import app from '../app.js';

describe('Books API', () => {
  let createdBookId;

  beforeAll(async () => {
    const newBook = { title: 'Book for tests', author: 'Test Author' };
    const res = await request(app).post('/api/books').send(newBook);
    expect([200, 201]).toContain(res.statusCode);

    createdBookId = res.body.id || null;
    if (!createdBookId) {
      const listRes = await request(app).get('/api/books');
      createdBookId = listRes.body[0]?.id;
    }
    expect(createdBookId).toBeDefined();
  });

  it('GET /api/books - should return an array of books', async () => {
    const res = await request(app).get('/api/books');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('GET /api/books/:id - should get a book by ID', async () => {
    const res = await request(app).get(`/api/books/${createdBookId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('id', createdBookId);
  });

  it('PUT /api/books/:id - should update a book by ID', async () => {
    const updates = { title: 'Updated Test Book' };
    const res = await request(app).put(`/api/books/${createdBookId}`).send(updates);
    expect(res.statusCode).toBe(200);

    // Verificar con GET que el título se actualizó
    const getRes = await request(app).get(`/api/books/${createdBookId}`);
    expect(getRes.body.title).toBe(updates.title);
  });

  it('DELETE /api/books/:id - should delete a book by ID', async () => {
    const res = await request(app).delete(`/api/books/${createdBookId}`);
    expect([200, 204]).toContain(res.statusCode);
  });
});
