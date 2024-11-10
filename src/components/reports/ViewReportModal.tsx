import React, { useState } from 'react';
import { Report, ExportOptions } from '../../types/report';
import { ExportOptionsModal } from './ExportOptionsModal';
import { exportReportToPDF } from '../../utils/pdfExport';
import { Download, X } from 'lucide-react';

interface ViewReportModalProps {
  report: Report;
  onClose: () => void;
}

export function ViewReportModal({ report, onClose }: ViewReportModalProps) {
  const [showExportOptions, setShowExportOptions] = useState(false);

  const handleExport = (options: ExportOptions) => {
    exportReportToPDF(report, options);
    setShowExportOptions(false);
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">{report.name}</h2>
          <div className="flex gap-4">
            <button
              onClick={() => setShowExportOptions(true)}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
            >
              <Download className="w-4 h-4" />
              Export PDF
            </button>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="space-y-6">
          {/* Report Details */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Asset Class</h3>
              <p className="mt-1 text-sm text-gray-900">{report.assetClass}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Quarter</h3>
              <p className="mt-1 text-sm text-gray-900">{report.quarter}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Date</h3>
              <p className="mt-1 text-sm text-gray-900">{report.date}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Status</h3>
              <p className="mt-1 text-sm text-gray-900">{report.status}</p>
            </div>
          </div>

          {/* Pricing Details */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Pricing Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-gray-500">Market Average</h4>
                <p className="mt-1 text-lg font-semibold text-gray-900">
                  {report.marketAverage.toFixed(1)}%
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Final Price</h4>
                <p className="mt-1 text-lg font-semibold text-gray-900">
                  {report.finalPrice.toFixed(1)}%
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Price Range</h4>
                <p className="mt-1 text-lg font-semibold text-gray-900">
                  {report.priceRangeMin.toFixed(1)}% - {report.priceRangeMax.toFixed(1)}%
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Deferral Price</h4>
                <p className="mt-1 text-lg font-semibold text-gray-900">
                  {report.deferralPrice.toFixed(1)}%
                </p>
              </div>
            </div>
          </div>

          {/* Qualitative Factors */}
          {report.qualitativeFactors.length > 0 && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Qualitative Factors</h3>
              <div className="bg-white shadow overflow-hidden rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Factor
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Score
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Weight
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {report.qualitativeFactors.map((factor, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {factor.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {factor.score > 0 ? `+${factor.score}` : factor.score}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {factor.weight.toFixed(1)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Volatility Score */}
          <div>
            <h3 className="text-sm font-medium text-gray-500">Volatility Score</h3>
            <p className="mt-1 text-lg font-semibold text-gray-900">{report.volatilityScore}</p>
          </div>
        </div>

        {showExportOptions && (
          <ExportOptionsModal
            onClose={() => setShowExportOptions(false)}
            onExport={handleExport}
          />
        )}
      </div>
    </div>
  );
}