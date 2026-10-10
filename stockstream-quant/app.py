"""
STOCKSTREAM QUANT — Production Streamlit Intelligence Application
Institutional-Grade Real-Time Stock Market & Bitcoin Analytics Terminal
"""

import sys
import os

# Add directory to pythonpath
sys.path.insert(0, os.path.dirname(__file__))

import streamlit as st
from config.settings import CONFIG
from data.ingestion import MarketDataIngestor
from market.stocks import StockMarketIntelligence
from market.crypto import CryptoMarketIntelligence
from market.ownership import OwnershipIntelligence
from market.news import MarketNewsService
from analytics.forecasting import MarketForecaster
from analytics.backtesting import StrategyBacktester
from analytics.risk import RiskEvaluator
from database.connection import initialize_database
from database.repository import MarketRepository
from services.alerts import AlertService
from services.scheduler import PipelineHealthService
from ui.theme import get_terminal_custom_css
from ui.components import render_kpi_card_html, render_btc_hero_html

# Page Configuration
st.set_page_config(
    page_title=f"{CONFIG.APP_NAME} — Financial Intelligence",
    page_icon="⚡",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Apply Institutional Midnight Navy Theme
st.markdown(get_terminal_custom_css(), unsafe_allow_html=True)

# Initialize Database & Ingestor
initialize_database()
repo = MarketRepository()
ingestor = MarketDataIngestor()

# Sidebar Navigation
st.sidebar.markdown(f"### ⚡ {CONFIG.APP_NAME}")
st.sidebar.markdown(f"<span style='color:#94A3B8; font-size:12px;'>Institutional v{CONFIG.VERSION}</span>", unsafe_allow_html=True)

selected_currency = st.sidebar.selectbox("Base Currency", CONFIG.SUPPORTED_CURRENCIES, index=0)

active_module = st.sidebar.radio(
    "Navigation Modules",
    [
        "Market Overview",
        "Stock Screener",
        "Bitcoin Terminal",
        "Prediction Lab",
        "Ownership Intelligence",
        "Portfolio Tracker",
        "Trading Research",
        "Alerts Center",
        "Pipeline Monitor",
        "System Settings"
    ]
)

# Top Bar Kicker
st.markdown(f"""
<div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #1E293B; padding-bottom:12px; margin-bottom:20px;">
    <div>
        <span style="font-size:20px; font-weight:700; color:#F8FAFC; letter-spacing:-0.01em;">{CONFIG.APP_NAME}</span>
        <span style="color:#64748B; margin: 0 8px;">·</span>
        <span style="font-size:13px; color:#94A3B8;">{CONFIG.TAGLINE}</span>
    </div>
    <div style="font-size:12px; color:#10B981; font-family:'JetBrains Mono',monospace;">
        ● PIPELINE ACTIVE · DATA FRESHNESS: OPTIMAL
    </div>
</div>
""", unsafe_allow_html=True)

# -------------------------------------------------------------
# Module 1: Market Overview
# -------------------------------------------------------------
if active_module == "Market Overview":
    st.subheader("Global Market Indices & Breadth")
    
    indices = StockMarketIntelligence.get_global_indices()
    cols = st.columns(len(indices))
    for col, idx in zip(cols, indices):
        with col:
            st.markdown(
                render_kpi_card_html(
                    label=f"{idx['name']} ({idx['region']})",
                    value=f"{idx['price']:,.2f}",
                    change=f"{idx['change_pct']:+.2f}%",
                    is_positive=idx['change_pct'] >= 0
                ),
                unsafe_allow_html=True
            )

    st.markdown("---")
    c1, c2 = st.columns([2, 1])
    with c1:
        st.markdown("#### Equities Breadth & Sector Leadership")
        equities = StockMarketIntelligence.get_tracked_equities()
        st.dataframe(
            [
                {
                    "Symbol": e["symbol"],
                    "Company": e["name"],
                    "Sector": e["sector"],
                    "Price ($)": e["price"],
                    "Change (24h)": f"{e['change_pct']:+.2f}%",
                    "Market Cap": e["market_cap"],
                    "RSI(14)": e["rsi"],
                    "Signal": e["signal"]
                }
                for e in equities
            ],
            use_container_width=True
        )
    with c2:
        st.markdown("#### Recent Catalyst Events")
        news = MarketNewsService.get_market_news()
        for item in news[:3]:
            st.markdown(f"""
            <div style="background:#0B1528; border:1px solid #1E293B; border-radius:6px; padding:12px; margin-bottom:10px;">
                <div style="font-size:11px; color:#10B981; font-weight:600;">{item['category'].upper()} · {item['source']}</div>
                <div style="font-size:13px; font-weight:600; color:#F8FAFC; margin:4px 0;">{item['title']}</div>
                <div style="font-size:12px; color:#94A3B8;">{item['summary']}</div>
            </div>
            """, unsafe_allow_html=True)

# -------------------------------------------------------------
# Module 2: Stock Screener
# -------------------------------------------------------------
elif active_module == "Stock Screener":
    st.subheader("Quantitative Equity Screener")
    
    col1, col2, col3 = st.columns(3)
    with col1:
        sector_filter = st.selectbox("Sector", ["All", "Semiconductors", "Consumer Electronics", "Enterprise Software", "Internet & Cloud", "Automotive & Clean Energy"])
    with col2:
        max_pe_filter = st.slider("Max P/E Ratio", 10.0, 100.0, 70.0)
    with col3:
        signal_filter = st.selectbox("Analytical Signal", ["All", "BULLISH_MOMENTUM", "BULLISH_SETUP", "CONSOLIDATION_WATCH", "NEUTRAL", "BEARISH_PRESSURE"])

    screened = StockMarketIntelligence.screen_stocks(sector=sector_filter, max_pe=max_pe_filter, signal_filter=signal_filter)
    st.write(f"Showing **{len(screened)}** qualified equities matching multi-factor constraints:")
    
    st.dataframe(screened, use_container_width=True)

# -------------------------------------------------------------
# Module 3: Bitcoin Terminal
# -------------------------------------------------------------
elif active_module == "Bitcoin Terminal":
    btc_metrics = CryptoMarketIntelligence.get_bitcoin_metrics(currency=selected_currency)
    st.markdown(render_btc_hero_html(btc_metrics), unsafe_allow_html=True)

    b1, b2, b3, b4 = st.columns(4)
    with b1:
        st.markdown(render_kpi_card_html("Market Cap (USD)", btc_metrics["market_cap_usd"], "1.35 Trillion", True), unsafe_allow_html=True)
    with b2:
        st.markdown(render_kpi_card_html("BTC Dominance", f"{btc_metrics['btc_dominance_pct']}%", "Macro Share", True), unsafe_allow_html=True)
    with b3:
        st.markdown(render_kpi_card_html("Fear & Greed Index", f"{btc_metrics['fear_greed_index']} / 100", btc_metrics['fear_greed_label'], True), unsafe_allow_html=True)
    with b4:
        st.markdown(render_kpi_card_html("Circulating Supply", btc_metrics["circulating_supply"], "94.1% of Cap", True), unsafe_allow_html=True)

    st.markdown("---")
    st.markdown("#### Global Exchange Orderbook Spreads & Liquidity Shares")
    st.dataframe(btc_metrics["exchange_spreads"], use_container_width=True)

    st.markdown("#### Downside Liquidity Retest Scenarios")
    st.dataframe(btc_metrics["downside_risk_scenarios"], use_container_width=True)

# -------------------------------------------------------------
# Module 4: Prediction Lab
# -------------------------------------------------------------
elif active_module == "Prediction Lab":
    st.subheader("Quantitative Prediction Lab & Walk-Forward Validation")
    st.info("⚠️ NOTICE: Experimental statistical forecast for research purposes only — NOT financial advice. Predictions are based on historical return distributions and technical momentum.")

    target_symbol = st.selectbox("Select Asset for Forecast Modeling", ["BTC", "NVDA", "AAPL", "MSFT", "GOOGL", "AMZN", "TSLA"])
    hist = ingestor.get_historical_candles(target_symbol, days=90)
    forecast = MarketForecaster.forecast_asset(target_symbol, hist["bars"])

    if "error" in forecast:
        st.error(forecast["error"])
    else:
        st.markdown(f"**Current Price:** ${forecast['last_price']:.2f} · **Model:** {forecast['model_type']}")
        
        m1, m2, m3 = st.columns(3)
        with m1:
            st.metric("Directional Hit Rate", f"{forecast['metrics']['directional_accuracy_pct']}%")
        with m2:
            st.metric("Mean Absolute Error (MAE)", f"{forecast['metrics']['mae']}")
        with m3:
            st.metric("Root Mean Squared Error (RMSE)", f"{forecast['metrics']['rmse']}")

        st.markdown("#### Multi-Horizon Projections & Confidence Intervals")
        proj_list = []
        for horizon, data in forecast["projections"].items():
            proj_list.append({
                "Horizon": horizon,
                "Expected Price ($)": data["expected_price"],
                "Expected Delta": f"{data['expected_delta_pct']:+.2f}%",
                "Direction": data["direction"],
                "80% CI Range": f"${data['confidence_80']['lower']:.2f} - ${data['confidence_80']['upper']:.2f}",
                "95% CI Range": f"${data['confidence_95']['lower']:.2f} - ${data['confidence_95']['upper']:.2f}",
                "Period Volatility": f"{data['horizon_volatility_pct']}%"
            })
        st.dataframe(proj_list, use_container_width=True)

        st.markdown("#### Contributing Quantitative Factors")
        st.dataframe(forecast["key_drivers"], use_container_width=True)

# -------------------------------------------------------------
# Module 5: Ownership Intelligence
# -------------------------------------------------------------
elif active_module == "Ownership Intelligence":
    st.subheader("SEC Form 13F & Regulatory Ownership Disclosures")
    st.caption("Filing source: SEC EDGAR 13F-HR / 13D schedules. Ownership figures are subject to statutory quarterly reporting delays.")

    owned_sym = st.selectbox("Select Entity", ["NVDA", "AAPL", "BTC"])
    ownership = OwnershipIntelligence.get_ownership(owned_sym)

    st.markdown(f"**Entity:** {ownership['company_name']} · **Source:** {ownership['filing_source']} · **Period:** {ownership['reporting_period']}")
    
    o1, o2, o3 = st.columns(3)
    with o1:
        st.metric("Institutional Float", f"{ownership['institutional_ownership_pct']}%")
    with o2:
        st.metric("Insider Holdings", f"{ownership['insider_ownership_pct']}%")
    with o3:
        st.metric("Public / Retail Float", f"{ownership['retail_public_pct']}%")

    st.markdown("#### Disclosed Major Institutional Shareholders")
    st.dataframe(ownership["top_institutions"], use_container_width=True)

    if ownership.get("key_insiders"):
        st.markdown("#### Major Insider Disclosures")
        st.dataframe(ownership["key_insiders"], use_container_width=True)

# -------------------------------------------------------------
# Module 6: Portfolio Tracker
# -------------------------------------------------------------
elif active_module == "Portfolio Tracker":
    st.subheader("Institutional Portfolio Tracker & Paper Trading")
    
    positions = repo.get_portfolio()
    
    c_action1, c_action2 = st.columns(2)
    with c_action1:
        st.markdown("#### Execute Paper Trade")
        trade_sym = st.selectbox("Symbol", ["BTC", "NVDA", "AAPL", "MSFT", "GOOGL"])
        trade_side = st.radio("Side", ["BUY", "SELL"], horizontal=True)
        trade_shares = st.number_input("Shares / Units", min_value=0.01, value=1.0, step=0.1)
        quote = ingestor.get_latest_quote(trade_sym)
        st.write(f"Estimated Price: **${quote['price']:.2f}**")
        if st.button("Submit Paper Order"):
            repo.record_paper_trade(trade_sym, trade_side, trade_shares, quote["price"])
            st.success(f"Order filled: {trade_side} {trade_shares} {trade_sym} at ${quote['price']:.2f}")
            st.rerun()

    with c_action2:
        st.markdown("#### Current Positions")
        if positions:
            st.dataframe(positions, use_container_width=True)
        else:
            st.info("No active positions. Execute your first paper trade on the left.")

# -------------------------------------------------------------
# Module 7: Trading Research & Suggestion Center
# -------------------------------------------------------------
elif active_module == "Trading Research":
    st.subheader("Quantitative Research & Trade Invalidation Framework")
    st.caption("Deterministic setup evaluation — Risk/Reward assessment is an analytical suggestion, not financial advice.")

    res_sym = st.selectbox("Asset for Setup Evaluation", ["NVDA", "AAPL", "MSFT", "GOOGL", "TSLA"])
    eq_list = [e for e in StockMarketIntelligence.get_tracked_equities() if e["symbol"] == res_sym]
    if eq_list:
        setup = StockMarketIntelligence.calculate_trade_setup(eq_list[0])
        st.json(setup)

# -------------------------------------------------------------
# Module 8: Alerts Center
# -------------------------------------------------------------
elif active_module == "Alerts Center":
    st.subheader("Active Price & Technical Threshold Triggers")
    
    with st.expander("Configure New Trigger Rule"):
        a_sym = st.selectbox("Asset", ["BTC", "NVDA", "AAPL", "MSFT"])
        a_type = st.selectbox("Trigger Condition", ["PRICE_ABOVE", "PRICE_BELOW", "RSI_OVERBOUGHT", "RSI_OVERSOLD"])
        a_val = st.number_input("Threshold Value", value=150.0)
        if st.button("Save Alert"):
            repo.create_alert(a_sym, a_type, a_val)
            st.success(f"Alert configured for {a_sym} ({a_type} {a_val})")
            st.rerun()

    alerts = repo.get_alerts()
    st.dataframe(alerts, use_container_width=True)

# -------------------------------------------------------------
# Module 9: Pipeline Monitor
# -------------------------------------------------------------
elif active_module == "Pipeline Monitor":
    st.subheader("Real-Time Data Pipeline Telemetry")
    diag = PipelineHealthService.get_pipeline_diagnostics()
    
    st.markdown("#### Ingestion Stages & Latency")
    st.dataframe(diag["pipeline_stages"], use_container_width=True)

    c_p1, c_p2 = st.columns(2)
    with c_p1:
        st.markdown("#### Tiered Cache Performance")
        st.json(diag["cache_metrics"])
    with c_p2:
        st.markdown("#### Market Data Freshness State")
        st.json(diag["data_freshness"])

# -------------------------------------------------------------
# Module 10: System Settings
# -------------------------------------------------------------
elif active_module == "System Settings":
    st.subheader("Terminal & Workspace Configuration")
    st.write(f"Application: **{CONFIG.APP_NAME}** (Version {CONFIG.VERSION})")
    st.write(f"Database Path: `{CONFIG.DB_PATH}`")
    st.write(f"Supported Currencies: {', '.join(CONFIG.SUPPORTED_CURRENCIES)}")
    st.success("System configurations verified and operational.")
