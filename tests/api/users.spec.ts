import { test, expect } from '@playwright/test';

test('GET /api/users/2 returns the user with an email', async ({ request }) => {
  const response = await request.get('/api/users/2');

  expect(response.status()).toBe(200);
  const body = await response.json();
  expect(body.data.email).toBeTruthy();
});

test('POST /api/users creates a user named morpheus', async ({ request }) => {
  const response = await request.post('/api/users', {
    data: { name: 'morpheus', job: 'leader' },
  });

  expect(response.status()).toBe(201);
  const body = await response.json();
  expect(body.name).toBe('morpheus');
});