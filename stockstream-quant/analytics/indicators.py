"""
STOCKSTREAM QUANT — Quantitative Technical Indicators Engine
Implements SMA, EMA, RSI, MACD, Bollinger Bands, and ATR without relying strictly on external C-bindings.
"""

import math
from typing import List, Dict, Any, Optional

class TechnicalIndicators:
    """Core mathematical technical analysis indicators."""

    @staticmethod
    def sma(data: List[float], period: int) -> List[Optional[float]]:
        """Simple Moving Average."""
        if period <= 0 or len(data) < period:
            return [None] * len(data)

        result = [None] * (period - 1)
        running_sum = sum(data[:period])
        result.append(running_sum / period)

        for i in range(period, len(data)):
            running_sum += data[i] - data[i - period]
            result.append(running_sum / period)

        return result

    @staticmethod
    def ema(data: List[float], period: int) -> List[Optional[float]]:
        """Exponential Moving Average."""
        if period <= 0 or len(data) < period:
            return [None] * len(data)

        multiplier = 2.0 / (period + 1)
        result = [None] * (period - 1)
        initial_sma = sum(data[:period]) / period
        result.append(initial_sma)

        current_ema = initial_sma
        for i in range(period, len(data)):
            current_ema = (data[i] - current_ema) * multiplier + current_ema
            result.append(current_ema)

        return result

    @staticmethod
    def rsi(data: List[float], period: int = 14) -> List[Optional[float]]:
        """Relative Strength Index (Wilder's RSI)."""
        if period <= 0 or len(data) <= period:
            return [None] * len(data)

        gains = []
        losses = []
        for i in range(1, len(data)):
            diff = data[i] - data[i - 1]
            gains.append(max(diff, 0.0))
            losses.append(max(-diff, 0.0))

        result = [None] * period
        avg_gain = sum(gains[:period]) / period
        avg_loss = sum(losses[:period]) / period

        if avg_loss == 0:
            result.append(100.0)
        else:
            rs = avg_gain / avg_loss
            result.append(100.0 - (100.0 / (1.0 + rs)))

        for i in range(period, len(gains)):
            avg_gain = (avg_gain * (period - 1) + gains[i]) / period
            avg_loss = (avg_loss * (period - 1) + losses[i]) / period

            if avg_loss == 0:
                result.append(100.0)
            else:
                rs = avg_gain / avg_loss
                result.append(100.0 - (100.0 / (1.0 + rs)))

        return result

    @staticmethod
    def macd(data: List[float], fast: int = 12, slow: int = 26, signal: int = 9) -> Dict[str, List[Optional[float]]]:
        """Moving Average Convergence Divergence with Signal and Histogram."""
        ema_fast = TechnicalIndicators.ema(data, fast)
        ema_slow = TechnicalIndicators.ema(data, slow)

        macd_line = []
        for f, s in zip(ema_fast, ema_slow):
            if f is not None and s is not None:
                macd_line.append(f - s)
            else:
                macd_line.append(None)

        # Extract non-None values to compute signal EMA
        valid_macd = [x for x in macd_line if x is not None]
        signal_raw = TechnicalIndicators.ema(valid_macd, signal) if len(valid_macd) >= signal else [None] * len(valid_macd)

        # Re-pad signal line with leading None values
        pad_count = len(macd_line) - len(valid_macd)
        signal_line = [None] * pad_count + signal_raw

        histogram = []
        for m, s in zip(macd_line, signal_line):
            if m is not None and s is not None:
                histogram.append(m - s)
            else:
                histogram.append(None)

        return {
            "macd": macd_line,
            "signal": signal_line,
            "histogram": histogram
        }

    @staticmethod
    def bollinger_bands(data: List[float], period: int = 20, num_std: float = 2.0) -> Dict[str, List[Optional[float]]]:
        """Bollinger Bands (Middle, Upper, Lower, %B)."""
        mid_sma = TechnicalIndicators.sma(data, period)
        upper = []
        lower = []
        percent_b = []

        for i in range(len(data)):
            if mid_sma[i] is None:
                upper.append(None)
                lower.append(None)
                percent_b.append(None)
                continue

            window = data[i - period + 1 : i + 1]
            mean = mid_sma[i]
            variance = sum((x - mean) ** 2 for x in window) / period
            std = math.sqrt(variance)

            up = mean + num_std * std
            dn = mean - num_std * std
            pb = (data[i] - dn) / (up - dn) if (up - dn) != 0 else 0.5

            upper.append(up)
            lower.append(dn)
            percent_b.append(pb)

        return {
            "middle": mid_sma,
            "upper": upper,
            "lower": lower,
            "percent_b": percent_b
        }

    @staticmethod
    def atr(highs: List[float], lows: List[float], closes: List[float], period: int = 14) -> List[Optional[float]]:
        """Average True Range (volatility metric)."""
        if len(closes) < 2 or len(highs) != len(closes) or len(lows) != len(closes):
            return [None] * len(closes)

        tr = [highs[0] - lows[0]]
        for i in range(1, len(closes)):
            h_l = highs[i] - lows[i]
            h_pc = abs(highs[i] - closes[i - 1])
            l_pc = abs(lows[i] - closes[i - 1])
            tr.append(max(h_l, h_pc, l_pc))

        return TechnicalIndicators.sma(tr, period)
