"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { StockStatus } from '@/components/stock-status'
import { StopLossCalculator } from '@/components/stop-loss-calculator'
import { BacktestChart } from '@/components/backtest-chart'

// This is a placeholder for the actual data fetching function
const fetchStockData = async (symbol: string) => {
  // Simulated API call
  return {
    symbol,
    name: 'Example Stock',
    price: 100,
    yield: 4.5,
    pe: 15,
    eps: 6.67,
    marketCap: '10B',
  }
}

interface StockDetailProps {
  symbol: string
}

export function StockDetail({ symbol }: StockDetailProps) {
  const [stock, setStock] = useState(null)
  const [backtestDays, setBacktestDays] = useState(30)

  useState(() => {
    fetchStockData(symbol).then(setStock)
  }, [symbol])

  if (!stock) return <div>Loading...</div>

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">{stock.symbol} - {stock.name}</h1>
        <StockStatus status={stock.status} />
      </div>
      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="backtest">Backtest</TabsTrigger>
          <TabsTrigger value="stop-loss">Stop Loss</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>Stock Information</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="grid grid-cols-2 gap-4">
                <div>
                  <dt className="font-medium">Price</dt>
                  <dd>${stock.price.toFixed(2)}</dd>
                </div>
                <div>
                  <dt className="font-medium">Dividend Date</dt>
                  <dd>{stock.dividendDate}</dd>
                </div>
                <div>
                  <dt className="font-medium">Yield</dt>
                  <dd>{stock.yield.toFixed(2)}%</dd>
                </div>
                <div>
                  <dt className="font-medium">EV</dt>
                  <dd>{stock.ev.toFixed(2)}</dd>
                </div>
                <div>
                  <dt className="font-medium">P/E Ratio</dt>
                  <dd>{stock.pe.toFixed(2)}</dd>
                </div>
                <div>
                  <dt className="font-medium">EPS</dt>
                  <dd>${stock.eps.toFixed(2)}</dd>
                </div>
                <div>
                  <dt className="font-medium">Market Cap</dt>
                  <dd>{stock.marketCap}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="backtest">
          <Card>
            <CardHeader>
              <CardTitle>Backtest Results</CardTitle>
              <CardDescription>
                Visualize past stock data based on the dividend capture strategy
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <Label htmlFor="backtest-days">Max Holding Period (Days)</Label>
                  <Input
                    id="backtest-days"
                    type="number"
                    value={backtestDays}
                    onChange={(e) => setBacktestDays(parseInt(e.target.value))}
                    className="w-20"
                  />
                  <Button onClick={() => {/* Trigger backtest */}}>Run Backtest</Button>
                </div>
                <BacktestChart symbol={symbol} days={backtestDays} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="stop-loss">
          <StopLossCalculator symbol={symbol} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

