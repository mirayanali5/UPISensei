"use client"

import { useState, useEffect } from 'react'
import { useAuth } from '@/app/providers'
import { useRouter } from 'next/navigation'
import Header from './header'
import Navigation from './navigation'
import SpendingStatsCard from './spending-stats-card'
import WeeklySpendingChart from './weekly-spending-chart'
import GenZJoke from './gen-z-joke'
import TransactionHistory from './transaction-history'
import FloatingChatButton from './floating-chat-button'
import ProfileSection from './profile-section'
import InsightsSection from './insights-section'
import FileUploadCard from './file-upload-card'
import { apiService, AnalysisResponse } from '@/lib/api-service'

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [analysis, setAnalysis] = useState<AnalysisResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user, isLoggedIn } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (isLoggedIn && user?.id) {
      loadAnalysis()
    }
  }, [isLoggedIn, user?.id])

  const loadAnalysis = async () => {
    if (!user?.id) return
    
    try {
      setLoading(true)
      setError(null)
      const data = await apiService.getAnalysis(user.id, 30)
      setAnalysis(data)
    } catch (err: any) {
      setError(err.message || 'Failed to load analysis')
      console.error('Error loading analysis:', err)
    } finally {
      setLoading(false)
    }
  }

  if (!isLoggedIn) {
    router.push('/login')
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted pb-24">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 pt-4 pb-8">
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {loading && (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Loading your financial insights...</p>
              </div>
            )}

            {error && (
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                <p className="text-destructive">{error}</p>
              </div>
            )}

            {!loading && !error && analysis && (
              <>
                {analysis.summary.transaction_count === 0 ? (
                  // Empty state - no transactions
                  <div className="space-y-6">
                    <div className="bg-card border border-border rounded-2xl p-8 text-center space-y-4">
                      <div className="text-6xl mb-4">📊</div>
                      <h2 className="text-2xl font-bold text-foreground">No Transactions Yet</h2>
                      <p className="text-muted-foreground max-w-md mx-auto">
                        Upload your bank statement (PDF) or transaction CSV file to start analyzing your spending patterns.
                      </p>
                    </div>
                    
                    {/* File Upload Card */}
                    <FileUploadCard />
                  </div>
                ) : (
                  // Has transactions - show dashboard
                  <>
                    {/* Spending Stats Card */}
                    <SpendingStatsCard analysis={analysis} />

                    {/* Insights Section */}
                    <InsightsSection insights={analysis.insights} />

                    {/* Pie Chart Section */}
                    <WeeklySpendingChart summary={analysis.summary} />

                    {/* Gen-Z Joke */}
                    <GenZJoke />

                    {/* Transaction History */}
                    <TransactionHistory userId={user?.id} />
                  </>
                )}
              </>
            )}

            {!loading && !error && !analysis && (
              <div className="space-y-6">
                <div className="text-center py-4">
                  <p className="text-muted-foreground mb-4">Upload a PDF or CSV to get started!</p>
                </div>
                <FileUploadCard />
              </div>
            )}
          </div>
        )}

        {activeTab === 'profile' && (
          <ProfileSection />
        )}
      </main>

      {/* Bottom Navigation */}
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />

      <FloatingChatButton userId={user?.id} />
    </div>
  )
}
