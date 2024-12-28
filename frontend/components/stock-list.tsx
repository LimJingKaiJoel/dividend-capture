"use client"

import { useState } from 'react'
import Link from 'next/link'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent } from "@/components/ui/card"
import { StockStatus } from '@/components/stock-status'

// This is sample data - replace with your API call
const stocks = [
  { id: 1, symbol: 'DBS', name: 'DBS Group Holdings', dividendDate: '2023-05-15', yield: 4.50, ev: 0.80, status: 'bullish' as const },
  { id: 2, symbol: 'OCBC', name: 'Oversea-Chinese Banking Corp', dividendDate: '2023-05-20', yield: 4.20, ev: 0.60, status: 'bearish' as const },
  { id: 3, symbol: 'UOB', name: 'United Overseas Bank', dividendDate: '2023-05-25', yield: 4.00, ev: 0.70, status: 'consolidation' as const },
]

export function StockList() {
  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState({
    positiveEV: false,
    nonBearish: false,
  })

  const filteredStocks = stocks.filter(stock => {
    if (filters.positiveEV && stock.ev <= 0) return false
    if (filters.nonBearish && stock.status === 'bearish') return false
    if (search && !stock.symbol.toLowerCase().includes(search.toLowerCase()) &&
        !stock.name.toLowerCase().includes(search.toLowerCase())) return false
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
                  <TableHead>Dividend Date</TableHead>
                  <TableHead className="text-right">Yield</TableHead>
                  <TableHead className="text-right">EV</TableHead>
                  <TableHead>Status</TableHead>
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
                    <TableCell>{stock.dividendDate}</TableCell>
                    <TableCell className="text-right">{stock.yield.toFixed(2)}%</TableCell>
                    <TableCell className="text-right">{stock.ev.toFixed(2)}</TableCell>
                    <TableCell>
                      <StockStatus status={stock.status} />
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
