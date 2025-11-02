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

// Mock utils
vi.mock('../../src/utils.js', () => ({
  sanitizeInput: vi.fn((input) => input),
}));

describe('CopilotCLI', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    delete process.env.GITHUB_TOKEN;
  });

  describe('isCopilotCLIAvailable', () => {
    it('should return true if CLI is available', async () => {
      const { exec } = await import('child_process');
      exec.mockImplementation((cmd, callback) => {
        if (cmd === 'gh copilot --version') {
          callback(null, { stdout: 'copilot version 1.0.0' });
        }
      });

      const result = await CopilotCLI.isCopilotCLIAvailable();
      expect(result).toBe(true);
    });

    it('should return false if CLI is not available', async () => {
      const { exec } = await import('child_process');
      exec.mockImplementation((cmd, callback) => {
        callback(new Error('command not found'));
      });

      const result = await CopilotCLI.isCopilotCLIAvailable();
      expect(result).toBe(false);
    });
  });

  describe('authenticateCopilotCLI', () => {
    it('should authenticate with valid token', async () => {
      const { exec } = await import('child_process');
      exec.mockImplementation((cmd, callback) => {
        if (cmd.includes('gh auth login')) {
          callback(null, { stdout: 'success' });
        } else if (cmd === 'gh copilot --version') {
          callback(null, { stdout: 'copilot version 1.0.0' });
        }
      });

      const copilot = new CopilotCLI();
      const result = await copilot.authenticateCopilotCLI('ghp_1234567890123456789012345678901234567890');

      expect(result.success).toBe(true);
      expect(result.authenticated).toBe(true);
      expect(process.env.GITHUB_TOKEN).toBe('ghp_1234567890123456789012345678901234567890');
    });

    it('should reject invalid token format', async () => {
      const copilot = new CopilotCLI();

      await expect(copilot.authenticateCopilotCLI('invalid')).rejects.toThrow('Invalid GitHub token format');
    });
  });

  describe('triggerCodingAgent', () => {
    it('should trigger coding agent successfully', async () => {
      const { exec } = await import('child_process');
      exec.mockImplementation((cmd, callback) => {
        callback(null, { stdout: 'Coding agent triggered' });
      });

      const copilot = new CopilotCLI();
      copilot.authenticated = true;

      const repositoryContext = {
        owner: 'test-owner',
        name: 'test-repo',
        branch: 'main',
      };

      const result = await copilot.triggerCodingAgent('GENERATE_DOCUMENTATION', repositoryContext);

      expect(result.success).toBe(true);
      expect(result.promptKey).toBe('GENERATE_DOCUMENTATION');
      expect(result.message).toContain('triggered successfully');
    });

    it('should reject invalid prompt key', async () => {
      const copilot = new CopilotCLI();
      copilot.authenticated = true;

      const repositoryContext = {
        owner: 'test-owner',
        name: 'test-repo',
        branch: 'main',
      };

      await expect(copilot.triggerCodingAgent('INVALID_PROMPT', repositoryContext)).rejects.toThrow(
        'Invalid prompt key: INVALID_PROMPT'
      );
    });

    it('should require authentication', async () => {
      const copilot = new CopilotCLI();

      const repositoryContext = {
        owner: 'test-owner',
        name: 'test-repo',
        branch: 'main',
      };

      await expect(copilot.triggerCodingAgent('GENERATE_DOCUMENTATION', repositoryContext)).rejects.toThrow(
        'Copilot CLI not authenticated'
      );
    });
  });

  describe('validateSetup', () => {
    it('should validate successful setup', async () => {
      const { exec } = await import('child_process');
      exec.mockImplementation((cmd, callback) => {
        callback(null, { stdout: 'success' });
      });

      const result = await CopilotCLI.validateSetup();

      expect(result.errors).toHaveLength(0);
      expect(result.checks.githubCLI).toBe(true);
      expect(result.checks.copilotExtension).toBe(true);
    });

    it('should detect missing CLI', async () => {
      const { exec } = await import('child_process');
      exec.mockImplementation((cmd, callback) => {
        callback(new Error('command not found'));
      });

      const result = await CopilotCLI.validateSetup();

      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.checks.githubCLI).toBe(false);
    });
  });

  describe('triggerDocumentationWorkflow', () => {
    it('should trigger documentation workflow successfully', async () => {
      const { exec } = await import('child_process');
      exec.mockImplementation((cmd, callback) => {
        callback(null, { stdout: 'Workflow triggered' });
      });

      const copilot = new CopilotCLI();
      copilot.authenticated = true;

      const repositoryContext = {
        owner: 'test-owner',
        name: 'test-repo',
        branch: 'main',
      };

      const result = await copilot.triggerDocumentationWorkflow(repositoryContext);

      expect(result.success).toBe(true);
      expect(result.triggered).toBe(true);
      expect(result.message).toContain('asynchronously');
    });
  });

  describe('buildContextualPrompt', () => {
    it('should replace placeholders with context values', () => {
      const prompt = 'Repository: {owner}/{name} on {branch}';
      const context = {
        owner: 'test-owner',
        name: 'test-repo',
        branch: 'main',
      };

      const result = CopilotCLI.buildContextualPrompt(prompt, context);

      expect(result).toBe('Repository: test-owner/test-repo on main');
    });
  });
});
