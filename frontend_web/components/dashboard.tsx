"use client"

import { useState } from 'react'
import Header from './header'
import BalanceCard from './balance-card'
import ChatFeed from './chat-feed'
import GameificationSection from './gamification-section'
import InsightsSection from './insights-section'
import AIAgentChatbot from './ai-agent-chatbot'
import Navigation from './navigation'

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('feed')

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted pb-24">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 pt-4">
        {/* Quick Balance Overview */}
        <BalanceCard />
        
        {/* Main Content Tabs */}
        <div className="mt-6">
          {activeTab === 'feed' && (
            <>
              <ChatFeed />
              <GameificationSection />
            </>
          )}
          {activeTab === 'insights' && <InsightsSection />}
          {activeTab === 'challenges' && <GameificationSection expandedView />}
          {activeTab === 'chatbot' && <AIAgentChatbot />}
        </div>
      </main>

      {/* Bottom Navigation */}
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  )
}
