"""
Unit tests for forecasting models, feature engineering, backtesting, and risk calculations.
"""

import unittest
from analytics.forecasting import MarketForecaster
from analytics.features import FeatureEngineer
from analytics.backtesting import StrategyBacktester
from analytics.risk import RiskEvaluator

class TestForecastingAndRisk(unittest.TestCase):

    def setUp(self):
        # Generate 60 test bars
        self.sample_bars = []
        p = 100.0
        for i in range(60):
            p = max(p + ((i % 4) - 1.5), 10.0)
            self.sample_bars.append({
                "timestamp": f"2024-01-{i+1:02d}" if i < 30 else f"2024-02-{i-29:02d}",
                "open": p - 0.5,
                "high": p + 1.5,
                "low": p - 1.2,
                "close": p,
                "volume": 100000 + i * 500
            })

    def test_feature_extraction(self):
        feat = FeatureEngineer.extract_features(self.sample_bars)
        self.assertIn("features", feat)
        self.assertIn("targets", feat)
        self.assertGreater(len(feat["features"]), 0)
        self.assertEqual(len(feat["features"]), len(feat["targets"]))

    def test_forecast_generation(self):
        forecast = MarketForecaster.forecast_asset("TEST_SYM", self.sample_bars)
        self.assertNotIn("error", forecast)
        self.assertIn("projections", forecast)
        self.assertIn("1D", forecast["projections"])
        self.assertIn("5D", forecast["projections"])
        self.assertIn("20D", forecast["projections"])
        
        # Verify 80% and 95% confidence intervals exist and are ordered
        p5d = forecast["projections"]["5D"]
        self.assertLessEqual(p5d["confidence_95"]["lower"], p5d["confidence_80"]["lower"])
        self.assertGreaterEqual(p5d["confidence_95"]["upper"], p5d["confidence_80"]["upper"])

    def test_backtester(self):
        bt = StrategyBacktester.run_backtest(self.sample_bars, initial_capital=10000.0)
        self.assertNotIn("error", bt)
        self.assertIn("final_equity", bt)
        self.assertIn("sharpe_ratio", bt)
        self.assertIn("max_drawdown_pct", bt)

    def test_risk_var_cvar(self):
        returns = [-0.04, -0.02, -0.01, 0.005, 0.01, 0.02, 0.03, -0.03, 0.015, -0.015]
        risk = RiskEvaluator.calculate_var_cvar(returns, confidence=0.90)
        self.assertGreater(risk["var_pct"], 0)
        self.assertGreaterEqual(risk["cvar_pct"], risk["var_pct"])

if __name__ == "__main__":
    unittest.main()
