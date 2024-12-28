"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

// This is a placeholder for the actual data fetching function
const fetchStopLossData = async (symbol: string) => {
  // Simulated API call
  return {
    currentPrice: 100,
    stopLoss: 95,
    target: 105,
  }
}

interface StopLossCalculatorProps {
  symbol: string
}

export function StopLossCalculator({ symbol }: StopLossCalculatorProps) {
  const [data, setData] = useState(null)

  useEffect(() => {
    fetchStopLossData(symbol).then(setData)
  }, [symbol])

  if (!data) return <div>Loading...</div>

  const { currentPrice, stopLoss, target } = data

  return (
    <Card>
      <CardHeader>
        <CardTitle>Stop Loss Calculator</CardTitle>
        <CardDescription>Calculate target and stop-loss values</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label htmlFor="current-price">Current Price</Label>
            <Input id="current-price" type="number" value={currentPrice} readOnly />
          </div>
          <div>
            <Label htmlFor="stop-loss">Stop Loss</Label>
            <Input id="stop-loss" type="number" value={stopLoss} readOnly />
          </div>
          <div>
            <Label htmlFor="target">Target</Label>
            <Input id="target" type="number" value={target} readOnly />
          </div>
        </div>
        <div className="mt-4">
          <div className="text-sm font-medium">Recommendation:</div>
          <div className="text-lg font-bold">
            {currentPrice >= target ? (
              <span className="text-green-500">Sell</span>
            ) : currentPrice <= stopLoss ? (
              <span className="text-red-500">Stop Loss Triggered</span>
            ) : (
              <span className="text-yellow-500">Hold</span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

