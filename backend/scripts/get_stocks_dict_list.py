from get_ex_date import get_expected_ex_date
from helpers import get_dividends
from bull_or_bear_trend import get_trend
import yfinance as yf

# FRONT PAGE
def get_stocks_dict_list(tickers):
    result = []
    id = 1

    # for each ticker in SGX, get relevant information into a dictionary and append to list
    for ticker_name in tickers:
        dividends = get_dividends(ticker_name)
        # Do not add tickers that don't exist anymore or don't pay dividends
        if dividends.empty:
            continue

        ticker_info = yf.Ticker(ticker_name).info

        dict = {}
        dict["id"] = id
        id += 1
        dict["symbol"] = ticker_name
        
        dict["name"] = ticker_info['shortName']
        expected_dividend_info = get_expected_ex_date(dividends) # change this later when we figure out how to get ex-date
        dict["ex-date"] = expected_dividend_info[0]
        dict["payout"] = expected_dividend_info[1]
        dict["trend"] = get_trend(ticker_name) # bearish, bullish or consolidation

        # dict["captured_yield"] = get_yield(ticker_name) # dividend capture strategy yield based on past data -- can remove, put in backtest page

        result.append(dict)

    return result