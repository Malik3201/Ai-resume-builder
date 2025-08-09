/**
 * AiDescribe component - AI-powered description generation button
 * Provides a small, attractive button to auto-fill content with AI
 */

import { useState } from 'react';
import { Sparkles, Check, X } from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog';
import { useAiDescribe } from '../../hooks/useAiDescribe';
import { Button } from '../ui/Button';

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
 * AiDescribe button component
 * @param {Object} props
 * @param {AiDescribeContext} props.context - Context for AI generation
 * @param {function(AiDescribeResult): void} props.onApply - Callback when result is applied
 * @param {'sm'|'md'} [props.size='sm'] - Button size
 * @param {'ghost'|'outline'} [props.variant='ghost'] - Button variant
 * @param {boolean} [props.showPreview=true] - Whether to show preview dialog
 */
export function AiDescribe({ 
  context, 
  onApply, 
  size = 'sm', 
  variant = 'ghost',
  showPreview = true 
}) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [previewData, setPreviewData] = useState(null);
  const { describe, loading, error, reset } = useAiDescribe();

  const handleGenerate = async () => {
    try {
      reset();
      const result = await describe(context);
      
      if (showPreview) {
        setPreviewData(result);
        setDialogOpen(true);
      } else {
        // Direct apply without preview
        onApply(result);
      }
    } catch (err) {
      // Error is handled by the hook
      console.error('AI generation failed:', err);
    }
  };

  const handleApply = () => {
    if (previewData) {
      onApply(previewData);
      setDialogOpen(false);
      setPreviewData(null);
      reset();
    }
  };

  const handleCancel = () => {
    setDialogOpen(false);
    setPreviewData(null);
    reset();
  };

  // Check if we have enough context to generate
  const hasMinimumContext = context.role || context.organization;

  return (
    <>
      <Button
        variant={variant}
        size={size}
        onClick={handleGenerate}
        disabled={loading || !hasMinimumContext}
        loading={loading}
        className="text-purple-600 hover:text-purple-700 hover:bg-purple-50"
        aria-label="Generate description with AI"
        title={hasMinimumContext ? "Generate with AI" : "Fill in role or organization first"}
      >
        <Sparkles className="h-4 w-4 mr-1" />
        AI
      </Button>

      {/* Error display */}
      {error && (
        <div className="mt-2 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Preview Dialog */}
      {showPreview && (
        <Dialog.Root open={dialogOpen} onOpenChange={setDialogOpen}>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 bg-black/50 z-40" />
            <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-lg p-6 w-full max-w-md z-50 focus:outline-none">
              <Dialog.Title className="text-lg font-semibold text-gray-900 mb-4">
                AI Generated Description
              </Dialog.Title>

              {previewData && (
                <div className="space-y-4">
                  {/* Paragraph Preview */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Description:</h4>
                    <div className="p-3 bg-gray-50 rounded border text-sm text-gray-800 leading-relaxed">
                      {previewData.paragraph}
                    </div>
                  </div>

                  {/* Bullets Preview (if available) */}
                  {previewData.bullets && previewData.bullets.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Key Highlights:</h4>
                      <div className="p-3 bg-gray-50 rounded border">
                        <ul className="text-sm text-gray-800 space-y-1">
                          {previewData.bullets.map((bullet, index) => (
                            <li key={index} className="flex items-start">
                              <span className="text-gray-400 mr-2">•</span>
                              {bullet}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}

                  <p className="text-xs text-gray-500">
                    You can edit this content after applying it.
                  </p>
                </div>
              )}

              {/* Dialog Actions */}
              <div className="flex justify-end gap-3 mt-6">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCancel}
                >
                  <X className="h-4 w-4 mr-1" />
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleApply}
                  disabled={!previewData}
                >
                  <Check className="h-4 w-4 mr-1" />
                  Apply
                </Button>
              </div>

              <Dialog.Close asChild>
                <button
                  className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                  aria-label="Close"
                >
                  <X className="h-4 w-4" />
                </button>
              </Dialog.Close>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      )}
    </>
  );
}
