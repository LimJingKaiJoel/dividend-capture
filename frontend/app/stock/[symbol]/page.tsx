import { StockDetail } from '@/components/stock-detail'

export default function StockPage({ params }: { params: { symbol: string } }) {
  return <StockDetail symbol={params.symbol} />
}