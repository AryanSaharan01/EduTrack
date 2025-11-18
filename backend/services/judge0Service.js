const axios = require('axios');

/**
 * Judge0 API Service
 * Handles code compilation and execution via Judge0 API
 */

// Judge0 Language IDs - commonly used languages
const LANGUAGE_IDS = {
  'javascript': 63,
  'python': 71,
  'java': 62,
  'cpp': 54,
  'c': 50,
  'csharp': 51,
  'ruby': 72,
  'go': 60,
  'php': 68,
  'swift': 83,
  'kotlin': 78,
  'rust': 73,
  'typescript': 74,
};

class Judge0Service {
  constructor() {
    // Use sample API key for now - user will replace with their own
    this.apiKey = process.env.JUDGE0_API_KEY || 'd0a9fd974dmshde0fad821e57c4fp14103bjsneb6131a15123';
    this.apiHost = process.env.JUDGE0_API_HOST || 'judge0-ce.p.rapidapi.com';
    this.baseURL = `https://${this.apiHost}`;
    
    this.axiosInstance = axios.create({
      baseURL: this.baseURL,
      headers: {
        'Content-Type': 'application/json',
        'X-RapidAPI-Key': this.apiKey,
        'X-RapidAPI-Host': this.apiHost
      }
    });
  }

  /**
   * Get language ID from language name
   */
  getLanguageId(language) {
    const normalizedLang = language.toLowerCase();
    return LANGUAGE_IDS[normalizedLang] || LANGUAGE_IDS['python']; // default to python
  }

  /**
   * Submit code for execution
   * @param {string} sourceCode - The source code to execute
   * @param {string} language - Programming language
   * @param {string} stdin - Standard input (optional)
   * @returns {Promise<string>} - Submission token
   */
  async submitCode(sourceCode, language, stdin = '') {
    try {
      const languageId = this.getLanguageId(language);
      
      const submission = {
        source_code: Buffer.from(sourceCode).toString('base64'),
        language_id: languageId,
        stdin: stdin ? Buffer.from(stdin).toString('base64') : '',
      };

      console.log('[JUDGE0] Submitting code:', {
        language,
        languageId,
        codeLength: sourceCode.length
      });

      const response = await this.axiosInstance.post('/submissions', submission, {
        params: { base64_encoded: 'true', fields: '*' }
      });

      return response.data.token;
    } catch (error) {
      console.error('[JUDGE0] Submission error:', error.response?.data || error.message);
      throw new Error(`Failed to submit code: ${error.response?.data?.message || error.message}`);
    }
  }

  /**
   * Get submission result
   * @param {string} token - Submission token
   * @returns {Promise<object>} - Submission result
   */
  async getSubmission(token) {
    try {
      const response = await this.axiosInstance.get(`/submissions/${token}`, {
        params: { base64_encoded: 'true', fields: '*' }
      });

      const data = response.data;
      
      // Decode base64 fields
      if (data.stdout) {
        data.stdout = Buffer.from(data.stdout, 'base64').toString('utf-8');
      }
      if (data.stderr) {
        data.stderr = Buffer.from(data.stderr, 'base64').toString('utf-8');
      }
      if (data.compile_output) {
        data.compile_output = Buffer.from(data.compile_output, 'base64').toString('utf-8');
      }
      if (data.message) {
        data.message = Buffer.from(data.message, 'base64').toString('utf-8');
      }

      return data;
    } catch (error) {
      console.error('[JUDGE0] Get submission error:', error.response?.data || error.message);
      throw new Error(`Failed to get submission: ${error.response?.data?.message || error.message}`);
    }
  }

  /**
   * Submit code and wait for result with polling
   * @param {string} sourceCode - The source code to execute
   * @param {string} language - Programming language
   * @param {string} stdin - Standard input (optional)
   * @param {number} maxRetries - Maximum polling retries (default: 20)
   * @param {number} pollInterval - Polling interval in ms (default: 1000)
   * @returns {Promise<object>} - Execution result
   */
  async executeCode(sourceCode, language, stdin = '', maxRetries = 20, pollInterval = 1000) {
    try {
      // Submit code
      const token = await this.submitCode(sourceCode, language, stdin);
      
      // Poll for result
      let retries = 0;
      while (retries < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, pollInterval));
        
        const result = await this.getSubmission(token);
        
        // Status IDs:
        // 1: In Queue, 2: Processing, 3: Accepted, 4: Wrong Answer,
        // 5: Time Limit Exceeded, 6: Compilation Error, 7-12: Runtime Errors, 13: Internal Error
        const status = result.status.id;
        
        if (status === 1 || status === 2) {
          // Still processing
          retries++;
          console.log(`[JUDGE0] Polling... (${retries}/${maxRetries})`);
          continue;
        }
        
        // Execution completed
        return this.formatResult(result);
      }
      
      throw new Error('Execution timeout: Code took too long to execute');
    } catch (error) {
      console.error('[JUDGE0] Execute code error:', error);
      throw error;
    }
  }

  /**
   * Format execution result for client
   */
  formatResult(result) {
    const statusId = result.status.id;
    const statusDescription = result.status.description;

    let output = '';
    let error = null;
    let success = false;

    // Status 3 = Accepted (Success)
    if (statusId === 3) {
      success = true;
      output = result.stdout || 'Code executed successfully (no output)';
    }
    // Status 6 = Compilation Error
    else if (statusId === 6) {
      error = 'Compilation Error';
      output = result.compile_output || 'Compilation failed';
    }
    // Status 5 = Time Limit Exceeded
    else if (statusId === 5) {
      error = 'Time Limit Exceeded';
      output = 'Your code took too long to execute';
    }
    // Runtime Errors (7-12)
    else if (statusId >= 7 && statusId <= 12) {
      error = statusDescription;
      output = result.stderr || result.message || 'Runtime error occurred';
    }
    // Wrong Answer (4)
    else if (statusId === 4) {
      success = false;
      output = result.stdout || 'Wrong Answer';
    }
    // Internal Error or other
    else {
      error = statusDescription || 'Unknown Error';
      output = result.stderr || result.message || 'An error occurred';
    }

    return {
      success,
      output: output.trim(),
      error,
      status: statusDescription,
      time: result.time,
      memory: result.memory,
      token: result.token,
      statusId
    };
  }

  /**
   * Test code against expected output
   * @param {string} sourceCode - The source code to execute
   * @param {string} language - Programming language
   * @param {string} expectedOutput - Expected output
   * @param {string} stdin - Standard input (optional)
   * @returns {Promise<object>} - Test result with pass/fail
   */
  async testCode(sourceCode, language, expectedOutput, stdin = '') {
    try {
      const result = await this.executeCode(sourceCode, language, stdin);
      
      if (!result.success) {
        return {
          ...result,
          passed: false,
          message: result.error || 'Execution failed'
        };
      }

      // Compare output with expected output
      const actualOutput = result.output.trim();
      const expected = expectedOutput.trim();
      const passed = actualOutput === expected;

      return {
        ...result,
        passed,
        expectedOutput: expected,
        actualOutput,
        message: passed ? 'All test cases passed!' : 'Output does not match expected result'
      };
    } catch (error) {
      return {
        success: false,
        passed: false,
        error: error.message,
        message: 'Failed to test code',
        output: error.message
      };
    }
  }

  /**
   * Get supported languages
   */
  getSupportedLanguages() {
    return Object.keys(LANGUAGE_IDS);
  }

  /**
   * Validate API configuration
   */
  async validateConnection() {
    try {
      // Try to get languages to validate connection
      const response = await this.axiosInstance.get('/languages');
      return {
        valid: true,
        message: 'Judge0 API connection successful',
        languages: response.data.length
      };
    } catch (error) {
      console.error('[JUDGE0] Connection validation failed:', error.message);
      return {
        valid: false,
        message: 'Failed to connect to Judge0 API. Please check your API key and host.',
        error: error.message
      };
    }
  }
}

// Export singleton instance
module.exports = new Judge0Service();
