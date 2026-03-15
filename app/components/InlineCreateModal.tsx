/**
 * Inline Create Modal Component
 * Modal dialog for creating new items inline within forms
 */

'use client';

import { ReactNode, useState } from 'react';

interface Field {
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
}

interface InlineCreateModalProps {
  isOpen: boolean;
  title: string;
  onSubmit: (value: Record<string, unknown> | string) => Promise<void> | void;
  onCancel?: () => void;
  onClose?: () => void;
  loading?: boolean;
  children?: ReactNode;
  fields?: Field[];
  label?: string;
  placeholder?: string;
  submitLabel?: string;
}

export function InlineCreateModal({
  isOpen,
  title,
  onSubmit,
  onCancel,
  onClose,
  loading = false,
  children,
  fields = [],
  label,
  placeholder,
  submitLabel = 'Submit',
}: InlineCreateModalProps) {
  const [value, setValue] = useState('');
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Support both simple string input and complex forms with multiple fields
  const isComplexForm = fields.length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsSubmitting(true);
    try {
      if (isComplexForm) {
        await onSubmit(formData);
        setFormData({});
      } else {
        if (!value.trim()) return;
        await onSubmit(value);
        setValue('');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    onClose?.();
    onCancel?.();
    setValue('');
    setFormData({});
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="rounded-lg bg-white p-6 shadow-xl max-w-md w-full mx-4">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">{title}</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isComplexForm ? (
            // Multi-field form
            <>
              {fields.map((field) => (
                <div key={field.name}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {field.label}
                    {field.required && <span className="text-red-600">*</span>}
                  </label>
                  {field.type === 'textarea' ? (
                    <textarea
                      name={field.name}
                      value={formData[field.name] || ''}
                      onChange={(e) =>
                        setFormData({ ...formData, [field.name]: e.target.value })
                      }
                      placeholder={field.placeholder}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <input
                      type={field.type || 'text'}
                      name={field.name}
                      value={formData[field.name] || ''}
                      onChange={(e) =>
                        setFormData({ ...formData, [field.name]: e.target.value })
                      }
                      placeholder={field.placeholder}
                      required={field.required}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  )}
                </div>
              ))}
            </>
          ) : (
            // Simple string input
            <div>
              {label && (
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {label}
                </label>
              )}
              <input
                type="text"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder={placeholder}
                disabled={isSubmitting || loading}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-100 disabled:opacity-50"
                autoFocus
              />
            </div>
          )}

          {children}

          <div className="flex gap-3 justify-end pt-4">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting || loading}
              className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 disabled:opacity-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={
                isSubmitting ||
                loading ||
                (isComplexForm ? false : !value.trim())
              }
              className="px-4 py-2 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 disabled:opacity-50 transition-colors"
            >
              {isSubmitting ? 'Creating...' : submitLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
