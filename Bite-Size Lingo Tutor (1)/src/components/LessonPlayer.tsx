import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Progress } from './ui/progress'
import { ArrowLeft, Volume2, RotateCcw, ArrowRight, CheckCircle } from 'lucide-react'
import { apiCall, authenticatedApiCall } from '../utils/api'
import { useAuth } from './AuthProvider'

interface VocabItem {
  word: string
  translation: string
  pronunciation: string
}

interface Lesson {
  id: string
  deckId: string
  vocabList: VocabItem[]
  dialogueText: string
  audioUrl: string | null
}

interface LessonPlayerProps {
  deckId: string
  deckTitle: string
  languageName: string
  onNavigate: (screen: string, data?: any) => void
}

export function LessonPlayer({ deckId, deckTitle, languageName, onNavigate }: LessonPlayerProps) {
  const { session } = useAuth()
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null)
  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  const [showTranslation, setShowTranslation] = useState(false)
  const [loading, setLoading] = useState(true)
  const [startTime, setStartTime] = useState<number>(Date.now())

  useEffect(() => {
    loadLessons()
  }, [deckId])

  useEffect(() => {
    if (lessons.length > 0) {
      setCurrentLesson(lessons[0])
      setStartTime(Date.now())
    }
  }, [lessons])

  const loadLessons = async () => {
    try {
      const data = await apiCall(`/lessons/${deckId}`)
      setLessons(data.lessons || [])
    } catch (error) {
      console.error('Failed to load lessons:', error)
    } finally {
      setLoading(false)
    }
  }

  const playAudio = () => {
    // In a real app, this would play the actual audio file
    // For now, we'll use text-to-speech if available
    if ('speechSynthesis' in window && currentLesson) {
      const currentCard = currentLesson.vocabList[currentCardIndex]
      const utterance = new SpeechSynthesisUtterance(currentCard.word)
      
      // Try to find an appropriate voice for the language
      const voices = speechSynthesis.getVoices()
      const languageCode = languageName.includes('Hindi') ? 'hi' : 
                          languageName.includes('Spanish') ? 'es' : 'en'
      const voice = voices.find(v => v.lang.startsWith(languageCode))
      if (voice) utterance.voice = voice
      
      speechSynthesis.speak(utterance)
    }
  }

  const nextCard = () => {
    if (!currentLesson) return
    
    if (currentCardIndex < currentLesson.vocabList.length - 1) {
      setCurrentCardIndex(prev => prev + 1)
      setShowTranslation(false)
    } else {
      // Lesson complete, go to quiz
      onNavigate('quiz', { 
        lesson: currentLesson,
        deckTitle,
        languageName,
        timeSpent: Math.floor((Date.now() - startTime) / 1000)
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
  }

  if (loading) {
    return (
      <div className="min-h-screen cosmic-gradient flex items-center justify-center">
        <div className="text-white">Loading lesson...</div>
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
      {/* Header */}
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onNavigate('decks', { languageId: deckId, languageName })}
            className="text-white hover:bg-white/10"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-lg text-white">{deckTitle}</h1>
            <p className="text-sm text-blue-200">{languageName}</p>
          </div>
        </div>
        <div className="text-sm text-blue-200">
          {currentCardIndex + 1} / {currentLesson.vocabList.length}
        </div>
      </div>

      {/* Progress bar */}
      <div className="px-4 mb-6">
        <Progress value={progressPercentage} className="h-2" />
      </div>

      {/* Flashcard */}
      <div className="p-4 flex-1 flex items-center justify-center">
        <Card 
          className="glass-card w-full max-w-md aspect-[3/4] flex flex-col cursor-pointer"
          onClick={toggleTranslation}
        >
          <CardHeader className="text-center flex-1 flex items-center justify-center">
            <CardTitle className="text-3xl text-white mb-4">
              {currentCard.word}
            </CardTitle>
            
            {currentCard.pronunciation && (
              <p className="text-lg text-blue-300 mb-4">
                [{currentCard.pronunciation}]
              </p>
            )}

            {showTranslation && (
              <div className="text-center">
                <p className="text-xl text-green-300 mb-2">
                  {currentCard.translation}
                </p>
                <CheckCircle className="w-8 h-8 text-green-400 mx-auto" />
              </div>
            )}

            {!showTranslation && (
              <p className="text-sm text-blue-200">
                Tap to reveal translation
              </p>
            )}
          </CardHeader>

          <CardContent className="text-center">
            <Button
              onClick={(e) => {
                e.stopPropagation()
                playAudio()
              }}
              variant="outline"
              size="icon"
              className="border-blue-400 text-blue-300 hover:bg-blue-400/20"
            >
              <Volume2 className="w-5 h-5" />
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Navigation */}
      <div className="p-4 flex justify-between items-center">
        <Button
          variant="ghost"
          onClick={prevCard}
          disabled={currentCardIndex === 0}
          className="text-white hover:bg-white/10 disabled:opacity-50"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Previous
        </Button>

        <Button
          onClick={nextCard}
          className="cosmic-button"
          disabled={!showTranslation}
        >
          {currentCardIndex === currentLesson.vocabList.length - 1 ? 'Quiz' : 'Next'}
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>

      {/* Dialogue Preview */}
      {currentLesson.dialogueText && (
        <div className="p-4">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-white text-sm">Dialogue Context</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-blue-200 text-sm whitespace-pre-line">
                {currentLesson.dialogueText}
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}