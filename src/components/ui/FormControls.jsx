/**
 * Reusable form controls with accessibility and error handling
 * Provides consistent input components for the editor forms
 */

import { forwardRef } from 'react';

/**
 * Label component with proper accessibility
 * @param {Object} props
 * @param {string} props.htmlFor - ID of the associated input
 * @param {boolean} [props.required] - Whether the field is required
 * @param {React.ReactNode} props.children - Label text
 */
export function Label({ htmlFor, required, children, ...props }) {
  return (
    <label
      htmlFor={htmlFor}
      className="block text-sm font-medium text-gray-700 mb-1"
      {...props}
    >
      {children}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
  );
}

/**
 * Input component with error states
 * @param {Object} props
 * @param {boolean} [props.error] - Whether the input has an error
 * @param {string} [props.className] - Additional CSS classes
 */
export const Input = forwardRef(({ error, className = '', ...props }, ref) => {
  return (
    <input
      ref={ref}
      className={`input ${error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''} ${className}`}
      aria-invalid={error ? 'true' : 'false'}
      {...props}
    />
  );
});

Input.displayName = 'Input';

/**
 * Textarea component with error states
 * @param {Object} props
 * @param {boolean} [props.error] - Whether the textarea has an error
 * @param {string} [props.className] - Additional CSS classes
 * @param {number} [props.rows] - Number of rows
 */
export const Textarea = forwardRef(({ error, className = '', rows = 3, ...props }, ref) => {
  return (
    <textarea
      ref={ref}
      rows={rows}
      className={`input resize-none ${error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''} ${className}`}
      aria-invalid={error ? 'true' : 'false'}
      {...props}
    />
  );
});

Textarea.displayName = 'Textarea';

/**
 * Error text component
 * @param {Object} props
 * @param {React.ReactNode} props.children - Error message
 */
export function ErrorText({ children }) {
  if (!children) return null;
  
  return (
    <p className="text-sm text-red-600 mt-1" role="alert">
      {children}
    </p>
  );
}

/**
 * Help text component
 * @param {Object} props
 * @param {React.ReactNode} props.children - Help message
 */
export function HelpText({ children }) {
  if (!children) return null;
  
  return (
    <p className="text-sm text-gray-500 mt-1">
      {children}
    </p>
  );
}

/**
 * Field row component for consistent spacing
 * @param {Object} props
 * @param {React.ReactNode} props.children - Field content
 * @param {string} [props.className] - Additional CSS classes
 */
export function FieldRow({ children, className = '' }) {
  return (
    <div className={`space-y-1 ${className}`}>
      {children}
    </div>
  );
}
