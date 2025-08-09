/**
 * Select component - Styled dropdown select with accessibility
 * Provides consistent styling for select inputs across the application
 */

import { ChevronDown } from 'lucide-react';
import { Label, ErrorText, FieldRow } from './FormControls';

/**
 * Select component
 * @param {Object} props
 * @param {string} props.label - Select label
 * @param {string} props.value - Current selected value
 * @param {function} props.onChange - Change handler
 * @param {Array<{value: string, label: string}>} props.options - Select options
 * @param {string} [props.id] - Select ID
 * @param {boolean} [props.required] - Whether field is required
 * @param {string} [props.error] - Error message
 * @param {string} [props.placeholder] - Placeholder text
 */
export function Select({ label, value, onChange, options, id, required, error, placeholder }) {
  return (
    <FieldRow>
      <Label htmlFor={id} required={required}>
        {label}
      </Label>
      <div className="relative">
        <select
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`input pr-10 appearance-none cursor-pointer ${error ? 'border-red-500 focus:ring-red-500' : ''}`}
          aria-invalid={!!error}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <ChevronDown className="h-4 w-4 text-gray-400" />
        </div>
      </div>
      <ErrorText>{error}</ErrorText>
    </FieldRow>
  );
}
