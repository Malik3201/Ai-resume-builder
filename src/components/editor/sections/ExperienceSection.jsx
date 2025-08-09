/**
 * Experience section with multiple experience blocks
 * Handles adding, removing, and editing experience entries
 */

import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { useEditorStore } from '../../../store/useEditorStore';
import { uid } from '../../../lib/utils/ids';
import { Input, Textarea, Label, ErrorText, HelpText, FieldRow } from '../../ui/FormControls';

/**
 * Individual experience block form
 * @param {Object} props
 * @param {Object} props.block - Experience block data
 * @param {string} props.sectionId - Parent section ID
 * @param {number} props.index - Block index for display
 * @param {function} props.onDelete - Delete callback
 */
function ExperienceBlock({ block, sectionId, index, onDelete }) {
  const updateField = useEditorStore(state => state.updateField);

  const {
    register,
    watch,
    formState: { errors },
    setValue,
  } = useForm({
    defaultValues: {
      role: block.fields.role || '',
      company: block.fields.company || '',
      location: block.fields.location || '',
      startDate: block.fields.startDate || '',
      endDate: block.fields.endDate || '',
      skills: Array.isArray(block.fields.skills) ? block.fields.skills.join(', ') : '',
      description: block.fields.description || '',
    },
    mode: 'onChange',
  });

  // Watch all fields for instant updates
  const watchedFields = watch();

  // Update store whenever form values change
  useEffect(() => {
    Object.entries(watchedFields).forEach(([field, value]) => {
      let processedValue = value;
      
      // Handle skills CSV conversion
      if (field === 'skills') {
        processedValue = value ? value.split(',').map(s => s.trim()).filter(Boolean) : [];
      }
      
      // Handle highlights conversion from description
      if (field === 'description') {
        const highlights = value ? value.split('\n').filter(line => line.trim()) : [];
        if (JSON.stringify(highlights) !== JSON.stringify(block.fields.highlights)) {
          updateField(sectionId, block.id, 'highlights', highlights);
        }
      }

      if (JSON.stringify(processedValue) !== JSON.stringify(block.fields[field])) {
        updateField(sectionId, block.id, field, processedValue);
      }
    });
  }, [watchedFields, sectionId, block.id, updateField]);

  // Update form when store changes
  useEffect(() => {
    Object.entries(block.fields).forEach(([field, value]) => {
      if (field === 'skills' && Array.isArray(value)) {
        setValue(field, value.join(', '), { shouldValidate: false, shouldDirty: false });
      } else if (field === 'highlights' && Array.isArray(value)) {
        setValue('description', value.join('\n'), { shouldValidate: false, shouldDirty: false });
      } else {
        setValue(field, value, { shouldValidate: false, shouldDirty: false });
      }
    });
  }, [block.id, setValue]); // Only depend on block ID to avoid infinite loops

  return (
    <div className="border border-gray-200 rounded-lg p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-medium text-gray-900">
          Experience #{index + 1}
        </h4>
        <button
          onClick={() => onDelete(block.id)}
          className="btn btn-ghost btn-sm text-red-600 hover:text-red-700 hover:bg-red-50"
          aria-label={`Delete experience ${index + 1}`}
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FieldRow>
          <Label htmlFor={`role-${block.id}`} required>
            Job Title
          </Label>
          <Input
            id={`role-${block.id}`}
            placeholder="Frontend Engineer"
            error={!!errors.role}
            {...register('role', {
              required: 'Job title is required',
            })}
          />
          <ErrorText>{errors.role?.message}</ErrorText>
        </FieldRow>

        <FieldRow>
          <Label htmlFor={`company-${block.id}`} required>
            Company
          </Label>
          <Input
            id={`company-${block.id}`}
            placeholder="TechCorp Solutions"
            error={!!errors.company}
            {...register('company', {
              required: 'Company is required',
            })}
          />
          <ErrorText>{errors.company?.message}</ErrorText>
        </FieldRow>
      </div>

      <FieldRow>
        <Label htmlFor={`location-${block.id}`}>
          Location
        </Label>
        <Input
          id={`location-${block.id}`}
          placeholder="San Francisco, CA"
          error={!!errors.location}
          {...register('location')}
        />
        <ErrorText>{errors.location?.message}</ErrorText>
      </FieldRow>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FieldRow>
          <Label htmlFor={`startDate-${block.id}`} required>
            Start Date
          </Label>
          <Input
            id={`startDate-${block.id}`}
            placeholder="Jan 2020"
            error={!!errors.startDate}
            {...register('startDate', {
              required: 'Start date is required',
            })}
          />
          <ErrorText>{errors.startDate?.message}</ErrorText>
          <HelpText>Format: Jan 2023</HelpText>
        </FieldRow>

        <FieldRow>
          <Label htmlFor={`endDate-${block.id}`} required>
            End Date
          </Label>
          <Input
            id={`endDate-${block.id}`}
            placeholder="Present"
            error={!!errors.endDate}
            {...register('endDate', {
              required: 'End date is required',
            })}
          />
          <ErrorText>{errors.endDate?.message}</ErrorText>
          <HelpText>Format: Dec 2023 or Present</HelpText>
        </FieldRow>
      </div>

      <FieldRow>
        <Label htmlFor={`skills-${block.id}`}>
          Skills Used
        </Label>
        <Input
          id={`skills-${block.id}`}
          placeholder="React, TypeScript, Node.js"
          error={!!errors.skills}
          {...register('skills')}
        />
        <ErrorText>{errors.skills?.message}</ErrorText>
        <HelpText>Separate skills with commas</HelpText>
      </FieldRow>

      <FieldRow>
        <Label htmlFor={`description-${block.id}`}>
          Key Achievements
        </Label>
        <Textarea
          id={`description-${block.id}`}
          rows={4}
          placeholder="Led development of microservices architecture&#10;Reduced system latency by 40%&#10;Mentored 5 junior developers"
          error={!!errors.description}
          {...register('description')}
        />
        <ErrorText>{errors.description?.message}</ErrorText>
        <HelpText>Each line will become a bullet point</HelpText>
      </FieldRow>
    </div>
  );
}

/**
 * ExperienceSection component with multiple blocks
 */
export function ExperienceSection() {
  const doc = useEditorStore(state => state.doc);
  const addBlock = useEditorStore(state => state.addBlock);
  const removeBlock = useEditorStore(state => state.removeBlock);

  // Find experience section
  const experienceSection = doc.sections.find(s => s.type === 'experience');

  const handleAddExperience = () => {
    if (!experienceSection) return;

    const newBlock = {
      id: uid('exp'),
      type: 'experience',
      fields: {
        role: '',
        company: '',
        location: '',
        startDate: '',
        endDate: '',
        highlights: [],
        description: '',
        skills: [],
      },
    };

    addBlock(experienceSection.id, newBlock);
  };

  const handleDeleteExperience = (blockId) => {
    if (!experienceSection) return;
    removeBlock(experienceSection.id, blockId);
  };

  if (!experienceSection) {
    return (
      <div className="p-4 text-sm text-gray-500">
        Experience section not found
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {experienceSection.blocks.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p className="mb-4">No experience entries yet</p>
          <button
            onClick={handleAddExperience}
            className="btn btn-primary btn-md"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Your First Experience
          </button>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {experienceSection.blocks.map((block, index) => (
              <ExperienceBlock
                key={block.id}
                block={block}
                sectionId={experienceSection.id}
                index={index}
                onDelete={handleDeleteExperience}
              />
            ))}
          </div>

          <div className="pt-4 border-t border-gray-200">
            <button
              onClick={handleAddExperience}
              className="btn btn-secondary btn-md w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Another Experience
            </button>
          </div>
        </>
      )}
    </div>
  );
}
