import { ArrowDown, ArrowRight, ArrowUp } from 'lucide-react'

type StatusType = 'bullish' | 'bearish' | 'consolidation'

interface StockStatusProps {
  status: StatusType
}

export function StockStatus({ status }: StockStatusProps) {
  const config = {
    bullish: { Icon: ArrowUp, className: 'text-green-500' },
    bearish: { Icon: ArrowDown, className: 'text-red-500' },
    consolidation: { Icon: ArrowRight, className: 'text-gray-500' },
  }

  const { Icon, className } = config[status]

  return (
    <div className="flex items-center gap-1.5">
      <Icon className={`h-4 w-4 ${className}`} />
      <span className={`text-sm capitalize ${className}`}>{status}</span>
    </div>
  )
}
