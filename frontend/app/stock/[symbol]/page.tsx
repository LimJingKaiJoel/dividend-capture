"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation' // 'next/router'?
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { StockStatus } from "@/components/stock-status"
import { StopLossCalculator } from "@/components/stop-loss-calculator"
import { BacktestChart } from "@/components/backtest-chart"

type BacktestRow = {
  id: number
  ["ex-date"]: string
  buy_date: number | string
  sell_date: number | string
  capture_yield: number
  profitable_percentage: number
  average_profit: number
  possible_desired_profit: boolean
}

interface StockDetailProps {
  symbol: string
}

export function StockDetail({ symbol }: StockDetailProps) {
  // Basic "stock info" state:
  const [stock, setStock] = useState<any>(null)

  // Backtest parameters:
  const [backtestDays, setBacktestDays] = useState(700)
  const [holdThreshold, setHoldThreshold] = useState(5)
  const [desiredProfit, setDesiredProfit] = useState(0.02)

  // Backtest results table:
  const [backtestResults, setBacktestResults] = useState<BacktestRow[]>([])
  const [isLoadingBacktest, setIsLoadingBacktest] = useState(false)

  const API_BASE_URL = "http://127.0.0.1:8000" // can move to env later on

  // Example "fetchStockData" might come from your actual backend or a static file
  useEffect(() => {
    // e.g., fetch basic info from a simpler /stock/{symbol} endpoint
    fetch(`${API_BASE_URL}/stock/${symbol}`)
      .then((res) => res.json())
      .then((data) => setStock(data))
      .catch((err) => console.error("Error fetching stock info:", err))
  }, [symbol])

  // On mount, or whenever user changes backtest params, we can load the backtest
  // but let's do it on button click for clarity
  const runBacktest = () => {
    setIsLoadingBacktest(true)
    const url = `http://localhost:8000/stock/${symbol}/backtest?` +
      `strategy_duration=${backtestDays}&` +
      `hold_threshold=${holdThreshold}&` +
      `desired_profit_percentage=${desiredProfit}`
    fetch(url)
      .then((res) => res.json())
      .then((data: BacktestRow[]) => {
        setBacktestResults(data)
        setIsLoadingBacktest(false)
      })
      .catch((err) => {
        console.error("Error fetching backtest:", err)
        setIsLoadingBacktest(false)
      })
  }

  if (!stock) return <div>Loading basic stock info...</div>

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">{symbol} - {stock.name}</h1>
        <StockStatus status={stock.status} />
      </div>
      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="backtest">Backtest</TabsTrigger>
          <TabsTrigger value="stop-loss">Stop Loss</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>Stock Information</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Display basic info about the stock */}
              <p>Price: {stock.price}</p>
              <p>Dividend Date: {stock.dividendDate}</p>
              {/* Add more fields... */}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Backtest Tab */}
        <TabsContent value="backtest">
          <Card>
            <CardHeader>
              <CardTitle>Backtest Results</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Controls */}
              <div className="space-y-4 mb-4">
                <div className="flex items-center space-x-4">
                  <Label>Max Holding Period (Days): </Label>
                  <Input
                    type="number"
                    value={backtestDays}
                    onChange={(e) => setBacktestDays(parseInt(e.target.value))}
                    className="w-20"
                  />
                </div>
                <div className="flex items-center space-x-4">
                  <Label>Hold Threshold: </Label>
                  <Input
                    type="number"
                    value={holdThreshold}
                    onChange={(e) => setHoldThreshold(parseInt(e.target.value))}
                    className="w-20"
                  />
                </div>
                <div className="flex items-center space-x-4">
                  <Label>Desired Profit (%): </Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={desiredProfit}
                    onChange={(e) => setDesiredProfit(parseFloat(e.target.value))}
                    className="w-20"
                  />
                </div>
                <Button onClick={runBacktest}>Run Backtest</Button>
              </div>

              {isLoadingBacktest ? (
                <div>Loading backtest...</div>
              ) : (
                <div>
                  {/* Render your backtest results in a small table or chart */}
                  <table className="table-auto w-full border">
                    <thead>
                      <tr>
                        <th className="border px-2 py-1">ID</th>
                        <th className="border px-2 py-1">Ex Date</th>
                        <th className="border px-2 py-1">Buy Offset</th>
                        <th className="border px-2 py-1">Sell Offset</th>
                        <th className="border px-2 py-1">Capture Yield</th>
                        <th className="border px-2 py-1">Profitable %</th>
                        <th className="border px-2 py-1">Avg Profit</th>
                        <th className="border px-2 py-1">Hit Desired?</th>
                      </tr>
                    </thead>
                    <tbody>
                      {backtestResults.map((row) => (
                        <tr key={row.id}>
                          <td className="border px-2 py-1">{row.id}</td>
                          <td className="border px-2 py-1">{row["ex-date"]}</td>
                          <td className="border px-2 py-1">{row.buy_date}</td>
                          <td className="border px-2 py-1">{row.sell_date}</td>
                          <td className="border px-2 py-1">
                            {(row.capture_yield * 100).toFixed(2)}%
                          </td>
                          <td className="border px-2 py-1">
                            {row.profitable_percentage.toFixed(1)}%
                          </td>
                          <td className="border px-2 py-1">
                            {(row.average_profit * 100).toFixed(2)}%
                          </td>
                          <td className="border px-2 py-1">
                            {row.possible_desired_profit ? "Yes" : "No"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Stop Loss Tab */}
        <TabsContent value="stop-loss">
          <StopLossCalculator symbol={symbol} />
        </TabsContent>
      </Tabs>
    </div>
  )
}