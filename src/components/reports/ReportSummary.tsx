import { Report } from '../../types/report';
import { BarChart3, TrendingUp, FileText } from 'lucide-react';

function getFactorLabel(name: string): string {
  return name.replace(/([A-Z])/g, ' $1').trim();
}

interface ReportSummaryProps {
  report: Report;
}

export function ReportSummary({ report }: ReportSummaryProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-medium text-gray-900">{report.name}</h3>
          <p className="mt-1 text-sm text-gray-500">{report.date}</p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-50 rounded-lg">
            <BarChart3 className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Final Price</p>
            <p className="text-lg font-semibold text-gray-900">{report.finalPrice.toFixed(1)}%</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-50 rounded-lg">
            <TrendingUp className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Market Avg</p>
            <p className="text-lg font-semibold text-gray-900">{report.marketAverage.toFixed(1)}%</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 rounded-lg">
            <FileText className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Price Range</p>
            <p className="text-lg font-semibold text-gray-900">
              {report.priceRangeMin.toFixed(1)}-{report.priceRangeMax.toFixed(1)}%
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <h4 className="text-sm font-medium text-gray-500 mb-2">Qualitative Factors</h4>
        <div className="grid grid-cols-2 gap-4">
          {report.qualitativeFactors.map((factor, index) => (
            <div key={index} className="flex justify-between items-center bg-gray-50 rounded-lg p-2">
              <span className="text-sm text-gray-700">{getFactorLabel(factor.name)}</span>
              <span className="text-sm font-medium text-gray-900">
                {factor.score > 0 ? `+${factor.score.toFixed(1)}` : factor.score.toFixed(1)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}