import { describe, it, expect } from 'vitest';
import { formatResults } from '../src/lib/formatter.js';

describe('formatResults', () => {
  it('formats search results as a readable table', () => {
    const results = [
      {
        id: 1,
        name: 'imagemagick',
        description: 'Convert images',
        install_command: 'brew install imagemagick',
        package_manager: 'brew',
        platform: ['macos'],
        category: 'image',
        source_url: null,
        similarity: 0.94,
        success_rate: 0.94,
        use_count: 4100,
      },
    ];

    const output = formatResults(results);
    expect(output).toContain('imagemagick');
    expect(output).toContain('brew install imagemagick');
    expect(output).toContain('94%');
  });

  it('shows a message when no results found', () => {
    const output = formatResults([]);
    expect(output).toContain('No tools found');
  });
});
