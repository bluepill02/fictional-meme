import React, { useEffect, useState } from 'react'
import { Button } from './ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Progress } from './ui/progress'
import { Badge } from './ui/badge'
import { useAuth } from './AuthProvider'
import { authenticatedApiCall } from '../utils/api'
import { Play, Trophy, Calendar, Settings, LogOut, Crown, Brain, Target, TrendingUp, Clock } from 'lucide-react'

interface UserProgress {
  subscription: string
  lessonsCompleted: number
  joinedDate: string
  totalWordsLearned: number
  currentStreak: number
  longestStreak: number
  flashcardStats: {
    total: number
    mastered: number
    learning: number
    new: number
    due: number
    lapseRate: number
  }
  cefrProgress: Record<string, number>
  currentCefrLevel: string
  weeklyActivity: Array<{
    date: string
    lessons: number
    reviews: number
  }>
  progress: Array<{
    lessonId: string
    lastScore: number
    lastReviewedDate: string
    nextReviewDate: string
  }>
}

interface HomeScreenProps {
  onNavigate: (screen: string) => void
}

export function HomeScreen({ onNavigate }: HomeScreenProps) {
  const { user, session, signOut } = useAuth()
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null)
  const [dueLessons, setDueLessons] = useState<any>(null)
  const [aiRecommendations, setAiRecommendations] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (session?.access_token) {
      loadUserProgress()
      loadDueLessons()
      loadAIRecommendations()
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

  const loadDueLessons = async () => {
    try {
      const data = await authenticatedApiCall('/lessons/due', session!.access_token)
      setDueLessons(data)
    } catch (error) {
      console.error('Failed to load due lessons:', error)
    }
  }

  const loadAIRecommendations = async () => {
    try {
      const data = await authenticatedApiCall('/ai/recommendations', session!.access_token)
      setAiRecommendations(data.recommendations)
    } catch (error) {
      console.error('Failed to load AI recommendations:', error)
    }
  }

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 18) return 'Good afternoon'
    return 'Good evening'
  }

  const getStreakDays = () => {
    if (!userProgress?.progress?.length) return 0
    
    // Calculate streak based on consecutive days with lessons
    const sortedProgress = userProgress.progress
      .filter(p => p.lastReviewedDate)
      .sort((a, b) => new Date(b.lastReviewedDate).getTime() - new Date(a.lastReviewedDate).getTime())
    
    let streak = 0
    let currentDate = new Date()
    currentDate.setHours(0, 0, 0, 0)
    
    for (const progress of sortedProgress) {
      const reviewDate = new Date(progress.lastReviewedDate)
      reviewDate.setHours(0, 0, 0, 0)
      
      const daysDiff = Math.floor((currentDate.getTime() - reviewDate.getTime()) / (1000 * 60 * 60 * 24))
      
      if (daysDiff === streak) {
        streak++
        currentDate.setDate(currentDate.getDate() - 1)
      } else {
        break
      }
    }
    
    return streak
  }

  const averageScore = userProgress?.progress?.length 
    ? Math.round(userProgress.progress.reduce((sum, p) => sum + (p.lastScore || 0), 0) / userProgress.progress.length)
    : 0

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
      <div className="p-4 flex justify-between items-center">
        <div>
          <h1 className="text-xl text-white">
            {getGreeting()}, {user?.user_metadata?.name || 'Learner'}!
          </h1>
          <div className="flex items-center space-x-2 mt-1">
            {userProgress?.subscription === 'paid' && (
              <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30">
                <Crown className="w-3 h-3 mr-1" />
                Premium
              </Badge>
            )}
          </div>
        </div>
        <div className="flex space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onNavigate('subscription')}
            className="text-white hover:bg-white/10"
          >
            <Settings className="w-5 h-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={signOut}
            className="text-white hover:bg-white/10"
          >
            <LogOut className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <div className="mobile-padding p-4 space-y-6">
        {/* Enhanced Progress Overview */}
        <div className="responsive-card-grid grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="glass-card text-center">
            <CardContent className="p-4">
              <Trophy className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{userProgress?.currentStreak || 0}</div>
              <div className="text-sm text-blue-200">Day Streak</div>
            </CardContent>
          </Card>
          
          <Card className="glass-card text-center">
            <CardContent className="p-4">
              <Brain className="w-6 h-6 text-purple-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{userProgress?.totalWordsLearned || 0}</div>
              <div className="text-sm text-blue-200">Words Mastered</div>
            </CardContent>
          </Card>
          
          <Card className="glass-card text-center">
            <CardContent className="p-4">
              <Target className="w-6 h-6 text-green-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{userProgress?.currentCefrLevel || 'A1'}</div>
              <div className="text-sm text-blue-200">CEFR Level</div>
            </CardContent>
          </Card>
          
          <Card className="glass-card text-center">
            <CardContent className="p-4">
              <Clock className="w-6 h-6 text-blue-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{dueLessons?.scheduleSummary?.totalDue || 0}</div>
              <div className="text-sm text-blue-200">Due Today</div>
            </CardContent>
          </Card>
        </div>

        {/* AI-Powered Learning Recommendations */}
        {aiRecommendations && (
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Brain className="w-5 h-5 mr-2" />
                Smart Study Plan
              </CardTitle>
              <CardDescription className="text-blue-200">
                Personalized recommendations based on your progress
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-blue-200">Focus Areas</div>
                  <div className="text-white">{aiRecommendations.studyPlan?.focusAreas?.length || 0} words</div>
                </div>
                <div>
                  <div className="text-blue-200">Suggested Time</div>
                  <div className="text-white">{aiRecommendations.studyPlan?.suggestedDuration || 5} min</div>
                </div>
              </div>
              
              {aiRecommendations.motivationalInsights && (
                <div className="p-3 bg-blue-900/20 rounded-lg">
                  <p className="text-blue-200 text-sm">
                    💡 {aiRecommendations.motivationalInsights[0]}
                  </p>
                </div>
              )}
              
              <Button 
                onClick={() => onNavigate('languages')}
                className="w-full cosmic-button"
                size="lg"
              >
                Start Smart Session
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Continue Learning */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Play className="w-5 h-5 mr-2" />
              Continue Learning
            </CardTitle>
            <CardDescription className="text-blue-200">
              {dueLessons?.scheduleSummary?.totalDue > 0 
                ? `${dueLessons.scheduleSummary.totalDue} items ready for review`
                : 'Keep up the great work!'
              }
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {dueLessons?.recommendations && (
              <div className="grid grid-cols-3 gap-4 text-center text-sm">
                <div>
                  <div className="text-2xl">{dueLessons.scheduleSummary.lessons}</div>
                  <div className="text-blue-200">Lessons</div>
                </div>
                <div>
                  <div className="text-2xl">{dueLessons.scheduleSummary.flashcards}</div>
                  <div className="text-blue-200">Flashcards</div>
                </div>
                <div>
                  <div className="text-2xl">{dueLessons.recommendations.estimatedTimeMinutes}</div>
                  <div className="text-blue-200">Minutes</div>
                </div>
              </div>
            )}
            
            <div className="space-y-2">
              <Button 
                onClick={() => onNavigate('languages')}
                className="w-full cosmic-button"
                size="lg"
              >
                {dueLessons?.scheduleSummary?.totalDue > 0 ? 'Review Due Items' : 'Start New Lesson'}
              </Button>
              
              <Button 
                onClick={() => onNavigate('neet-content')}
                variant="outline"
                className="w-full text-white border-white hover:bg-white/10"
                size="lg"
              >
                🎯 NEET Preparation
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Analytics */}
        {userProgress?.flashcardStats && (
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <TrendingUp className="w-5 h-5 mr-2" />
                Learning Analytics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Flashcard distribution */}
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-blue-200">Vocabulary Progress</span>
                  <span className="text-white">
                    {userProgress.flashcardStats.mastered} / {userProgress.flashcardStats.total} mastered
                  </span>
                </div>
                <div className="flex h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className="bg-green-500" 
                    style={{ width: `${(userProgress.flashcardStats.mastered / userProgress.flashcardStats.total) * 100}%` }}
                  ></div>
                  <div 
                    className="bg-yellow-500" 
                    style={{ width: `${(userProgress.flashcardStats.learning / userProgress.flashcardStats.total) * 100}%` }}
                  ></div>
                  <div 
                    className="bg-blue-500" 
                    style={{ width: `${(userProgress.flashcardStats.new / userProgress.flashcardStats.total) * 100}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-blue-300 mt-1">
                  <span>✓ Mastered</span>
                  <span>📚 Learning</span>
                  <span>🆕 New</span>
                </div>
              </div>

              {/* CEFR Progress */}
              {userProgress.cefrProgress && (
                <div>
                  <div className="text-sm text-blue-200 mb-2">CEFR Level Progress</div>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    {Object.entries(userProgress.cefrProgress).map(([level, count]) => (
                      <div key={level} className="text-center p-2 bg-blue-900/20 rounded">
                        <div className="text-white font-medium">{level}</div>
                        <div className="text-blue-300">{count} words</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Weekly activity chart */}
              {userProgress.weeklyActivity && (
                <div>
                  <div className="text-sm text-blue-200 mb-2">This Week's Activity</div>
                  <div className="flex justify-between items-end h-12 space-x-1">
                    {userProgress.weeklyActivity.map((day, index) => (
                      <div key={index} className="flex-1 flex flex-col items-center">
                        <div 
                          className="w-full bg-blue-500 rounded-t"
                          style={{ 
                            height: `${Math.max(4, (day.lessons / Math.max(...userProgress.weeklyActivity.map(d => d.lessons))) * 100)}%`,
                            minHeight: '4px'
                          }}
                        ></div>
                        <div className="text-xs text-blue-300 mt-1">
                          {new Date(day.date).toLocaleDateString('en', { weekday: 'short' })[0]}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-2 grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-blue-200 flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    Joined
                  </span>
                  <span className="text-white">
                    {userProgress.joinedDate ? new Date(userProgress.joinedDate).toLocaleDateString() : 'Recently'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-blue-200">Accuracy</span>
                  <span className="text-white">{Math.round((1 - userProgress.flashcardStats.lapseRate) * 100)}%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Subscription prompt for free users */}
        {userProgress?.subscription === 'free' && userProgress.lessonsCompleted >= 3 && (
          <Card className="glass-card border-yellow-500/30">
            <CardHeader>
              <CardTitle className="text-yellow-300 flex items-center">
                <Crown className="w-5 h-5 mr-2" />
                Unlock Premium
              </CardTitle>
              <CardDescription className="text-yellow-200">
                You've completed {userProgress.lessonsCompleted} lessons this month. Upgrade to continue learning!
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => onNavigate('subscription')}
                className="w-full bg-yellow-500 hover:bg-yellow-600 text-black"
              >
                Upgrade for ₹99/month
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}