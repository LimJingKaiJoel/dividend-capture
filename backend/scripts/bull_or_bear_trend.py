from ta.trend import SMAIndicator
import yfinance as yf
import pandas as pd
from helpers import load_data

def get_trend(ticker_name, sma_short_window=10, sma_long_window=20, momentum_days=10, momentum_threshold=0.02):
    """
    Determines whether the stock is bullish, bearish, or in consolidation based on short-term trends
        - Takes into account momentum and whether SMA short or SMA long is higher
    
    returns a string: "Bullish", "Bearish", or "Consolidation". ("Unknown" if error)
    """
    # .download() as we don't need the other info that comes with .price_history()
    price_data = yf.download(ticker_name, period="6mo", interval="1d")
    
    if price_data.empty or 'Close' not in price_data:
        return "Unknown"

    # have to squeeze as its a 2d array
    close_prices = price_data['Close'].squeeze()

    # get sma of short window and long windows
    sma_short = SMAIndicator(close=close_prices, window=sma_short_window)
    sma_long = SMAIndicator(close=close_prices, window=sma_long_window)
    price_data['SMA_short'] = sma_short.sma_indicator()
    price_data['SMA_long'] = sma_long.sma_indicator()

    # get momentum (percentage change)
    price_data['Momentum'] = close_prices.pct_change(periods=momentum_days)

    # get latest value
    latest_sma_short = price_data['SMA_short'].iloc[-1]
    latest_sma_long = price_data['SMA_long'].iloc[-1]
    latest_momentum = price_data['Momentum'].iloc[-1]

    # bullish if sma short higher than sma long and momentum validates it, bearish if opposite
    if latest_sma_short > latest_sma_long and latest_momentum > momentum_threshold:
        return "Bullish"
    elif latest_sma_short < latest_sma_long and latest_momentum < -momentum_threshold:
        return "Bearish"
    else:
        return "Consolidation"

tickers = load_data("../data/SGX.txt")
for ticker in tickers:
    trend = get_trend(ticker)
    if trend != "Unknown":
        print(f"{ticker}: {trend}")