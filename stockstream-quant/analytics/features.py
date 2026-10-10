"""
STOCKSTREAM QUANT — Feature Engineering Engine
Extracts temporal lags, normalized momentum vectors, and volatility indicators for predictive modeling.
"""

from typing import List, Dict, Any
from analytics.indicators import TechnicalIndicators
from data.preprocessing import TimeSeriesPreprocessor

class FeatureEngineer:
    """Transforms raw OHLCV bars into clean ML training feature matrices."""

    @staticmethod
    def extract_features(bars: List[Dict[str, Any]], lookback: int = 5) -> Dict[str, Any]:
        """
        Extracts tabular features from historical bars:
        - Price return lags (t-1, t-2, t-3)
        - RSI(14)
        - MACD histogram
        - Bollinger Band %B
        - Normalized Volume ratio
        """
        if len(bars) < 30:
            return {"features": [], "targets": [], "columns": []}

        closes = [b["close"] for b in bars]
        highs = [b["high"] for b in bars]
        lows = [b["low"] for b in bars]
        volumes = [b["volume"] for b in bars]

        # Compute technical indicators
        rsi_vals = TechnicalIndicators.rsi(closes, 14)
        macd_res = TechnicalIndicators.macd(closes)
        macd_hist = macd_res["histogram"]
        bb_res = TechnicalIndicators.bollinger_bands(closes, 20)
        pct_b = bb_res["percent_b"]
        vol_sma20 = TechnicalIndicators.sma(volumes, 20)

        feature_rows = []
        targets = []
        feature_names = [
            "ret_lag1", "ret_lag2", "ret_lag3",
            "rsi", "macd_hist", "bollinger_pct_b",
            "vol_ratio"
        ]

        # Valid index starts where all indicators are warmed up (index >= 26)
        start_idx = 26
        for i in range(start_idx, len(bars) - 1):
            if (rsi_vals[i] is None or macd_hist[i] is None or 
                pct_b[i] is None or vol_sma20[i] is None or vol_sma20[i] == 0):
                continue

            # Return lags
            r_lag1 = (closes[i] - closes[i - 1]) / closes[i - 1]
            r_lag2 = (closes[i - 1] - closes[i - 2]) / closes[i - 2]
            r_lag3 = (closes[i - 2] - closes[i - 3]) / closes[i - 3]

            row = [
                round(r_lag1, 5),
                round(r_lag2, 5),
                round(r_lag3, 5),
                round(rsi_vals[i] / 100.0, 4),      # normalized to 0-1
                round(macd_hist[i] / closes[i], 5),  # normalized relative to price
                round(pct_b[i], 4),
                round(volumes[i] / vol_sma20[i], 4)
            ]

            # Target: next period return
            next_ret = (closes[i + 1] - closes[i]) / closes[i]
            feature_rows.append(row)
            targets.append(next_ret)

        return {
            "features": feature_rows,
            "targets": targets,
            "columns": feature_names,
            "current_vector": [
                round((closes[-1] - closes[-2]) / closes[-2], 5) if len(closes) >= 2 else 0.0,
                round((closes[-2] - closes[-3]) / closes[-3], 5) if len(closes) >= 3 else 0.0,
                round((closes[-3] - closes[-4]) / closes[-4], 5) if len(closes) >= 4 else 0.0,
                round((rsi_vals[-1] or 50.0) / 100.0, 4),
                round((macd_hist[-1] or 0.0) / closes[-1], 5),
                round(pct_b[-1] if pct_b[-1] is not None else 0.5, 4),
                round(volumes[-1] / (vol_sma20[-1] or volumes[-1]), 4)
            ]
        }
