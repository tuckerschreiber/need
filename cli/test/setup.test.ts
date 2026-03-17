import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as fs from 'node:fs';
import * as os from 'node:os';

vi.mock('node:fs');
vi.mock('node:os');

const mockedFs = vi.mocked(fs);
const mockedOs = vi.mocked(os);

const EXPECTED_CONFIG = { command: 'npx', args: ['@needtools/need', 'serve'] };

describe('setupCommand', () => {
  let logSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
    mockedOs.homedir.mockReturnValue('/fakehome');
    logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
  });

  async function loadSetupCommand() {
    const mod = await import('../src/commands/setup.js');
    return mod.setupCommand;
  }

  describe('Claude Code config', () => {
    it('creates config when file does not exist', async () => {
      // .claude.json does not exist; .cursor dir does not exist
      mockedFs.existsSync.mockImplementation((p) => false);
      mockedFs.mkdirSync.mockImplementation(() => undefined as any);
      mockedFs.writeFileSync.mockImplementation(() => {});

      const setupCommand = await loadSetupCommand();
      await setupCommand();

      const writeCall = mockedFs.writeFileSync.mock.calls.find(
        (c) => (c[0] as string).includes('.claude.json')
      );
      expect(writeCall).toBeDefined();
      const written = JSON.parse(writeCall![1] as string);
      expect(written).toEqual({ mcpServers: { need: EXPECTED_CONFIG } });
    });

    it('merges into existing file without mcpServers key', async () => {
      mockedFs.existsSync.mockImplementation((p) => {
        const s = String(p);
        if (s.endsWith('.claude.json')) return true;
        return false;
      });
      mockedFs.readFileSync.mockImplementation((p) => {
        if (String(p).endsWith('.claude.json')) {
          return JSON.stringify({ someOtherKey: true });
        }
        return '';
      });
      mockedFs.mkdirSync.mockImplementation(() => undefined as any);
      mockedFs.writeFileSync.mockImplementation(() => {});

      const setupCommand = await loadSetupCommand();
      await setupCommand();

      const writeCall = mockedFs.writeFileSync.mock.calls.find(
        (c) => (c[0] as string).includes('.claude.json')
      );
      expect(writeCall).toBeDefined();
      const written = JSON.parse(writeCall![1] as string);
      expect(written.someOtherKey).toBe(true);
      expect(written.mcpServers.need).toEqual(EXPECTED_CONFIG);
    });

    it('skips when already configured', async () => {
      mockedFs.existsSync.mockImplementation((p) => {
        const s = String(p);
        if (s.endsWith('.claude.json')) return true;
        return false;
      });
      mockedFs.readFileSync.mockImplementation((p) => {
        if (String(p).endsWith('.claude.json')) {
          return JSON.stringify({
            mcpServers: { need: EXPECTED_CONFIG },
          });
        }
        return '';
      });
      mockedFs.writeFileSync.mockImplementation(() => {});

      const setupCommand = await loadSetupCommand();
      await setupCommand();

      // Should not write to .claude.json
      const writeCall = mockedFs.writeFileSync.mock.calls.find(
        (c) => (c[0] as string).includes('.claude.json')
      );
      expect(writeCall).toBeUndefined();
      expect(logSpy).toHaveBeenCalledWith(
        expect.stringContaining('already configured')
      );
    });
  });

  describe('Cursor config', () => {
    it('skips when .cursor directory does not exist', async () => {
      mockedFs.existsSync.mockReturnValue(false);
      mockedFs.mkdirSync.mockImplementation(() => undefined as any);
      mockedFs.writeFileSync.mockImplementation(() => {});

      const setupCommand = await loadSetupCommand();
      await setupCommand();

      expect(logSpy).toHaveBeenCalledWith(
        expect.stringContaining('Cursor')
      );
      expect(logSpy).toHaveBeenCalledWith(
        expect.stringContaining('skipped')
      );
    });

    it('configures when .cursor directory exists', async () => {
      mockedFs.existsSync.mockImplementation((p) => {
        const s = String(p);
        // .claude.json doesn't exist, .cursor dir exists, mcp.json doesn't exist
        if (s.endsWith('.cursor')) return true;
        return false;
      });
      mockedFs.statSync.mockImplementation((p) => {
        return { isDirectory: () => true } as fs.Stats;
      });
      mockedFs.mkdirSync.mockImplementation(() => undefined as any);
      mockedFs.writeFileSync.mockImplementation(() => {});

      const setupCommand = await loadSetupCommand();
      await setupCommand();

      const writeCall = mockedFs.writeFileSync.mock.calls.find(
        (c) => (c[0] as string).includes('mcp.json')
      );
      expect(writeCall).toBeDefined();
      const written = JSON.parse(writeCall![1] as string);
      expect(written.mcpServers.need).toEqual(EXPECTED_CONFIG);
    });
  });
});
