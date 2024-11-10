import React, { useState } from 'react';
import { X } from 'lucide-react';
import { ExportOptions } from '../../types/report';

interface ExportOptionsModalProps {
  onClose: () => void;
  onExport: (options: ExportOptions) => void;
}

export function ExportOptionsModal({ onClose, onExport }: ExportOptionsModalProps) {
  const [options, setOptions] = useState<ExportOptions>({
    currentNAV: 0,
    fundManager: '',
    vintage: '',
    buyers: '',
    includeQualitativeFactors: true,
    includeMarketData: true
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onExport(options);
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium text-gray-900">Export Report</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="currentNAV" className="block text-sm font-medium text-gray-700">
              Current NAV ($M)
            </label>
            <input
              type="number"
              id="currentNAV"
              value={options.currentNAV}
              onChange={(e) => setOptions({ ...options, currentNAV: Number(e.target.value) })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              min="0"
              step="0.1"
            />
          </div>

          <div>
            <label htmlFor="fundManager" className="block text-sm font-medium text-gray-700">
              Fund Manager
            </label>
            <input
              type="text"
              id="fundManager"
              value={options.fundManager}
              onChange={(e) => setOptions({ ...options, fundManager: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label htmlFor="vintage" className="block text-sm font-medium text-gray-700">
              Vintage
            </label>
            <input
              type="text"
              id="vintage"
              value={options.vintage}
              onChange={(e) => setOptions({ ...options, vintage: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="e.g., 2020"
            />
          </div>

          <div>
            <label htmlFor="buyers" className="block text-sm font-medium text-gray-700">
              Potential Buyers
            </label>
            <textarea
              id="buyers"
              value={options.buyers}
              onChange={(e) => setOptions({ ...options, buyers: e.target.value })}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="List potential buyers..."
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="includeQualitativeFactors"
                checked={options.includeQualitativeFactors}
                onChange={(e) => setOptions({ ...options, includeQualitativeFactors: e.target.checked })}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="includeQualitativeFactors" className="ml-2 block text-sm text-gray-700">
                Include Qualitative Factors
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="includeMarketData"
                checked={options.includeMarketData}
                onChange={(e) => setOptions({ ...options, includeMarketData: e.target.checked })}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="includeMarketData" className="ml-2 block text-sm text-gray-700">
                Include Market Data
              </label>
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
              Export PDF
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}