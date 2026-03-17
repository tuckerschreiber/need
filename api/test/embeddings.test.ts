import { describe, it, expect, vi } from 'vitest';
import { getEmbedding } from '../src/lib/embeddings.js';

describe('getEmbedding', () => {
  it('returns a 1536-dimension vector for a query', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        data: [{ embedding: new Array(1536).fill(0.1) }],
      }),
    });

    const result = await getEmbedding('convert pdf to png', {
      apiKey: 'test-key',
      fetch: mockFetch,
    });

    expect(result).toHaveLength(1536);
    expect(mockFetch).toHaveBeenCalledWith(
      'https://api.openai.com/v1/embeddings',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          Authorization: 'Bearer test-key',
        }),
      })
    );
  });

  it('throws on API error', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 401,
      text: async () => 'Unauthorized',
    });

    await expect(
      getEmbedding('test', { apiKey: 'bad-key', fetch: mockFetch })
    ).rejects.toThrow('Embedding API error');
  });
});
