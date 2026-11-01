import { expect, test } from '@playwright/test';

test.describe('ProtoCommerce HTTP smoke tests', () => {
  test('login route serves the login form', async ({ request }) => {
    const response = await request.get('/loginpagePractise/');
    const body = await response.text();

    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('text/html');
    expect(body).toContain('<title>LoginPage Practise | Rahul Shetty Academy</title>');
    expect(body).toContain('id="login-form"');
    expect(body).toContain('id="username"');
    expect(body).toContain('id="password"');
    expect(body).toContain('id="signInBtn"');
  });

  test('shop route serves the ProtoCommerce application shell', async ({ request }) => {
    const response = await request.get('/angularpractice/shop');
    const body = await response.text();

    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('text/html');
    expect(body).toContain('<title>ProtoCommerce</title>');
    expect(body).toContain('<base href="/angularpractice/">');
    expect(body).toContain('<app-root></app-root>');
    expect(body).toContain('main.');
  });

  test('home route serves the ProtoCommerce application shell', async ({ request }) => {
    const response = await request.get('/angularpractice/');
    const body = await response.text();

    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('text/html');
    expect(body).toContain('<title>ProtoCommerce</title>');
    expect(body).toContain('<base href="/angularpractice/">');
    expect(body).toContain('<app-root></app-root>');
  });
});
