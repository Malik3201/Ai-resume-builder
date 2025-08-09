/**
 * Google Generative Language (Gemini 1.5 Flash) integration
 * Provides secure AI-powered content generation for resume descriptions
 */

/**
 * @typedef {Object} GeminiInput
 * @property {'experience'|'education'|'project'|'certification'|'achievement'} section - Section type
 * @property {string} [role] - Job title, degree, or role
 * @property {string} [organization] - Company, school, or organization
 * @property {string} [location] - Location
 * @property {string} [start] - Start date
 * @property {string} [end] - End date
 * @property {string[]} [skills] - Skills or coursework
 * @property {'concise'|'impactful'|'technical'} [style] - Writing style
 * @property {string} [lang] - Language code
 * @property {boolean} [wantBullets] - Whether to generate bullet points (experience only)
 */

/**
 * @typedef {Object} GeminiResponse
 * @property {string} paragraph - Generated paragraph description
 * @property {string[]} [bullets] - Generated bullet points (if requested)
 */

/**
 * Generate AI-powered description using Gemini 1.5 Flash
 * @param {GeminiInput} input - Input parameters for generation
 * @returns {Promise<GeminiResponse>} Generated content
 */
export async function geminiDescribe(input) {
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    // For testing purposes, return mock data when API key is not available
    console.warn('GEMINI_API_KEY not found, returning mock data for testing');
    return getMockResponse(input);
  }

  const {
    section,
    role = '',
    organization = '',
    location = '',
    start = '',
    end = '',
    skills = [],
    style = 'concise',
    lang = 'en',
    wantBullets = false
  } = input;

  // Build context-aware prompt
  const contextInfo = [
    role && `Role: ${role}`,
    organization && `Organization: ${organization}`,
    location && `Location: ${location}`,
    start && end && `Duration: ${start} - ${end}`,
    skills.length > 0 && `Skills/Technologies: ${skills.join(', ')}`
  ].filter(Boolean).join('\n');

  // Style-specific instructions
  const styleInstructions = {
    concise: 'Write in a clear, professional tone focusing on key responsibilities and achievements.',
    impactful: 'Emphasize quantifiable results, leadership, and significant contributions.',
    technical: 'Focus on technical skills, methodologies, and specific technologies used.'
  };

  // Section-specific context
  const sectionContext = {
    experience: 'professional work experience',
    education: 'educational background and academic achievements',
    project: 'project work and deliverables',
    certification: 'certification or credential',
    achievement: 'accomplishment or recognition'
  };

  const systemPrompt = `You are an expert resume writer specializing in ATS-friendly content. Generate professional descriptions that:
- Are optimized for Applicant Tracking Systems (ATS)
- Use industry-standard keywords and terminology
- Avoid first-person pronouns (I, me, my)
- Do not include emojis or special characters
- Focus on achievements and impact
- Use action verbs and quantifiable results when possible`;

  let userPrompt = `Generate a professional description for this ${sectionContext[section]}:

${contextInfo}

Requirements:
- Write exactly ONE paragraph of 40-60 words
- ${styleInstructions[style]}
- Use third-person perspective
- Be ATS-friendly with relevant keywords
- Format the paragraph between <<PARAGRAPH>> and <<END>> tags`;

  if (wantBullets && section === 'experience') {
    userPrompt += `

Additionally, generate exactly 3 concise bullet points (15-20 words each) highlighting key achievements or responsibilities. Format each bullet point on a new line starting with "- ".`;
  }

  const requestBody = {
    contents: [{
      parts: [{
        text: `${systemPrompt}\n\n${userPrompt}`
      }]
    }],
    generationConfig: {
      temperature: 0.7,
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 200,
      stopSequences: []
    },
    safetySettings: [
      {
        category: "HARM_CATEGORY_HARASSMENT",
        threshold: "BLOCK_MEDIUM_AND_ABOVE"
      },
      {
        category: "HARM_CATEGORY_HATE_SPEECH",
        threshold: "BLOCK_MEDIUM_AND_ABOVE"
      },
      {
        category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
        threshold: "BLOCK_MEDIUM_AND_ABOVE"
      },
      {
        category: "HARM_CATEGORY_DANGEROUS_CONTENT",
        threshold: "BLOCK_MEDIUM_AND_ABOVE"
      }
    ]
  };

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Gemini API error: ${response.status} ${response.statusText} - ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    
    if (!data.candidates || data.candidates.length === 0) {
      throw new Error('No response generated from Gemini API');
    }

    const generatedText = data.candidates[0]?.content?.parts?.[0]?.text;
    
    if (!generatedText) {
      throw new Error('Invalid response format from Gemini API');
    }

    // Parse the response
    const result = parseGeminiResponse(generatedText, wantBullets);
    
    console.log('Gemini API response parsed successfully');
    return result;

  } catch (error) {
    console.error('Gemini API error:', error);
    throw error;
  }
}

/**
 * Parse Gemini response text to extract paragraph and bullets
 * @param {string} text - Raw response text
 * @param {boolean} expectBullets - Whether bullets were requested
 * @returns {GeminiResponse} Parsed response
 */
function parseGeminiResponse(text, expectBullets) {
  // Extract paragraph between tags
  const paragraphMatch = text.match(/<<PARAGRAPH>>(.*?)<<END>>/s);
  let paragraph = paragraphMatch ? paragraphMatch[1].trim() : '';
  
  // Fallback: if no tags found, use the first paragraph-like text
  if (!paragraph) {
    const lines = text.split('\n').filter(line => line.trim() && !line.trim().startsWith('-'));
    paragraph = lines[0]?.trim() || text.substring(0, 200).trim();
  }

  const result = { paragraph };

  // Extract bullets if requested
  if (expectBullets) {
    const bulletMatches = text.match(/^- .+$/gm);
    if (bulletMatches && bulletMatches.length > 0) {
      result.bullets = bulletMatches
        .map(bullet => bullet.replace(/^- /, '').trim())
        .slice(0, 3); // Ensure max 3 bullets
    }
  }

  return result;
}

/**
 * Validate input parameters
 * @param {any} input - Input to validate
 * @returns {boolean} True if valid
 */
export function validateGeminiInput(input) {
  if (!input || typeof input !== 'object') {
    return false;
  }

  const validSections = ['experience', 'education', 'project', 'certification', 'achievement'];
  if (!validSections.includes(input.section)) {
    return false;
  }

  return true;
}

/**
 * Generate mock response for testing when API key is not available
 * @param {GeminiInput} input - Input parameters
 * @returns {GeminiResponse} Mock response
 */
function getMockResponse(input) {
  const { section, role, organization, wantBullets } = input;
  
  const mockResponses = {
    experience: {
      paragraph: `Contributed to ${organization || 'the organization'} as ${role || 'a team member'}, delivering high-quality solutions and collaborating effectively with cross-functional teams to achieve project objectives and drive business growth.`,
      bullets: wantBullets ? [
        'Led cross-functional team initiatives and improved operational efficiency',
        'Implemented innovative solutions that enhanced user experience and satisfaction',
        'Collaborated with stakeholders to deliver projects on time and within budget'
      ] : undefined
    },
    education: {
      paragraph: `Completed ${role || 'degree program'} at ${organization || 'the institution'}, gaining comprehensive knowledge in relevant coursework and developing strong analytical and problem-solving skills through academic projects and research.`
    },
    project: {
      paragraph: `Developed and delivered ${role || 'project'} for ${organization || 'client'}, demonstrating technical expertise and project management skills while ensuring quality deliverables and stakeholder satisfaction.`
    },
    certification: {
      paragraph: `Earned ${role || 'certification'} from ${organization || 'issuing organization'}, demonstrating commitment to professional development and expertise in industry-standard practices and methodologies.`
    },
    achievement: {
      paragraph: `Recognized for ${role || 'achievement'} by ${organization || 'the organization'}, highlighting exceptional performance and contribution to team success and organizational objectives.`
    }
  };

  return mockResponses[section] || mockResponses.experience;
}
