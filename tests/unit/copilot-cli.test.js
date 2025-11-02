import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CopilotCLI } from '../../src/copilot-cli.js';

// Mock child_process
vi.mock('child_process', () => ({
  exec: vi.fn(),
}));

// Mock @actions/core
vi.mock('@actions/core', () => ({
  info: vi.fn(),
  error: vi.fn(),
  debug: vi.fn(),
}));

describe('CopilotCLI', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('install', () => {
    it('should skip installation if CLI already exists', async () => {
      // Mock successful version check (CLI already installed)
      const { exec } = await import('child_process');
      exec.mockImplementation((cmd, callback) => {
        if (cmd === 'gh --version') {
          callback(null, { stdout: 'gh version 2.0.0' });
        } else if (cmd === 'gh copilot --version') {
          callback(null, { stdout: 'copilot version 1.0.0' });
        }
      });

      await expect(CopilotCLI.install()).resolves.not.toThrow();
    });

    it('should install CLI if not present', async () => {
      // Mock CLI not found, then successful installation
      const { exec } = await import('child_process');
      exec.mockImplementation((cmd, callback) => {
        if (cmd === 'gh --version') {
          callback(new Error('command not found'));
        } else if (cmd === 'gh copilot --version') {
          callback(new Error('command not found'));
        } else {
          callback(null, { stdout: 'success' });
        }
      });

      await expect(CopilotCLI.install()).resolves.not.toThrow();
    });
  });

  describe('authenticate', () => {
    it('should authenticate with token', async () => {
      const { exec } = await import('child_process');
      exec.mockImplementation((cmd, callback) => {
        callback(null, { stdout: 'success' });
      });

      await expect(CopilotCLI.authenticate('test-token')).resolves.not.toThrow();
      expect(process.env.GITHUB_TOKEN).toBe('test-token');
    });
  });

  describe('run', () => {
    it('should run copilot command', async () => {
      const { exec } = await import('child_process');
      exec.mockImplementation((cmd, callback) => {
        callback(null, { stdout: 'copilot response' });
      });

      const result = await CopilotCLI.run('test prompt');
      expect(result).toBe('copilot response');
    });
  });
});