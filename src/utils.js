import * as core from '@actions/core';

/**
 * Validate action inputs
 */
const validateInputs = (inputs) => {
  if (!inputs.githubToken) {
    throw new Error('GitHub token is required');
  }

  // Validate GitHub token format (basic check)
  if (typeof inputs.githubToken !== 'string' || inputs.githubToken.length < 10) {
    throw new Error('Invalid GitHub token format');
  }

  core.info('✅ Inputs validated successfully');
};

/**
 * Handle errors consistently
 */
const handleError = (error) => {
  core.error(`❌ UpkeepDocs failed: ${error.message}`);

  if (error.stack) {
    core.debug(error.stack);
  }

  core.setFailed(error.message);
};

/**
 * Sanitize user input to prevent injection attacks
 */
const sanitizeInput = (input) => {
  if (typeof input !== 'string') {
    return input;
  }

  // Remove potentially dangerous characters
  return input.replace(/[;&|`$(){}[\]]/g, '');
};

/**
 * Log execution context for debugging
 */
const logContext = (context) => {
  core.debug(`Repository: ${context.repo.owner}/${context.repo.repo}`);
  core.debug(`Event: ${context.eventName}`);
  core.debug(`SHA: ${context.sha}`);
  core.debug(`Ref: ${context.ref}`);
};

export {
  validateInputs,
  handleError,
  sanitizeInput,
  logContext,
};