import { ArrowDown, ArrowRight, ArrowUp, type LucideIcon } from "lucide-react"

type StatusType = "Bullish" | "Bearish" | "Consolidation"

interface StatusConfig {
  Icon: LucideIcon
  className: string
}

interface StockStatusProps {
  status: StatusType
}

export function StockStatus({ status }: StockStatusProps) {
  const config: Record<StatusType, StatusConfig> = {
    Bullish: { Icon: ArrowUp, className: "text-green-500" },
    Bearish: { Icon: ArrowDown, className: "text-red-500" },
    Consolidation: { Icon: ArrowRight, className: "text-gray-500" },
  }

  const { Icon, className } = config[status]

  return (
    <div className="flex items-center gap-1.5">
      <Icon className={`h-4 w-4 ${className}`} />
      <span className={`text-sm capitalize ${className}`}>{status}</span>
    </div>
  )
}