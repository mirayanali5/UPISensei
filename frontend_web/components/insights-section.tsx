"use client"

import { useState } from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Insight } from '@/lib/api-service'
import { AlertCircle, TrendingUp, Lightbulb, AlertTriangle } from 'lucide-react'

interface InsightsSectionProps {
  insights?: Insight[]
}

export default function InsightsSection({ insights = [] }: InsightsSectionProps) {
  
  const [expenditureData] = useState([
    { name: 'Food & Dining', value: 4500, percentage: 35, color: '#FF006E' },
    { name: 'Electricity & Bills', value: 1800, percentage: 14, color: '#FFB703' },
    { name: 'Transport', value: 2200, percentage: 17, color: '#00D9FF' },
    { name: 'Entertainment', value: 2000, percentage: 15, color: '#8338EC' },
    { name: 'Shopping & Others', value: 2500, percentage: 19, color: '#FFBE0B' },
  ])

  const [merchantData] = useState([
    { name: 'Swiggy', transactions: 21, amount: 3200, avatar: '🍕', color: '#FF006E' },
    { name: 'Starbucks', transactions: 15, amount: 2400, avatar: '☕', color: '#00D9FF' },
    { name: 'Uber', transactions: 12, amount: 1800, avatar: '🚗', color: '#8338EC' },
  ])

  const [goalsData] = useState([
    { id: 1, name: 'Goa Trip Fund', icon: '✈️', current: 12500, target: 50000, percentage: 25 },
    { id: 2, name: 'Concert Tickets', icon: '🎵', current: 6000, target: 8000, percentage: 75 },
  ])

  const [badgesData] = useState([
    { name: 'Impulse Ignorer', description: 'Avoided 5 impulse buys', color: '#00D9FF' },
    { name: 'Goal Getter', description: 'Hit a savings goal', color: '#8338EC' },
    { name: 'Subscription Slayer', description: 'Cancel an unused sub', color: '#FFBE0B', locked: true },
    { name: 'Budget Boss', description: 'Stay under budget', color: '#FF006E', locked: true },
  ])

  const [leaderboard] = useState([
    { rank: 1, name: 'You', points: 1250, avatar: '👤', isUser: true },
    { rank: 2, name: 'Aarav', points: 1180, avatar: '👤' },
    { rank: 3, name: 'Priya', points: 950, avatar: '👤' },
  ])

  const [hoveredCategory, setHoveredCategory] = useState(null)
  const [hoveredMerchant, setHoveredMerchant] = useState(null)
  const [expandedGoal, setExpandedGoal] = useState(null)
  
  const totalExpenditure = expenditureData.reduce((sum, item) => sum + item.value, 0)

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-card border border-primary/40 rounded-lg p-3 shadow-lg animate-pulse-glow">
          <p className="font-bold text-foreground text-sm">{data.name}</p>
          <p className="text-primary font-black text-sm">₹{data.value.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground">{data.percentage}% of total</p>
        </div>
      )
    }
    return null
  }

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'alert':
        return <AlertTriangle className="w-5 h-5" />
      case 'recommendation':
        return <Lightbulb className="w-5 h-5" />
      case 'trend':
        return <TrendingUp className="w-5 h-5" />
      default:
        return <AlertCircle className="w-5 h-5" />
    }
  }

  const getInsightColor = (type: string, severity?: string) => {
    if (type === 'alert') {
      if (severity === 'high') return 'border-red-500/50 bg-red-500/10'
      if (severity === 'medium') return 'border-orange-500/50 bg-orange-500/10'
      return 'border-yellow-500/50 bg-yellow-500/10'
    }
    if (type === 'recommendation') return 'border-blue-500/50 bg-blue-500/10'
    if (type === 'trend') return 'border-purple-500/50 bg-purple-500/10'
    return 'border-primary/50 bg-primary/10'
  }

  if (!insights || insights.length === 0) {
    return (
      <div className="bg-card border border-border rounded-2xl p-6">
        <h3 className="text-lg font-bold mb-2">AI Insights</h3>
        <p className="text-muted-foreground">No insights available yet. Upload transactions to get personalized insights!</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-8">
        <div>
          <h2 className="font-bold text-2xl text-foreground mb-2">AI Insights</h2>
          <p className="text-sm text-muted-foreground">Personalized financial recommendations</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {insights.slice(0, 6).map((insight, index) => (
          <Card
            key={index}
            className={`p-4 border-l-4 ${getInsightColor(insight.type, insight.severity)} animate-slide-in`}
          >
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded-lg ${
                insight.type === 'alert' ? 'bg-red-500/20' :
                insight.type === 'recommendation' ? 'bg-blue-500/20' :
                'bg-purple-500/20'
              }`}>
                {getInsightIcon(insight.type)}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    {insight.type === 'alert' ? 'Alert' : insight.type === 'recommendation' ? 'Recommendation' : 'Trend'}
                  </p>
                  {insight.severity && (
                    <span className={`text-xs px-2 py-0.5 rounded ${
                      insight.severity === 'high' ? 'bg-red-500/20 text-red-600' :
                      insight.severity === 'medium' ? 'bg-orange-500/20 text-orange-600' :
                      'bg-yellow-500/20 text-yellow-600'
                    }`}>
                      {insight.severity}
                    </span>
                  )}
                </div>
                <p className="text-base font-bold text-foreground mb-2">{insight.title}</p>
                <p className="text-sm text-muted-foreground">{insight.message}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
