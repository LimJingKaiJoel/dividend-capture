"use client"

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent } from "@/components/ui/card"
import { StockStatus } from '@/components/stock-status'

type StockData = {
  id: number
  symbol: string
  name: string
  exDate: string | null
  payout: number
  trend: string // "bullish" | "bearish" | "consolidation" | "unknown"
}

export function StockList() {
  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState({
    positiveEV: false,
    nonBearish: false,
  })

  // to store data that is fetched in stockdata format
  const [stocks, setStocks] = useState<StockData[]>([])
  
  // // stock data for landing page api endpoint -- Makes more sense to statically fetch for now
  // const API_ENDPOINT = "http://127.0.0.1:8000/stocks"

  // fetch (static json)
  useEffect(() => {
    fetch("/stock_list_data.json")
      .then(response => response.json())
      .then((data: StockData[]) => {
        const sortedData = [...data].sort((a, b) => {
          // push to bottom if null
          if (!a.exDate) return 1
          if (!b.exDate) return -1
  
          // Compare actual date values
          return new Date(a.exDate).getTime() - new Date(b.exDate).getTime()
        })
  
        setStocks(sortedData)
      })
      .catch((error) => {
        console.error("Error fetching static JSON:", error)
      })
  }, [])

  // filter
  const filteredStocks = stocks.filter((stock) => {
    if (filters.nonBearish && stock.trend === "Bearish") {
      return false
    }
    // to add positiveEV tag,,, or if it's too computationally expensive, only display inside stock details page
    // if (filters.positiveEV && stock.ev <= 0) return false

    // search filter
    if (
      search &&
      !stock.symbol.toLowerCase().includes(search.toLowerCase()) &&
      !stock.name.toLowerCase().includes(search.toLowerCase())
    ) {
      return false
    }
    return true
  })

  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="w-full md:w-72">
              <Input
                placeholder="Search stocks..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="positive-ev"
                  checked={filters.positiveEV}
                  onCheckedChange={(checked) =>
                    setFilters(prev => ({ ...prev, positiveEV: checked }))
                  }
                />
                <Label htmlFor="positive-ev">Positive EV</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="non-bearish"
                  checked={filters.nonBearish}
                  onCheckedChange={(checked) =>
                    setFilters(prev => ({ ...prev, nonBearish: checked }))
                  }
                />
                <Label htmlFor="non-bearish">Non-bearish</Label>
              </div>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Symbol</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Ex Date</TableHead>
                  <TableHead>Payout</TableHead>
                  <TableHead>Trend</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStocks.map((stock) => (
                  <TableRow key={stock.id}>
                    <TableCell className="font-medium">
                      <Link
                        href={`/stock/${stock.symbol}`}
                        className="text-primary hover:underline"
                      >
                        {stock.symbol}
                      </Link>
                    </TableCell>
                    <TableCell>{stock.name}</TableCell>
                    <TableCell>{stock.exDate}</TableCell>
                    <TableCell>{stock.payout}</TableCell>
                    <TableCell>
                      <StockStatus status={stock.trend as 'Bullish' | 'Bearish' | 'Consolidation'} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}