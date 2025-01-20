import unittest
from datetime import datetime, timedelta
import pandas as pd
from strategy_with_profitability import optimal_strategy_single_date

class TestOptimalStrategySingleDate(unittest.TestCase):

    def setUp(self):
        # Setup mock data for testing
        self.dividend_ex_date = pd.Timestamp('2023-02-08')
        self.dividend_value = 0.5
        self.buy_metric = 'Close'
        self.sell_metric = 'Close'
        self.hold_threshold = 5
        self.desired_profit_percentage = 0.02

        # Create a mock price history DataFrame
        dates = pd.date_range(start='2022-02-01', end='2023-02-28', freq='B')
        data = {
            'Close': [100 + i * 0.1 for i in range(len(dates))],
            'Open': [100 + i * 0.1 for i in range(len(dates))],
            'High': [100 + i * 0.1 for i in range(len(dates))],
            'Low': [100 + i * 0.1 for i in range(len(dates))]
        }
        self.price_history = pd.DataFrame(data, index=dates)

    def test_optimal_strategy_single_date(self):
        result = optimal_strategy_single_date(
            self.dividend_ex_date,
            self.dividend_value,
            self.buy_metric,
            self.sell_metric,
            self.price_history,
            self.hold_threshold,
            self.desired_profit_percentage
        )
        self.assertIsInstance(result, list)
        self.assertEqual(len(result), 5)
        self.assertIsInstance(result[0], int)
        self.assertIsInstance(result[1], int)
        self.assertIsInstance(result[2], float)
        self.assertIsInstance(result[3], list)
        self.assertIsInstance(result[4], float)

    def test_no_profitable_strategy(self):
        result = optimal_strategy_single_date(
            self.dividend_ex_date,
            self.dividend_value,
            self.buy_metric,
            self.sell_metric,
            self.price_history,
            self.hold_threshold,
            0.5  # High desired profit percentage to ensure no profitable strategy
        )
        self.assertEqual(result[2], float('-inf'))

    def test_invalid_dates(self):
        # Test with dates that are not in the price history
        invalid_ex_date = pd.Timestamp('2025-02-08')
        result = optimal_strategy_single_date(
            invalid_ex_date,
            self.dividend_value,
            self.buy_metric,
            self.sell_metric,
            self.price_history,
            self.hold_threshold,
            self.desired_profit_percentage
        )
        self.assertEqual(result[2], float('-inf'))

if __name__ == '__main__':
    unittest.main()