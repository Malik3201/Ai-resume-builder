/**
 * PreviewCanvas component - Resume preview with template rendering and print functionality
 * Renders templates with zoom controls and paper size options
 */

import { useState } from 'react';
import { ZoomIn, ZoomOut, Printer } from 'lucide-react';
import { ZOOM_LEVELS, DEFAULT_ZOOM_INDEX } from '../../lib/theme';
import { useEditorStore } from '../../store/useEditorStore';
import { Classic } from './templates/Classic';
import { Modern } from './templates/Modern';

/**
 * PreviewCanvas component with A4 page and zoom controls
 */
export function PreviewCanvas() {
  const [zoomIndex, setZoomIndex] = useState(DEFAULT_ZOOM_INDEX);
  const currentZoom = ZOOM_LEVELS[zoomIndex];
  const doc = useEditorStore(state => state.doc);
  const template = useEditorStore(state => state.template);
  const setTheme = useEditorStore(state => state.setTheme);

  // Paper size from theme or default to A4
  const paperSize = doc.theme?.layout?.paper || 'A4';

  const handleZoomIn = () => {
    if (zoomIndex < ZOOM_LEVELS.length - 1) {
      setZoomIndex(zoomIndex + 1);
    }
  };

  const handleZoomOut = () => {
    if (zoomIndex > 0) {
      setZoomIndex(zoomIndex - 1);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handlePaperSizeChange = (newSize) => {
    setTheme({
      layout: {
        ...doc.theme?.layout,
        paper: newSize,
      },
    });
  };

  // Paper dimensions
  const paperDimensions = {
    A4: { width: '210mm', minHeight: '297mm' },
    Letter: { width: '8.5in', minHeight: '11in' },
  };

  const currentDimensions = paperDimensions[paperSize];

  return (
    <div className="h-full flex flex-col bg-gray-100">
      {/* Toolbar */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 no-print">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Zoom Controls */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">Zoom:</span>
              <div className="flex items-center gap-1">
                <button
                  onClick={handleZoomOut}
                  disabled={zoomIndex === 0}
                  className="btn btn-ghost btn-sm"
                  aria-label="Zoom out"
                >
                  <ZoomOut className="h-4 w-4" />
                </button>
                <span className="text-sm font-medium text-gray-900 min-w-[4rem] text-center">
                  {Math.round(currentZoom * 100)}%
                </span>
                <button
                  onClick={handleZoomIn}
                  disabled={zoomIndex === ZOOM_LEVELS.length - 1}
                  className="btn btn-ghost btn-sm"
                  aria-label="Zoom in"
                >
                  <ZoomIn className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Paper Size Toggle */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">Paper:</span>
              <select
                value={paperSize}
                onChange={(e) => handlePaperSizeChange(e.target.value)}
                className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                aria-label="Select paper size"
              >
                <option value="A4">A4</option>
                <option value="Letter">Letter</option>
              </select>
            </div>
          </div>
          
          <button
            onClick={handlePrint}
            className="btn btn-primary btn-md"
          >
            <Printer className="h-4 w-4 mr-2" />
            Print / Save PDF
          </button>
        </div>
      </div>

      {/* Canvas */}
      <div className="flex-1 overflow-auto p-4 lg:p-8">
        <div className="flex justify-center">
          <div
            className={`page bg-white print-no-shadow border border-gray-200 transition-transform duration-200 ${
              paperSize === 'A4' ? 'paper-a4' : 'paper-letter'
            }`}
            style={{
              width: currentDimensions.width,
              minHeight: currentDimensions.minHeight,
              transform: `scale(${currentZoom})`,
              transformOrigin: 'top left',
              marginBottom: `${(1 - currentZoom) * (paperSize === 'A4' ? 297 : 11 * 25.4) * 3.78}px`, // Adjust bottom margin for scaling
              boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
            }}
          >
            {/* Template Content */}
            <div className="p-12 h-full">
              {template === 'modern' ? (
                <Modern doc={doc} />
              ) : (
                <Classic doc={doc} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
