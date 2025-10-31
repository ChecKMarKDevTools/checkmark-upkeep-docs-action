import * as core from '@actions/core';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

/**
 * Single CLI abstraction for all Copilot commands
 */
class CopilotCLI {
  constructor() {
    this.authenticated = false;
  }

  /**
   * Check if Copilot CLI is available in the environment
   * @returns {Promise<boolean>} True if CLI is available
   */
  static async isAvailable() {
    try {
      const { stdout } = await execAsync('gh copilot --version');
      core.debug(`Copilot CLI version: ${stdout.trim()}`);
      return true;
    } catch (error) {
      core.debug(`Copilot CLI not available: ${error.message}`);
      return false;
    }
  }

  /**
   * Authenticate with Copilot CLI
   * @param {string} githubToken - GitHub personal access token
   */
  async authenticate(githubToken) {
    try {
      core.info('🔐 Authenticating with Copilot CLI...');

      // Set GitHub token for Copilot CLI
      process.env.GITHUB_TOKEN = githubToken;
      process.env.GH_TOKEN = githubToken;

      this.authenticated = true;
      core.info('✅ Copilot CLI authenticated successfully');
    } catch (error) {
      core.error('❌ Failed to authenticate with Copilot CLI:', error.message);
      throw new Error(`Authentication failed: ${error.message}`);
    }
  }

  /**
   * Execute any Copilot CLI command
   * @param {string} command - The copilot command to execute
   * @param {Object} options - Optional configuration
   * @returns {Promise<Object>} Command result with stdout, stderr, and success status
   */
  async execute(command, options = {}) {
    if (!this.authenticated) {
      throw new Error('Must authenticate before executing commands');
    }

    try {
      core.info(`🤖 Executing: ${command}`);

      const { stdout, stderr } = await execAsync(command, options);

      if (stderr) {
        core.warning('⚠️ Command warning:', stderr);
      }

      core.info('✅ Command executed successfully');

      return {
        success: true,
        stdout,
        stderr,
      };
    } catch (error) {
      core.error('❌ Command failed:', error.message);

      return {
        success: false,
        stdout: error.stdout || '',
        stderr: error.stderr || error.message,
        error: error.message,
      };
    }
  }
}

export { CopilotCLI };
