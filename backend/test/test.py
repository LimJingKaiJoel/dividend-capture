import yfinance as yf
print(yf.Ticker("^GSPC").history(period="1d"))  # Fetch S&P 500