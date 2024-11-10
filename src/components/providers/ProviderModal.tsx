import React from 'react';
import { Provider } from '../../types/provider';

interface ProviderModalProps {
  isOpen: boolean;
  onClose: () => void;
  provider: Partial<Provider>;
  onSubmit: (e: React.FormEvent) => void;
  onChange: (field: keyof Provider, value: string | number) => void;
  mode: 'add' | 'edit';
}

export function ProviderModal({
  isOpen,
  onClose,
  provider,
  onSubmit,
  onChange,
  mode
}: ProviderModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h2 className="text-lg font-medium text-gray-900 mb-4">
          {mode === 'add' ? 'Add New Provider' : 'Edit Provider'}
        </h2>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label htmlFor="providerName" className="block text-sm font-medium text-gray-700">
              Provider Name
            </label>
            <input
              type="text"
              id="providerName"
              value={provider.name || ''}
              onChange={(e) => onChange('name', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="Enter provider name"
              required
            />
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
            >
              {mode === 'add' ? 'Add Provider' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}