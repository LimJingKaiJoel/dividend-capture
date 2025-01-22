"use client"
// I will make the backtest chart once the MVP is done!
import { Line, LineChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

// This is a placeholder for the actual data fetching function
const fetchBacktestData = async (symbol: string, days: number) => {
  // Simulated API call
  const data = []
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - days)

  for (let i = 0; i < days; i++) {
    const date = new Date(startDate)
    date.setDate(date.getDate() + i)
    data.push({
      date: date.toISOString().split('T')[0],
      price: Math.random() * 10 + 90, // Random price between 90 and 100
      buySignal: Math.random() > 0.8,
      sellSignal: Math.random() > 0.8,
    })
  }
  return data
}

interface BacktestChartProps {
  symbol: string
  days: number
}

export function BacktestChart({ symbol, days }: BacktestChartProps) {
  const [data, setData] = useState([])

  useEffect(() => {
    fetchBacktestData(symbol, days).then(setData)
  }, [symbol, days])

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="price" stroke="#8884d8" />
        <Line type="monotone" dataKey="buySignal" stroke="#82ca9d" />
        <Line type="monotone" dataKey="sellSignal" stroke="#ff7300" />
      </LineChart>
    </ResponsiveContainer>
  )
}

