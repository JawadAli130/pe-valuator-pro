import { Report, QualitativeFactor } from '../types/report';
import { DataPoint } from '../types/dataPoint';
import { PricingSettings } from '../types/settings';
import { calculateFinalPrice } from './pricingCalculator';

export function generateReport(
  name: string,
  assetClass: string,
  quarter: string,
  qualitativeFactors: QualitativeFactor[],
  volatilityScore: number,
  dataPoints: DataPoint[],
  settings: PricingSettings
): Report {
  // Filter relevant data points for the asset class and quarter
  const relevantDataPoints = dataPoints.filter(
    point => point.assetClass === assetClass && point.quarter === quarter
  );

  // Calculate pricing details
  const pricingResult = calculateFinalPrice(
    relevantDataPoints,
    qualitativeFactors,
    volatilityScore,
    settings
  );

  // Generate the report
  return {
    id: Date.now(),
    name,
    assetClass,
    quarter,
    date: new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }),
    qualitativeFactors,
    volatilityScore,
    marketAverage: pricingResult.marketAverage,
    finalPrice: pricingResult.finalPrice,
    priceRange: pricingResult.priceRange,
    deferralPrice: pricingResult.deferralPrice,
    deferralPriceRange: pricingResult.deferralPriceRange
  };
}