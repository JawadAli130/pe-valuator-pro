export interface AssetClassSettings {
  sMax: number;
  aNegative: number;
  aPositive: number;
  m: number;
  adjustmentPerUnit: number;
  weights: {
    [key: string]: number;
    gpQuartile: number;
    strategyDesirability: number;
    gpNavValuation: number;
    vintageDesirability: number;
    geographicDesirability: number;
    ticketSizeLiquidity: number;
    default: number;
  };
}

export interface PricingSettings {
  assetClasses: {
    [key: string]: AssetClassSettings;
  };
}

export function validateSettings(settings: AssetClassSettings): string[] {
  const errors: string[] = [];

  // Validate basic parameters
  if (settings.sMax <= 0) {
    errors.push('Maximum absolute score must be greater than 0');
  }

  if (settings.aNegative <= 0) {
    errors.push('Negative score scaling must be greater than 0');
  }

  if (settings.aPositive <= 0) {
    errors.push('Positive score scaling must be greater than 0');
  }

  if (settings.m < 0 || settings.m > 1) {
    errors.push('Volatility impact must be between 0 and 1');
  }

  if (settings.adjustmentPerUnit <= 0) {
    errors.push('Adjustment per unit must be greater than 0');
  }

  // Validate weights
  Object.entries(settings.weights).forEach(([factor, weight]) => {
    if (weight < 0) {
      errors.push(`Weight for ${factor} must be non-negative`);
    }
  });

  return errors;
}