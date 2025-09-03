import React, { useEffect, useState, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Progress } from './ui/progress'
import { Badge } from './ui/badge'
import { ArrowLeft, Volume2, RotateCcw, ArrowRight, CheckCircle, Mic, MicOff, Play, Pause, SkipForward } from 'lucide-react'
import { apiCall, authenticatedApiCall } from '../utils/api'
import { useAuth } from './AuthProvider'
import { useAccessibility } from './AccessibilityProvider'

interface VocabItem {
  vocab_id: string
  word: string
  translation: string
  pronunciation: string
  part_of_speech: string
  sample_sentence: string
  difficulty_score: number
  audio_url: string | null
}

interface Lesson {
  id: string
  deckId: string
  title: string
  content_type: string
  duration_sec: number
  cefr_level: string
  vocabList: VocabItem[]
  dialogue: any
  learning_objectives: string[]
  cultural_notes?: string
}

interface EnhancedLessonPlayerProps {
  deckId: string
  deckTitle: string
  languageName: string
  onNavigate: (screen: string, data?: any) => void
}

export function EnhancedLessonPlayer({ deckId, deckTitle, languageName, onNavigate }: EnhancedLessonPlayerProps) {
  const { session } = useAuth()
  const { settings, isReducedMotion } = useAccessibility()
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null)
  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  const [showTranslation, setShowTranslation] = useState(false)
  const [loading, setLoading] = useState(true)
  const [startTime, setStartTime] = useState<number>(Date.now())
  const [cardStartTime, setCardStartTime] = useState<number>(Date.now())
  const [flashcardResults, setFlashcardResults] = useState<Array<{vocabId: string, grade: number, responseTime: number}>>([])
  const [isRecording, setIsRecording] = useState(false)
  const [audioPlayback, setAudioPlayback] = useState(false)
  const [showHints, setShowHints] = useState(false)
  
  const cardRef = useRef<HTMLDivElement>(null)
  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    loadLessons()
    
    // Set up keyboard navigation
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault()
        if (showTranslation) nextCard()
        else toggleTranslation()
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault()
        prevCard()
      } else if (e.key === 'p' || e.key === 'P') {
        e.preventDefault()
        playAudio()
      } else if (e.key === 'h' || e.key === 'H') {
        e.preventDefault()
        setShowHints(prev => !prev)
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [showTranslation, currentCardIndex])

  useEffect(() => {
    if (lessons.length > 0) {
      setCurrentLesson(lessons[0])
      setStartTime(Date.now())
      setCardStartTime(Date.now())
    }
  }, [lessons])

  useEffect(() => {
    setCardStartTime(Date.now())
  }, [currentCardIndex])

  // Focus management
  useEffect(() => {
    if (cardRef.current) {
      cardRef.current.focus()
    }
  }, [currentCardIndex])

  const loadLessons = async () => {
    try {
      const headers = session?.access_token ? 
        { Authorization: `Bearer ${session.access_token}` } : {}
      
      const data = await apiCall(`/lessons/${deckId}`, { headers })
      setLessons(data.lessons || [])
    } catch (error) {
      console.error('Failed to load lessons:', error)
    } finally {
      setLoading(false)
    }
  }

  const playAudio = () => {
    if (!currentLesson) return
    
    const currentCard = currentLesson.vocabList[currentCardIndex]
    
    // Use Web Speech API for pronunciation
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(currentCard.word)
      
      // Try to find an appropriate voice for the language
      const voices = speechSynthesis.getVoices()
      const languageCode = languageName.includes('Hindi') ? 'hi' : 
                          languageName.includes('Spanish') ? 'es' : 'en'
      const voice = voices.find(v => v.lang.startsWith(languageCode))
      if (voice) utterance.voice = voice
      
      utterance.rate = 0.8 // Slower for learning
      utterance.onstart = () => setAudioPlayback(true)
      utterance.onend = () => setAudioPlayback(false)
      
      speechSynthesis.speak(utterance)
    }

    // Announce for screen readers
    if (settings.screen_reader_optimized) {
      const announcement = `Playing pronunciation for ${currentCard.word}: ${currentCard.pronunciation}`
      const announcementElement = document.createElement('div')
      announcementElement.setAttribute('aria-live', 'polite')
      announcementElement.setAttribute('aria-atomic', 'true')
      announcementElement.className = 'sr-only'
      announcementElement.textContent = announcement
      document.body.appendChild(announcementElement)
      setTimeout(() => document.body.removeChild(announcementElement), 1000)
    }
  }

  const recordPronunciation = async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      alert('Recording not supported in this browser')
      return
    }

    if (isRecording) {
      setIsRecording(false)
      return
    }

    try {
      setIsRecording(true)
      // In a real app, would implement speech recognition here
      setTimeout(() => {
        setIsRecording(false)
        // Simulate pronunciation feedback
        alert('Great pronunciation! Keep practicing.')
      }, 3000)
    } catch (error) {
      console.error('Recording error:', error)
      setIsRecording(false)
    }
  }

  const rateCard = (grade: number) => {
    const responseTime = Date.now() - cardStartTime
    const currentCard = currentLesson!.vocabList[currentCardIndex]
    
    setFlashcardResults(prev => [...prev, {
      vocabId: currentCard.vocab_id,
      grade,
      responseTime
    }])

    nextCard()
  }

  const nextCard = () => {
    if (!currentLesson) return
    
    if (!showTranslation) {
      toggleTranslation()
      return
    }
    
    if (currentCardIndex < currentLesson.vocabList.length - 1) {
      setCurrentCardIndex(prev => prev + 1)
      setShowTranslation(false)
    } else {
      // Lesson complete, go to quiz
      onNavigate('quiz', { 
        lesson: currentLesson,
        deckTitle,
        languageName,
        timeSpent: Math.floor((Date.now() - startTime) / 1000),
        flashcardResults
      })
    }
  }

  const prevCard = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(prev => prev - 1)
      setShowTranslation(false)
    }
  }

  const toggleTranslation = () => {
    setShowTranslation(prev => !prev)
    
    // Announce for screen readers
    if (settings.screen_reader_optimized) {
      const currentCard = currentLesson!.vocabList[currentCardIndex]
      const announcement = showTranslation ? 
        `Hiding translation` : 
        `Translation: ${currentCard.translation}`
      
      const announcementElement = document.createElement('div')
      announcementElement.setAttribute('aria-live', 'polite')
      announcementElement.className = 'sr-only'
      announcementElement.textContent = announcement
      document.body.appendChild(announcementElement)
      setTimeout(() => document.body.removeChild(announcementElement), 1000)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen cosmic-gradient flex items-center justify-center">
        <div className="text-white" role="status" aria-live="polite">Loading lesson...</div>
      </div>
    )
  }

  if (!currentLesson || currentLesson.vocabList.length === 0) {
    return (
      <div className="min-h-screen cosmic-gradient flex items-center justify-center p-4">
        <Card className="glass-card max-w-md">
          <CardContent className="p-6 text-center">
            <h3 className="text-white text-lg mb-2">No lessons available</h3>
            <p className="text-blue-200 mb-4">This deck doesn't have any lessons yet.</p>
            <Button onClick={() => onNavigate('decks', { languageId: deckId, languageName })}>
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const currentCard = currentLesson.vocabList[currentCardIndex]
  const progressPercentage = ((currentCardIndex + 1) / currentLesson.vocabList.length) * 100

  return (
    <div className="min-h-screen cosmic-gradient">
      {/* Skip navigation for screen readers */}
      <a href="#main-content" className="skip-link">Skip to main content</a>
      
      {/* Header */}
      <header className="p-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onNavigate('decks', { languageId: deckId, languageName })}
            className="text-white hover:bg-white/10"
            aria-label="Go back to deck list"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-lg text-white">{deckTitle}</h1>
            <p className="text-sm text-blue-200">{languageName} • {currentLesson.cefr_level}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="border-blue-400 text-blue-300">
            {currentCardIndex + 1} / {currentLesson.vocabList.length}
          </Badge>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowHints(prev => !prev)}
            className="text-white hover:bg-white/10"
            aria-label="Toggle learning hints"
          >
            💡
          </Button>
        </div>
      </header>

      {/* Progress bar */}
      <div className="px-4 mb-6">
        <Progress 
          value={progressPercentage} 
          className="h-2" 
          aria-label={`Lesson progress: ${Math.round(progressPercentage)}% complete`}
        />
      </div>

      {/* Learning hints */}
      {showHints && (
        <div className="px-4 mb-4">
          <Card className="glass-card">
            <CardContent className="p-3">
              <h4 className="text-white text-sm font-medium mb-2">💡 Learning Tips</h4>
              <ul className="text-blue-200 text-sm space-y-1">
                <li>• Press Space or → to reveal translation</li>
                <li>• Press P to hear pronunciation</li>
                <li>• Use ← and → arrows to navigate</li>
                <li>• Focus on understanding before memorizing</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main content */}
      <main id="main-content" className="p-4 flex-1 flex items-center justify-center">
        <Card 
          ref={cardRef}
          className="glass-card w-full max-w-md aspect-[3/4] flex flex-col cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-400"
          onClick={toggleTranslation}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              toggleTranslation()
            }
          }}
          tabIndex={0}
          role="button"
          aria-label={`Flashcard: ${currentCard.word}. ${showTranslation ? 'Translation visible' : 'Press to reveal translation'}`}
        >
          <CardHeader className="text-center flex-1 flex items-center justify-center">
            <div className="space-y-4">
              <Badge className="bg-blue-500/20 text-blue-300 mb-4">
                {currentCard.part_of_speech}
              </Badge>
              
              <CardTitle className="text-3xl text-white mb-4">
                {currentCard.word}
              </CardTitle>
              
              {currentCard.pronunciation && (
                <p className="text-lg text-blue-300 mb-4">
                  [{currentCard.pronunciation}]
                </p>
              )}

              {showTranslation && (
                <div className={`text-center ${!isReducedMotion ? 'animate-fade-in' : ''}`}>
                  <p className="text-xl text-green-300 mb-2">
                    {currentCard.translation}
                  </p>
                  <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-3" />
                  
                  {currentCard.sample_sentence && (
                    <div className="text-sm text-blue-200 p-3 bg-blue-900/20 rounded-lg">
                      <strong>Example:</strong><br />
                      {currentCard.sample_sentence}
                    </div>
                  )}
                </div>
              )}

              {!showTranslation && (
                <p className="text-sm text-blue-200">
                  {settings.keyboard_navigation ? 
                    'Press Space or click to reveal translation' :
                    'Tap to reveal translation'
                  }
                </p>
              )}
            </div>
          </CardHeader>

          <CardContent className="text-center space-y-4">
            {/* Audio controls */}
            <div className="flex justify-center space-x-2">
              <Button
                onClick={(e) => {
                  e.stopPropagation()
                  playAudio()
                }}
                variant="outline"
                size="icon"
                className="border-blue-400 text-blue-300 hover:bg-blue-400/20"
                disabled={audioPlayback}
                aria-label="Play pronunciation audio"
              >
                {audioPlayback ? <Pause className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </Button>
              
              <Button
                onClick={(e) => {
                  e.stopPropagation()
                  recordPronunciation()
                }}
                variant="outline"
                size="icon"
                className={`border-blue-400 hover:bg-blue-400/20 ${
                  isRecording ? 'text-red-400 border-red-400' : 'text-blue-300'
                }`}
                aria-label={isRecording ? 'Recording... Click to stop' : 'Record your pronunciation'}
              >
                {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </Button>
            </div>

            {/* Difficulty rating (only shown after translation) */}
            {showTranslation && (
              <div className="flex justify-center space-x-2 pt-2">
                <Button
                  onClick={(e) => { e.stopPropagation(); rateCard(1) }}
                  size="sm"
                  variant="outline"
                  className="border-red-400 text-red-300 hover:bg-red-400/20"
                  aria-label="Mark as difficult (will review soon)"
                >
                  Hard
                </Button>
                <Button
                  onClick={(e) => { e.stopPropagation(); rateCard(3) }}
                  size="sm"
                  variant="outline"
                  className="border-blue-400 text-blue-300 hover:bg-blue-400/20"
                  aria-label="Mark as good (normal review interval)"
                >
                  Good
                </Button>
                <Button
                  onClick={(e) => { e.stopPropagation(); rateCard(4) }}
                  size="sm"
                  variant="outline"
                  className="border-green-400 text-green-300 hover:bg-green-400/20"
                  aria-label="Mark as easy (longer review interval)"
                >
                  Easy
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      {/* Navigation */}
      <nav className="p-4 flex justify-between items-center" role="navigation" aria-label="Lesson navigation">
        <Button
          variant="ghost"
          onClick={prevCard}
          disabled={currentCardIndex === 0}
          className="text-white hover:bg-white/10 disabled:opacity-50"
          aria-label="Previous card"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Previous
        </Button>

        <Button
          onClick={nextCard}
          className="cosmic-button"
          disabled={!showTranslation}
          aria-label={currentCardIndex === currentLesson.vocabList.length - 1 ? 'Complete lesson and start quiz' : 'Next card'}
        >
          {currentCardIndex === currentLesson.vocabList.length - 1 ? 'Quiz' : 'Next'}
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </nav>

      {/* Learning objectives */}
      {currentLesson.learning_objectives && (
        <div className="p-4">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-white text-sm">📚 Learning Objectives</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-blue-200 text-sm space-y-1">
                {currentLesson.learning_objectives.map((objective, index) => (
                  <li key={index}>• {objective}</li>
                ))}
              </ul>
              {currentLesson.cultural_notes && (
                <div className="mt-3 p-2 bg-blue-900/20 rounded text-xs text-blue-200">
                  <strong>Cultural Note:</strong> {currentLesson.cultural_notes}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Hidden audio element for future use */}
      <audio ref={audioRef} className="hidden" />
    </div>
  )
}