from helpers import get_dividends, get_price_history
from get_ex_date import get_expected_ex_date
import pandas as pd
from datetime import date, timedelta

'''
average yield for this stock for dividend capture: 
if positive, when to buy (show big recommendation: buy on D-2, sell on D+3)
    - this should be mean (rounded)
    - if average negative, recommendation to not trade this stock

id, dividend payout day, buy date, sell date, capture yield
1, 02-08-2024, D-2, D+3, 0.6%
2, 02-09-2023, D-3, D+3, 1.0%
3, 02-08-2022, D-4, D+5, -1.5%

'''

# This method backtests a single stock from date and returns a dataframe in the above format
def backtest(date, backtest_duration, dividends, buy_metric, sell_metric, price_history):
    today = pd.Timestamp(date.today(), tz="UTC")
    backtest_start_date = today - backtest_duration

    dividends = dividends[dividends.index > backtest_start_date]
    
    # for dividend_date in dividends.index:
    #     backtest_single_date()

    return

# This method backtests a single date of a single stock, to be called in the larger backtest method
# buy_metric can be 'Close', 'Open', 'High'. same for sell_metric. use as you wish!
# returns a list of [-2, +4], where you buy on D-2 and sell on D+4
def backtest_single_date(dividend_ex_date, buy_metric, sell_metric, price_history, hold_threshold, desired_profit):
    dividend_ex_date = dividend_ex_date.replace(year = dividend_ex_date.year - 1)
    desired_profit_value = desired_profit * price_history.iloc[-1]['Close']

    buy = 1
    sell = 0
    max_profit = float('-inf') # huge negative profit to initialise max

    # we will minus buy_delta and add sell_delta to traverse the different possible dates
    ONE_DAY_DELTA = timedelta(days=1)

    # sliding window to break early -- start from window of size 1 to k, where k is hold_threshold
    for size in range(1, hold_threshold + 1):
        for i in range(size):
            # Set sliding window buy date and sell date
            buy_date = dividend_ex_date - (size * ONE_DAY_DELTA) + (i * ONE_DAY_DELTA)
            sell_date = dividend_ex_date + (i * ONE_DAY_DELTA)
            # print("Buy date = ", buy_date)
            # print("Sell date = ", sell_date)

            profit = get_profit(buy_date, sell_date, buy_metric, sell_metric, price_history)

            # Break condition: we found a date to buy / sell that satisfies our desired_profit
            if profit >= desired_profit_value:
                print("Profit taken: ", profit, "   Target profit: ", desired_profit_value)
                return [buy, sell]
            
            # If not, keep track if it's the min, in case we don't ever find a window that hits our desired profit, we want to return
            max_profit = max(profit, max_profit)
    
    return max
        
def get_profit(buy_date, sell_date, buy_metric, sell_metric, price_history):
    # Need to convert datetime into timestamp... and match the dates
    buy_date = pd.Timestamp(buy_date, tz="UTC")
    sell_date = pd.Timestamp(sell_date, tz="UTC")

    # Filter the buy and sell prices, and take the float out of the pd series
    buy_price = price_history[price_history.index.date == buy_date.date()][buy_metric].iloc[0]
    sell_price = price_history[price_history.index.date == sell_date.date()][sell_metric].iloc[0]

    return float(sell_price - buy_price)


ticker = "A17U.SI"
dividends = get_dividends(ticker)
price_history = get_price_history(ticker, '1y')
expected_ex_date = get_expected_ex_date(dividends)

print(backtest_single_date(expected_ex_date[0], 'Close', 'Close', price_history, 5, 0.01))