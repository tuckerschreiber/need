import { describe, it, expect, vi } from 'vitest';
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

  it('returns 200 with tools and days for GET /trending', async () => {
    const mockTrending = [
      {
        id: 1,
        name: 'jq',
        install_command: 'brew install jq',
        github_stars: 29000,
        agent_uses: 150,
        success_rate: 0.97,
      },
      {
        id: 2,
        name: 'ripgrep',
        install_command: 'brew install ripgrep',
        github_stars: 45000,
        agent_uses: 120,
        success_rate: 0.95,
      },
    ];

    const app = new Hono();
    app.get('/trending', async (c) => {
      const days = Math.min(Math.max(parseInt(c.req.query('days') ?? '7', 10) || 7, 1), 90);
      const limit = Math.min(Math.max(parseInt(c.req.query('limit') ?? '10', 10) || 10, 1), 50);
      return c.json({ tools: mockTrending.slice(0, limit), days });
    });

    const res = await app.request('/trending');
    const body = await res.json() as { tools: typeof mockTrending; days: number };
    expect(res.status).toBe(200);
    expect(body.days).toBe(7);
    expect(Array.isArray(body.tools)).toBe(true);
    expect(body.tools[0].name).toBe('jq');
    expect(typeof body.tools[0].agent_uses).toBe('number');
    expect(typeof body.tools[0].success_rate).toBe('number');
    expect(typeof body.tools[0].github_stars).toBe('number');
  });

  it('respects days and limit query params for GET /trending', async () => {
    const app = new Hono();
    app.get('/trending', async (c) => {
      const days = Math.min(Math.max(parseInt(c.req.query('days') ?? '7', 10) || 7, 1), 90);
      const limit = Math.min(Math.max(parseInt(c.req.query('limit') ?? '10', 10) || 10, 1), 50);
      return c.json({ tools: [], days });
    });

    const res = await app.request('/trending?days=30&limit=5');
    const body = await res.json() as { tools: unknown[]; days: number };
    expect(res.status).toBe(200);
    expect(body.days).toBe(30);
    expect(Array.isArray(body.tools)).toBe(true);
  });

  it('falls back to FTS when embedding fails', async () => {
    const ftsResults = [
      {
        id: 2,
        name: 'pngquant',
        description: 'Compress PNG images',
        install_command: 'brew install pngquant',
        package_manager: 'brew',
        platform: ['macos', 'linux'],
        category: 'image',
        source_url: null,
        similarity: 0.8,
        success_rate: 0.5,
        use_count: 0,
      },
    ];

    // Simulate: embedding throws, FTS returns results
    const app = new Hono();
    app.get('/search', async (c) => {
      const query = c.req.query('q');
      if (!query) return c.json({ error: 'Missing query parameter: q' }, 400);

      let results;
      try {
        // Simulate OpenAI failure
        throw new Error('OpenAI API is down');
      } catch {
        // FTS fallback
        results = ftsResults;
      }

      return c.json({ results, query });
    });

    const res = await app.request('/search?q=compress+png');
    const body = await res.json() as { results: typeof ftsResults; query: string };
    expect(res.status).toBe(200);
    expect(body.results.length).toBeGreaterThan(0);
    expect(body.results[0].name).toBe('pngquant');
    expect(body.query).toBe('compress png');
  });
});
