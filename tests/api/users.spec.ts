import { test, expect } from '@playwright/test';

// Scope: only the endpoints


test('GET /api/users/2 returns the user with an email', async ({ request }) => {
  const response = await request.get('/api/users/2');

  expect(response.status()).toBe(200);
  const body = await response.json(); // reading the body is async, so is awaited
  
  expect(body.data.email).toBeTruthy()
});

test('POST /api/users creates a user named morpheus', async ({ request }) => {
  const response = await request.post('/api/users', {
    data: { name: 'morpheus', job: 'leader' },
  });

  expect(response.status()).toBe(201);
  const body = await response.json();
  expect(body.name).toBe('morpheus');
});

// Bonus: a missing user must return 404
test('GET /api/users/23 returns 404 for a user that does not exist', async ({ request }) => {
  const response = await request.get('/api/users/23');

  expect(response.status()).toBe(404);
});