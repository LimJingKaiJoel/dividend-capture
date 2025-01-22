import yfinance as yf

def load_data(filepath):
    tickers = set()

    # load the data of all tickers in SGX to pass into yfinance
    file = open(filepath, "r")
    for line in file:
        line = line.strip()
        tickers.add(line)
    
    return tickers

def get_dividends(ticker):
    # Get pandas series of dividends
    info = yf.Ticker(ticker)
    return info.dividends

def get_price_history(ticker, period):
    # Get pandas df of prices to match to dividend payout date
    return yf.Ticker(ticker).history(period=period, auto_adjust=False)

def process_data(read_filepath, write_filepath):
    # load the data of all tickers in SGX to pass into yfinance
    read_file = open(read_filepath, "r")
    write_file = open(write_filepath, "a")
    for line in read_file:
        write_file.write(line[:4].strip() + ".SI\n")
    
    return

# READ_FILEPATH = "../data/SGX.txt"
# WRITE_FILEPATH = "../data/tickers.txt"
# process_data(READ_FILEPATH, WRITE_FILEPATH)