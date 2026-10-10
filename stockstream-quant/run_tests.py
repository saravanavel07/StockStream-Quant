#!/usr/bin/env python3
"""
STOCKSTREAM QUANT — Automated Test Suite Runner
Runs unit tests across data, analytics, indicators, forecasting, and repository modules.
"""

import sys
import os
import unittest

# Ensure current directory is in sys.path
sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))

def run_all_tests():
    print("=" * 70)
    print("⚡ STOCKSTREAM QUANT — Automated Test Runner")
    print("=" * 70)
    loader = unittest.TestLoader()
    suite = unittest.TestSuite()

    # Load test modules
    from tests.test_data import TestDataPipeline
    from tests.test_indicators import TestIndicators
    from tests.test_forecasting import TestForecastingAndRisk

    suite.addTests(loader.loadTestsFromTestCase(TestDataPipeline))
    suite.addTests(loader.loadTestsFromTestCase(TestIndicators))
    suite.addTests(loader.loadTestsFromTestCase(TestForecastingAndRisk))

    runner = unittest.TextTestRunner(verbosity=2)
    result = runner.run(suite)

    if result.wasSuccessful():
        print("\n✅ All unit tests PASSED successfully.")
        return 0
    else:
        print(f"\n❌ Test failures detected: {len(result.failures)} failures, {len(result.errors)} errors.")
        return 1

if __name__ == "__main__":
    sys.exit(run_all_tests())
