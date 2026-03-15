import React from "react";

export interface FormFieldProps {
  label: string;
  htmlFor: string;
  error?: string;
  helperText?: string;
  children: React.ReactNode;
}

export function FormField({ label, htmlFor, error, helperText, children }: FormFieldProps) {
  const errorId = error ? `${htmlFor}-error` : undefined;
  const helperId = helperText ? `${htmlFor}-helper` : undefined;
  return (
    <div className="mb-4">
      <label htmlFor={htmlFor} className="block font-semibold mb-1">
        {label}
      </label>
      {React.cloneElement(children as React.ReactElement, {
        id: htmlFor,
        'aria-describedby': [helperId, errorId].filter(Boolean).join(' ') || undefined,
        'aria-invalid': !!error || undefined,
      })}
      {helperText && <div id={helperId} className="text-xs text-gray-500 mt-1">{helperText}</div>}
      {error && <div id={errorId} className="text-xs text-red-600 mt-1" role="alert">{error}</div>}
    </div>
  );
}
