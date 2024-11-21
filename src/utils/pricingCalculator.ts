interface QualitativeFactor {
  name: string;
  score: number;
  weight: number;
}

interface PricingSettings {
  assetClasses: {
    [key: string]: {
      sMax: number;
      aNegative: number;
      aPositive: number;
      m: number;
      adjustmentPerUnit: number;
      weights: {
        [key: string]: number;
        default: number;
      };
    };
  };
}


interface DataPoint {
  minPrice: number;
  maxPrice: number;
}

export function calculateMarketAverage(dataPoints: DataPoint[]): number {
  if (dataPoints.length === 0) return 0;
  
  const sum = dataPoints.reduce((acc, point) => {
    const average = (point.minPrice + point.maxPrice) / 2;
    return acc + average;
  }, 0);
  
  return sum / dataPoints.length;
}


export function calculateQualitativeAdjustment(
  factors: QualitativeFactor[],
  settings: PricingSettings,
  
): number {

  const assetClassSettings = settings?.assetClasses['buyout'] || settings?.assetClasses['growth']  || settings?.assetClasses['venture'] ;

  // Check if assetClassSettings and weights are available
  if (!assetClassSettings?.weights) {
    console.error('Missing weights in settings for asset class:');
    return 0;
  }
  
  const totalWeightedScore = factors.reduce((acc, factor) => {
   
    const weight = assetClassSettings.weights[factor.name] ?? assetClassSettings.weights.default ?? 1;
   
    const x = factor.score >= 0 
      ? (factor.score / assetClassSettings.sMax) * assetClassSettings.aPositive
      : (factor.score / assetClassSettings.sMax) * assetClassSettings.aNegative;
    const transformedScore = Math.tanh(x);
    console.log(assetClassSettings.aPositive)
    console.log(assetClassSettings.sMax)
    console.log(assetClassSettings.aNegative)
    console.log(factor.score)

    return acc + (transformedScore * weight);
  }, 0);
  
  return totalWeightedScore;
}

export function calculatePriceRange(
  basePrice: number,
  volatilityScore: number,
  settings: PricingSettings
): { min: number; max: number } {
  const mappedVolatility = (volatilityScore * 2) - 5;
  const totalRangePercent = 5 + ((mappedVolatility + 5) / 10) * 15;
  const halfRange = totalRangePercent / 2;
  
  return {
    min: Math.max(0, basePrice * (1 - halfRange / 100)),
    max: Math.min(150, basePrice * (1 + halfRange / 100))
  };
}

export function calculateDeferralPrice(price: number): number {
  return price + 3; // 3% deferral adjustment
}

export function calculateFinalPrice(
  dataPoints: DataPoint[],
  qualitativeFactors: QualitativeFactor[],
  volatilityScore: number,
  settings: PricingSettings
): {
  marketAverage: number;
  finalPrice: number;
  priceRange: { min: number; max: number };
  deferralPrice: number;
  deferralPriceRange: { min: number; max: number };
} {
  const assetClassSettings = settings?.assetClasses['buyout'] || settings?.assetClasses['growth']  || settings?.assetClasses['venture'] ;

  const marketAverage = calculateMarketAverage(dataPoints);
  const qualitativeAdjustment = calculateQualitativeAdjustment(qualitativeFactors, settings);

  // Calculate volatility multiplier
  const mappedVolatility = (volatilityScore * 2) - 5;
  const volatilityMultiplier = Math.min(1.5, Math.max(0.5, 1 + ((mappedVolatility / 5) * assetClassSettings.m)));

  
  const adjustmentAmount = qualitativeAdjustment * assetClassSettings.adjustmentPerUnit * volatilityMultiplier;
  
  const finalPrice = Math.min(150, Math.max(0, marketAverage + adjustmentAmount));
  
  const priceRange = calculatePriceRange(finalPrice, volatilityScore, settings);
  const deferralPrice = calculateDeferralPrice(finalPrice);
  const deferralPriceRange = {
    min: calculateDeferralPrice(priceRange.min),
    max: calculateDeferralPrice(priceRange.max)
  };

  return {
    marketAverage,
    finalPrice,
    priceRange,
    deferralPrice,
    deferralPriceRange
  };
}