import { StockList } from '@/components/stock-list'

export default function Home() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">SGX Dividend Capture Trading Strategy</h1>
      <StockList />
    </div>
  )
}
