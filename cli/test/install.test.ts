import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock api-client
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

// Mock child_process
vi.mock('node:child_process', () => ({
  execSync: vi.fn(),
}));

// Mock node:readline
vi.mock('node:readline', () => ({
  createInterface: vi.fn(),
}));

import { installCommand } from '../src/commands/install.js';
import { NeedApiClient } from '../src/lib/api-client.js';
import { execSync } from 'node:child_process';
import { createInterface } from 'node:readline';

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

function mockReadlineAnswer(answer: string) {
  const mockRl = {
    question: vi.fn((_prompt: string, cb: (answer: string) => void) => {
      cb(answer);
    }),
    close: vi.fn(),
  };
  vi.mocked(createInterface).mockReturnValue(mockRl as any);
  return mockRl;
}

describe('installCommand', () => {
  let mockClient: ReturnType<typeof getMockClient>;
  let logSpy: ReturnType<typeof vi.spyOn>;
  let errorSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    vi.clearAllMocks();
    mockClient = getMockClient();
    mockClient.reportSignal.mockResolvedValue(undefined);
    logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('installs selected tool and reports success', async () => {
    mockClient.search.mockResolvedValue({
      results: [
        { ...baseTool, id: 1, name: 'pngquant', install_command: 'brew install pngquant' },
        { ...baseTool, id: 2, name: 'optipng', install_command: 'brew install optipng' },
      ],
      query: 'compress png',
    });
    mockReadlineAnswer('1');
    vi.mocked(execSync).mockReturnValue(Buffer.from(''));

    await installCommand('compress png');

    expect(execSync).toHaveBeenCalledWith('brew install pngquant', { stdio: 'inherit' });
    expect(mockClient.reportSignal).toHaveBeenCalledWith(1, true, 'compress png');
  });

  it('exits gracefully when user types n', async () => {
    mockClient.search.mockResolvedValue({
      results: [
        { ...baseTool, id: 1, name: 'pngquant', install_command: 'brew install pngquant' },
      ],
      query: 'compress png',
    });
    mockReadlineAnswer('n');

    await installCommand('compress png');

    expect(execSync).not.toHaveBeenCalled();
    expect(mockClient.reportSignal).not.toHaveBeenCalled();
  });

  it('exits gracefully when user presses enter (empty input)', async () => {
    mockClient.search.mockResolvedValue({
      results: [
        { ...baseTool, id: 1, name: 'pngquant', install_command: 'brew install pngquant' },
      ],
      query: 'compress png',
    });
    mockReadlineAnswer('');

    await installCommand('compress png');

    expect(execSync).not.toHaveBeenCalled();
    expect(mockClient.reportSignal).not.toHaveBeenCalled();
  });

  it('prints message and exits when no results found', async () => {
    mockClient.search.mockResolvedValue({
      results: [],
      query: 'nonexistent',
    });

    await installCommand('nonexistent');

    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('No tools found'));
    expect(execSync).not.toHaveBeenCalled();
    expect(mockClient.reportSignal).not.toHaveBeenCalled();
  });

  it('reports failure when execSync throws', async () => {
    mockClient.search.mockResolvedValue({
      results: [
        { ...baseTool, id: 3, name: 'badtool', install_command: 'brew install badtool' },
      ],
      query: 'bad tool',
    });
    mockReadlineAnswer('1');
    vi.mocked(execSync).mockImplementation(() => {
      throw new Error('command failed');
    });

    await installCommand('bad tool');

    expect(execSync).toHaveBeenCalledWith('brew install badtool', { stdio: 'inherit' });
    expect(mockClient.reportSignal).toHaveBeenCalledWith(3, false, 'bad tool');
    expect(errorSpy).toHaveBeenCalledWith(expect.stringContaining('Failed to install badtool'));
  });
});
