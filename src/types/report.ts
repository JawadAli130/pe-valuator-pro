export interface QualitativeFactor {
  name: string;
  score: number;
  weight: number;
}

export interface Report {
  id: number;
  name: string;
  assetClass: string;
  quarter: string;
  date: string;
  status: 'draft' | 'final';
  marketAverage: number;
  finalPrice: number;
  priceRangeMin: number;
  priceRangeMax: number;
  deferralPrice: number;
  deferralRangeMin: number;
  deferralRangeMax: number;
  volatilityScore: number;
  qualitativeFactors: QualitativeFactor[];
}

export interface ExportOptions {
  currentNAV: string;
  fundManager: string;
  vintage: string;
  buyers: string;
  includeQualitativeFactors: boolean;
  includeMarketData: boolean;
  isDesignExport?: boolean;
}

export const qualitativeFactorOptions = [
  { name: 'gpQuartile', label: 'GP Quartile' },
  { name: 'strategyDesirability', label: 'Strategy Desirability' },
  { name: 'gpNavValuation', label: 'GP NAV Valuation Confidence' },
  { name: 'vintageDesirability', label: 'Vintage Desirability' },
  { name: 'geographicDesirability', label: 'Geographic Desirability' },
  { name: 'ticketSizeLiquidity', label: 'Ticket-Size Liquidity Score' }
];