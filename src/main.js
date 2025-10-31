import * as core from '@actions/core';
import * as github from '@actions/github';
import { CopilotCLI } from './copilot-cli.js';
import { validateInputs, handleError, logContext } from './utils.js';

/**
 * Main entry point for the UpkeepDocs GitHub Action
 * Implements comprehensive error handling and user feedback as per requirement 5.3
 */
const run = async () => {
  try {
    core.info('🚀 Starting UpkeepDocs GitHub Action...');

    // Log execution context for debugging and transparency
    const { context } = github;
    logContext(context);

    // Get and validate all inputs
    const inputs = {
      githubToken: core.getInput('github-token', { required: true }),
      customConfig: core.getInput('custom-config', { required: false }),
    };

    core.info('📋 Validating action inputs...');
    validateInputs(inputs);

    // Initialize and authenticate Copilot CLI
    core.info('🔧 Initializing Copilot CLI integration...');
    const copilot = new CopilotCLI();

    // Check CLI availability before authentication
    const isAvailable = await CopilotCLI.isAvailable();
    if (!isAvailable) {
      throw new Error('GitHub Copilot CLI is not available in this environment');
    }

    await copilot.authenticate(inputs.githubToken);

    // Set up execution context for documentation generation
    const executionContext = {
      repository: {
        owner: context.repo.owner,
        name: context.repo.repo,
        branch: context.ref.replace('refs/heads/', ''),
      },
      workflow: {
        runId: context.runId,
        actor: context.actor,
      },
      inputs,
    };

    core.info('📝 Execution context prepared');
    core.debug(`Repository: ${executionContext.repository.owner}/${executionContext.repository.name}`);
    core.debug(`Branch: ${executionContext.repository.branch}`);

    // TODO: Implement documentation generation logic in future tasks
    core.info('✅ UpkeepDocs action completed successfully');

    // Set outputs for workflow integration
    core.setOutput('pr-number', '');
    core.setOutput('pr-url', '');
  } catch (error) {
    // Comprehensive error handling with user feedback
    core.error(`❌ UpkeepDocs action failed: ${error.message}`);

    // Provide actionable error messages based on error type
    if (error.message.includes('GitHub token')) {
      core.error('💡 Ensure your workflow has the correct GitHub token permissions');
      core.error('   Required permissions: contents:write, pull-requests:write');
    } else if (error.message.includes('Copilot CLI')) {
      core.error('💡 Ensure GitHub Copilot CLI is available in your runner environment');
      core.error('   Consider using a runner with Copilot CLI pre-installed');
    }

    handleError(error);
  }
};

/**
 * Entry point - immediately execute the action
 * Follows GitHub Actions best practices for JavaScript actions
 */
if (import.meta.url === `file://${process.argv[1]}`) {
  run();
}

export { run };
