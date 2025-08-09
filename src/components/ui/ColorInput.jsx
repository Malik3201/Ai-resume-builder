/**
 * ColorInput component - Color picker with hex input field
 * Provides both visual color picker and text input for hex values
 */

import { useState, useEffect } from 'react';
import { Label, ErrorText, FieldRow } from './FormControls';

/**
 * ColorInput component
 * @param {Object} props
 * @param {string} props.label - Input label
 * @param {string} props.value - Current hex color value
 * @param {function} props.onChange - Change handler
 * @param {string} [props.id] - Input ID
 * @param {boolean} [props.required] - Whether field is required
 * @param {string} [props.error] - Error message
 */
export function ColorInput({ label, value, onChange, id, required, error }) {
  const [hexValue, setHexValue] = useState(value || '#000000');

  // Sync with external value changes
  useEffect(() => {
    if (value && value !== hexValue) {
      setHexValue(value);
    }
  }, [value]);

  const handleColorChange = (newColor) => {
    setHexValue(newColor);
    onChange(newColor);
  };

  const handleHexChange = (e) => {
    const newHex = e.target.value;
    setHexValue(newHex);
    
    // Validate hex format before calling onChange
    if (/^#[0-9A-F]{6}$/i.test(newHex)) {
      onChange(newHex);
    }
  };

  return (
    <FieldRow>
      <Label htmlFor={id} required={required}>
        {label}
      </Label>
      <div className="flex gap-2">
        <div className="relative">
          <input
            type="color"
            value={hexValue}
            onChange={(e) => handleColorChange(e.target.value)}
            className="w-12 h-10 rounded border border-gray-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
            aria-label={`${label} color picker`}
          />
        </div>
        <input
          type="text"
          id={id}
          value={hexValue}
          onChange={handleHexChange}
          placeholder="#000000"
          className={`input flex-1 font-mono text-sm ${error ? 'border-red-500 focus:ring-red-500' : ''}`}
          pattern="^#[0-9A-Fa-f]{6}$"
          maxLength={7}
          aria-invalid={!!error}
        />
      </div>
      <ErrorText>{error}</ErrorText>
    </FieldRow>
  );
}
