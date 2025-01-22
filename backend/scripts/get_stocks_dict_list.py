from scripts.get_ex_date import get_expected_ex_date
from scripts.helpers import get_dividends, load_data
from scripts.bull_or_bear_trend import get_trend
import yfinance as yf

# FRONT PAGE
def get_stocks_dict_list(tickers):
    result = []
    id = 1

    # for each ticker in SGX, get relevant information into a dictionary and append to list
    for ticker_name in tickers:
        try:
            dividends = get_dividends(ticker_name)
            expected_dividend_info = get_expected_ex_date(dividends) # might return empty list if no dividends given
            
            # if empty, don't need process this ticker, it doesn't give dividends -- the method returns [] if dividends dont exist
            if not expected_dividend_info:
                continue

            ticker_info = yf.Ticker(ticker_name).info

            current_stock = {}
            current_stock["id"] = id
            id += 1
            current_stock["symbol"] = ticker_name
            
            # ticker might not have a variable longName in the api
            try: 
                current_stock["name"] = ticker_info['longName']
            except:
                continue

            current_stock["exDate"] = expected_dividend_info[0]
            current_stock["payout"] = expected_dividend_info[1]
            current_stock["trend"] = get_trend(ticker_name) # bearish, bullish or consolidation

            # dict["captured_yield"] = get_yield(ticker_name) # dividend capture strategy yield based on past data -- can remove, put in backtest page
            print(current_stock)
            result.append(current_stock)
        except:
            return result

    return result

filepath = "../data/tickers.txt"
print(get_stocks_dict_list(load_data(filepath)))