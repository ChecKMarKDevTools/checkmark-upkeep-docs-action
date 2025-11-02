import * as core from '@actions/core';
import * as fs from 'fs';
import * as path from 'path';

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
 * Handle errors consistently
 */
const handleError = (error) => {
  core.error(`❌ Upkeep Docs failed: ${error.message}`);

  if (error.stack) {
    core.debug(error.stack);
  }

  core.setFailed(error.message);
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

/**
 * Validate the execution environment
 * Implements requirement 5.5 - environment validation
 */
const validateEnvironment = () => {
  // Check Node.js version
  const nodeVersion = process.version;
  const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0], 10);

  if (majorVersion < 18) {
    throw new Error(`Node.js version ${nodeVersion} is not supported. Minimum required version is 18.x`);
  }

  // Check required environment variables
  const requiredEnvVars = ['GITHUB_WORKSPACE', 'GITHUB_REPOSITORY'];
  const missingVars = requiredEnvVars.filter((varName) => !process.env[varName]);

  if (missingVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
  }

  // Validate GitHub workspace
  if (!fs.existsSync(process.env.GITHUB_WORKSPACE)) {
    throw new Error(`GitHub workspace directory not found: ${process.env.GITHUB_WORKSPACE}`);
  }
};

/**
 * Validate documentation configuration section
 */
const validateDocumentationConfig = (docConfig) => {
  if (typeof docConfig !== 'object') {
    throw new Error('Documentation configuration must be an object');
  }

  const validated = {};

  if (docConfig.outputDir) {
    if (typeof docConfig.outputDir !== 'string') {
      throw new Error('Documentation outputDir must be a string');
    }
    // Sanitize output directory path
    validated.outputDir = sanitizeInput(docConfig.outputDir);
  }

  if (docConfig.includeApi !== undefined) {
    validated.includeApi = Boolean(docConfig.includeApi);
  }

  if (docConfig.includeReadme !== undefined) {
    validated.includeReadme = Boolean(docConfig.includeReadme);
  }

  return validated;
};

/**
 * Validate pull request configuration section
 */
const validatePullRequestConfig = (prConfig) => {
  if (typeof prConfig !== 'object') {
    throw new Error('Pull request configuration must be an object');
  }

  const validated = {};

  if (prConfig.title) {
    if (typeof prConfig.title !== 'string') {
      throw new Error('Pull request title must be a string');
    }
    validated.title = sanitizeInput(prConfig.title);
  }

  if (prConfig.body) {
    if (typeof prConfig.body !== 'string') {
      throw new Error('Pull request body must be a string');
    }
    validated.body = sanitizeInput(prConfig.body);
  }

  if (prConfig.labels && Array.isArray(prConfig.labels)) {
    validated.labels = prConfig.labels
      .filter((label) => typeof label === 'string')
      .map((label) => sanitizeInput(label));
  }

  return validated;
};

/**
 * Validate output configuration section
 */
const validateOutputConfig = (outputConfig) => {
  if (typeof outputConfig !== 'object') {
    throw new Error('Output configuration must be an object');
  }

  const validated = {};

  if (outputConfig.format) {
    const allowedFormats = ['markdown', 'html', 'json'];
    if (!allowedFormats.includes(outputConfig.format)) {
      throw new Error(`Output format must be one of: ${allowedFormats.join(', ')}`);
    }
    validated.format = outputConfig.format;
  }

  return validated;
};

/**
 * Validate configuration file structure
 * Implements security requirements for configuration validation
 */
const validateConfigStructure = (config) => {
  if (!config || typeof config !== 'object') {
    throw new Error('Configuration must be a valid JSON object');
  }

  // Define allowed configuration keys for security
  const allowedKeys = ['prompts', 'documentation', 'pullRequest', 'output', 'debug'];

  // Check for unknown keys
  const configKeys = Object.keys(config);
  const unknownKeys = configKeys.filter((key) => !allowedKeys.includes(key));

  if (unknownKeys.length > 0) {
    core.warning(`Unknown configuration keys will be ignored: ${unknownKeys.join(', ')}`);
  }

  // Validate specific configuration sections
  const validatedConfig = {};

  if (config.documentation) {
    validatedConfig.documentation = validateDocumentationConfig(config.documentation);
  }

  if (config.pullRequest) {
    validatedConfig.pullRequest = validatePullRequestConfig(config.pullRequest);
  }

  if (config.output) {
    validatedConfig.output = validateOutputConfig(config.output);
  }

  if (config.debug !== undefined) {
    validatedConfig.debug = Boolean(config.debug);
  }

  return validatedConfig;
};

/**
 * Validate GitHub token format and permissions
 * Implements requirement 5.5 - comprehensive input validation
 */
const validateGitHubToken = (token) => {
  if (!token) {
    throw new Error('GitHub token is required');
  }

  if (typeof token !== 'string') {
    throw new Error('GitHub token must be a string');
  }

  // GitHub tokens have specific format patterns
  const tokenPatterns = [
    /^ghp_[a-zA-Z0-9]{36}$/, // Personal access token
    /^ghs_[a-zA-Z0-9]{36}$/, // Server-to-server token
    /^gho_[a-zA-Z0-9]{36}$/, // OAuth token
    /^ghu_[a-zA-Z0-9]{36}$/, // User access token
    /^github_pat_[a-zA-Z0-9_]{82}$/, // Fine-grained personal access token
  ];

  const isValidFormat = tokenPatterns.some((pattern) => pattern.test(token));

  if (!isValidFormat && token.length < 10) {
    throw new Error(
      'Invalid GitHub token format. Token must be a valid GitHub token (ghp_, ghs_, gho_, ghu_, or github_pat_ prefix)'
    );
  }

  // Additional security check - ensure token doesn't contain suspicious characters
  if (/[<>'"&;|`$(){}[\]\\]/.test(token)) {
    throw new Error('GitHub token contains invalid characters');
  }

  return true;
};

/**
 * Validate custom configuration file if provided
 * Implements requirement 1.5 - custom configuration handling
 */
const validateCustomConfig = (configPath) => {
  if (!configPath) {
    return null; // Optional parameter
  }

  if (typeof configPath !== 'string') {
    throw new Error('Custom config path must be a string');
  }

  // Sanitize the path to prevent directory traversal
  const sanitizedPath = path.normalize(configPath).replace(/^(\.\.[/\\])+/, '');

  if (sanitizedPath !== configPath) {
    throw new Error('Custom config path contains invalid directory traversal');
  }

  // Check if file exists and is readable
  try {
    if (!fs.existsSync(sanitizedPath)) {
      throw new Error(`Custom config file not found: ${sanitizedPath}`);
    }

    const stats = fs.statSync(sanitizedPath);
    if (!stats.isFile()) {
      throw new Error(`Custom config path is not a file: ${sanitizedPath}`);
    }

    // Validate file extension (only allow safe config formats)
    const allowedExtensions = ['.json', '.yml', '.yaml', '.toml'];
    const ext = path.extname(sanitizedPath).toLowerCase();

    if (!allowedExtensions.includes(ext)) {
      throw new Error(`Custom config file must have one of these extensions: ${allowedExtensions.join(', ')}`);
    }

    return sanitizedPath;
  } catch (error) {
    if (error.code === 'ENOENT') {
      throw new Error(`Custom config file not found: ${sanitizedPath}`);
    }
    if (error.code === 'EACCES') {
      throw new Error(`Custom config file not readable: ${sanitizedPath}`);
    }
    throw error;
  }
};

/**
 * Load and parse custom configuration file
 * Implements requirement 1.5 - configuration file processing
 */
const loadCustomConfig = (configPath) => {
  if (!configPath) {
    return {};
  }

  try {
    const configContent = fs.readFileSync(configPath, 'utf8');
    const ext = path.extname(configPath).toLowerCase();

    let config;
    switch (ext) {
      case '.json':
        config = JSON.parse(configContent);
        break;
      case '.yml':
      case '.yaml':
        // For now, we'll require JSON format. YAML parsing can be added later if needed
        throw new Error('YAML configuration files are not yet supported. Please use JSON format.');
      case '.toml':
        throw new Error('TOML configuration files are not yet supported. Please use JSON format.');
      default:
        throw new Error(`Unsupported configuration file format: ${ext}`);
    }

    // Validate configuration structure
    return validateConfigStructure(config);
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error(`Invalid JSON in custom config file: ${error.message}`);
    }
    throw new Error(`Failed to load custom config: ${error.message}`);
  }
};

/**
 * Comprehensive input validation for all action inputs
 * Implements requirement 5.5 - comprehensive input validation
 */
const validateInputs = (inputs) => {
  core.info('🔍 Starting comprehensive input validation...');

  // Validate GitHub token
  try {
    validateGitHubToken(inputs.githubToken);
    core.info('✅ GitHub token format validated');
  } catch (error) {
    throw new Error(`GitHub token validation failed: ${error.message}`);
  }

  // Validate custom configuration if provided
  let customConfig = {};
  if (inputs.customConfig) {
    try {
      const configPath = validateCustomConfig(inputs.customConfig);
      customConfig = loadCustomConfig(configPath);
      core.info(`✅ Custom configuration loaded from: ${inputs.customConfig}`);
    } catch (error) {
      throw new Error(`Custom configuration validation failed: ${error.message}`);
    }
  } else {
    core.info('ℹ️ No custom configuration provided, using defaults');
  }

  // Validate environment requirements
  validateEnvironment();

  core.info('✅ All inputs validated successfully');

  return {
    ...inputs,
    customConfig,
  };
};

export {
  validateInputs,
  handleError,
  sanitizeInput,
  logContext,
  validateGitHubToken,
  loadCustomConfig,
  validateEnvironment,
};
