import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { Separator } from './ui/separator'
import { Alert, AlertDescription } from './ui/alert'
import { Progress } from './ui/progress'
import { 
  ArrowLeft, 
  BookOpen, 
  Target, 
  CheckCircle, 
  AlertTriangle, 
  Lightbulb,
  Calculator,
  Brain,
  Trophy,
  Clock,
  PlayCircle,
  PauseCircle,
  RotateCcw,
  CheckSquare
} from 'lucide-react'

interface NEETContentViewerProps {
  onNavigate: (screen: any, data?: any) => void
  subject: string
  chapter: string
  chapterId: string
}

// Import the comprehensive content database
import { NEETContentDatabase, getChapterById, type NEETChapter } from './NEETContentDatabase'

export function NEETContentViewerEnhanced({ onNavigate, subject, chapter, chapterId }: NEETContentViewerProps) {
  const [content, setContent] = useState<any>(null)
  const [currentTab, setCurrentTab] = useState('overview')
  const [readingTime, setReadingTime] = useState(0)
  const [isTimerRunning, setIsTimerRunning] = useState(true)
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({})
  const [showAnswers, setShowAnswers] = useState(false)
  const [quizScore, setQuizScore] = useState(0)
  const [completedSections, setCompletedSections] = useState<Set<string>>(new Set())

  useEffect(() => {
    // Get content based on subject and chapterId using the new database
    const selectedContent = getChapterById(subject, chapterId)
    if (selectedContent) {
      setContent(selectedContent)
    } else {
      // Fallback to physics motion-1d if content not found
      setContent(getChapterById('physics', 'motion-1d'))
    }
    
    // Start reading timer
    const timer = setInterval(() => {
      if (isTimerRunning) {
        setReadingTime(prev => prev + 1)
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [subject, chapterId, isTimerRunning])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const toggleTimer = () => {
    setIsTimerRunning(!isTimerRunning)
  }

  const resetTimer = () => {
    setReadingTime(0)
    setIsTimerRunning(true)
  }

  const handleAnswerSelect = (questionIndex: number, answerIndex: number) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionIndex]: answerIndex
    }))
  }

  const calculateQuizScore = () => {
    if (!content?.practice?.[0]?.mcqs) return 0
    const mcqs = content.practice[0].mcqs
    const correct = mcqs.reduce((count, mcq, index) => {
      return selectedAnswers[index] === mcq.correct ? count + 1 : count
    }, 0)
    return Math.round((correct / mcqs.length) * 100)
  }

  const markSectionCompleted = (section: string) => {
    setCompletedSections(prev => new Set([...prev, section]))
  }

  const renderLatexFormula = (formula: string) => {
    // Simple LaTeX rendering - in production, you'd use a proper LaTeX renderer
    return formula
      .replace(/\\\\/g, '')
      .replace(/\{/g, '')
      .replace(/\}/g, '')
      .replace(/\\frac{([^}]+)}{([^}]+)}/g, '($1/$2)')
      .replace(/\\vec{([^}]+)}/g, '$1⃗')
      .replace(/\\Delta/g, 'Δ')
      .replace(/\\theta/g, 'θ')
      .replace(/\\pi/g, 'π')
      .replace(/\\times/g, '×')
      .replace(/\\geq/g, '≥')
      .replace(/\\leq/g, '≤')
      .replace(/\\rightarrow/g, '→')
      .replace(/\\Rightarrow/g, '⇒')
      .replace(/\\propto/g, '∝')
  }

  if (!content) {
    return (
      <div className="min-h-screen cosmic-gradient flex items-center justify-center">
        <div className="text-white">Loading content...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen cosmic-gradient">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Enhanced Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onNavigate('neet-content')}
              className="text-white hover:bg-white/10"
            >
              <ArrowLeft className="h-6 w-6" />
            </Button>
            <div>
              <h1 className="text-white text-2xl">{content.title}</h1>
              <div className="flex items-center gap-4 text-white/70 text-sm mt-1">
                <span className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Reading: {formatTime(readingTime)}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleTimer}
                    className="text-white/70 hover:text-white p-1 h-auto"
                  >
                    {isTimerRunning ? <PauseCircle className="h-4 w-4" /> : <PlayCircle className="h-4 w-4" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={resetTimer}
                    className="text-white/70 hover:text-white p-1 h-auto"
                  >
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                </span>
                <Badge className="bg-blue-500 text-white">
                  {subject.charAt(0).toUpperCase() + subject.slice(1)}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-white/70 mb-2">
            <span>Study Progress</span>
            <span>{completedSections.size}/6 sections completed</span>
          </div>
          <Progress 
            value={(completedSections.size / 6) * 100} 
            className="bg-white/20"
          />
        </div>

        {/* Enhanced Content Tabs */}
        <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 mb-8 bg-white/10">
            <TabsTrigger value="overview" className="text-xs">
              {completedSections.has('overview') && <CheckSquare className="h-3 w-3 mr-1" />}
              Overview
            </TabsTrigger>
            <TabsTrigger value="learn" className="text-xs">
              {completedSections.has('learn') && <CheckSquare className="h-3 w-3 mr-1" />}
              Learn
            </TabsTrigger>
            <TabsTrigger value="examples" className="text-xs">
              {completedSections.has('examples') && <CheckSquare className="h-3 w-3 mr-1" />}
              Examples
            </TabsTrigger>
            <TabsTrigger value="formulas" className="text-xs">
              {completedSections.has('formulas') && <CheckSquare className="h-3 w-3 mr-1" />}
              Formulas
            </TabsTrigger>
            <TabsTrigger value="practice" className="text-xs">
              {completedSections.has('practice') && <CheckSquare className="h-3 w-3 mr-1" />}
              Practice
            </TabsTrigger>
            <TabsTrigger value="summary" className="text-xs">
              {completedSections.has('summary') && <CheckSquare className="h-3 w-3 mr-1" />}
              Summary
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab - Enhanced */}
          <TabsContent value="overview" className="space-y-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Learning Objectives
                </CardTitle>
              </CardHeader>
              <CardContent className="text-white/90 space-y-3">
                {content.objectives.map((objective, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                    <span>{objective}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Prerequisites
                </CardTitle>
              </CardHeader>
              <CardContent className="text-white/90">
                <ul className="space-y-2">
                  {content.prerequisites.map((req, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-blue-400">•</span>
                      {req}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-white">Concept Overview</CardTitle>
              </CardHeader>
              <CardContent className="text-white/90 space-y-4">
                <p>{content.overview?.summary}</p>
                <Alert className="bg-amber-500/20 border-amber-500/30">
                  <Lightbulb className="h-4 w-4 text-amber-400" />
                  <AlertDescription className="text-amber-100">
                    <strong>Tamil Connection:</strong> {content.overview?.tamilAnalogy}
                  </AlertDescription>
                </Alert>
                {content.overview?.culturalContext && (
                  <Alert className="bg-green-500/20 border-green-500/30">
                    <BookOpen className="h-4 w-4 text-green-400" />
                    <AlertDescription className="text-green-100">
                      <strong>Cultural Context:</strong> {content.overview.culturalContext}
                    </AlertDescription>
                  </Alert>
                )}
                <div className="bg-blue-500/20 p-4 rounded-lg">
                  <h4 className="text-blue-300 mb-2">TN Board Mapping:</h4>
                  <p className="text-blue-100 text-sm">{content.tnBoardMapping}</p>
                </div>
              </CardContent>
            </Card>

            <div className="text-center">
              <Button 
                onClick={() => markSectionCompleted('overview')}
                className="cosmic-button"
                disabled={completedSections.has('overview')}
              >
                {completedSections.has('overview') ? 'Completed' : 'Mark as Completed'}
              </Button>
            </div>
          </TabsContent>

          {/* Enhanced Practice Tab with Interactive Quiz */}
          <TabsContent value="practice" className="space-y-6">
            {/* MCQs */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-white flex items-center justify-between">
                  <span>Multiple Choice Questions</span>
                  {showAnswers && (
                    <Badge className="bg-green-500 text-white">
                      Score: {calculateQuizScore()}%
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {content.practice?.[0]?.mcqs?.map((mcq, index) => (
                  <div key={index} className="space-y-3">
                    <h4 className="text-white">Q{index + 1}. {mcq.question}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {mcq.options.map((option, oIndex) => (
                        <Button
                          key={oIndex}
                          variant="outline"
                          onClick={() => handleAnswerSelect(index, oIndex)}
                          className={`p-3 text-left justify-start ${
                            selectedAnswers[index] === oIndex 
                              ? 'bg-blue-500/30 border-blue-500' 
                              : 'bg-white/10 hover:bg-white/20'
                          } ${
                            showAnswers && oIndex === mcq.correct 
                              ? 'bg-green-500/30 border-green-500' 
                              : ''
                          } ${
                            showAnswers && selectedAnswers[index] === oIndex && oIndex !== mcq.correct 
                              ? 'bg-red-500/30 border-red-500' 
                              : ''
                          }`}
                        >
                          <span className="text-white/90">{String.fromCharCode(65 + oIndex)}. {option}</span>
                        </Button>
                      ))}
                    </div>
                    {showAnswers && (
                      <div className="bg-green-500/20 p-3 rounded">
                        <div className="space-y-2">
                          <p className="text-green-300 text-sm">
                            <strong>Answer: {String.fromCharCode(65 + mcq.correct)}</strong> - {mcq.explanation}
                          </p>
                          {mcq.examTip && (
                            <p className="text-blue-300 text-xs">
                              <strong>Exam Tip:</strong> {mcq.examTip}
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                    <Separator className="bg-white/10" />
                  </div>
                ))}
                
                <div className="flex gap-4 justify-center">
                  <Button 
                    onClick={() => setShowAnswers(!showAnswers)}
                    className="bg-blue-500 hover:bg-blue-600"
                  >
                    {showAnswers ? 'Hide Answers' : 'Show Answers'}
                  </Button>
                  <Button 
                    onClick={() => markSectionCompleted('practice')}
                    className="cosmic-button"
                    disabled={completedSections.has('practice')}
                  >
                    {completedSections.has('practice') ? 'Completed' : 'Complete Practice'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Summary Tab with completion tracking */}
          <TabsContent value="summary" className="space-y-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  Memory Mnemonic
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {content.tamilMnemonics?.map((mnemonic, index) => (
                    <div key={index} className="bg-purple-500/20 p-4 rounded-lg">
                      <p className="text-purple-200 text-lg font-medium">{mnemonic}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-white">Chapter Summary</CardTitle>
              </CardHeader>
              <CardContent className="text-white/90">
                <ul className="space-y-3">
                  {content.downloadableSummary?.keyPoints?.map((point, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Trophy className="h-5 w-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                      {point}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-white">Next Steps & NEET Tips</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="text-green-300 mb-2">NEET Hacks & Tips:</h4>
                  <ul className="space-y-2 text-white/90">
                    {content.neetHacks?.map((hack, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Lightbulb className="h-4 w-4 text-yellow-400 mt-1 flex-shrink-0" />
                        <div>
                          <span className="font-medium capitalize">{hack.type}:</span> {hack.content}
                          {hack.tamilTip && (
                            <div className="text-yellow-300 text-sm italic mt-1">{hack.tamilTip}</div>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-blue-500/20 p-4 rounded-lg space-y-2">
                  <p className="text-blue-200">
                    <strong>Next Module:</strong> {content.nextSteps?.nextModule}
                  </p>
                  <p className="text-green-200 text-sm">
                    <strong>Student Tip:</strong> {content.studentTip}
                  </p>
                  <p className="text-yellow-200 text-sm">
                    <strong>Peer Discussion:</strong> {content.nextSteps?.peerDiscussion}
                  </p>
                </div>
              </CardContent>
            </Card>

            <div className="text-center">
              <Button 
                onClick={() => markSectionCompleted('summary')}
                className="cosmic-button"
                disabled={completedSections.has('summary')}
              >
                {completedSections.has('summary') ? 'Chapter Completed!' : 'Complete Chapter'}
              </Button>
            </div>
          </TabsContent>

          {/* Learn Tab - Enhanced */}
          <TabsContent value="learn" className="space-y-6">
            {content.sections?.map((section, index) => (
              <Card key={index} className="glass-card">
                <CardHeader>
                  <CardTitle className="text-white">{section.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-white/90 space-y-4">
                  <p>{section.content}</p>
                  {section.formulas && (
                    <div className="bg-blue-500/20 p-4 rounded-lg">
                      <h4 className="text-blue-300 mb-2">Key Formulas:</h4>
                      {section.formulas.map((formula, fIndex) => (
                        <div key={fIndex} className="space-y-2">
                          <div className="font-mono text-blue-100 text-center py-2">
                            {renderLatexFormula(formula.latex)}
                          </div>
                          <p className="text-sm text-blue-200 text-center">{formula.description}</p>
                          {formula.tamilMnemonic && (
                            <p className="text-xs text-yellow-300 text-center italic">
                              {formula.tamilMnemonic}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                  {section.diagrams && section.diagrams.map((diagram, dIndex) => (
                    <div key={dIndex} className="bg-gray-800/30 p-4 rounded-lg">
                      <h4 className="text-green-300 mb-2">{diagram.title}</h4>
                      <p className="text-white/80 mb-4">{diagram.description}</p>
                      <div className="bg-black/50 p-4 rounded font-mono text-green-400 text-sm whitespace-pre">
                        {diagram.asciiArt}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
            <div className="text-center">
              <Button 
                onClick={() => markSectionCompleted('learn')}
                className="cosmic-button"
                disabled={completedSections.has('learn')}
              >
                {completedSections.has('learn') ? 'Completed' : 'Mark as Completed'}
              </Button>
            </div>
          </TabsContent>

          {/* Examples Tab - Enhanced */}
          <TabsContent value="examples" className="space-y-6">
            {content.solvedExamples?.map((example, index) => {
              const difficultyColor = example.difficulty === 'Easy' ? 'bg-green-500' : 
                                    example.difficulty === 'Medium' ? 'bg-yellow-500' : 'bg-red-500'
              return (
                <Card key={index} className="glass-card">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-white">Solved Example {index + 1}</CardTitle>
                      <Badge className={`${difficultyColor} text-white`}>
                        {example.difficulty}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="text-white/90 space-y-4">
                    <div>
                      <h4 className="text-blue-300 mb-2">Problem:</h4>
                      <p className="bg-blue-500/20 p-3 rounded">{example.problem}</p>
                    </div>
                    <div>
                      <h4 className="text-green-300 mb-2">Solution:</h4>
                      <ol className="space-y-2">
                        {example.solution.map((step, sIndex) => (
                          <li key={sIndex} className="flex gap-3">
                            <span className="text-green-400 font-semibold">{sIndex + 1}.</span>
                            <span>{step}</span>
                          </li>
                        ))}
                      </ol>
                    </div>
                    <Alert className="bg-yellow-500/20 border-yellow-500/30">
                      <Lightbulb className="h-4 w-4 text-yellow-400" />
                      <AlertDescription className="text-yellow-100">
                        <strong>NEET Hack:</strong> {example.neetHack}
                      </AlertDescription>
                    </Alert>
                    <Alert className="bg-red-500/20 border-red-500/30">
                      <AlertTriangle className="h-4 w-4 text-red-400" />
                      <AlertDescription className="text-red-100">
                        <strong>Common Pitfall:</strong> {example.commonPitfall}
                      </AlertDescription>
                    </Alert>
                  </CardContent>
                </Card>
              )
            })}
            <div className="text-center">
              <Button 
                onClick={() => markSectionCompleted('examples')}
                className="cosmic-button"
                disabled={completedSections.has('examples')}
              >
                {completedSections.has('examples') ? 'Completed' : 'Mark as Completed'}
              </Button>
            </div>
          </TabsContent>

          {/* Formulas Tab - Enhanced */}
          <TabsContent value="formulas" className="space-y-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Calculator className="h-5 w-5" />
                  Key Formulas & Diagrams
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/20">
                        <th className="text-left text-white p-3">Formula</th>
                        <th className="text-left text-white p-3">Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      {content.sections?.flatMap(section => section.formulas || []).map((formula, index) => (
                        <tr key={index} className="border-b border-white/10">
                          <td className="p-3 font-mono text-blue-200">{renderLatexFormula(formula.latex)}</td>
                          <td className="p-3 text-white/80">
                            <div>{formula.description}</div>
                            {formula.tamilMnemonic && (
                              <div className="text-xs text-yellow-300 italic mt-1">{formula.tamilMnemonic}</div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                <Separator className="bg-white/20" />
                
                {content.sections?.flatMap(section => section.diagrams || []).map((diagram, index) => (
                  <div key={index}>
                    <h4 className="text-white mb-4">{diagram.title}</h4>
                    <p className="text-white/80 mb-4">{diagram.description}</p>
                    <div className="bg-black/30 p-4 rounded font-mono text-green-400 text-sm whitespace-pre">
                      {diagram.asciiArt}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
            <div className="text-center">
              <Button 
                onClick={() => markSectionCompleted('formulas')}
                className="cosmic-button"
                disabled={completedSections.has('formulas')}
              >
                {completedSections.has('formulas') ? 'Completed' : 'Mark as Completed'}
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        {/* Study Progress Summary */}
        {completedSections.size === 6 && (
          <Card className="glass-card mt-8 border-green-500/30">
            <CardHeader>
              <CardTitle className="text-green-300 flex items-center gap-2">
                <Trophy className="h-6 w-6" />
                Chapter Completed!
              </CardTitle>
            </CardHeader>
            <CardContent className="text-green-200">
              <p>Congratulations! You've completed all sections of this chapter.</p>
              <p className="mt-2">Total study time: {formatTime(readingTime)}</p>
              <div className="mt-4">
                <Button 
                  onClick={() => onNavigate('neet-content')}
                  className="bg-green-500 hover:bg-green-600 mr-4"
                >
                  Back to Chapters
                </Button>
                <Button 
                  onClick={() => window.print()}
                  variant="outline"
                  className="text-white border-white hover:bg-white/10"
                >
                  Print Summary
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}