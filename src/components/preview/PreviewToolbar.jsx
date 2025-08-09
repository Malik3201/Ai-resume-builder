/**
 * PreviewToolbar component - Toolbar for preview controls and export functions
 * Provides zoom controls, paper size toggle, print, and PDF download functionality
 */

import { ZoomIn, ZoomOut, Printer, Download } from 'lucide-react';
import { useEditorStore } from '../../store/useEditorStore';

/**
 * PreviewToolbar component
 * @param {Object} props
 * @param {number} props.zoomIndex - Current zoom level index
 * @param {function} props.onZoomIn - Zoom in handler
 * @param {function} props.onZoomOut - Zoom out handler
 * @param {Array} props.zoomLevels - Available zoom levels
 * @param {string} props.paperSize - Current paper size
 * @param {function} props.onPaperSizeChange - Paper size change handler
 */
export function PreviewToolbar({ 
  zoomIndex, 
  onZoomIn, 
  onZoomOut, 
  zoomLevels, 
  paperSize, 
  onPaperSizeChange 
}) {
  const doc = useEditorStore(state => state.doc);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPdf = async () => {
    try {
      // Show loading state
      const button = document.getElementById('download-pdf-btn');
      if (button) {
        button.disabled = true;
        button.textContent = 'Generating...';
      }

      // Encode document data as base64 (browser-compatible)
      const docData = btoa(JSON.stringify(doc));
      const exportUrl = `/api/export/pdf?data=${encodeURIComponent(docData)}`;
      
      // Create a temporary link to trigger download
      const link = document.createElement('a');
      link.href = exportUrl;
      link.download = `${doc.sections?.find(s => s.type === 'header')?.blocks?.[0]?.fields?.name || 'resume'}_resume.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
    } catch (error) {
      console.error('Error downloading PDF:', error);
      alert('Failed to download PDF. Please try again.');
    } finally {
      // Reset button state
      const button = document.getElementById('download-pdf-btn');
      if (button) {
        button.disabled = false;
        button.innerHTML = '<svg class="h-4 w-4 mr-2">...</svg>Download PDF';
      }
    }
  };

  const currentZoom = zoomLevels[zoomIndex];

  return (
    <div className="bg-white border-b border-gray-200 px-4 py-3 no-print">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Zoom Controls */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">Zoom:</span>
            <div className="flex items-center gap-1">
              <button
                onClick={onZoomOut}
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
                onClick={onZoomIn}
                disabled={zoomIndex === zoomLevels.length - 1}
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
              onChange={(e) => onPaperSizeChange(e.target.value)}
              className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
              aria-label="Select paper size"
            >
              <option value="A4">A4</option>
              <option value="Letter">Letter</option>
            </select>
          </div>
        </div>
        
        {/* Export Actions */}
        <div className="flex items-center gap-2">
          <button
            id="download-pdf-btn"
            onClick={handleDownloadPdf}
            className="btn btn-secondary btn-md"
            title="Download as PDF"
          >
            <Download className="h-4 w-4 mr-2" />
            Download PDF
          </button>
          
          <button
            onClick={handlePrint}
            className="btn btn-primary btn-md"
          >
            <Printer className="h-4 w-4 mr-2" />
            Print / Save PDF
          </button>
        </div>
      </div>
    </div>
  );
}
