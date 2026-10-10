"""
Unit tests for mathematical technical analysis indicators.
"""

import unittest
from analytics.indicators import TechnicalIndicators

class TestIndicators(unittest.TestCase):

    def test_sma_calculation(self):
        data = [10.0, 20.0, 30.0, 40.0, 50.0]
        sma3 = TechnicalIndicators.sma(data, 3)
        self.assertEqual(len(sma3), 5)
        self.assertIsNone(sma3[0])
        self.assertIsNone(sma3[1])
        self.assertAlmostEqual(sma3[2], 20.0)
        self.assertAlmostEqual(sma3[3], 30.0)
        self.assertAlmostEqual(sma3[4], 40.0)

    def test_ema_calculation(self):
        data = [10.0, 11.0, 12.0, 13.0, 14.0]
        ema3 = TechnicalIndicators.ema(data, 3)
        self.assertEqual(len(ema3), 5)
        self.assertIsNone(ema3[0])
        self.assertIsNone(ema3[1])
        self.assertAlmostEqual(ema3[2], 11.0)
        # Multiplier = 2 / (3+1) = 0.5
        # EMA[3] = (13 - 11) * 0.5 + 11 = 12.0
        self.assertAlmostEqual(ema3[3], 12.0)

    def test_rsi_range(self):
        # 25 increasing prices -> RSI should be high
        prices = [100.0 + i * 2.0 for i in range(25)]
        rsi_vals = TechnicalIndicators.rsi(prices, 14)
        valid = [r for r in rsi_vals if r is not None]
        self.assertTrue(len(valid) > 0)
        self.assertTrue(all(0.0 <= r <= 100.0 for r in valid))
        self.assertGreater(valid[-1], 80.0)

    def test_bollinger_bands_geometry(self):
        prices = [100.0 + (i % 3) * 5.0 for i in range(30)]
        bb = TechnicalIndicators.bollinger_bands(prices, 20)
        for u, m, l in zip(bb["upper"], bb["middle"], bb["lower"]):
            if u is not None and m is not None and l is not None:
                self.assertGreaterEqual(u, m)
                self.assertGreaterEqual(m, l)

if __name__ == "__main__":
    unittest.main()
