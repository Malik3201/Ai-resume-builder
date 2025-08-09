/**
 * Header section form for personal information
 * Handles name, title, email, phone, and location fields with validation
 */

import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import { useEditorStore } from '../../../store/useEditorStore';
import { Input, Label, ErrorText, FieldRow } from '../../ui/FormControls';

/**
 * HeaderSection component with form validation
 */
export function HeaderSection() {
  const doc = useEditorStore(state => state.doc);
  const updateField = useEditorStore(state => state.updateField);

  // Find header section and block
  const headerSection = doc.sections.find(s => s.type === 'header');
  const headerBlock = headerSection?.blocks.find(b => b.type === 'header');
  
  const {
    register,
    watch,
    formState: { errors },
    setValue,
  } = useForm({
    defaultValues: {
      name: headerBlock?.fields.name || '',
      title: headerBlock?.fields.title || '',
      email: headerBlock?.fields.email || '',
      phone: headerBlock?.fields.phone || '',
      location: headerBlock?.fields.location || '',
      linkedin: headerBlock?.fields.linkedin || '',
      website: headerBlock?.fields.website || '',
    },
    mode: 'onChange',
  });

  // Watch all fields for instant updates
  const watchedFields = watch();

  // Update store whenever form values change
  useEffect(() => {
    if (!headerSection || !headerBlock) return;

    Object.entries(watchedFields).forEach(([field, value]) => {
      const currentValue = headerBlock.fields[field];
      if (value !== currentValue && value !== '') { // Only update if different and not empty
        updateField(headerSection.id, headerBlock.id, field, value);
      }
    });
  }, [watchedFields, headerSection?.id, headerBlock?.id, updateField]);

  // Update form when store changes (for external updates)
  useEffect(() => {
    if (!headerBlock) return;

    Object.entries(headerBlock.fields).forEach(([field, value]) => {
      setValue(field, value, { shouldValidate: false, shouldDirty: false });
    });
  }, [headerBlock?.id, setValue]); // Only depend on block ID to avoid infinite loops

  if (!headerSection || !headerBlock) {
    return (
      <div className="p-4 text-sm text-gray-500">
        Header section not found
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <FieldRow>
        <Label htmlFor="name" required>
          Full Name
        </Label>
        <Input
          id="name"
          placeholder="John Anderson"
          error={!!errors.name}
          {...register('name', {
            required: 'Name is required',
            minLength: {
              value: 2,
              message: 'Name must be at least 2 characters',
            },
          })}
        />
        <ErrorText>{errors.name?.message}</ErrorText>
      </FieldRow>

      <FieldRow>
        <Label htmlFor="title" required>
          Professional Title
        </Label>
        <Input
          id="title"
          placeholder="Senior Software Engineer"
          error={!!errors.title}
          {...register('title', {
            required: 'Professional title is required',
          })}
        />
        <ErrorText>{errors.title?.message}</ErrorText>
      </FieldRow>

      <FieldRow>
        <Label htmlFor="email" required>
          Email Address
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="john.anderson@email.com"
          error={!!errors.email}
          {...register('email', {
            required: 'Email is required',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Invalid email address',
            },
          })}
        />
        <ErrorText>{errors.email?.message}</ErrorText>
      </FieldRow>

      <FieldRow>
        <Label htmlFor="phone">
          Phone Number
        </Label>
        <Input
          id="phone"
          placeholder="+1 (555) 123-4567"
          error={!!errors.phone}
          {...register('phone')}
        />
        <ErrorText>{errors.phone?.message}</ErrorText>
      </FieldRow>

      <FieldRow>
        <Label htmlFor="location">
          Location
        </Label>
        <Input
          id="location"
          placeholder="San Francisco, CA"
          error={!!errors.location}
          {...register('location')}
        />
        <ErrorText>{errors.location?.message}</ErrorText>
      </FieldRow>

      <FieldRow>
        <Label htmlFor="linkedin">
          LinkedIn
        </Label>
        <Input
          id="linkedin"
          placeholder="linkedin.com/in/johnanderson"
          error={!!errors.linkedin}
          {...register('linkedin')}
        />
        <ErrorText>{errors.linkedin?.message}</ErrorText>
      </FieldRow>

      <FieldRow>
        <Label htmlFor="website">
          Website
        </Label>
        <Input
          id="website"
          placeholder="https://johnanderson.dev"
          error={!!errors.website}
          {...register('website')}
        />
        <ErrorText>{errors.website?.message}</ErrorText>
      </FieldRow>
    </div>
  );
}
