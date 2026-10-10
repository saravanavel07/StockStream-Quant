"""
STOCKSTREAM QUANT — Preprocessing & Series Normalization
Handles market holidays, gap filling, logarithmic returns, and feature scaling.
"""

import math
from typing import List, Dict, Any

class TimeSeriesPreprocessor:
    """Preprocesses raw price bars into normalized numerical inputs."""

    @staticmethod
    def calculate_log_returns(closes: List[float]) -> List[float]:
        """Calculates natural log returns: ln(P_t / P_{t-1})."""
        if len(closes) < 2:
            return []
        returns = []
        for i in range(1, len(closes)):
            prev, curr = closes[i - 1], closes[i]
            if prev <= 0 or curr <= 0:
                returns.append(0.0)
            else:
                returns.append(math.log(curr / prev))
        return returns

    @staticmethod
    def calculate_simple_returns(closes: List[float]) -> List[float]:
        """Calculates percentage returns: (P_t - P_{t-1}) / P_{t-1}."""
        if len(closes) < 2:
            return []
        returns = []
        for i in range(1, len(closes)):
            prev, curr = closes[i - 1], closes[i]
            if prev <= 0:
                returns.append(0.0)
            else:
                returns.append((curr - prev) / prev)
        return returns

    @staticmethod
    def min_max_normalize(series: List[float]) -> List[float]:
        """Scale values into [0.0, 1.0]."""
        if not series:
            return []
        min_v = min(series)
        max_v = max(series)
        rng = max_v - min_v
        if rng == 0:
            return [0.5 for _ in series]
        return [(x - min_v) / rng for x in series]

    @staticmethod
    def z_score_standardize(series: List[float]) -> List[float]:
        """Standardize series to mean=0, std=1."""
        if len(series) < 2:
            return [0.0 for _ in series]
        mean = sum(series) / len(series)
        variance = sum((x - mean) ** 2 for x in series) / (len(series) - 1)
        std = math.sqrt(variance)
        if std == 0:
            return [0.0 for _ in series]
        return [(x - mean) / std for x in series]

    @staticmethod
    def forward_fill_gaps(bars: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Ensures consecutive integrity by forward-filling any None price attributes."""
        if not bars:
            return []
        cleaned = []
        last_valid_close = None

        for bar in bars:
            b = dict(bar)
            if b.get("close") is not None:
                last_valid_close = b["close"]
            elif last_valid_close is not None:
                b["close"] = last_valid_close
                b["open"] = last_valid_close
                b["high"] = last_valid_close
                b["low"] = last_valid_close

            cleaned.append(b)
        return cleaned
