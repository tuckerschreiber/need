import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { getEmbedding } from './lib/embeddings.js';
import { createDb } from './lib/db.js';

type Bindings = {
  DATABASE_URL: string;
  OPENAI_API_KEY: string;
};

const app = new Hono<{ Bindings: Bindings }>();

app.use('*', cors());

app.get('/', (c) => c.json({ name: 'need-api', version: '0.1.0' }));

app.get('/search', async (c) => {
  const query = c.req.query('q');
  if (!query) return c.json({ error: 'Missing query parameter: q' }, 400);

  const limit = parseInt(c.req.query('limit') ?? '10', 10);

  try {
    const db = createDb(c.env.DATABASE_URL);
    const embedding = await getEmbedding(query, { apiKey: c.env.OPENAI_API_KEY });
    const results = await db.searchTools(embedding, limit);

    db.logQuery(query, results.length).catch(() => {});

    return c.json({ results, query });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return c.json({ error: message }, 500);
  }
});

app.post('/signal', async (c) => {
  const body = await c.req.json<{
    tool_id: number;
    query_text?: string;
    success: boolean;
    agent_type?: string;
  }>();

  if (typeof body.tool_id !== 'number' || typeof body.success !== 'boolean') {
    return c.json({ error: 'Required: tool_id (number), success (boolean)' }, 400);
  }

  try {
    const db = createDb(c.env.DATABASE_URL);
    await db.insertSignal(body.tool_id, body.success, body.query_text, body.agent_type);
    return c.json({ ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return c.json({ error: message }, 500);
  }
});

export default app;
