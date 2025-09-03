import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { ArrowLeft, Crown, Check, Star, Users, Headphones, BookOpen, Zap, Settings, Eye } from 'lucide-react'
import { useAuth } from './AuthProvider'
import { authenticatedApiCall } from '../utils/api'

interface SubscriptionScreenProps {
  onNavigate: (screen: string) => void
}

export function SubscriptionScreen({ onNavigate }: SubscriptionScreenProps) {
  const { session, user } = useAuth()
  const [userProgress, setUserProgress] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [upgrading, setUpgrading] = useState(false)

  useEffect(() => {
    if (session?.access_token) {
      loadUserProgress()
    }
  }, [session])

  const loadUserProgress = async () => {
    try {
      const data = await authenticatedApiCall('/user/progress', session!.access_token)
      setUserProgress(data)
    } catch (error) {
      console.error('Failed to load user progress:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpgrade = async () => {
    if (!session?.access_token) return
    
    setUpgrading(true)
    try {
      await authenticatedApiCall('/subscription/upgrade', session.access_token, {
        method: 'POST'
      })
      
      // Reload user progress to reflect subscription change
      await loadUserProgress()
      
      // Show success message (in a real app, this would be after payment processing)
      alert('Subscription upgraded successfully! 🎉')
    } catch (error) {
      console.error('Failed to upgrade subscription:', error)
      alert('Upgrade failed. Please try again.')
    } finally {
      setUpgrading(false)
    }
  }

  const isPremium = userProgress?.subscription === 'paid'
  const lessonsCompleted = userProgress?.lessonsCompleted || 0
  const freeLimit = 3

  const premiumFeatures = [
    {
      icon: <BookOpen className="w-5 h-5" />,
      title: 'Unlimited Lessons',
      description: 'Access all language decks and lessons'
    },
    {
      icon: <Headphones className="w-5 h-5" />,
      title: 'Audio Pronunciation',
      description: 'High-quality native speaker audio'
    },
    {
      icon: <Zap className="w-5 h-5" />,
      title: 'Advanced Spaced Repetition',
      description: 'AI-powered review scheduling'
    },
    {
      icon: <Users className="w-5 h-5" />,
      title: 'Community Features',
      description: 'Study groups and leaderboards'
    },
    {
      icon: <Star className="w-5 h-5" />,
      title: 'Offline Mode',
      description: 'Download lessons for offline study'
    }
  ]

  if (loading) {
    return (
      <div className="min-h-screen cosmic-gradient flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen cosmic-gradient">
      {/* Header */}
      <div className="p-4 flex items-center space-x-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onNavigate('home')}
          className="text-white hover:bg-white/10"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-xl text-white">Subscription</h1>
      </div>

      <div className="p-4 space-y-6">
        {/* Current Status */}
        <Card className="glass-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-white flex items-center">
                <Crown className="w-5 h-5 mr-2" />
                Current Plan
              </CardTitle>
              <Badge 
                className={isPremium 
                  ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30' 
                  : 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                }
              >
                {isPremium ? 'Premium' : 'Free'}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            {isPremium ? (
              <div>
                <p className="text-blue-200 mb-4">
                  You have unlimited access to all features!
                </p>
                <div className="text-sm text-white">
                  Subscribed: {userProgress.subscription_date ? new Date(userProgress.subscription_date).toLocaleDateString() : 'Recently'}
                </div>
              </div>
            ) : (
              <div>
                <p className="text-blue-200 mb-4">
                  You're on the free plan with limited access.
                </p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-blue-200">Lessons this month</span>
                    <span className="text-white">{lessonsCompleted} / {freeLimit}</span>
                  </div>
                  <div className="bg-white/10 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full transition-all"
                      style={{ width: `${Math.min((lessonsCompleted / freeLimit) * 100, 100)}%` }}
                    ></div>
                  </div>
                  {lessonsCompleted >= freeLimit && (
                    <p className="text-yellow-300 text-sm mt-2">
                      You've reached your free lesson limit. Upgrade to continue learning!
                    </p>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Premium Plan */}
        {!isPremium && (
          <Card className="glass-card border-yellow-500/30 relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-yellow-500 text-black px-3 py-1 text-xs font-medium">
              POPULAR
            </div>
            <CardHeader>
              <CardTitle className="text-white text-2xl flex items-center">
                <Crown className="w-6 h-6 mr-2 text-yellow-400" />
                Premium Plan
              </CardTitle>
              <CardDescription className="text-blue-200">
                Unlock your language learning potential
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center mb-6">
                <div className="text-4xl font-bold text-white mb-2">₹99</div>
                <div className="text-blue-200">per month</div>
                <div className="text-sm text-yellow-300 mt-1">
                  First week free • Cancel anytime
                </div>
              </div>

              <div className="space-y-3 mb-6">
                {premiumFeatures.map((feature, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="text-green-400 mt-0.5">
                      {feature.icon}
                    </div>
                    <div>
                      <div className="text-white font-medium">{feature.title}</div>
                      <div className="text-blue-200 text-sm">{feature.description}</div>
                    </div>
                  </div>
                ))}
              </div>

              <Button 
                onClick={handleUpgrade}
                disabled={upgrading}
                className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-medium py-3"
                size="lg"
              >
                {upgrading ? 'Processing...' : 'Upgrade to Premium'}
              </Button>

              <p className="text-xs text-blue-300 text-center mt-3">
                Secure payment processing. Cancel anytime from your account settings.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Free vs Premium Comparison */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-white text-lg">Free</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex items-center text-blue-200">
                <Check className="w-4 h-4 mr-2 text-green-400" />
                3 lessons/month
              </div>
              <div className="flex items-center text-blue-200">
                <Check className="w-4 h-4 mr-2 text-green-400" />
                Basic flashcards
              </div>
              <div className="flex items-center text-gray-400">
                <div className="w-4 h-4 mr-2" />
                Limited audio
              </div>
              <div className="flex items-center text-gray-400">
                <div className="w-4 h-4 mr-2" />
                No offline mode
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card border-yellow-500/30">
            <CardHeader>
              <CardTitle className="text-white text-lg">Premium</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex items-center text-blue-200">
                <Check className="w-4 h-4 mr-2 text-green-400" />
                Unlimited lessons
              </div>
              <div className="flex items-center text-blue-200">
                <Check className="w-4 h-4 mr-2 text-green-400" />
                Advanced features
              </div>
              <div className="flex items-center text-blue-200">
                <Check className="w-4 h-4 mr-2 text-green-400" />
                Full audio library
              </div>
              <div className="flex items-center text-blue-200">
                <Check className="w-4 h-4 mr-2 text-green-400" />
                Offline downloads
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Settings & Accessibility */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Eye className="w-5 h-5 mr-2" />
                Accessibility
              </CardTitle>
              <CardDescription className="text-blue-200">
                Customize the app for your needs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => onNavigate('accessibility')}
                variant="outline"
                className="w-full border-blue-400 text-blue-300 hover:bg-blue-400/20"
              >
                Accessibility Settings
              </Button>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Settings className="w-5 h-5 mr-2" />
                Privacy
              </CardTitle>
              <CardDescription className="text-blue-200">
                Manage your data and privacy
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                variant="outline"
                className="w-full border-blue-400 text-blue-300 hover:bg-blue-400/20"
              >
                Privacy Settings
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Testimonials */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-white">What Our Users Say</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm">
              <p className="text-blue-200 italic mb-2">
                "I learned basic Hindi in just 2 weeks! The bite-sized lessons fit perfectly into my busy schedule."
              </p>
              <div className="text-white">- Priya, Mumbai</div>
            </div>
            <div className="text-sm">
              <p className="text-blue-200 italic mb-2">
                "The spaced repetition really works. I actually remember the words weeks later!"
              </p>
              <div className="text-white">- Alex, Bangalore</div>
            </div>
            <div className="text-sm">
              <p className="text-blue-200 italic mb-2">
                "Love that the app works great with my screen reader. Truly accessible learning!"
              </p>
              <div className="text-white">- Sarah, Delhi</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}