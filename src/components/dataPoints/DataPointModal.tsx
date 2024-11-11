import React from 'react';
import { DataPoint } from '../../types/dataPoint';

interface DataPointModalProps {
  isOpen: boolean;
  onClose: () => void;
  dataPoint: Partial<DataPoint>;
  onSubmit: (e: React.FormEvent) => void;
  onChange: (field: string, value: any) => void;
  mode: 'add' | 'edit';
  providers: Provider[];
}

export function DataPointModal({
  isOpen,
  onClose,
  dataPoint,
  onSubmit,
  onChange,
  mode,
  providers
}: DataPointModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h2 className="text-lg font-medium text-gray-900 mb-4">
          {mode === 'add' ? 'Add New Data Point' : 'Edit Data Point'}
        </h2>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label htmlFor="provider" className="block text-sm font-medium text-gray-700">
              Provider
            </label>
            <select
              id="provider"
              value={dataPoint.provider || ''}
              onChange={(e) => onChange('provider', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            >
              <option value="">Select a provider</option>
              {providers.map((provider) => (
                <option key={provider.id} value={provider.id}>
                  {provider.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="assetClass" className="block text-sm font-medium text-gray-700">
              Asset Class
            </label>
            <select
              id="assetClass"
              value={dataPoint.assetClass || 'Buyout'}
              onChange={(e) => onChange('assetClass', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="Buyout">Buyout</option>
              <option value="Growth">Growth</option>
              <option value="Venture">Venture</option>
            </select>
          </div>

          <div>
            <label htmlFor="quarter" className="block text-sm font-medium text-gray-700">
              Quarter
            </label>
            <select
              id="quarter"
              value={dataPoint.quarter || 'Q1 2024'}
              onChange={(e) => onChange('quarter', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="Q1 2024">Q1 2024</option>
              <option value="Q2 2024">Q2 2024</option>
              <option value="Q3 2024">Q3 2024</option>
              <option value="Q4 2024">Q4 2024</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="minPrice" className="block text-sm font-medium text-gray-700">
                Min Price (%)
              </label>
              <input
                type="number"
                id="minPrice"
                value={dataPoint.minPrice || ''}
                onChange={(e) => onChange('minPrice', Number(e.target.value))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                min="0"
                max="200"
                step="0.01"
                required
              />
            </div>

            <div>
              <label htmlFor="maxPrice" className="block text-sm font-medium text-gray-700">
                Max Price (%)
              </label>
              <input
                type="number"
                id="maxPrice"
                value={dataPoint.maxPrice || ''}
                onChange={(e) => onChange('maxPrice', Number(e.target.value))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                min="0"
                max="100"
                step="0.01"
                required
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6">
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
              {mode === 'add' ? 'Add Data Point' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}