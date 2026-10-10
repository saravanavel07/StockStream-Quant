"""
Unit tests for data validation, preprocessing, and cache modules.
"""

import unittest
from datetime import datetime
from data.validation import MarketDataValidator
from data.cache import MemoryCache
from data.preprocessing import TimeSeriesPreprocessor

class TestDataPipeline(unittest.TestCase):

    def test_bar_validation_valid(self):
        valid_bar = {
            "timestamp": "2024-10-01",
            "open": 100.0,
            "high": 105.0,
            "low": 98.0,
            "close": 102.0,
            "volume": 1500000
        }
        is_valid, errors = MarketDataValidator.validate_bar(valid_bar)
        self.assertTrue(is_valid)
        self.assertEqual(len(errors), 0)

    def test_bar_validation_invalid_geometry(self):
        # High lower than low
        bad_bar = {
            "timestamp": "2024-10-01",
            "open": 100.0,
            "high": 95.0,
            "low": 98.0,
            "close": 96.0,
            "volume": 1500000
        }
        is_valid, errors = MarketDataValidator.validate_bar(bad_bar)
        self.assertFalse(is_valid)
        self.assertTrue(any("cannot be lower than Low" in e for e in errors))

    def test_series_deduplication(self):
        bars = [
            {"timestamp": "2024-10-01", "open": 10.0, "high": 12.0, "low": 9.0, "close": 11.0, "volume": 100},
            {"timestamp": "2024-10-01", "open": 10.0, "high": 12.0, "low": 9.0, "close": 11.0, "volume": 100},
            {"timestamp": "2024-10-02", "open": 11.0, "high": 13.0, "low": 10.0, "close": 12.0, "volume": 150},
        ]
        clean, metrics = MarketDataValidator.validate_series(bars)
        self.assertEqual(len(clean), 2)
        self.assertEqual(metrics["duplicates_removed"], 1)

    def test_memory_cache(self):
        cache = MemoryCache(default_ttl_sec=10)
        cache.set("BTC_KEY", 68000.0)
        self.assertEqual(cache.get("BTC_KEY"), 68000.0)
        self.assertEqual(cache.hits, 1)
        self.assertIsNone(cache.get("NON_EXISTENT"))
        self.assertEqual(cache.misses, 1)

    def test_log_returns(self):
        prices = [100.0, 110.0, 121.0]
        returns = TimeSeriesPreprocessor.calculate_log_returns(prices)
        self.assertEqual(len(returns), 2)
        self.assertAlmostEqual(returns[0], 0.09531, places=4)

if __name__ == "__main__":
    unittest.main()
