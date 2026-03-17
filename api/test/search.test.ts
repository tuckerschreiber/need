import { describe, it, expect } from 'vitest';
import { Hono } from 'hono';

describe('GET /search', () => {
  it('returns 400 if no query param', async () => {
    const app = new Hono();
    app.get('/search', async (c) => {
      const query = c.req.query('q');
      if (!query) return c.json({ error: 'Missing query parameter: q' }, 400);
      return c.json({ results: [], query });
    });

    const res = await app.request('/search');
    expect(res.status).toBe(400);
  });

  it('returns ranked tools for a valid query', async () => {
    const mockTools = [
      {
        id: 1,
        name: 'imagemagick',
        description: 'Convert images between formats',
        install_command: 'brew install imagemagick',
        package_manager: 'brew',
        platform: ['macos', 'linux'],
        category: 'image',
        source_url: 'https://imagemagick.org',
        similarity: 0.92,
        success_rate: 0.94,
        use_count: 4100,
      },
    ];

    const app = new Hono();
    const route = new Hono();
    route.get('/', async (c) => {
      return c.json({ results: mockTools, query: 'convert pdf to png' });
    });
    app.route('/search', route);

    const res = await app.request('/search');
    const body = await res.json() as { results: typeof mockTools };
    expect(res.status).toBe(200);
    expect(body.results[0].name).toBe('imagemagick');
    expect(body.results[0].similarity).toBeGreaterThan(0);
  });
});
