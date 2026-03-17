import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock the api-client module before importing report
vi.mock('../src/lib/api-client.js', () => {
  const mockClient = {
    search: vi.fn(),
    reportSignal: vi.fn(),
  };
  return {
    NeedApiClient: vi.fn(() => mockClient),
    __mockClient: mockClient,
  };
});

import { reportCommand } from '../src/commands/report.js';
import { NeedApiClient } from '../src/lib/api-client.js';

function getMockClient() {
  return new NeedApiClient() as unknown as {
    search: ReturnType<typeof vi.fn>;
    reportSignal: ReturnType<typeof vi.fn>;
  };
}

const baseTool = {
  description: 'A tool',
  install_command: 'brew install tool',
  package_manager: 'brew',
  platform: ['macos'],
  category: null,
  source_url: null,
  similarity: 0.9,
  success_rate: 0.8,
  use_count: 100,
};

describe('reportCommand', () => {
  let mockClient: ReturnType<typeof getMockClient>;
  let exitSpy: ReturnType<typeof vi.spyOn>;
  let errorSpy: ReturnType<typeof vi.spyOn>;
  let logSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    vi.clearAllMocks();
    mockClient = getMockClient();
    mockClient.reportSignal.mockResolvedValue(undefined);
    exitSpy = vi.spyOn(process, 'exit').mockImplementation(() => {
      throw new Error('process.exit');
    });
    errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
  });

  it('reports success for an exact name match', async () => {
    mockClient.search.mockResolvedValue({
      results: [
        { ...baseTool, id: 5, name: 'jq' },
        { ...baseTool, id: 9, name: 'jql' },
      ],
      query: 'jq',
    });

    await reportCommand('jq', { success: true });

    expect(mockClient.reportSignal).toHaveBeenCalledWith(5, true, 'jq');
    expect(logSpy).toHaveBeenCalledWith(
      expect.stringContaining('Reported success for "jq"'),
    );
  });

  it('falls back to first result when no exact match', async () => {
    mockClient.search.mockResolvedValue({
      results: [
        { ...baseTool, id: 10, name: 'ImageMagick' },
        { ...baseTool, id: 11, name: 'graphicsmagick' },
      ],
      query: 'magick',
    });

    await reportCommand('magick', { fail: true });

    expect(mockClient.reportSignal).toHaveBeenCalledWith(10, false, 'magick');
    expect(logSpy).toHaveBeenCalledWith(
      expect.stringContaining('Reported failure for "ImageMagick"'),
    );
  });

  it('finds exact match case-insensitively', async () => {
    mockClient.search.mockResolvedValue({
      results: [
        { ...baseTool, id: 3, name: 'FFmpeg' },
      ],
      query: 'ffmpeg',
    });

    await reportCommand('ffmpeg', { success: true });

    expect(mockClient.reportSignal).toHaveBeenCalledWith(3, true, 'ffmpeg');
    expect(logSpy).toHaveBeenCalledWith(
      expect.stringContaining('Reported success for "FFmpeg"'),
    );
  });

  it('errors when no results found', async () => {
    mockClient.search.mockResolvedValue({ results: [], query: 'nonexistent' });

    await expect(
      reportCommand('nonexistent', { success: true }),
    ).rejects.toThrow('process.exit');

    expect(errorSpy).toHaveBeenCalledWith(
      expect.stringContaining('No tool found matching "nonexistent"'),
    );
    expect(exitSpy).toHaveBeenCalledWith(1);
  });

  it('errors when neither --success nor --fail provided', async () => {
    await expect(reportCommand('jq', {})).rejects.toThrow('process.exit');

    expect(errorSpy).toHaveBeenCalledWith(
      expect.stringContaining('Please specify --success or --fail'),
    );
    expect(exitSpy).toHaveBeenCalledWith(1);
    expect(mockClient.search).not.toHaveBeenCalled();
  });
});
