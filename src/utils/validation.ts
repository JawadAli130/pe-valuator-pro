import { Report, QualitativeFactor } from '../types/report';
import { DataPoint } from '../types/dataPoint';

export function validateReport(report: Partial<Report>): string[] {
  const errors: string[] = [];

  if (!report.name?.trim()) {
    errors.push('Report name is required');
  }

  if (!report.assetClass) {
    errors.push('Asset class is required');
  }

  if (!report.quarter) {
    errors.push('Quarter is required');
  }

  if (!report.qualitativeFactors || report.qualitativeFactors.length === 0) {
    errors.push('At least one qualitative factor is required');
  } else {
    report.qualitativeFactors.forEach((factor, index) => {
      const factorErrors = validateQualitativeFactor(factor);
      if (factorErrors.length > 0) {
        errors.push(`Qualitative factor ${index + 1}: ${factorErrors.join(', ')}`);
      }
    });
  }

  if (typeof report.volatilityScore !== 'number' || 
      report.volatilityScore < 0 || 
      report.volatilityScore > 5) {
    errors.push('Volatility score must be between 0 and 5');
  }

  if (report.marketAverage !== undefined) {
    if (typeof report.marketAverage !== 'number' || 
        report.marketAverage < 0 || 
        report.marketAverage > 200) {
      errors.push('Market average must be between 0% and 200%');
    }
  }

  if (report.finalPrice !== undefined) {
    if (typeof report.finalPrice !== 'number' || 
        report.finalPrice < 0 || 
        report.finalPrice > 150) {
      errors.push('Final price must be between 0% and 150%');
    }
  }

  return errors;
}

export function validateQualitativeFactor(factor: QualitativeFactor): string[] {
  const errors: string[] = [];

  if (!factor.name) {
    errors.push('Factor name is required');
  }

  if (typeof factor.score !== 'number' || 
      factor.score < -5 || 
      factor.score > 5) {
    errors.push('Score must be between -5 and +5');
  }

  if (typeof factor.weight !== 'number' || 
      factor.weight < 0) {
    errors.push('Weight must be a positive number');
  }

  return errors;
}

export function validateDataPoint(dataPoint: Partial<DataPoint>): string[] {
  const errors: string[] = [];

  if (!dataPoint.provider?.trim()) {
    errors.push('Provider is required');
  }

  if (!dataPoint.assetClass?.trim()) {
    errors.push('Asset class is required');
  }

  if (!dataPoint.quarter?.trim()) {
    errors.push('Quarter is required');
  }

  if (typeof dataPoint.minPrice !== 'number' || 
      dataPoint.minPrice < 0 || 
      dataPoint.minPrice > 200) {
    errors.push('Minimum price must be between 0% and 200%');
  }

  if (typeof dataPoint.maxPrice !== 'number' || 
      dataPoint.maxPrice < 0 || 
      dataPoint.maxPrice > 200) {
    errors.push('Maximum price must be between 0% and 200%');
  }

  if (dataPoint.minPrice !== undefined && 
      dataPoint.maxPrice !== undefined && 
      dataPoint.minPrice > dataPoint.maxPrice) {
    errors.push('Minimum price cannot be greater than maximum price');
  }

  return errors;
}

export function validatePriceRange(min: number, max: number): string[] {
  const errors: string[] = [];

  if (typeof min !== 'number' || min < 0 || min > 200) {
    errors.push('Minimum price must be between 0% and 200%');
  }

  if (typeof max !== 'number' || max < 0 || max > 200) {
    errors.push('Maximum price must be between 0% and 200%');
  }

  if (min > max) {
    errors.push('Minimum price cannot be greater than maximum price');
  }

  return errors;
}