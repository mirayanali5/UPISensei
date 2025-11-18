"use client"

import { useState } from 'react'
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts'
import { SpendingSummary } from '@/lib/api-service'

interface WeeklySpendingChartProps {
  summary?: SpendingSummary | null
}

const COLORS = [
  '#DC2626', '#059669', '#0284C7', '#D97706', '#7C3AED', 
  '#EC4899', '#10B981', '#F59E0B', '#8B5CF6', '#06B6D4'
]

const CATEGORY_EMOJIS: { [key: string]: string } = {
  'Food & Dining': '🍕',
  'Groceries': '🛒',
  'Transportation': '🚗',
  'Bills & Recharges': '📋',
  'Shopping': '🛍️',
  'Entertainment': '🎬',
  'Utilities': '⚡',
  'Healthcare': '🏥',
  'Education': '📚',
  'Travel': '✈️',
  'Income': '💰',
  'Investment': '📈',
  'Other': '📦'
}

export default function WeeklySpendingChart({ summary }: WeeklySpendingChartProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  // Transform summary data into chart format
  const data = summary?.categories?.slice(0, 10).map((cat, index) => ({
    name: `${cat.category} ${CATEGORY_EMOJIS[cat.category] || ''}`,
    value: cat.percentage,
    amount: cat.amount,
    color: COLORS[index % COLORS.length]
  })) || []

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="text-sm font-bold text-foreground">{data.name}</p>
          <p className="text-sm font-bold" style={{ color: data.color }}>{data.value.toFixed(1)}%</p>
          <p className="text-xs text-muted-foreground">₹{data.amount.toLocaleString('en-IN')}</p>
        </div>
      )
    }
    return null
  }

  const handleSliceClick = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index)
  }

  if (!summary || data.length === 0) {
    return (
      <div className="bg-card border border-border rounded-2xl p-6 shadow-lg">
        <h3 className="text-lg font-bold mb-4">Monthly Expenditure Breakdown</h3>
        <p className="text-muted-foreground text-center py-8">No spending data available</p>
      </div>
    )
  }

  return (
    <div className="bg-card border border-border rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold">Monthly Expenditure Breakdown</h3>
        <p className="text-sm text-muted-foreground">
          Total: ₹{summary.total_spent.toLocaleString('en-IN')}
        </p>
      </div>

      <div className="flex flex-col items-center">
        <div className="w-full h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
                onMouseEnter={(_, index) => setActiveIndex(index)}
                onMouseLeave={() => setActiveIndex(null)}
                onClick={(_, index) => handleSliceClick(index)}
              >
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.color}
                    opacity={activeIndex === null || activeIndex === index ? 1 : 0.5}
                    style={{ cursor: 'pointer', transition: 'opacity 0.2s ease' }}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-2 gap-4 w-full mt-6">
          {data.map((item, index) => (
            <div 
              key={index} 
              onClick={() => handleSliceClick(index)}
              className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-300 cursor-pointer group border-2 ${
                activeIndex === index 
                  ? 'bg-primary/10 border-primary/50 shadow-md' 
                  : 'bg-muted/50 border-transparent hover:bg-muted hover:border-primary/30'
              }`}
            >
              <div 
                className="w-3 h-3 rounded-full transition-transform group-hover:scale-125" 
                style={{ backgroundColor: item.color }}
              />
              <div className="flex-1">
                <p className="text-sm font-medium group-hover:text-primary transition-colors">{item.name}</p>
                <p className="text-xs text-muted-foreground font-bold">{item.value.toFixed(1)}%</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
