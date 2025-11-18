"use client"

import { AnalysisResponse } from '@/lib/api-service'

interface SpendingStatsCardProps {
  analysis?: AnalysisResponse | null
}

export default function SpendingStatsCard({ analysis }: SpendingStatsCardProps) {
  const totalSpent = analysis?.summary.total_spent || 0
  const totalIncome = analysis?.summary.total_income || 0
  const netBalance = analysis?.summary.net_balance || 0
  const transactionCount = analysis?.summary.transaction_count || 0

  // Calculate average daily spending (last 30 days)
  const days = 30
  const averageDaily = totalSpent / days

  // Calculate percentage for progress bars
  const spentPercentage = Math.min((totalSpent / (totalIncome || 1)) * 100, 100)
  const incomePercentage = totalIncome > 0 ? 100 : 0

  return (
    <div className="bg-gradient-to-br from-primary/10 via-accent/10 to-secondary/10 border-2 border-primary/20 rounded-2xl p-6 backdrop-blur-sm">
      <div className="grid grid-cols-2 gap-6">
        {/* Total Spent */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">Total Spent</p>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-primary">₹{totalSpent.toLocaleString('en-IN')}</span>
          </div>
          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-primary to-accent" 
              style={{ width: `${Math.min(spentPercentage, 100)}%` }} 
            />
          </div>
          <p className="text-xs text-muted-foreground">{transactionCount} transactions</p>
        </div>

        {/* Average Daily */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">Average Daily</p>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-secondary">₹{Math.round(averageDaily).toLocaleString('en-IN')}</span>
          </div>
          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-secondary to-accent" 
              style={{ width: `${Math.min((averageDaily / 1000) * 100, 100)}%` }} 
            />
          </div>
          {totalIncome > 0 && (
            <p className="text-xs text-muted-foreground">
              Net: ₹{netBalance.toLocaleString('en-IN')}
            </p>
          )}
        </div>
      </div>

      {totalIncome > 0 && (
        <div className="mt-4 pt-4 border-t border-primary/20">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Total Income</span>
            <span className="text-lg font-semibold text-green-600">₹{totalIncome.toLocaleString('en-IN')}</span>
          </div>
        </div>
      )}
    </div>
  )
}
