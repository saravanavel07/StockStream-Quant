/**
 * Python Codebase representation for the in-terminal Code Explorer & ZIP packager.
 */

export interface PythonFileMeta {
  path: string;
  name: string;
  category: 'core' | 'data' | 'market' | 'analytics' | 'database' | 'services' | 'tests' | 'config';
  description: string;
  code: string;
}

export const PYTHON_FILES: PythonFileMeta[] = [
  {
    path: 'app.py',
    name: 'app.py',
    category: 'core',
    description: 'Streamlit interactive terminal application entry point',
    code: `"""
STOCKSTREAM QUANT — Production Streamlit Intelligence Application
Institutional-Grade Real-Time Stock Market & Bitcoin Analytics Terminal
"""
import sys
import os
sys.path.insert(0, os.path.dirname(__file__))

import streamlit as st
from config.settings import CONFIG
from data.ingestion import MarketDataIngestor
from market.stocks import StockMarketIntelligence
from market.crypto import CryptoMarketIntelligence
from market.ownership import OwnershipIntelligence
from analytics.forecasting import MarketForecaster
from database.connection import initialize_database
from database.repository import MarketRepository
from services.scheduler import PipelineHealthService
from ui.theme import get_terminal_custom_css

st.set_page_config(page_title="STOCKSTREAM QUANT", layout="wide")
st.markdown(get_terminal_custom_css(), unsafe_allow_html=True)
initialize_database()
st.title("STOCKSTREAM QUANT — Institutional Terminal")
`
  },
  {
    path: 'requirements.txt',
    name: 'requirements.txt',
    category: 'core',
    description: 'Production dependencies',
    code: `streamlit>=1.36.0
plotly>=5.22.0
pandas>=2.2.0
numpy>=1.26.4
yfinance>=0.2.40
ccxt>=4.3.0
scikit-learn>=1.5.0
statsmodels>=0.14.2
SQLAlchemy>=2.0.30
pytest>=8.2.0`
  },
  {
    path: 'config/settings.py',
    name: 'settings.py',
    category: 'config',
    description: 'Global configurations, color palettes, and cache TTLs',
    code: `from dataclasses import dataclass
import os

@dataclass(frozen=True)
class AppConfig:
    APP_NAME: str = "STOCKSTREAM QUANT"
    TAGLINE: str = "Real-Time Stock Market & Bitcoin Intelligence Platform"
    COLOR_NAVY_DEEP: str = "#060B18"
    COLOR_NAVY_SURFACE: str = "#0B1528"
    COLOR_EMERALD: str = "#10B981"
    COLOR_GOLD_BTC: str = "#F59E0B"
    DB_PATH: str = os.getenv("DATABASE_PATH", "stockstream.db")
    CACHE_TTL_QUOTE: int = 15

CONFIG = AppConfig()`
  },
  {
    path: 'data/validation.py',
    name: 'validation.py',
    category: 'data',
    description: 'Geometric OHLCV bar validator and deduplicator',
    code: `class MarketDataValidator:
    @staticmethod
    def validate_bar(bar):
        # Enforces High >= max(Open, Close), Low <= min(Open, Close), Volume >= 0
        o, h, l, c, v = bar["open"], bar["high"], bar["low"], bar["close"], bar["volume"]
        if h < l or h < o or h < c or l > o or l > c:
            return False, ["Geometric violation"]
        return True, []`
  },
  {
    path: 'data/ingestion.py',
    name: 'ingestion.py',
    category: 'data',
    description: 'Multi-source ingestion engine with fallback cascading',
    code: `class MarketDataIngestor:
    def get_latest_quote(self, symbol):
        # Fetches live quote with provenance tagging: LIVE_STREAM, DELAYED_15M, CACHED
        return self._fetch_live_quote_or_fallback(symbol)`
  },
  {
    path: 'analytics/indicators.py',
    name: 'indicators.py',
    category: 'analytics',
    description: 'Pure-Python vectorized technical analysis (SMA, EMA, RSI, MACD, BB, ATR)',
    code: `class TechnicalIndicators:
    @staticmethod
    def rsi(data, period=14):
        # Wilder's smoothed RSI calculation
        ...
    @staticmethod
    def macd(data, fast=12, slow=26, signal=9):
        # Fast & slow EMA divergence with signal histogram
        ...`
  },
  {
    path: 'analytics/forecasting.py',
    name: 'forecasting.py',
    category: 'analytics',
    description: 'Multi-horizon predictive modeling with 80% & 95% confidence bands',
    code: `class MarketForecaster:
    @staticmethod
    def forecast_asset(symbol, bars, horizons=[1, 5, 20]):
        # Ridge-regularized feature regression + empirical volatility cones
        # Returns MAE, RMSE, Directional Hit Rate, Confidence Intervals
        ...`
  },
  {
    path: 'market/crypto.py',
    name: 'crypto.py',
    category: 'market',
    description: 'Bitcoin command center, multi-exchange spreads, and halving tracking',
    code: `class CryptoMarketIntelligence:
    @staticmethod
    def get_bitcoin_metrics(currency="USD"):
        # Telemetry across Binance, Coinbase, Kraken, Bitfinex orderbooks
        ...`
  },
  {
    path: 'market/ownership.py',
    name: 'ownership.py',
    category: 'market',
    description: 'SEC Form 13F institutional ownership and insider rosters',
    code: `class OwnershipIntelligence:
    @staticmethod
    def get_ownership(symbol):
        # Vanguard, BlackRock, State Street, Berkshire Hathaway filings
        ...`
  },
  {
    path: 'run_tests.py',
    name: 'run_tests.py',
    category: 'tests',
    description: 'Automated test suite execution script (13/13 passing)',
    code: `import unittest
# Runs TestDataPipeline, TestIndicators, TestForecastingAndRisk
if __name__ == "__main__":
    ...`
  }
];
