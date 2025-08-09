/**
 * Summary section form for professional summary
 * Handles a single textarea with character limit
 */

import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import { useEditorStore } from '../../../store/useEditorStore';
import { Textarea, Label, ErrorText, HelpText, FieldRow } from '../../ui/FormControls';

const MAX_LENGTH = 500;

/**
 * SummarySection component with character limit
 */
export function SummarySection() {
  const doc = useEditorStore(state => state.doc);
  const updateField = useEditorStore(state => state.updateField);

  // Find summary section and block
  const summarySection = doc.sections.find(s => s.type === 'summary');
  const summaryBlock = summarySection?.blocks.find(b => b.type === 'summary');
  
  const {
    register,
    watch,
    formState: { errors },
    setValue,
  } = useForm({
    defaultValues: {
      content: summaryBlock?.fields.content || '',
    },
    mode: 'onChange',
  });

  // Watch content field for instant updates
  const content = watch('content');

  // Update store whenever form values change
  useEffect(() => {
    if (!summarySection || !summaryBlock) return;

    if (content !== summaryBlock.fields.content) {
      updateField(summarySection.id, summaryBlock.id, 'content', content);
    }
  }, [content, summarySection?.id, summaryBlock?.id, updateField]);

  // Update form when store changes (for external updates)
  useEffect(() => {
    if (!summaryBlock) return;

    setValue('content', summaryBlock.fields.content, { shouldValidate: false, shouldDirty: false });
  }, [summaryBlock?.id, setValue]); // Only depend on block ID to avoid infinite loops

  if (!summarySection || !summaryBlock) {
    return (
      <div className="p-4 text-sm text-gray-500">
        Summary section not found
      </div>
    );
  }

  const characterCount = content?.length || 0;
  const isNearLimit = characterCount > MAX_LENGTH * 0.8;
  const isOverLimit = characterCount > MAX_LENGTH;

  return (
    <div className="space-y-4">
      <FieldRow>
        <Label htmlFor="summary-content">
          Professional Summary
        </Label>
        <Textarea
          id="summary-content"
          rows={4}
          placeholder="Experienced professional with expertise in..."
          error={!!errors.content}
          {...register('content', {
            maxLength: {
              value: MAX_LENGTH,
              message: `Summary must be ${MAX_LENGTH} characters or less`,
            },
          })}
        />
        <div className="flex justify-between items-center">
          <ErrorText>{errors.content?.message}</ErrorText>
          <div className={`text-sm ${
            isOverLimit 
              ? 'text-red-600' 
              : isNearLimit 
                ? 'text-yellow-600' 
                : 'text-gray-500'
          }`}>
            {characterCount}/{MAX_LENGTH}
          </div>
        </div>
        <HelpText>
          Write a compelling summary that highlights your key skills and experience.
        </HelpText>
      </FieldRow>
    </div>
  );
}
