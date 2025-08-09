/**
 * Print page for PDF generation
 * Renders resume templates in isolation without UI chrome for clean PDF export
 */

import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Classic } from '../../components/preview/templates/Classic';
import { Modern } from '../../components/preview/templates/Modern';

/**
 * Print page component for PDF generation
 * Reads document data from URL parameters and renders the appropriate template
 */
export function PrintPage() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const [doc, setDoc] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      // Get document data from query parameter
      const dataParam = searchParams.get('data');
      
      if (!dataParam) {
        throw new Error('No document data provided');
      }

      // Decode base64 document data
      const docJson = atob(decodeURIComponent(dataParam));
      const parsedDoc = JSON.parse(docJson);
      
      // Validate document structure
      if (!parsedDoc.id || !Array.isArray(parsedDoc.sections)) {
        throw new Error('Invalid document structure');
      }
      
      setDoc(parsedDoc);
      setLoading(false);
      
      // Set page title for PDF filename
      const headerSection = parsedDoc.sections.find(s => s.type === 'header');
      const headerBlock = headerSection?.blocks.find(b => b.type === 'header');
      const name = headerBlock?.fields?.name || 'Resume';
      document.title = `${name} - Resume`;
      
    } catch (err) {
      console.error('Error loading document:', err);
      setError(err.message);
      setLoading(false);
    }
  }, [searchParams]);

  // Apply print-specific styles
  useEffect(() => {
    if (!doc) return;

    // Apply CSS variables for theme
    const theme = doc.theme || {};
    const root = document.documentElement;
    
    if (theme.fontFamily) {
      root.style.setProperty('--font-family', theme.fontFamily);
    }
    if (theme.fontScale) {
      root.style.setProperty('--font-scale', theme.fontScale.toString());
    }
    if (theme.colors?.accent) {
      root.style.setProperty('--accent', theme.colors.accent);
    }
    if (theme.lineHeight) {
      root.style.setProperty('--line-height', theme.lineHeight.toString());
    }

    // Set paper size class on body
    const paperSize = theme.layout?.paper || 'A4';
    document.body.className = `print-page paper-${paperSize.toLowerCase()}`;
    
    return () => {
      // Cleanup
      document.body.className = '';
    };
  }, [doc]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading resume...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="text-center">
          <p className="text-red-600 mb-2">Error loading resume</p>
          <p className="text-gray-500 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  if (!doc) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <p className="text-gray-500">No document data</p>
      </div>
    );
  }

  // Determine template to use
  const template = doc.template || 'classic';
  const theme = doc.theme || {};
  const paperSize = theme.layout?.paper || 'A4';
  
  // Paper dimensions
  const paperDimensions = {
    A4: { width: '210mm', minHeight: '297mm' },
    Letter: { width: '8.5in', minHeight: '11in' },
  };
  
  const dimensions = paperDimensions[paperSize];

  return (
    <div className="print-container bg-white">
      <div 
        className={`print-page-content mx-auto bg-white ${paperSize === 'A4' ? 'paper-a4' : 'paper-letter'}`}
        style={{
          width: dimensions.width,
          minHeight: dimensions.minHeight,
          padding: '48px', // 12mm equivalent
        }}
      >
        {template === 'modern' ? (
          <Modern doc={doc} />
        ) : (
          <Classic doc={doc} />
        )}
      </div>
    </div>
  );
}
