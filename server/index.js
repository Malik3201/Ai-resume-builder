/**
 * Express server for AI Resume Builder
 * Provides PDF export functionality via Playwright
 */

import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
// import { exportPdf, validateResumeDoc } from './export/pdf.js';
import { geminiDescribe, validateGeminiInput } from './ai/gemini.js';

const app = express();
const PORT = 8787;

// Rate limiting for AI endpoint
const aiRateLimit = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 30, // limit each IP to 30 requests per windowMs
  message: { error: 'Too many AI requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// AI describe endpoint
app.post('/api/ai/describe', aiRateLimit, async (req, res) => {
  try {
    const input = req.body;
    
    // Validate input
    if (!validateGeminiInput(input)) {
      return res.status(400).json({ 
        ok: false, 
        error: 'Invalid input. Section is required and must be one of: experience, education, project, certification, achievement' 
      });
    }

    // Check for required fields based on section
    if (input.section === 'experience' && !input.role && !input.organization) {
      return res.status(400).json({ 
        ok: false, 
        error: 'Role or organization is required for experience descriptions' 
      });
    }

    if (input.section === 'education' && !input.role && !input.organization) {
      return res.status(400).json({ 
        ok: false, 
        error: 'Degree/program or school is required for education descriptions' 
      });
    }

    console.log('Generating AI description for:', input.section, input.role || input.organization);

    // Generate content with Gemini
    const result = await geminiDescribe(input);

    res.json({
      ok: true,
      paragraph: result.paragraph,
      bullets: result.bullets || null
    });

  } catch (error) {
    console.error('AI describe error:', error);
    
    // Return appropriate error message
    if (error.message.includes('GEMINI_API_KEY')) {
      res.status(500).json({ 
        ok: false, 
        error: 'AI service is not configured. Please contact support.' 
      });
    } else if (error.message.includes('Gemini API error')) {
      res.status(502).json({ 
        ok: false, 
        error: 'AI service temporarily unavailable. Please try again.' 
      });
    } else {
      res.status(500).json({ 
        ok: false, 
        error: 'Failed to generate description. Please try again.' 
      });
    }
  }
});

// PDF export endpoints disabled for AI-only implementation
// TODO: Re-enable when PDF functionality is needed

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Server error:', error);
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Resume Builder Server running on http://localhost:${PORT}`);
  console.log(`PDF export endpoint: http://localhost:${PORT}/api/export/pdf`);
});

export default app;
