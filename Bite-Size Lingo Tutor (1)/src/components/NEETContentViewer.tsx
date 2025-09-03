import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { Separator } from './ui/separator'
import { Alert, AlertDescription } from './ui/alert'
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
  Clock
} from 'lucide-react'

interface NEETContentViewerProps {
  onNavigate: (screen: any, data?: any) => void
  subject: string
  chapter: string
  chapterId: string
}

interface ContentModule {
  title: string
  objectives: string[]
  prerequisites: string[]
  overview: {
    summary: string
    tamilAnalogy: string
  }
  explanation: {
    sections: {
      title: string
      content: string
      formulas?: string[]
    }[]
  }
  examples: {
    difficulty: 'Easy' | 'Medium' | 'Must-Practice'
    problem: string
    solution: string[]
    pitfall: string
  }[]
  formulas: {
    formula: string
    description: string
  }[]
  diagram: {
    title: string
    description: string
    asciiArt: string
  }
  practice: {
    mcqs: {
      question: string
      options: string[]
      correct: number
      explanation: string
    }[]
    assertionReason: {
      assertion: string
      reason: string
      correct: boolean
      explanation: string
    }[]
    matchColumns: {
      left: string[]
      right: string[]
      matches: number[]
    }[]
  }
  selfCheck: string[]
  mnemonic: string
  summary: string[]
  nextSteps: {
    tips: string[]
    nextModule: string
  }
}

// Content database for different subjects and chapters
export const contentDatabase = {
  physics: {
    kinematics: {
      title: "Physics – Motion in One Dimension",
      objectives: [
        "After this, you will be able to distinguish between distance and displacement",
        "Calculate average velocity and instantaneous velocity for different motion scenarios",
        "Apply kinematic equations to solve problems involving uniformly accelerated motion",
        "Analyze position-time and velocity-time graphs to determine motion characteristics"
      ],
      prerequisites: [
        "Basic understanding of coordinate systems and graphs",
        "Elementary algebra and solving linear equations",
        "Concept of rate of change and basic differentiation",
        "Vector representation in one dimension"
      ],
      overview: {
        summary: "Motion in one dimension forms the foundation of mechanics in NEET Physics. Understanding displacement, velocity, and acceleration concepts is crucial for solving 10-15% of physics problems in NEET.",
        tamilAnalogy: "Just like describing the journey of a Tamil Nadu Express train from Chennai to Madurai, we need to specify position, direction, and speed changes with time - this is what kinematics teaches us (*இயக்கவியல் - Iyakkaviyal*)."
      },
      explanation: {
        sections: [
          {
            title: "Position and Displacement",
            content: "Position (*நிலை - Nilai*) is the location of an object with respect to a chosen reference point. Displacement (*இடப்பெயர்ச்சி - Idappeyarchi*) is the change in position vector. Unlike distance, displacement can be negative, zero, or positive depending on direction.",
            formulas: ["\\vec{s} = \\vec{r_f} - \\vec{r_i}", "|\\vec{s}| \\leq \\text{distance traveled}"]
          },
          {
            title: "Velocity and Speed",
            content: "Velocity (*திசைவேகம் - Thisaivegam*) is the rate of change of displacement with time. It's a vector quantity with both magnitude and direction. Speed is the magnitude of velocity.",
            formulas: ["\\vec{v} = \\frac{d\\vec{s}}{dt}", "\\text{Average velocity} = \\frac{\\vec{s}}{t}"]
          },
          {
            title: "Acceleration",
            content: "Acceleration (*முடுக்கம் - Mudukkam*) is the rate of change of velocity with time. Uniform acceleration occurs when velocity changes at a constant rate.",
            formulas: ["\\vec{a} = \\frac{d\\vec{v}}{dt}", "a = \\frac{v - u}{t}"]
          }
        ]
      },
      examples: [
        {
          difficulty: "Easy" as const,
          problem: "A car travels 60 km north, then 40 km south. Find the total distance and displacement.",
          solution: [
            "Total distance = 60 km + 40 km = 100 km",
            "Taking north as positive direction:",
            "Initial position = 0",
            "Final position = +60 km - 40 km = +20 km",
            "Displacement = 20 km north"
          ],
          pitfall: "Students often confuse distance with displacement. Remember: distance is always positive (scalar), displacement can be negative (vector)."
        },
        {
          difficulty: "Medium" as const,
          problem: "A train accelerates uniformly from rest to 72 km/h in 10 seconds. Find acceleration and distance covered.",
          solution: [
            "Convert units: 72 km/h = 72 × (5/18) = 20 m/s",
            "Given: u = 0, v = 20 m/s, t = 10 s",
            "Using v = u + at: 20 = 0 + a(10)",
            "Therefore, a = 2 m/s²",
            "Using s = ut + ½at²: s = 0 + ½(2)(10)² = 100 m"
          ],
          pitfall: "Always convert km/h to m/s by multiplying by 5/18. Many students forget this unit conversion."
        },
        {
          difficulty: "Must-Practice" as const,
          problem: "A ball is thrown upward with initial velocity 20 m/s. Find maximum height and time to return to ground. (g = 10 m/s²)",
          solution: [
            "At maximum height, final velocity v = 0",
            "Using v² = u² + 2as: 0 = (20)² + 2(-10)h",
            "Solving: h = 400/20 = 20 m",
            "For time to reach maximum height: 0 = 20 + (-10)t₁",
            "t₁ = 2 s",
            "Total time to return = 2 × 2 = 4 s (by symmetry)"
          ],
          pitfall: "Remember that acceleration due to gravity is negative when upward is positive. Also, time to go up equals time to come down for projectile motion."
        }
      ],
      formulas: [
        { formula: "v = u + at", description: "First equation of motion (velocity-time relation)" },
        { formula: "s = ut + \\frac{1}{2}at^2", description: "Second equation of motion (position-time relation)" },
        { formula: "v^2 = u^2 + 2as", description: "Third equation of motion (velocity-position relation)" },
        { formula: "s_n = u + \\frac{a}{2}(2n-1)", description: "Distance covered in nth second" },
        { formula: "\\bar{v} = \\frac{u + v}{2}", description: "Average velocity for uniform acceleration" },
        { formula: "a = \\frac{dv}{dt} = \\frac{d^2s}{dt^2}", description: "Instantaneous acceleration" }
      ],
      diagram: {
        title: "Position-Time Graph for Uniformly Accelerated Motion",
        description: "Shows parabolic curve for uniform acceleration (*சீரான முடுக்கம் - Seeraana Mudukkam*)",
        asciiArt: `
    Position (s)
         ^
         |     /
         |    /
         |   /  (Parabolic curve)
         |  /
         | /
         |/
         +-----------> Time (t)
         0
    
    Slope = velocity
    Curve = acceleration`
      },
      practice: {
        mcqs: [
          {
            question: "A car moving at 36 km/h takes 10 s to stop. The retardation is:",
            options: ["1 m/s²", "3.6 m/s²", "10 m/s²", "36 m/s²"],
            correct: 0,
            explanation: "36 km/h = 10 m/s; using v = u + at: 0 = 10 + a(10); a = -1 m/s²"
          },
          {
            question: "The displacement-time graph for uniform motion is:",
            options: ["Parabolic", "Straight line with positive slope", "Horizontal line", "Curved line"],
            correct: 1,
            explanation: "Uniform motion means constant velocity, so displacement increases linearly with time"
          },
          {
            question: "A ball thrown upward returns to ground after 4s. Maximum height reached is:",
            options: ["20 m", "40 m", "60 m", "80 m"],
            correct: 0,
            explanation: "Time to reach max height = 2s; using s = ut - ½gt²: h = u(2) - ½(10)(4) where u = gt₁ = 20 m/s"
          },
          {
            question: "Which equation is dimensionally incorrect?",
            options: ["v = u + at", "s = vt", "v² = u² + 2as", "s = ut + ½at²"],
            correct: 1,
            explanation: "s = vt is incomplete for accelerated motion; correct form is s = ut + ½at²"
          },
          {
            question: "Area under velocity-time graph gives:",
            options: ["Acceleration", "Displacement", "Distance", "Speed"],
            correct: 1,
            explanation: "Area under v-t graph represents displacement (integral of velocity)"
          }
        ],
        assertionReason: [
          {
            assertion: "The slope of position-time graph gives velocity",
            reason: "Velocity is defined as rate of change of position",
            correct: true,
            explanation: "Both assertion and reason are correct, and reason explains the assertion"
          },
          {
            assertion: "A body with zero velocity has zero acceleration",
            reason: "Acceleration is rate of change of velocity",
            correct: false,
            explanation: "Assertion is false. A body can have zero velocity but non-zero acceleration (e.g., ball at highest point)"
          }
        ],
        matchColumns: [
          {
            left: ["Uniform velocity", "Uniform acceleration", "Zero acceleration", "Non-uniform acceleration"],
            right: ["Straight line in v-t graph", "Parabola in s-t graph", "Horizontal line in v-t graph", "Curved line in v-t graph"],
            matches: [2, 1, 0, 3]
          }
        ]
      },
      selfCheck: [
        "Can you explain the difference between average velocity and instantaneous velocity using a real-life example?",
        "How would you determine if motion is uniformly accelerated from a velocity-time graph?",
        "Why can displacement be negative while distance cannot? Provide a scenario from daily life."
      ],
      mnemonic: "**Tamil Mnemonic for Kinematic Equations:** *'வேகம் உள்ள உயர் தூரம் வளரும்'* (Vegam Ulla Uyar Thooram Valarum) - **V**elocity **U**sed for **A**cceleration **T**ime gives **S**position **V**alue",
      summary: [
        "Motion in one dimension involves position, displacement, velocity, and acceleration",
        "Three kinematic equations solve all uniformly accelerated motion problems",
        "Graphs provide visual understanding: s-t graph slope = velocity, v-t graph slope = acceleration",
        "Sign conventions are crucial: choose positive direction consistently",
        "Practice unit conversions, especially km/h to m/s multiplication by 5/18"
      ],
      nextSteps: {
        tips: [
          "**NEET Hack:** Memorize that 1 km/h = 5/18 m/s for quick conversions",
          "**Time Management:** Solve kinematics problems in 2-3 minutes by identifying which equation to use first"
        ],
        nextModule: "Laws of Motion"
      }
    }
  },
  chemistry: {},
  biology: {}
}

// Sample content for Physics - Motion in One Dimension
const sampleContent: ContentModule = contentDatabase.physics.kinematics

export function NEETContentViewer({ onNavigate, subject, chapter, chapterId }: NEETContentViewerProps) {
  const [content, setContent] = useState<ContentModule | null>(null)
  const [currentTab, setCurrentTab] = useState('overview')
  const [readingTime, setReadingTime] = useState(0)

  useEffect(() => {
    // In a real app, this would fetch content based on subject and chapterId
    setContent(sampleContent)
    
    // Start reading timer
    const timer = setInterval(() => {
      setReadingTime(prev => prev + 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [subject, chapterId])

  if (!content) {
    return (
      <div className="min-h-screen cosmic-gradient flex items-center justify-center">
        <div className="text-white">Loading content...</div>
      </div>
    )
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="min-h-screen cosmic-gradient">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
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
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  Reading: {formatTime(readingTime)}
                </span>
                <Badge className="bg-blue-500 text-white">
                  {subject.charAt(0).toUpperCase() + subject.slice(1)}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Content Tabs */}
        <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 lg:grid-cols-6 mb-8 bg-white/10">
            <TabsTrigger value="overview" className="text-xs">Overview</TabsTrigger>
            <TabsTrigger value="learn" className="text-xs">Learn</TabsTrigger>
            <TabsTrigger value="examples" className="text-xs">Examples</TabsTrigger>
            <TabsTrigger value="formulas" className="text-xs">Formulas</TabsTrigger>
            <TabsTrigger value="practice" className="text-xs">Practice</TabsTrigger>
            <TabsTrigger value="summary" className="text-xs">Summary</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
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
                <p>{content.overview.summary}</p>
                <Alert className="bg-amber-500/20 border-amber-500/30">
                  <Lightbulb className="h-4 w-4 text-amber-400" />
                  <AlertDescription className="text-amber-100">
                    <strong>Tamil Connection:</strong> {content.overview.tamilAnalogy}
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Learn Tab */}
          <TabsContent value="learn" className="space-y-6">
            {content.explanation.sections.map((section, index) => (
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
                        <div key={fIndex} className="font-mono text-blue-100 text-center py-2">
                          {formula}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* Examples Tab */}
          <TabsContent value="examples" className="space-y-6">
            {content.examples.map((example, index) => {
              const difficultyColor = example.difficulty === 'Easy' ? 'bg-green-500' : 
                                    example.difficulty === 'Medium' ? 'bg-yellow-500' : 'bg-red-500'
              return (
                <Card key={index} className="glass-card">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-white">Worked Example {index + 1}</CardTitle>
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
                    <Alert className="bg-red-500/20 border-red-500/30">
                      <AlertTriangle className="h-4 w-4 text-red-400" />
                      <AlertDescription className="text-red-100">
                        <strong>Common Pitfall:</strong> {example.pitfall}
                      </AlertDescription>
                    </Alert>
                  </CardContent>
                </Card>
              )
            })}
          </TabsContent>

          {/* Formulas Tab */}
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
                      {content.formulas.map((formula, index) => (
                        <tr key={index} className="border-b border-white/10">
                          <td className="p-3 font-mono text-blue-200">{formula.formula}</td>
                          <td className="p-3 text-white/80">{formula.description}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                <Separator className="bg-white/20" />
                
                <div>
                  <h4 className="text-white mb-4">{content.diagram.title}</h4>
                  <p className="text-white/80 mb-4">{content.diagram.description}</p>
                  <div className="bg-black/30 p-4 rounded font-mono text-green-400 text-sm whitespace-pre">
                    {content.diagram.asciiArt}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Practice Tab */}
          <TabsContent value="practice" className="space-y-6">
            {/* MCQs */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-white">Multiple Choice Questions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {content.practice.mcqs.map((mcq, index) => (
                  <div key={index} className="space-y-3">
                    <h4 className="text-white">Q{index + 1}. {mcq.question}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {mcq.options.map((option, oIndex) => (
                        <div key={oIndex} className={`p-2 rounded ${oIndex === mcq.correct ? 'bg-green-500/20 border border-green-500' : 'bg-white/10'}`}>
                          <span className="text-white/90">{String.fromCharCode(65 + oIndex)}. {option}</span>
                        </div>
                      ))}
                    </div>
                    <p className="text-green-300 text-sm">
                      <strong>Answer: {String.fromCharCode(65 + mcq.correct)}</strong> - {mcq.explanation}
                    </p>
                    <Separator className="bg-white/10" />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Assertion-Reason */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-white">Assertion-Reason Questions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {content.practice.assertionReason.map((ar, index) => (
                  <div key={index} className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-blue-500/20 p-3 rounded">
                        <h5 className="text-blue-300 mb-1">Assertion:</h5>
                        <p className="text-white/90">{ar.assertion}</p>
                      </div>
                      <div className="bg-purple-500/20 p-3 rounded">
                        <h5 className="text-purple-300 mb-1">Reason:</h5>
                        <p className="text-white/90">{ar.reason}</p>
                      </div>
                    </div>
                    <p className="text-green-300">
                      <strong>{ar.correct ? 'Both correct' : 'Assertion false'}</strong> - {ar.explanation}
                    </p>
                    <Separator className="bg-white/10" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Summary Tab */}
          <TabsContent value="summary" className="space-y-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  Memory Mnemonic
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-purple-500/20 p-4 rounded-lg">
                  <p className="text-purple-200 text-lg font-medium">{content.mnemonic}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-white">Chapter Summary</CardTitle>
              </CardHeader>
              <CardContent className="text-white/90">
                <ul className="space-y-3">
                  {content.summary.map((point, index) => (
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
                  <h4 className="text-green-300 mb-2">NEET Success Tips:</h4>
                  <ul className="space-y-2 text-white/90">
                    {content.nextSteps.tips.map((tip, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Lightbulb className="h-4 w-4 text-yellow-400 mt-1 flex-shrink-0" />
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-blue-500/20 p-4 rounded-lg">
                  <p className="text-blue-200">
                    <strong>Next Module:</strong> {content.nextSteps.nextModule}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Self-Check Quiz */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-white">Self-Check Quiz</CardTitle>
                <CardDescription className="text-white/70">
                  Test your understanding with these open-ended questions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {content.selfCheck.map((question, index) => (
                  <div key={index} className="bg-orange-500/20 p-4 rounded-lg">
                    <p className="text-orange-200">
                      <strong>Q{index + 1}:</strong> {question}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}