/**
 * Education section with multiple education blocks
 * Handles adding, removing, and editing education entries with AI assistance
 */

import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { useEditorStore } from '../../../store/useEditorStore';
import { uid } from '../../../lib/utils/ids';
import { Input, Textarea, Label, ErrorText, HelpText, FieldRow } from '../../ui/FormControls';
import { AiDescribe } from '../../ai/AiDescribe';

/**
 * Individual education block form
 * @param {Object} props
 * @param {Object} props.block - Education block data
 * @param {string} props.sectionId - Parent section ID
 * @param {number} props.index - Block index for display
 * @param {function} props.onDelete - Delete callback
 */
function EducationBlock({ block, sectionId, index, onDelete }) {
  const updateField = useEditorStore(state => state.updateField);

  const {
    register,
    watch,
    formState: { errors },
    setValue,
  } = useForm({
    defaultValues: {
      degree: block.fields.degree || '',
      school: block.fields.school || '',
      location: block.fields.location || '',
      startDate: block.fields.startDate || '',
      endDate: block.fields.endDate || '',
      gpa: block.fields.gpa || '',
      coursework: Array.isArray(block.fields.coursework) ? block.fields.coursework.join(', ') : '',
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
      
      // Handle coursework CSV conversion
      if (field === 'coursework') {
        processedValue = value ? value.split(',').map(s => s.trim()).filter(Boolean) : [];
      }

      if (JSON.stringify(processedValue) !== JSON.stringify(block.fields[field])) {
        updateField(sectionId, block.id, field, processedValue);
      }
    });
  }, [watchedFields, sectionId, block.id, updateField]);

  // Update form when store changes
  useEffect(() => {
    Object.entries(block.fields).forEach(([field, value]) => {
      if (field === 'coursework' && Array.isArray(value)) {
        setValue(field, value.join(', '), { shouldValidate: false, shouldDirty: false });
      } else {
        setValue(field, value, { shouldValidate: false, shouldDirty: false });
      }
    });
  }, [block.id, setValue]);

  return (
    <div className="border border-gray-200 rounded-lg p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-medium text-gray-900">
          Education #{index + 1}
        </h4>
        <button
          onClick={() => onDelete(block.id)}
          className="btn btn-ghost btn-sm text-red-600 hover:text-red-700 hover:bg-red-50"
          aria-label={`Delete education ${index + 1}`}
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FieldRow>
          <Label htmlFor={`degree-${block.id}`} required>
            Degree/Program
          </Label>
          <Input
            id={`degree-${block.id}`}
            placeholder="Bachelor of Science in Computer Science"
            error={!!errors.degree}
            {...register('degree', {
              required: 'Degree or program is required',
            })}
          />
          <ErrorText>{errors.degree?.message}</ErrorText>
        </FieldRow>

        <FieldRow>
          <Label htmlFor={`school-${block.id}`} required>
            School/Institution
          </Label>
          <Input
            id={`school-${block.id}`}
            placeholder="University of California, Berkeley"
            error={!!errors.school}
            {...register('school', {
              required: 'School is required',
            })}
          />
          <ErrorText>{errors.school?.message}</ErrorText>
        </FieldRow>
      </div>

      <FieldRow>
        <Label htmlFor={`location-${block.id}`}>
          Location
        </Label>
        <Input
          id={`location-${block.id}`}
          placeholder="Berkeley, CA"
          error={!!errors.location}
          {...register('location')}
        />
        <ErrorText>{errors.location?.message}</ErrorText>
      </FieldRow>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FieldRow>
          <Label htmlFor={`startDate-${block.id}`}>
            Start Date
          </Label>
          <Input
            id={`startDate-${block.id}`}
            placeholder="Aug 2018"
            error={!!errors.startDate}
            {...register('startDate')}
          />
          <ErrorText>{errors.startDate?.message}</ErrorText>
          <HelpText>Format: Aug 2018</HelpText>
        </FieldRow>

        <FieldRow>
          <Label htmlFor={`endDate-${block.id}`}>
            End Date
          </Label>
          <Input
            id={`endDate-${block.id}`}
            placeholder="May 2022"
            error={!!errors.endDate}
            {...register('endDate')}
          />
          <ErrorText>{errors.endDate?.message}</ErrorText>
          <HelpText>Format: May 2022 or Expected</HelpText>
        </FieldRow>

        <FieldRow>
          <Label htmlFor={`gpa-${block.id}`}>
            GPA (Optional)
          </Label>
          <Input
            id={`gpa-${block.id}`}
            placeholder="3.8"
            error={!!errors.gpa}
            {...register('gpa')}
          />
          <ErrorText>{errors.gpa?.message}</ErrorText>
        </FieldRow>
      </div>

      <FieldRow>
        <Label htmlFor={`coursework-${block.id}`}>
          Relevant Coursework
        </Label>
        <Input
          id={`coursework-${block.id}`}
          placeholder="Data Structures, Algorithms, Machine Learning"
          error={!!errors.coursework}
          {...register('coursework')}
        />
        <ErrorText>{errors.coursework?.message}</ErrorText>
        <HelpText>Separate courses with commas</HelpText>
      </FieldRow>

      <FieldRow>
        <div className="flex items-center justify-between">
          <Label htmlFor={`description-${block.id}`}>
            Description
          </Label>
          <AiDescribe
            context={{
              section: 'education',
              role: block.fields.degree,
              organization: block.fields.school,
              location: block.fields.location,
              start: block.fields.startDate,
              end: block.fields.endDate,
              skills: Array.isArray(block.fields.coursework) ? block.fields.coursework : [],
              style: 'concise',
              lang: 'en',
              wantBullets: false
            }}
            onApply={(result) => {
              // Apply paragraph to description field
              setValue('description', result.paragraph, { shouldDirty: true });
            }}
            size="sm"
            variant="ghost"
          />
        </div>
        <Textarea
          id={`description-${block.id}`}
          rows={3}
          placeholder="Focused on computer science fundamentals with emphasis on software engineering and data analysis..."
          error={!!errors.description}
          {...register('description')}
        />
        <ErrorText>{errors.description?.message}</ErrorText>
        <HelpText>Optional description of your academic focus or achievements. Tip: You can edit the generated text.</HelpText>
      </FieldRow>
    </div>
  );
}

/**
 * EducationSection component with multiple blocks
 */
export function EducationSection() {
  const doc = useEditorStore(state => state.doc);
  const addBlock = useEditorStore(state => state.addBlock);
  const removeBlock = useEditorStore(state => state.removeBlock);

  // Find education section or create it if it doesn't exist
  let educationSection = doc.sections.find(s => s.type === 'education');
  
  // If education section doesn't exist, we'll need to create it
  // For now, let's assume it exists or will be created by the store

  const handleAddEducation = () => {
    if (!educationSection) return;

    const newBlock = {
      id: uid('edu'),
      type: 'education',
      fields: {
        degree: '',
        school: '',
        location: '',
        startDate: '',
        endDate: '',
        gpa: '',
        coursework: [],
        description: '',
      },
    };

    addBlock(educationSection.id, newBlock);
  };

  const handleDeleteEducation = (blockId) => {
    if (!educationSection) return;
    removeBlock(educationSection.id, blockId);
  };

  if (!educationSection) {
    return (
      <div className="p-4 text-sm text-gray-500">
        Education section not found
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {educationSection.blocks.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p className="mb-4">No education entries yet</p>
          <button
            onClick={handleAddEducation}
            className="btn btn-primary btn-md"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Your First Education
          </button>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {educationSection.blocks.map((block, index) => (
              <EducationBlock
                key={block.id}
                block={block}
                sectionId={educationSection.id}
                index={index}
                onDelete={handleDeleteEducation}
              />
            ))}
          </div>

          <div className="pt-4 border-t border-gray-200">
            <button
              onClick={handleAddEducation}
              className="btn btn-secondary btn-md w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Another Education
            </button>
          </div>
        </>
      )}
    </div>
  );
}
