/**
 * Custom hook for AI-powered description generation
 * Provides interface to call the Gemini API endpoint securely
 */

import { useState } from 'react';

/**
 * @typedef {Object} AiDescribeContext
 * @property {'experience'|'education'|'project'|'certification'|'achievement'} section - Section type
 * @property {string} [role] - Job title, degree, or role
 * @property {string} [organization] - Company, school, or organization
 * @property {string} [location] - Location
 * @property {string} [start] - Start date
 * @property {string} [end] - End date
 * @property {string[]} [skills] - Skills or coursework
 * @property {'concise'|'impactful'|'technical'} [style] - Writing style
 * @property {string} [lang] - Language code
 * @property {boolean} [wantBullets] - Whether to generate bullet points
 */

/**
 * @typedef {Object} AiDescribeResult
 * @property {string} paragraph - Generated paragraph description
 * @property {string[]} [bullets] - Generated bullet points (if requested)
 */

/**
 * @typedef {Object} UseAiDescribeReturn
 * @property {function} describe - Function to generate description
 * @property {boolean} loading - Whether request is in progress
 * @property {AiDescribeResult|null} data - Generated content
 * @property {string|null} error - Error message if any
 * @property {function} reset - Reset state
 */

/**
 * Hook for AI-powered description generation
 * @returns {UseAiDescribeReturn} Hook interface
 */
export function useAiDescribe() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  /**
   * Generate description using AI
   * @param {AiDescribeContext} context - Context for generation
   * @returns {Promise<AiDescribeResult>} Generated content
   */
  const describe = async (context) => {
    setLoading(true);
    setError(null);
    setData(null);

    try {
      const response = await fetch('/api/ai/describe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(context),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      if (!result.ok) {
        throw new Error(result.error || 'Failed to generate description');
      }

      const generatedData = {
        paragraph: result.paragraph,
        bullets: result.bullets || undefined,
      };

      setData(generatedData);
      return generatedData;

    } catch (err) {
      const errorMessage = err.message || 'Failed to generate description';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Reset hook state
   */
  const reset = () => {
    setLoading(false);
    setData(null);
    setError(null);
  };

  return {
    describe,
    loading,
    data,
    error,
    reset,
  };
}
