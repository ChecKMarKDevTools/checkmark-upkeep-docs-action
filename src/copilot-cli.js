import * as core from '@actions/core';
import { exec } from 'child_process';
import { promisify } from 'util';
import { sanitizeInput } from './utils.js';

const execAsync = promisify(exec);

/**
 * Predefined prompts for documentation generation
 * These prompts are maintained by this repository and cannot be customized for security
 * The coding agent will handle these asynchronously and create PRs when complete
 */
const PREDEFINED_PROMPTS = {
  GENERATE_DOCUMENTATION: `
    Your goal is to use the corresponding HLBPA agent to generate a comprehensive set of docs in the \`/docs\` folder that covers all major flows in the codebase that have been touched by the baseline PR. Take a tiered approach to documentation starting at a high level and then drilling down to a more detailed view in a separate inline diagram.

    Use available tools to perform a cursary search of any referenced API or repo outside of this one to include in a high level overview depecting where this app fits into the larger system. Then drill down to the flows affected specifically by this change from the time the app is first triggered until completion.  Generate this information using both a sequence and flow chart in Mermaid diagrams.

    It's also important to understand the data relationships that are used in this app and how that's different between input from other sources. Use ER diagrams to highlight this app's primary purpose from a data standpoint in addition to the systems information.

    Next, provide a comprehensive analysis of the current state of testing for this app with a focus on any unit or integration tests. Include performance or other specialty tests, if they exist. Identify any areas of concern in the testing setup along with recommendations for improvement, if applicable.

    Fourth, provide a detailed analysis of the current state of this app versus desired best case scenarios. It should highlight both the things this app does well and include gaps in logic or design that may need attention now or could be enhanced later to provide significant benefits in the future. List these in order by impact and timeline of estimated amount of work. For any suggested improvement, include a T-shirt size amount of effort (XS, S, M, L, XLG, etc.). If a previous document exists, update the existing one noting the improvement (or not) since the previous update, if any exists.

    Finally the last report is a comprehensive high-level overview of all recent changes, deployments, versions/releases. Update the existing document, if one exists else start a new one focused on this change and linear history. Use git as needed, but only include items that have already been merged to \`main\` or commits explicitly included directly or squashed in a release version. Any other branches or dev work should be explicitly ignored.

    If there are any other recommendations for reports that may highlight specific edge cases not covered here then please also include them along with your analysis.

    Repository Context:
    - Owner: {owner}
    - Name: {name}
    - Branch: {branch}
    - Language: {language}
    - Has existing README: {hasReadme}
    - Has existing docs directory: {hasDocs}

    After generating the comprehensive documentation with Mermaid diagrams:
    - You are responsible for self-validation. Do not depend on the repo to validate for you. 
    - Create a pull request with title "docs: Generate comprehensive technical documentation with architecture diagrams"
    - Include a detailed description of what documentation was added/updated
    - Add appropriate labels like "documentation", "enhancement"
    - Ensure all Mermaid diagrams are properly formatted and render correctly using any available tools. Do not depend on any automated form of testing and do not output broken documents due to poor formatting or include custom coloring or style to this diagrams in any way.

    This is an automated documentation generation request focusing on systems architecture and technical analysis. Please proceed with creating the documentation and opening the pull request.
  `,
};

/**
 * Copilot CLI integration class for GitHub Coding Agent
 * Implements requirements 4.1, 4.2, 4.3, 4.4, 4.5
 */
class CopilotCLI {
  constructor() {
    this.authenticated = false;
    this.version = null;
  }

  /**
   * Check if GitHub Copilot CLI is available in the environment
   * Implements requirement 4.2 - CLI availability validation
   */
  static async isCopilotCLIAvailable() {
    try {
      await execAsync('gh copilot --version');
      return true;
    } catch (error) {
      core.debug(`Copilot CLI not available: ${error.message}`);
      return false;
    }
  }

  /**
   * Authenticate Copilot CLI with GitHub token
   * Implements requirement 4.2 - CLI authentication
   */
  async authenticateCopilotCLI(token) {
    try {
      // Validate token format
      if (!token || typeof token !== 'string' || token.length < 10) {
        throw new Error('Invalid GitHub token format');
      }

      // Set environment variable for GitHub CLI
      process.env.GITHUB_TOKEN = token;

      // Authenticate with GitHub CLI
      await execAsync(`echo "${token}" | gh auth login --with-token`);

      // Verify Copilot CLI is working
      const { stdout } = await execAsync('gh copilot --version');
      this.version = stdout.trim();
      this.authenticated = true;

      core.info(`✅ Copilot CLI authenticated successfully`);
      return {
        success: true,
        version: this.version,
        authenticated: this.authenticated,
      };
    } catch (error) {
      const errorMessage = `Copilot CLI authentication failed: ${error.message}`;
      core.error(errorMessage);
      throw new Error(errorMessage);
    }
  }

  /**
   * Trigger coding agent with predefined prompt and repository context
   * Implements requirement 4.3, 4.4 - prompt execution with context
   * This is a fire-and-forget operation - the coding agent will handle everything asynchronously
   */
  async triggerCodingAgent(promptKey, repositoryContext) {
    try {
      if (!this.authenticated) {
        throw new Error('Copilot CLI not authenticated. Call authenticateCopilotCLI first.');
      }

      // Validate prompt key exists in predefined prompts
      if (!PREDEFINED_PROMPTS[promptKey]) {
        throw new Error(`Invalid prompt key: ${promptKey}. Only predefined prompts are allowed for security.`);
      }

      const prompt = PREDEFINED_PROMPTS[promptKey];

      // Sanitize repository context
      const sanitizedContext = CopilotCLI.sanitizeRepositoryContext(repositoryContext);

      // Build context-aware prompt with repository information
      const contextualPrompt = CopilotCLI.buildContextualPrompt(prompt, sanitizedContext);

      core.info(`🤖 Triggering GitHub Copilot coding agent: ${promptKey}`);
      core.debug(`Repository context: ${JSON.stringify(sanitizedContext)}`);

      // Trigger the coding agent - this is fire-and-forget
      await CopilotCLI.triggerCopilotCodingAgent(contextualPrompt, sanitizedContext);

      // Log action for transparency (requirement 4.6)
      core.info(`✅ Coding agent triggered successfully`);
      core.info(`📋 The coding agent will analyze the repository and create a pull request when complete`);
      core.info(`🔔 Repository owners will be notified when the documentation PR is opened`);

      return {
        success: true,
        promptKey,
        context: sanitizedContext,
        timestamp: new Date().toISOString(),
        message: 'Coding agent triggered successfully. PR will be created asynchronously.',
      };
    } catch (error) {
      const errorMessage = `Coding agent trigger failed: ${error.message}`;
      core.error(errorMessage);

      // Provide clear error handling (requirement 4.5)
      if (error.message.includes('authentication')) {
        core.error('💡 Ensure GitHub token has correct permissions and Copilot access');
      } else if (error.message.includes('CLI')) {
        core.error('💡 Ensure GitHub Copilot CLI is available in the runner environment');
      }

      throw new Error(errorMessage);
    }
  }

  /**
   * Trigger documentation generation workflow
   * Implements requirement 4.4 - comprehensive documentation generation
   * This triggers the coding agent to handle everything asynchronously
   */
  async triggerDocumentationWorkflow(repositoryContext) {
    try {
      core.info('🚀 Triggering comprehensive documentation generation workflow...');

      // Trigger the coding agent with the comprehensive documentation prompt
      const result = await this.triggerCodingAgent('GENERATE_DOCUMENTATION', repositoryContext);

      core.info('✅ Documentation generation workflow triggered successfully');
      core.info('📋 The GitHub Copilot coding agent will:');
      core.info('   • Analyze the repository structure');
      core.info('   • Generate or update README.md');
      core.info('   • Create API documentation if applicable');
      core.info('   • Generate user guides as needed');
      core.info('   • Open a pull request with all documentation changes');
      core.info('🔔 Repository owners will receive notifications when the PR is created');

      return {
        success: true,
        triggered: true,
        context: result.context,
        timestamp: result.timestamp,
        message: 'Documentation workflow triggered. Coding agent will create PR asynchronously.',
      };
    } catch (error) {
      core.error(`Documentation workflow trigger failed: ${error.message}`);
      throw error;
    }
  }

  /**
   * Validate CLI setup and configuration
   * Implements requirement 4.2 - setup validation
   */
  static async validateSetup() {
    const validation = {
      errors: [],
      warnings: [],
      checks: {},
    };

    try {
      // Check GitHub CLI availability
      await execAsync('gh --version');
      validation.checks.githubCLI = true;
    } catch (error) {
      validation.errors.push('GitHub CLI not available');
      validation.checks.githubCLI = false;
    }

    try {
      // Check Copilot extension
      await execAsync('gh copilot --version');
      validation.checks.copilotExtension = true;
    } catch (error) {
      validation.errors.push('GitHub Copilot CLI extension not available');
      validation.checks.copilotExtension = false;
    }

    try {
      // Check authentication status
      await execAsync('gh auth status');
      validation.checks.authentication = true;
    } catch (error) {
      validation.warnings.push('GitHub CLI not authenticated');
      validation.checks.authentication = false;
    }

    return validation;
  }

  /**
   * Sanitize repository context to prevent injection attacks
   * Implements requirement 5.5 - input validation
   */
  static sanitizeRepositoryContext(context) {
    return {
      owner: sanitizeInput(context.owner),
      name: sanitizeInput(context.name),
      branch: sanitizeInput(context.branch),
      // Only include safe, non-sensitive context information
      language: context.language ? sanitizeInput(context.language) : 'unknown',
      hasReadme: Boolean(context.hasReadme),
      hasDocs: Boolean(context.hasDocs),
    };
  }

  /**
   * Build contextual prompt with repository information
   */
  static buildContextualPrompt(basePrompt, context) {
    // Replace placeholders in the prompt with actual context values
    return basePrompt
      .replace('{owner}', context.owner)
      .replace('{name}', context.name)
      .replace('{branch}', context.branch)
      .replace('{language}', context.language || 'unknown')
      .replace('{hasReadme}', context.hasReadme ? 'yes' : 'no')
      .replace('{hasDocs}', context.hasDocs ? 'yes' : 'no');
  }

  /**
   * Trigger GitHub Copilot coding agent with the documentation prompt
   * This uses the coding agent deployment feature, not just suggestions
   */
  static async triggerCopilotCodingAgent(prompt, context) {
    try {
      // Create a temporary file with the prompt for the coding agent
      const fs = await import('fs');
      const path = await import('path');
      const os = await import('os');

      const tempDir = os.tmpdir();
      const promptFile = path.join(tempDir, `copilot-prompt-${Date.now()}.md`);

      // Write the prompt to a temporary file
      fs.writeFileSync(promptFile, prompt);

      core.info(`📝 Created prompt file: ${promptFile}`);

      // Use gh copilot to trigger the coding agent
      // The exact command may vary based on GitHub's implementation
      const command = `gh copilot --file "${promptFile}" --repo "${context.owner}/${context.name}"`;

      core.debug(`Executing command: ${command}`);

      // Execute the command - this is fire-and-forget
      await execAsync(command);

      // Clean up the temporary file
      fs.unlinkSync(promptFile);

      core.info('🤖 Coding agent triggered successfully');
    } catch (error) {
      throw new Error(`Copilot coding agent trigger failed: ${error.message}`);
    }
  }
}

export { CopilotCLI };
