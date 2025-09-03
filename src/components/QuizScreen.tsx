import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Progress } from './ui/progress'
import { Badge } from './ui/badge'
import { CheckCircle, X, Trophy, ArrowRight, Home } from 'lucide-react'
import { authenticatedApiCall } from '../utils/api'
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

interface QuizQuestion {
  question: string
  options: string[]
  correctAnswer: number
  vocab: VocabItem
}

interface QuizScreenProps {
  lesson: Lesson
  deckTitle: string
  languageName: string
  timeSpent: number
  flashcardResults?: Array<{vocabId: string, grade: number, responseTime: number}>
  onNavigate: (screen: string, data?: any) => void
}

export function QuizScreen({ lesson, deckTitle, languageName, timeSpent, flashcardResults = [], onNavigate }: QuizScreenProps) {
  const { session } = useAuth()
  const [questions, setQuestions] = useState<QuizQuestion[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [answers, setAnswers] = useState<boolean[]>([])
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [score, setScore] = useState(0)

  useEffect(() => {
    generateQuestions()
  }, [lesson])

  const generateQuestions = () => {
    const quizQuestions: QuizQuestion[] = lesson.vocabList.map((vocab, index) => {
      // Create multiple choice questions
      const otherVocab = lesson.vocabList.filter((_, i) => i !== index)
      const wrongAnswers = otherVocab
        .sort(() => Math.random() - 0.5)
        .slice(0, 3)
        .map(v => v.translation)
      
      const allOptions = [vocab.translation, ...wrongAnswers].sort(() => Math.random() - 0.5)
      const correctIndex = allOptions.indexOf(vocab.translation)

      return {
        question: `What does "${vocab.word}" mean?`,
        options: allOptions,
        correctAnswer: correctIndex,
        vocab
      }
    })

    setQuestions(quizQuestions)
  }

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex)
  }

  const submitAnswer = () => {
    if (selectedAnswer === null) return

    const isCorrect = selectedAnswer === questions[currentQuestionIndex].correctAnswer
    const newAnswers = [...answers, isCorrect]
    setAnswers(newAnswers)
    setShowResult(true)

    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1)
        setSelectedAnswer(null)
        setShowResult(false)
      } else {
        // Quiz completed
        completeQuiz(newAnswers)
      }
    }, 1500)
  }

  const completeQuiz = async (finalAnswers: boolean[]) => {
    const correctCount = finalAnswers.filter(a => a).length
    const finalScore = Math.round((correctCount / finalAnswers.length) * 100)
    setScore(finalScore)
    setQuizCompleted(true)

    // Create quiz-based flashcard results
    const quizFlashcardResults = questions.map((question, index) => ({
      vocabId: question.vocab.vocab_id,
      grade: finalAnswers[index] ? 3 : 1, // Good if correct, Again if incorrect
      responseTime: 3000 // Average quiz response time
    }))

    // Combine with any existing flashcard results
    const allFlashcardResults = [...flashcardResults, ...quizFlashcardResults]

    // Save progress to backend
    if (session?.access_token) {
      try {
        const result = await authenticatedApiCall('/lesson/complete', session.access_token, {
          method: 'POST',
          body: JSON.stringify({
            lessonId: lesson.id,
            score: finalScore,
            timeSpent,
            flashcardResults: allFlashcardResults
          })
        })
        
        console.log('Lesson completion result:', result)
      } catch (error) {
        console.error('Failed to save lesson progress:', error)
      }
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400'
    if (score >= 60) return 'text-yellow-400'
    return 'text-red-400'
  }

  const getScoreMessage = (score: number) => {
    if (score >= 90) return 'Excellent! You\'re a natural!'
    if (score >= 80) return 'Great job! Keep it up!'
    if (score >= 70) return 'Good work! Practice makes perfect.'
    if (score >= 60) return 'Not bad! Try reviewing the words again.'
    return 'Keep practicing! You\'ll get better.'
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen cosmic-gradient flex items-center justify-center">
        <div className="text-white">Preparing quiz...</div>
      </div>
    )
  }

  if (quizCompleted) {
    const correctAnswers = answers.filter(a => a).length
    
    return (
      <div className="min-h-screen cosmic-gradient">
        <div className="p-4 flex flex-col items-center justify-center min-h-screen space-y-6">
          <Card className="glass-card max-w-md w-full text-center">
            <CardHeader>
              <div className="flex justify-center mb-4">
                <Trophy className="w-16 h-16 text-yellow-400" />
              </div>
              <CardTitle className="text-2xl text-white">Quiz Complete!</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className={`text-4xl font-bold mb-2 ${getScoreColor(score)}`}>
                  {score}%
                </div>
                <p className="text-blue-200">
                  {correctAnswers} out of {questions.length} correct
                </p>
              </div>

              <div className="text-center">
                <p className="text-white font-medium mb-2">
                  {getScoreMessage(score)}
                </p>
                <Badge 
                  className={`${score >= 80 ? 'bg-green-500/20 text-green-300' : 
                              score >= 60 ? 'bg-yellow-500/20 text-yellow-300' : 
                              'bg-red-500/20 text-red-300'} border-0`}
                >
                  {score >= 80 ? 'Mastered' : score >= 60 ? 'Good' : 'Keep Practicing'}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="text-center">
                  <div className="text-white font-medium">{timeSpent}s</div>
                  <div className="text-blue-200">Time Spent</div>
                </div>
                <div className="text-center">
                  <div className="text-white font-medium">+{Math.floor(score / 10)}</div>
                  <div className="text-blue-200">XP Earned</div>
                </div>
              </div>

              <div className="space-y-2 pt-4">
                <Button 
                  onClick={() => onNavigate('decks', { languageId: lesson.deckId, languageName })}
                  className="w-full cosmic-button"
                >
                  <ArrowRight className="w-4 h-4 mr-2" />
                  Next Deck
                </Button>
                <Button 
                  onClick={() => onNavigate('home')}
                  variant="outline"
                  className="w-full border-blue-400 text-blue-300 hover:bg-blue-400/20"
                >
                  <Home className="w-4 h-4 mr-2" />
                  Home
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Review incorrect answers */}
          {answers.some(a => !a) && (
            <Card className="glass-card max-w-md w-full">
              <CardHeader>
                <CardTitle className="text-white text-lg">Review</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {answers.map((isCorrect, index) => {
                  if (isCorrect) return null
                  const question = questions[index]
                  return (
                    <div key={index} className="p-3 bg-red-500/10 rounded-lg border border-red-500/20">
                      <div className="text-white font-medium text-sm mb-1">
                        {question.vocab.word}
                      </div>
                      <div className="text-green-300 text-sm">
                        ✓ {question.vocab.translation}
                      </div>
                    </div>
                  )
                })}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    )
  }

  const currentQuestion = questions[currentQuestionIndex]
  const progressPercentage = ((currentQuestionIndex + 1) / questions.length) * 100
  const isCorrect = selectedAnswer === currentQuestion.correctAnswer

  return (
    <div className="min-h-screen cosmic-gradient">
      {/* Header */}
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl text-white">Quiz</h1>
          <div className="text-sm text-blue-200">
            {currentQuestionIndex + 1} / {questions.length}
          </div>
        </div>
        <Progress value={progressPercentage} className="h-2" />
      </div>

      {/* Question */}
      <div className="p-4 flex-1">
        <Card className="glass-card mb-6">
          <CardHeader>
            <CardTitle className="text-xl text-white text-center">
              {currentQuestion.question}
            </CardTitle>
            {currentQuestion.vocab.pronunciation && (
              <p className="text-blue-300 text-center">
                [{currentQuestion.vocab.pronunciation}]
              </p>
            )}
          </CardHeader>
        </Card>

        {/* Answer Options */}
        <div className="space-y-3 mb-6">
          {currentQuestion.options.map((option, index) => (
            <Button
              key={index}
              onClick={() => handleAnswerSelect(index)}
              variant="outline"
              className={`w-full p-4 text-left justify-start border-2 transition-all ${
                selectedAnswer === index
                  ? showResult
                    ? index === currentQuestion.correctAnswer
                      ? 'border-green-500 bg-green-500/20 text-green-300'
                      : 'border-red-500 bg-red-500/20 text-red-300'
                    : 'border-blue-400 bg-blue-400/20 text-blue-300'
                  : showResult && index === currentQuestion.correctAnswer
                    ? 'border-green-500 bg-green-500/20 text-green-300'
                    : 'border-white/20 text-white hover:border-blue-400 hover:bg-blue-400/10'
              }`}
              disabled={showResult}
            >
              <div className="flex items-center justify-between w-full">
                <span>{option}</span>
                {showResult && (
                  <div>
                    {index === currentQuestion.correctAnswer ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : selectedAnswer === index ? (
                      <X className="w-5 h-5" />
                    ) : null}
                  </div>
                )}
              </div>
            </Button>
          ))}
        </div>

        {/* Submit Button */}
        {!showResult && (
          <Button
            onClick={submitAnswer}
            disabled={selectedAnswer === null}
            className="w-full cosmic-button"
            size="lg"
          >
            Submit Answer
          </Button>
        )}

        {/* Result Message */}
        {showResult && (
          <div className="text-center">
            <div className={`text-lg font-medium mb-2 ${isCorrect ? 'text-green-300' : 'text-red-300'}`}>
              {isCorrect ? '✓ Correct!' : '✗ Incorrect'}
            </div>
            {!isCorrect && (
              <p className="text-blue-200">
                The correct answer is: {currentQuestion.options[currentQuestion.correctAnswer]}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}