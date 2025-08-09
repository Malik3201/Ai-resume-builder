/**
 * NumberInput component - Styled number input with min/max/step support
 * Provides consistent styling for numeric inputs with validation
 */

import { Label, ErrorText, HelpText, FieldRow } from './FormControls';

/**
 * NumberInput component
 * @param {Object} props
 * @param {string} props.label - Input label
 * @param {number} props.value - Current numeric value
 * @param {function} props.onChange - Change handler
 * @param {number} [props.min] - Minimum value
 * @param {number} [props.max] - Maximum value
 * @param {number} [props.step] - Step increment
 * @param {string} [props.id] - Input ID
 * @param {boolean} [props.required] - Whether field is required
 * @param {string} [props.error] - Error message
 * @param {string} [props.help] - Help text
 * @param {string} [props.unit] - Unit to display (e.g., "px", "%")
 */
export function NumberInput({ 
  label, 
  value, 
  onChange, 
  min, 
  max, 
  step = 1, 
  id, 
  required, 
  error, 
  help,
  unit 
}) {
  const handleChange = (e) => {
    const numValue = parseFloat(e.target.value);
    if (!isNaN(numValue)) {
      onChange(numValue);
    }
  };

  return (
    <FieldRow>
      <Label htmlFor={id} required={required}>
        {label}
      </Label>
      <div className="relative">
        <input
          type="number"
          id={id}
          value={value}
          onChange={handleChange}
          min={min}
          max={max}
          step={step}
          className={`input ${unit ? 'pr-12' : ''} ${error ? 'border-red-500 focus:ring-red-500' : ''}`}
          aria-invalid={!!error}
        />
        {unit && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <span className="text-sm text-gray-500">{unit}</span>
          </div>
        )}
      </div>
      <ErrorText>{error}</ErrorText>
      <HelpText>{help}</HelpText>
    </FieldRow>
  );
}
