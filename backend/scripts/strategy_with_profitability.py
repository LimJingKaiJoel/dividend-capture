from helpers import get_dividends, get_price_history
from get_ex_date import get_expected_ex_date
import pandas as pd
from datetime import date, timedelta, datetime

'''
average yield for this stock for dividend capture: 
if positive, when to buy (show big recommendation: buy on D-2, sell on D+3)
    - this should be mean (rounded)
    - if average negative, recommendation to not trade this stock

id, dividend payout day, buy date, sell date, capture yield
1, 02-08-2024, D-2, D+3, 0.6%
2, 02-09-2023, D-3, D+3, 1.0%
3, 02-08-2022, D-4, D+5, -1.5%

for backtesting later reference
    # Get the backtest start day
    today = pd.Timestamp(date.today(), tz="UTC")
    backtest_start_date = today - backtest_duration

    dividends = dividends[dividends.index > backtest_start_date]
    

'''

# This method backtests a single stock from date and returns a dataframe in the above format
# Strategy_duration is in days!
def optimal_strategies(strategy_duration, dividends, buy_metric, sell_metric, price_history, hold_threshold, desired_profit_percentage):
    today = pd.Timestamp(date.today(), tz="UTC")
    dividends = dividends[dividends.index > today - timedelta(days = strategy_duration)]
    
    # Create empty df with my column names
    columns = ['id', 'ex-date', 'buy_date', 'sell_date', 'capture_yield', 'profitable_percentage', 'possible_desired_profit']
    rows = []
    id = 1

    for dividend_date in dividends.index:
        # add the necessary information into the dictionary
        dict_to_df = {
            'id': id,
            'ex-date': dividend_date,
        }
        id += 1

        dividend_value = dividends[dividends.index == dividend_date].iloc[0]

        strategy_info = optimal_strategy_single_date(dividend_date, dividend_value, buy_metric, sell_metric, price_history, hold_threshold, desired_profit_percentage)
        
        # handle case where smallest timeframe is empty
        smallest_timeframe = strategy_info[3]
        if not smallest_timeframe:
            dict_to_df['buy_date'] = strategy_info[0]
            dict_to_df['sell_date'] = strategy_info[1]
            dict_to_df['capture_yield'] = strategy_info[2]
        else:
            dict_to_df['buy_date'] = smallest_timeframe[0]
            dict_to_df['sell_date'] = smallest_timeframe[1]
            dict_to_df['capture_yield'] = smallest_timeframe[2]

        dict_to_df['profitable_percentage'] = strategy_info[4]
        dict_to_df['possible_desired_profit'] = dict_to_df['capture_yield'] > desired_profit_percentage

        # add into the list of rows, to be initialised into a pandas df later on
        rows.append(dict_to_df)

    result = pd.DataFrame(rows, columns=columns)
    return result

# This method backtests a single date of a single stock, to be called in the larger backtest method
# buy_metric can be 'Close', 'Open', 'High'. same for sell_metric. use as you wish!
# returns a list of [-2, +4], where you buy on D-2 and sell on D+4
# returns 
def optimal_strategy_single_date(dividend_ex_date, dividend_value, buy_metric, sell_metric, price_history, hold_threshold, desired_profit_percentage):
    total_possibilities = 0
    profitable_possibilities = 0
    smallest_timeframe = []

    dividend_ex_date = dividend_ex_date.replace(year = dividend_ex_date.year - 1)

    buy = 1
    sell = 0
    max_profit_percentage = float('-inf') # huge negative profit to initialise max

    # we will minus buy_delta and add sell_delta to traverse the different possible dates
    ONE_DAY_DELTA = timedelta(days=1)

    # sliding window to break early -- start from window of size 1 to k, where k is hold_threshold
    for size in range(1, hold_threshold + 1):
        for shift in range(size):
            # Set sliding window buy date and sell date
            buy_date = dividend_ex_date - (size * ONE_DAY_DELTA) + (shift * ONE_DAY_DELTA)
            sell_date = dividend_ex_date + (shift * ONE_DAY_DELTA)

            # print("Buy date = ", buy_date)
            # print("Sell date = ", sell_date)

            profit_percentage = get_profit_percentage(buy_date, sell_date, buy_metric, sell_metric, price_history, dividend_value)

            # If buy or sell date is a holiday or a weekend, do not process it (invalid window)
            if profit_percentage == float('-inf'):
                continue

            # Break condition: we found a date to buy / sell that satisfies our desired_profit
            if profit_percentage >= desired_profit_percentage:
                # print("Profit taken: ", profit, "   Target profit: ", desired_profit_value)
                buy = shift - size
                sell = shift
                smallest_timeframe.append(buy)
                smallest_timeframe.append(sell)
                smallest_timeframe.append(profit_percentage)
            
            # If not, keep track if it's the max, in case we don't ever find a window that hits our desired profit, we want to return
            if profit_percentage > max_profit_percentage:
                max_profit_percentage = profit_percentage
                buy = shift - size
                sell = shift
            
            if profit_percentage > 0:
                profitable_possibilities += 1
            
            total_possibilities += 1

    percentage_profitable = profitable_possibilities * 100.0 / total_possibilities
    print(percentage_profitable, profitable_possibilities)

    # note smallest_timeframe might be empty -- to check in optimal_strategies method that calls this method
    return [buy, sell, max_profit_percentage, smallest_timeframe, percentage_profitable]
        
# This method returns -inf if either the buy date or sell date is not a trading day (weekends or holidays)
def get_profit_percentage(buy_date, sell_date, buy_metric, sell_metric, price_history, dividend_value):
    # Need to convert datetime into timestamp... and match the dates
    buy_date = pd.Timestamp(buy_date).date()
    sell_date = pd.Timestamp(sell_date).date()

    # print(buy_date, sell_date, price_history.index.date)

    try:
        # Filter the buy and sell prices, and take the float out of the pd series
        buy_price = price_history[price_history.index.date == buy_date][buy_metric].iloc[0]
        sell_price = price_history[price_history.index.date == sell_date][sell_metric].iloc[0]

        # print("Buy price: ", buy_price, "   Sell price: ", sell_price)
        return float((sell_price - buy_price + dividend_value) / buy_price)
    except:
        return float('-inf')


ticker = "A17U.SI"
dividends = get_dividends(ticker)
price_history = get_price_history(ticker, '5y')
expected_ex_date = get_expected_ex_date(dividends)

print(optimal_strategies(700, dividends, 'Close', 'Close', price_history, 5, 0.02))