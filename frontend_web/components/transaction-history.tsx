"use client"

import { useState, useEffect } from 'react'
import TransactionCard from './transaction-card'
import { apiService, Transaction } from '@/lib/api-service'
import { formatDistanceToNow } from 'date-fns'

interface TransactionHistoryProps {
  userId?: string
}

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

export default function TransactionHistory({ userId }: TransactionHistoryProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (userId) {
      loadTransactions()
    }
  }, [userId])

  const loadTransactions = async () => {
    if (!userId) return
    
    try {
      setLoading(true)
      const data = await apiService.getUserTransactions(userId, 20)
      setTransactions(data.transactions)
    } catch (error) {
      console.error('Error loading transactions:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatTransaction = (txn: Transaction) => {
    const date = new Date(txn.date)
    const timeAgo = formatDistanceToNow(date, { addSuffix: true })
    
    return {
      id: txn.id,
      type: txn.type === 'debit' ? 'sent' : 'received',
      name: txn.merchant || txn.raw_text.substring(0, 30),
      emoji: CATEGORY_EMOJIS[txn.category] || '📦',
      amount: txn.amount,
      time: timeAgo,
      category: txn.category,
    }
  }

  if (loading) {
    return (
      <div className="bg-card border border-border rounded-2xl p-6 shadow-lg">
        <h3 className="text-lg font-bold mb-4">History of Transactions</h3>
        <p className="text-muted-foreground text-center py-4">Loading transactions...</p>
      </div>
    )
  }

  if (transactions.length === 0) {
    return (
      <div className="bg-card border border-border rounded-2xl p-6 shadow-lg">
        <h3 className="text-lg font-bold mb-4">History of Transactions</h3>
        <p className="text-muted-foreground text-center py-4">No transactions found</p>
      </div>
    )
  }

  return (
    <div className="bg-card border border-border rounded-2xl p-6 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold">History of Transactions</h3>
        <span className="text-sm text-muted-foreground">
          {transactions.length} transactions
        </span>
      </div>

      <div className="space-y-3">
        {transactions.slice(0, 10).map((tx) => (
          <TransactionCard key={tx.id} transaction={formatTransaction(tx)} />
        ))}
      </div>
    </div>
  )
}
