from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from scripts.helpers import load_data
from scripts.get_stocks_dict_list import get_stocks_dict_list

app = FastAPI()

# CORS config, allowing all origins here for simplicity -- to change in the future!
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/stocks")
def get_stocks():
    """
    This endpoint returns stock data for all SGX tickers found in your data file.
    """
    DATA_FILE_PATH = "data/tickers.txt"
    all_tickers = load_data(DATA_FILE_PATH)

    # might no need to sort -- sort after you get the data
    stock_list = get_stocks_dict_list(sorted(all_tickers))
    return stock_list

@app.get("/stock/{symbol}/backtest")
def get_backtest_data():
    """
    This endpoint is a button you can click in the stock details page that backtests the dividend capture strategy
    Input:
        - Max number of days willing to hold
    Output:
        - Displays historical strategy best dates to buy / sell and EV for these payouts
        - Suggested buy/sell date for upcoming dividend payout
        - Positive / negative average return + how often we profit from dividend capture on this stock
    """