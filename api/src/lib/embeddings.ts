interface EmbeddingOptions {
  apiKey: string;
  fetch?: typeof globalThis.fetch;
  model?: string;
}

export async function getEmbedding(
  text: string,
  options: EmbeddingOptions
): Promise<number[]> {
  const { apiKey, model = 'text-embedding-3-small' } = options;
  const fetchFn = options.fetch ?? globalThis.fetch;

  const response = await fetchFn('https://api.openai.com/v1/embeddings', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      input: text,
      model,
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Embedding API error (${response.status}): ${body}`);
  }

  const data = await response.json() as {
    data: Array<{ embedding: number[] }>;
  };
  return data.data[0].embedding;
}
