from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware

from scripts.helpers import get_dividends, get_price_history
from scripts.strategy_with_profitability import optimal_strategies

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # adjust as needed
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/stock/{symbol}/backtest")
def backtest_stock(
    symbol: str,
    strategy_duration: int = Query(700, description="Number of days to look back"),
    buy_metric: str = Query("Close"),
    sell_metric: str = Query("Close"),
    hold_threshold: int = Query(5),
    desired_profit_percentage: float = Query(0.02),
):
    """
    request structure:
    GET /stock/A17U.SI/backtest?strategy_duration=700&hold_threshold=5&desired_profit_percentage=0.02
    """
    dividends = get_dividends(symbol)
    price_history = get_price_history(symbol, '5y')

    df = optimal_strategies(
        strategy_duration, dividends, buy_metric, sell_metric,
        price_history, hold_threshold, desired_profit_percentage
    )

    # Convert the DataFrame to a list of dicts so it can be JSON serialized
    return df.to_dict(orient="records")

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import yfinance as yf
from typing import Optional

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/stock/{symbol}")
def get_stock_details(symbol: str):
    # fetch data from yfinance
    ticker = yf.Ticker(symbol)
    info = ticker.info

    data = {
        "symbol": symbol,
        "name": info.get("longName", "Unknown"),
        "price": info.get("regularMarketPrice", 0),
        "yield": info.get("dividendYield", 0),
        "pe": info.get("trailingPE", 0),
        "eps": info.get("trailingEps", 0),
        "marketCap": info.get("marketCap", 0),
    }
    return data