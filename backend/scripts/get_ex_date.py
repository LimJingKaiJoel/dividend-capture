from datetime import date
import pandas as pd
from helpers import get_dividends, load_data

# returns a list of expected ex date and amount
def get_expected_ex_date(dividends):
    # Get today's date
    today = pd.Timestamp(date.today(), tz="UTC")

    # Get the ex-date of the stock based on last year's data
    previous_year_date = today.replace(year=today.year - 1)
    # print(type(dividends.index))
    # print(type(previous_year_date))

    # filter past dividend dates within a 1-year period and get first date (upcoming)
    filtered_dividends = dividends[dividends.index > previous_year_date]
    expected_ex_date = filtered_dividends.index[0].date()
    expected_payout = filtered_dividends.iloc[0]
    
    result = []
    result.append(expected_ex_date.replace(year=expected_ex_date.year + 1))
    result.append(expected_payout)

    return result