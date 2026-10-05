/**
 * MASMS Form Label Component
 * Adheres to user prompt: Keep all mandatory fields as non-mandatory for demo purpose,
 * but retain the red asterisk (*) mark for future reference.
 */

import React from 'react';

interface FormLabelProps {
  label: string;
  required?: boolean;
  tooltip?: string;
  htmlFor?: string;
  className?: string;
}

export const FormLabel: React.FC<FormLabelProps> = ({
  label,
  required = false,
  tooltip,
  htmlFor,
  className = '',
}) => {
  return (
    <label
      htmlFor={htmlFor}
      className={`block text-xs font-semibold text-slate-700 mb-1 flex items-center justify-between ${className}`}
    >
      <span className="flex items-center gap-1">
        {label}
        {required && (
          <span
            className="text-rose-600 font-bold text-sm cursor-help"
            title="Mandatory field in production SOP (Non-mandatory in Demo mode)"
          >
            *
          </span>
        )}
      </span>
      {tooltip && (
        <span className="text-[11px] font-normal text-slate-400 select-none">
          {tooltip}
        </span>
      )}
    </label>
  );
};
