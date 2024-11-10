export interface DataPoint {
  id: number;
  provider: string;
  assetClass: string;
  quarter: string;
  minPrice: number;
  maxPrice: number;
  date: string;
}

export interface DataPointFilters {
  assetClass?: string;
  quarter?: string;
  provider?: string;
}

export function filterDataPoints(dataPoints: DataPoint[], filters: DataPointFilters): DataPoint[] {
  return dataPoints.filter(point => {
    if (filters.assetClass && point.assetClass !== filters.assetClass) return false;
    if (filters.quarter && point.quarter !== filters.quarter) return false;
    if (filters.provider && !point.provider.toLowerCase().includes(filters.provider.toLowerCase())) return false;
    return true;
  });
}

export function validateDataPoint(dataPoint: Partial<DataPoint>): string[] {
  const errors: string[] = [];

  if (!dataPoint.provider?.trim()) {
    errors.push('Provider is required');
  }

  if (!dataPoint.minPrice || dataPoint.minPrice < 0 || dataPoint.minPrice > 100) {
    errors.push('Minimum price must be between 0 and 100');
  }

  if (!dataPoint.maxPrice || dataPoint.maxPrice < 0 || dataPoint.maxPrice > 100) {
    errors.push('Maximum price must be between 0 and 100');
  }

  if (dataPoint.minPrice && dataPoint.maxPrice && dataPoint.minPrice > dataPoint.maxPrice) {
    errors.push('Minimum price cannot be greater than maximum price');
  }

  return errors;
}