import * as core from '@actions/core';
import { CopilotCLI } from './copilot-cli.js';
import { validateInputs, handleError } from './utils.js';

/**
 * Main entry point for the UpkeepDocs GitHub Action
 */
const run = async () => {
  try {
    // Get and validate inputs
    const inputs = {
      githubToken: core.getInput('github-token', { required: true }),
    };

    validateInputs(inputs);

    core.info('🚀 Starting UpkeepDocs...');

    // Create and authenticate Copilot CLI
    const copilot = new CopilotCLI();
    await copilot.authenticate(inputs.githubToken);

    core.info('✅ Ready to execute Copilot commands');
  } catch (error) {
    handleError(error);
  }
};

// Run the action
run();

export { run };