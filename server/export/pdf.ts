/**
 * PDF export functionality using Playwright
 * Generates ATS-friendly PDFs from resume HTML with proper font embedding
 */

import { chromium } from 'playwright';

/**
 * @typedef {Object} ResumeDoc
 * @property {string} id - Document ID
 * @property {Object} theme - Theme configuration
 * @property {Object} theme.layout - Layout settings
 * @property {string} theme.layout.paper - Paper size ('A4' or 'Letter')
 * @property {Array} sections - Resume sections
 */

/**
 * Export resume document as PDF using Playwright
 * @param {ResumeDoc} doc - Resume document to export
 * @param {string} [vitePort='5176'] - Vite development server port
 * @returns {Promise<Buffer>} PDF buffer
 */
export async function exportPdf(doc, vitePort = '5176') {
  const browser = await chromium.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--no-first-run',
      '--no-zygote',
      '--disable-gpu'
    ]
  });

  try {
    const page = await browser.newPage();
    
    // Set viewport for consistent rendering
    await page.setViewportSize({ width: 1200, height: 1600 });
    
    // Encode document data as base64 for URL parameter
    const docData = Buffer.from(JSON.stringify(doc)).toString('base64');
    const printUrl = `http://localhost:${vitePort}/print/${doc.id}?data=${encodeURIComponent(docData)}`;
    
    console.log('Navigating to:', printUrl);
    
    // Navigate to print page
    await page.goto(printUrl, { 
      waitUntil: 'networkidle',
      timeout: 30000 
    });
    
    // Wait for fonts to load
    await page.waitForFunction(() => document.fonts.ready);
    
    // Additional wait for any dynamic content
    await page.waitForTimeout(1000);
    
    // Determine paper format and dimensions
    const paperSize = doc.theme?.layout?.paper || 'A4';
    let pdfOptions;
    
    if (paperSize === 'Letter') {
      pdfOptions = {
        format: 'Letter',
        width: '8.5in',
        height: '11in',
        margin: {
          top: '0.5in',
          right: '0.5in',
          bottom: '0.5in',
          left: '0.5in'
        }
      };
    } else {
      pdfOptions = {
        format: 'A4',
        margin: {
          top: '12mm',
          right: '12mm',
          bottom: '12mm',
          left: '12mm'
        }
      };
    }
    
    // Generate PDF with high quality settings
    const pdfBuffer = await page.pdf({
      ...pdfOptions,
      printBackground: true,
      preferCSSPageSize: false,
      displayHeaderFooter: false,
      scale: 1
    });
    
    console.log('PDF generated successfully, size:', pdfBuffer.length, 'bytes');
    return pdfBuffer;
    
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error(`PDF generation failed: ${error.message}`);
  } finally {
    await browser.close();
  }
}

/**
 * Validate resume document structure
 * @param {any} doc - Document to validate
 * @returns {boolean} True if valid
 */
export function validateResumeDoc(doc) {
  if (!doc || typeof doc !== 'object') {
    return false;
  }
  
  if (!doc.id || typeof doc.id !== 'string') {
    return false;
  }
  
  if (!Array.isArray(doc.sections)) {
    return false;
  }
  
  return true;
}
