interface ReportFilters {
  assetClass?: string;
  quarter?: string;
  status?: 'draft' | 'final';
}

interface ReportFiltersProps {
  filters: ReportFilters;
  onFilterChange: (filters: ReportFilters) => void;
}

export function ReportFilters({ filters, onFilterChange }: ReportFiltersProps) {
  return (
    <div className="grid grid-cols-3 gap-4">
      <div>
        <label htmlFor="assetClassFilter" className="block text-sm font-medium text-gray-700">
          Asset Class
        </label>
        <select
          id="assetClassFilter"
          value={filters.assetClass || ''}
          onChange={(e) => onFilterChange({ ...filters, assetClass: e.target.value || undefined })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        >
          <option value="">All Asset Classes</option>
          <option value="Buyout">Buyout</option>
          <option value="Growth">Growth</option>
          <option value="Venture">Venture</option>
        </select>
      </div>

      <div>
        <label htmlFor="quarterFilter" className="block text-sm font-medium text-gray-700">
          Quarter
        </label>
        <select
          id="quarterFilter"
          value={filters.quarter || ''}
          onChange={(e) => onFilterChange({ ...filters, quarter: e.target.value || undefined })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        >
          <option value="">All Quarters</option>
          <option value="Q1 2024">Q1 2024</option>
          <option value="Q2 2024">Q2 2024</option>
          <option value="Q3 2024">Q3 2024</option>
          <option value="Q4 2024">Q4 2024</option>
        </select>
      </div>

      <div>
        <label htmlFor="statusFilter" className="block text-sm font-medium text-gray-700">
          Status
        </label>
        <select
          id="statusFilter"
          value={filters.status || ''}
          onChange={(e) => onFilterChange({ ...filters, status: e.target.value as 'draft' | 'final' | undefined })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        >
          <option value="">All Statuses</option>
          <option value="draft">Draft</option>
          <option value="final">Final</option>
        </select>
      </div>
    </div>
  );
}