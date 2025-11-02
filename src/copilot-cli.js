import * as core from '@actions/core';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

/**
 * Simple Copilot CLI wrapper
 */
class CopilotCLI {
  /**
   * Install GitHub CLI and Copilot extension if not already installed
   */
  static async install() {
    try {
      // Check if GitHub CLI is already installed
      try {
        await execAsync('gh --version');
        core.info('GitHub CLI already installed');
      } catch {
        // Install GitHub CLI
        await execAsync('curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg | sudo dd of=/usr/share/keyrings/githubcli-archive-keyring.gpg');
        await execAsync('echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | sudo tee /etc/apt/sources.list.d/github-cli.list > /dev/null');
        await execAsync('sudo apt update && sudo apt install gh -y');
        core.info('✅ GitHub CLI installed');
      }
      
      // Check if Copilot extension is already installed
      try {
        await execAsync('gh copilot --version');
        core.info('Copilot extension already installed');
      } catch {
        // Install Copilot extension
        await execAsync('gh extension install github/gh-copilot');
        core.info('✅ Copilot extension installed');
      }
    } catch (error) {
      throw new Error(`Installation failed: ${error.message}`);
    }
  }

  /**
   * Authenticate with GitHub token
   */
  static async authenticate(token) {
    try {
      process.env.GITHUB_TOKEN = token;
      await execAsync(`echo "${token}" | gh auth login --with-token`);
      core.info('✅ Authenticated with GitHub');
    } catch (error) {
      throw new Error(`Authentication failed: ${error.message}`);
    }
  }

  /**
   * Run copilot command
   */
  static async run(prompt) {
    try {
      const { stdout } = await execAsync(`gh copilot suggest "${prompt}"`);
      return stdout;
    } catch (error) {
      throw new Error(`Copilot command failed: ${error.message}`);
    }
  }
}

export { CopilotCLI };
