import React from 'react';
import { Eye, Trash2 } from 'lucide-react';
import { Report } from '../../types/report';

interface ReportsTableProps {
  reports: Report[];
  onViewReport: (report: Report) => void;
  onDeleteReport: (id: number) => void;
}

export function ReportsTable({ reports, onViewReport, onDeleteReport }: ReportsTableProps) {
  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Report Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Asset Class
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Quarter
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Final Price
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {reports.map((report) => (
            <tr key={report.id}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">{report.name}</div>
                <div className="text-sm text-gray-500">
                  {new Date(report.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{report.assetClass}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{report.quarter}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{report.finalPrice.toFixed(1)}%</div>
                <div className="text-xs text-gray-500">
                  Range: {report.priceRangeMin.toFixed(1)}% - {report.priceRangeMax.toFixed(1)}%
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                <button 
                  onClick={() => onViewReport(report)}
                  className="text-gray-500 hover:text-indigo-600"
                >
                  <Eye className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => onDeleteReport(report.id)}
                  className="text-gray-500 hover:text-red-600"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}