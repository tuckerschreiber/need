import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { getEmbedding } from './lib/embeddings.js';
import { createDb } from './lib/db.js';
import { rateLimit } from './lib/rate-limit.js';

type Bindings = {
  DATABASE_URL: string;
  OPENAI_API_KEY: string;
};

function safeErrorMessage(err: unknown): string {
  if (err instanceof Error) {
    console.error(err);
  }
  return 'Internal server error';
}

const app = new Hono<{ Bindings: Bindings }>();

app.use('*', cors());

// Security headers
app.use('*', async (c, next) => {
  await next();
  c.res.headers.set('X-Content-Type-Options', 'nosniff');
  c.res.headers.set('X-Frame-Options', 'DENY');
  c.res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  c.res.headers.set(
    'Strict-Transport-Security',
    'max-age=63072000; includeSubDomains; preload'
  );
});

// Rate limits: /search hits OpenAI (costs money), so keep it tight
app.use('/search', rateLimit({ max: 30, windowMs: 60_000 }));
app.use('/signal', rateLimit({ max: 20, windowMs: 60_000 }));

app.get('/', (c) => c.json({ name: 'need-api', version: '0.1.0' }));

app.get('/search', async (c) => {
  const query = c.req.query('q')?.slice(0, 500);
  if (!query) return c.json({ error: 'Missing query parameter: q' }, 400);

  const limit = Math.min(Math.max(parseInt(c.req.query('limit') ?? '10', 10) || 10, 1), 50);

  try {
    const db = createDb(c.env.DATABASE_URL);

    // Check for exact name match first
    const exactMatch = await db.getToolByName(query.toLowerCase());

    // If exact match, return just that tool (single-word queries are likely exact lookups)
    if (exactMatch && !query.includes(' ')) {
      db.logQuery(query, 1).catch(() => {});
      return c.json({ results: [exactMatch], query });
    }

    const embedding = await getEmbedding(query, { apiKey: c.env.OPENAI_API_KEY });
    const results = await db.searchTools(embedding, limit);

    // If there's an exact match, put it first and deduplicate
    let finalResults = results;
    if (exactMatch) {
      finalResults = [
        exactMatch,
        ...results.filter((r) => r.name !== exactMatch.name),
      ].slice(0, limit);
    }

    db.logQuery(query, finalResults.length).catch(() => {});

    return c.json({ results: finalResults, query });
  } catch (err) {
    return c.json({ error: safeErrorMessage(err) }, 500);
  }
});

app.post('/signal', async (c) => {
  const body = await c.req.json<{
    tool_id: number;
    query_text?: string;
    success: boolean;
    agent_type?: string;
    command_ran?: string;
    context?: string;
  }>();

  if (typeof body.tool_id !== 'number' || typeof body.success !== 'boolean') {
    return c.json({ error: 'Required: tool_id (number), success (boolean)' }, 400);
  }

  try {
    const db = createDb(c.env.DATABASE_URL);
    await db.insertSignal(
      body.tool_id,
      body.success,
      body.query_text?.slice(0, 500),
      body.agent_type?.slice(0, 50),
      body.command_ran?.slice(0, 500),
      body.context?.slice(0, 1000),
    );
    return c.json({ ok: true });
  } catch (err) {
    return c.json({ error: safeErrorMessage(err) }, 500);
  }
});

app.get('/categories', async (c) => {
  try {
    const db = createDb(c.env.DATABASE_URL);
    const categories = await db.getCategories();
    return c.json({ categories });
  } catch (err) {
    return c.json({ error: safeErrorMessage(err) }, 500);
  }
});

app.get('/tools', async (c) => {
  const category = c.req.query('category')?.slice(0, 100);
  const limit = Math.min(Math.max(parseInt(c.req.query('limit') ?? '50', 10) || 50, 1), 100);
  const offset = Math.max(parseInt(c.req.query('offset') ?? '0', 10) || 0, 0);

  try {
    const db = createDb(c.env.DATABASE_URL);
    const { tools, total } = await db.listTools({ category: category || undefined, limit, offset });
    return c.json({ tools, total, limit, offset });
  } catch (err) {
    return c.json({ error: safeErrorMessage(err) }, 500);
  }
});

app.get('/tools/:name', async (c) => {
  const name = c.req.param('name');
  try {
    const db = createDb(c.env.DATABASE_URL);
    const tool = await db.getToolByName(name);
    if (!tool) return c.json({ error: 'Tool not found' }, 404);
    return c.json(tool);
  } catch (err) {
    return c.json({ error: safeErrorMessage(err) }, 500);
  }
});

export default app;
