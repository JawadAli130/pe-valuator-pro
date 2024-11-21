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
  
  
  return {
    id: Date.now(), 
    name,
    assetClass,
    quarter,
    date: new Date().toISOString(), 
    qualitativeFactors, 
    volatilityScore,
    marketAverage: pricingResult.marketAverage,
    finalPrice: pricingResult.finalPrice,
    priceRangeMin: pricingResult.priceRange?.min ?? 0, 
    priceRangeMax: pricingResult.priceRange?.max ?? 0, 
    deferralPrice: pricingResult.deferralPrice,
    deferralRangeMin: pricingResult.deferralPriceRange?.min ?? 0, 
    deferralRangeMax: pricingResult.deferralPriceRange?.max ?? 0, 
  };
  
 
}