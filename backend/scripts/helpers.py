import yfinance as yf

def load_data(filepath):
    tickers = set()

    # load the data of all tickers in SGX to pass into yfinance
    file = open(filepath, "r")
    for line in file:
        tickers.add(line[:4].strip() + ".SI")
    
    return tickers

def get_dividends(ticker):
    # Get pandas series of dividends
    info = yf.Ticker(ticker)
    return info.dividends

def get_price_history(ticker, period):
    # Get pandas df of prices to match to dividend payout date
    return yf.Ticker(ticker).history(period=period)