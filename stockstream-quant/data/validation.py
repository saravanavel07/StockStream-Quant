"""
STOCKSTREAM QUANT — Data Validation Pipeline
Validates timestamps, missing values, duplicate records, non-negative prices, and volume anomalies.
"""

from typing import Dict, List, Any, Tuple
from datetime import datetime

class DataValidationError(Exception):
    """Raised when data fails strict financial verification."""
    pass

class MarketDataValidator:
    """Rigorous validation for time-series bars and tick quotes."""

    @staticmethod
    def validate_bar(bar: Dict[str, Any]) -> Tuple[bool, List[str]]:
        """
        Validates an OHLCV bar dictionary.
        Required fields: timestamp, open, high, low, close, volume.
        """
        errors = []
        required_fields = ["timestamp", "open", "high", "low", "close", "volume"]
        for field in required_fields:
            if field not in bar or bar[field] is None:
                errors.append(f"Missing required field: '{field}'")

        if errors:
            return False, errors

        # Validate timestamp
        ts = bar["timestamp"]
        if not isinstance(ts, (str, datetime, int, float)):
            errors.append(f"Invalid timestamp type: {type(ts)}")

        # Validate numeric ranges
        o, h, l, c, v = bar["open"], bar["high"], bar["low"], bar["close"], bar["volume"]
        for name, val in [("open", o), ("high", h), ("low", l), ("close", c)]:
            if not isinstance(val, (int, float)) or val <= 0:
                errors.append(f"Price '{name}' must be positive numeric, got {val}")

        if not isinstance(v, (int, float)) or v < 0:
            errors.append(f"Volume must be non-negative, got {v}")

        # Validate OHLC geometric sanity
        if errors:
            return False, errors

        if h < l:
            errors.append(f"High ({h}) cannot be lower than Low ({l})")
        if h < o or h < c:
            errors.append(f"High ({h}) must be >= Open ({o}) and Close ({c})")
        if l > o or l > c:
            errors.append(f"Low ({l}) must be <= Open ({o}) and Close ({c})")

        return len(errors) == 0, errors

    @staticmethod
    def validate_series(bars: List[Dict[str, Any]]) -> Tuple[List[Dict[str, Any]], Dict[str, int]]:
        """
        Deduplicates, sorts by timestamp, and validates an array of bars.
        Returns cleaned bars and validation metrics.
        """
        metrics = {"total": len(bars), "valid": 0, "duplicates_removed": 0, "invalid_dropped": 0}
        seen_timestamps = set()
        clean_bars = []

        for bar in bars:
            is_valid, _ = MarketDataValidator.validate_bar(bar)
            if not is_valid:
                metrics["invalid_dropped"] += 1
                continue

            ts = bar["timestamp"]
            ts_key = ts.isoformat() if isinstance(ts, datetime) else str(ts)
            if ts_key in seen_timestamps:
                metrics["duplicates_removed"] += 1
                continue

            seen_timestamps.add(ts_key)
            clean_bars.append(bar)
            metrics["valid"] += 1

        clean_bars.sort(key=lambda b: b["timestamp"] if isinstance(b["timestamp"], (int, float, datetime)) else str(b["timestamp"]))
        return clean_bars, metrics
