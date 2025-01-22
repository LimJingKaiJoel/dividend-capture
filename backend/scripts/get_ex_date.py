from datetime import date
import pandas as pd
from scripts.helpers import get_dividends

# returns a list of expected ex date and amount
def get_expected_ex_date(dividends):
    # Get today's date
    today = pd.Timestamp(date.today(), tz="UTC")

    # Get the ex-date of the stock based on last year's data
    previous_year_date = today.replace(year=today.year - 1)

    # if no dividends in the past 1-year period, unable to find expected ex date since they havent been giving out dividends for a year
    if dividends.empty:
# print("Dividends is empty.")
        return []
# else:
# print("Dividends is not empty!")
# print(dividends)

    # filter past dividend dates within a 1-year period and get first date (upcoming)
    filtered_dividends = dividends[dividends.index > previous_year_date]
# print("Filtered Dividends: ")
# print(filtered_dividends)

    # if they haven't paid dividends in the past year
    if filtered_dividends.empty:
# print("Filtered dividends is empty")
        return []

    expected_ex_date = filtered_dividends.index[0].date()
    expected_payout = filtered_dividends.iloc[0]
    
    result = []

    try:
        result.append(expected_ex_date.replace(year=expected_ex_date.year + 1))
        result.append(float(expected_payout))
    except:
        print("Error in changing expected ex date")
        return []

    return result

# dividends = get_dividends('A17U.SI')
# print(get_expected_ex_date(dividends))