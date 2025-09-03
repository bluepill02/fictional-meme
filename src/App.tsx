import React, { useState, useEffect } from 'react'
import { AuthProvider, useAuth } from './components/AuthProvider'
import { AccessibilityProvider } from './components/AccessibilityProvider'
import { SplashScreen } from './components/SplashScreen'
import { AuthScreen } from './components/AuthScreen'
import { HomeScreen } from './components/HomeScreen'
import { LanguageSelection } from './components/LanguageSelection'
import { DeckList } from './components/DeckList'
import { EnhancedLessonPlayer } from './components/EnhancedLessonPlayer'
import { QuizScreen } from './components/QuizScreen'
import { SubscriptionScreen } from './components/SubscriptionScreen'
import { AccessibilitySettings } from './components/AccessibilitySettings'
import { ResponsiveTestScreen } from './components/ResponsiveTestScreen'
import { NEETContentScreen } from './components/NEETContentScreen'
import { NEETContentViewer } from './components/NEETContentViewer'
import { NEETContentViewerEnhanced } from './components/NEETContentViewerEnhanced'

type Screen = 
  | 'splash'
  | 'auth' 
  | 'home'
  | 'languages'
  | 'decks'
  | 'lessons'
  | 'quiz'
  | 'subscription'
  | 'accessibility'
  | 'responsive-test'
  | 'neet-content'
  | 'neet-content-viewer'
  | 'neet-content-enhanced'

interface NavigationData {
  languageId?: string
  languageName?: string
  deckId?: string
  deckTitle?: string
  lesson?: any
  timeSpent?: number
  subject?: string
  chapter?: string
  chapterId?: string
}

function AppContent() {
  const { user, loading } = useAuth()
  const [currentScreen, setCurrentScreen] = useState<Screen>('splash')
  const [navigationData, setNavigationData] = useState<NavigationData>({})
  const [hasSeenSplash, setHasSeenSplash] = useState(false)

  useEffect(() => {
    if (!loading) {
      if (user && hasSeenSplash) {
        setCurrentScreen('home')
      } else if (user && !hasSeenSplash) {
        // User is logged in but hasn't seen splash, show splash briefly then home
        setCurrentScreen('splash')
      } else if (!user && hasSeenSplash) {
        setCurrentScreen('auth')
      }
    }
  }, [user, loading, hasSeenSplash])

  const handleNavigation = (screen: Screen, data?: NavigationData) => {
    setCurrentScreen(screen)
    if (data) {
      setNavigationData(data)
    }
  }

  const handleGetStarted = () => {
    setHasSeenSplash(true)
    if (user) {
      setCurrentScreen('home')
    } else {
      setCurrentScreen('auth')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen cosmic-gradient flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  switch (currentScreen) {
    case 'splash':
      return <SplashScreen onGetStarted={handleGetStarted} />
    
    case 'auth':
      return <AuthScreen />
    
    case 'home':
      return <HomeScreen onNavigate={handleNavigation} />
    
    case 'languages':
      return <LanguageSelection onNavigate={handleNavigation} />
    
    case 'decks':
      return (
        <DeckList 
          languageId={navigationData.languageId!}
          languageName={navigationData.languageName!}
          onNavigate={handleNavigation}
        />
      )
    
    case 'lessons':
      return (
        <EnhancedLessonPlayer
          deckId={navigationData.deckId!}
          deckTitle={navigationData.deckTitle!}
          languageName={navigationData.languageName!}
          onNavigate={handleNavigation}
        />
      )
    
    case 'quiz':
      return (
        <QuizScreen
          lesson={navigationData.lesson!}
          deckTitle={navigationData.deckTitle!}
          languageName={navigationData.languageName!}
          timeSpent={navigationData.timeSpent!}
          onNavigate={handleNavigation}
        />
      )
    
    case 'subscription':
      return <SubscriptionScreen onNavigate={handleNavigation} />
    
    case 'accessibility':
      return <AccessibilitySettings onNavigate={handleNavigation} />
    
    case 'responsive-test':
      return <ResponsiveTestScreen onNavigate={handleNavigation} />
    
    case 'neet-content':
      return <NEETContentScreen onNavigate={handleNavigation} />
    
    case 'neet-content-viewer':
      return (
        <NEETContentViewer
          subject={navigationData.subject!}
          chapter={navigationData.chapter!}
          chapterId={navigationData.chapterId!}
          onNavigate={handleNavigation}
        />
      )
    
    case 'neet-content-enhanced':
      return (
        <NEETContentViewerEnhanced
          subject={navigationData.subject!}
          chapter={navigationData.chapter!}
          chapterId={navigationData.chapterId!}
          onNavigate={handleNavigation}
        />
      )
    
    default:
      return <SplashScreen onGetStarted={handleGetStarted} />
  }
}

export default function App() {
  return (
    <AuthProvider>
      <AccessibilityProvider>
        <div className="app-container">
          <AppContent />
        </div>
      </AccessibilityProvider>
    </AuthProvider>
  )
}