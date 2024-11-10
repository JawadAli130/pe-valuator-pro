import React from 'react';
import { Plus, FileText, Trash2 } from 'lucide-react';
import { QualitativeFactor, qualitativeFactorOptions } from '../../types/report';

interface AddReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  newReport: {
    name: string;
    assetClass: string;
    quarter: string;
    qualitativeFactors: QualitativeFactor[];
    volatilityScore: number;
  };
  onSubmit: (e: React.FormEvent) => void;
  onUpdateReport: (field: string, value: string | number) => void;
  onAddQualitativeFactor: () => void;
  onUpdateQualitativeFactor: (index: number, field: keyof QualitativeFactor, value: string | number) => void;
  onRemoveQualitativeFactor: (index: number) => void;
}

export function AddReportModal({
  isOpen,
  onClose,
  newReport,
  onSubmit,
  onUpdateReport,
  onAddQualitativeFactor,
  onUpdateQualitativeFactor,
  onRemoveQualitativeFactor
}: AddReportModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Create New Report</h2>
        <form onSubmit={onSubmit} className="space-y-6">
          <div>
            <label htmlFor="reportName" className="block text-sm font-medium text-gray-700">
              Report Name
            </label>
            <input
              type="text"
              id="reportName"
              value={newReport.name}
              onChange={(e) => onUpdateReport('name', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="assetClass" className="block text-sm font-medium text-gray-700">
                Asset Class
              </label>
              <select
                id="assetClass"
                value={newReport.assetClass}
                onChange={(e) => onUpdateReport('assetClass', e.target.value)}
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
                value={newReport.quarter}
                onChange={(e) => onUpdateReport('quarter', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="Q1 2024">Q1 2024</option>
                <option value="Q2 2024">Q2 2024</option>
                <option value="Q3 2024">Q3 2024</option>
                <option value="Q4 2024">Q4 2024</option>
              </select>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-medium text-gray-700">Qualitative Factors</h3>
              <button
                type="button"
                onClick={onAddQualitativeFactor}
                className="flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-900"
              >
                <Plus className="w-4 h-4" />
                Add Factor
              </button>
            </div>

            {newReport.qualitativeFactors.map((factor, index) => (
              <div key={index} className="grid grid-cols-12 gap-4 mb-4">
                <div className="col-span-5">
                  <select
                    value={factor.name}
                    onChange={(e) => onUpdateQualitativeFactor(index, 'name', e.target.value)}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  >
                    {qualitativeFactorOptions.map((option) => (
                      <option key={option.name} value={option.name}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-span-5">
                  <input
                    type="number"
                    min="-5"
                    max="5"
                    step="0.5"
                    value={factor.score}
                    onChange={(e) => onUpdateQualitativeFactor(index, 'score', parseFloat(e.target.value))}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    placeholder="Score (-5 to +5)"
                  />
                </div>
                <div className="col-span-2">
                  <button
                    type="button"
                    onClick={() => onRemoveQualitativeFactor(index)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div>
            <label htmlFor="volatilityScore" className="block text-sm font-medium text-gray-700">
              Volatility Score (0-5)
            </label>
            <input
              type="number"
              id="volatilityScore"
              min="0"
              max="5"
              step="0.5"
              value={newReport.volatilityScore}
              onChange={(e) => onUpdateReport('volatilityScore', parseFloat(e.target.value))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
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
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
            >
              <FileText className="w-4 h-4" />
              Create Report
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}