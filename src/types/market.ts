/**
 * STOCKSTREAM QUANT — Type Definitions
 */

export interface MarketBar {
  timestamp: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface Quote {
  symbol: string;
  name: string;
  sector: string;
  price: number;
  change24h: number;
  changePct: number;
  high24h: number;
  low24h: number;
  volume24h: string;
  marketCap: string;
  peRatio?: number;
  dividendYield?: string;
  rsi?: number;
  signal?: 'BULLISH_MOMENTUM' | 'BULLISH_SETUP' | 'CONSOLIDATION_WATCH' | 'NEUTRAL' | 'BEARISH_PRESSURE';
  support?: number;
  resistance?: number;
  status: 'LIVE_STREAM' | 'DELAYED_15M' | 'CACHED' | 'CALIBRATED_FALLBACK';
}

export interface GlobalIndex {
  symbol: string;
  name: string;
  region: string;
  price: number;
  change: number;
  changePct: number;
  volume: string;
  sparkline: number[];
}

export interface ExchangeSpread {
  exchange: string;
  pair: string;
  bid: number;
  ask: number;
  spreadUsd: number;
  volumeShare: string;
  latencyMs: number;
}

export interface DownsideScenario {
  scenario: string;
  level: number;
  dropPct: number;
  riskType: string;
}

export interface BitcoinMetrics {
  symbol: 'BTC';
  name: 'Bitcoin';
  priceUsd: number;
  change24hPct: number;
  change7dPct: number;
  high24h: number;
  low24h: number;
  marketCapUsd: string;
  volume24hUsd: string;
  circulatingSupply: string;
  maxSupply: string;
  btcDominancePct: number;
  fearGreedIndex: number;
  fearGreedLabel: string;
  hashRateEhs: number;
  nextHalvingEst: string;
  exchangeSpreads: ExchangeSpread[];
  supportLevels: number[];
  resistanceLevels: number[];
  downsideScenarios: DownsideScenario[];
}

export interface ProjectionData {
  horizonDays: number;
  currentPrice: number;
  expectedPrice: number;
  expectedDeltaPct: number;
  direction: 'BULLISH' | 'BEARISH' | 'NEUTRAL';
  confidence80: { lower: number; upper: number };
  confidence95: { lower: number; upper: number };
  horizonVolatilityPct: number;
}

export interface ForecastResult {
  symbol: string;
  lastPrice: number;
  modelType: string;
  metrics: {
    mae: number;
    rmse: number;
    directionalAccuracyPct: number;
    sampleSize: number;
  };
  projections: {
    '1D': ProjectionData;
    '5D': ProjectionData;
    '20D': ProjectionData;
  };
  keyDrivers: {
    factor: string;
    impact: number;
  }[];
  disclaimer: string;
}

export interface InstitutionalHolder {
  name: string;
  sharesHeld: string;
  portfolioWeightPct: number;
  changeSharesPct: string;
  filingDate: string;
}

export interface InsiderDisclosure {
  name: string;
  title: string;
  sharesHeld: string;
  pctOutstanding: string;
  reportedDate: string;
}

export interface OwnershipData {
  symbol: string;
  companyName: string;
  filingSource: string;
  reportingPeriod: string;
  institutionalOwnershipPct: number;
  insiderOwnershipPct: number;
  retailPublicPct: number;
  topInstitutions: InstitutionalHolder[];
  keyInsiders: InsiderDisclosure[];
  notice: string;
}

export interface PaperPosition {
  symbol: string;
  name: string;
  shares: number;
  avgEntryPrice: number;
  currentPrice: number;
  unrealizedPnl: number;
  unrealizedPnlPct: number;
}

export interface TradeOrder {
  id: string;
  symbol: string;
  side: 'BUY' | 'SELL';
  shares: number;
  price: number;
  fee: number;
  timestamp: string;
}

export interface AlertRule {
  id: string;
  symbol: string;
  conditionType: 'PRICE_ABOVE' | 'PRICE_BELOW' | 'RSI_OVERBOUGHT' | 'RSI_OVERSOLD' | 'VOLATILITY_SURGE';
  thresholdValue: number;
  isActive: boolean;
  createdAt: string;
  triggeredAt?: string;
  message?: string;
}

export interface PipelineStage {
  stage: string;
  status: 'NOMINAL' | 'DEGRADED' | 'LATENT';
  latencyMs: number;
  detail: string;
}
