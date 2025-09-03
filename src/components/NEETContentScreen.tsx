import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { BookOpen, FlaskConical, Atom, ChevronRight, ArrowLeft } from 'lucide-react'
import { getAllSubjects, getChaptersList } from './NEETContentDatabase'

interface NEETContentScreenProps {
  onNavigate: (screen: any, data?: any) => void
}

interface Subject {
  id: string
  name: string
  icon: React.ComponentType<any>
  color: string
  description: string
  chapters: Chapter[]
}

interface Chapter {
  id: string
  title: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  estimatedTime: string
  completed?: boolean
}

const subjectDetails = {
  physics: {
    name: 'Physics',
    icon: Atom,
    color: 'bg-blue-500',
    description: 'Master fundamental concepts and problem-solving (16 Chapters)'
  },
  chemistry: {
    name: 'Chemistry', 
    icon: FlaskConical,
    color: 'bg-green-500',
    description: 'Understand molecular world and chemical reactions (17 Chapters)'
  },
  biology: {
    name: 'Biology',
    icon: BookOpen,
    color: 'bg-emerald-500', 
    description: 'Explore life sciences and biological processes (17 Chapters)'
  }
}

const getSubjectsWithChapters = () => {
  return getAllSubjects().map(subjectId => {
    const chapters = getChaptersList(subjectId)
    return {
      id: subjectId,
      ...subjectDetails[subjectId],
      chapters: chapters.map(ch => ({
        id: ch.id,
        title: ch.title,
        difficulty: 'Medium' as const,
        estimatedTime: '45-60 min',
        tnBoardMapping: ch.tnBoardMapping
      }))
    }
  })
}

export function NEETContentScreen({ onNavigate }: NEETContentScreenProps) {
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null)
  const subjects = getSubjectsWithChapters()

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800'
      case 'Medium': return 'bg-yellow-100 text-yellow-800'
      case 'Hard': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (!selectedSubject) {
    return (
      <div className="min-h-screen cosmic-gradient">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onNavigate('home')}
              className="text-white hover:bg-white/10"
            >
              <ArrowLeft className="h-6 w-6" />
            </Button>
            <div>
              <h1 className="text-white text-3xl mb-2">NEET Preparation</h1>
              <p className="text-white/80">Complete study materials for Tamil Nadu students</p>
            </div>
          </div>

          {/* Subject Selection */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {subjects.map((subject) => {
              const Icon = subject.icon
              return (
                <Card
                  key={subject.id}
                  className="glass-card hover:scale-105 transition-transform cursor-pointer group"
                  onClick={() => setSelectedSubject(subject)}
                >
                  <CardHeader>
                    <div className={`w-16 h-16 rounded-full ${subject.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="text-white text-xl">{subject.name}</CardTitle>
                    <CardDescription className="text-white/70">
                      {subject.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-white/60">
                      <span>{subject.chapters.length} Chapters</span>
                      <ChevronRight className="h-5 w-5" />
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Study Tips */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-white">Study Tips for NEET Success</CardTitle>
            </CardHeader>
            <CardContent className="text-white/80 space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                <p>Follow the structured learning path with clear objectives</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                <p>Practice MCQs regularly to improve speed and accuracy</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                <p>Use Tamil mnemonics to remember complex concepts</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                <p>Review key formulas and diagrams before exams</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen cosmic-gradient">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSelectedSubject(null)}
            className="text-white hover:bg-white/10"
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-full ${selectedSubject.color} flex items-center justify-center`}>
              <selectedSubject.icon className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-white text-3xl">{selectedSubject.name}</h1>
              <p className="text-white/80">{selectedSubject.description}</p>
            </div>
          </div>
        </div>

        {/* Chapter List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {selectedSubject.chapters.map((chapter, index) => (
            <Card
              key={chapter.id}
              className="glass-card hover:scale-105 transition-transform cursor-pointer group"
              onClick={() => onNavigate('neet-content-enhanced', { 
                subject: selectedSubject.name.toLowerCase(),
                chapter: chapter.title,
                chapterId: chapter.id
              })}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="bg-white/10 text-white px-2 py-1 rounded text-sm">
                        Ch. {index + 1}
                      </span>
                      <Badge className={getDifficultyColor(chapter.difficulty)}>
                        {chapter.difficulty}
                      </Badge>
                    </div>
                    <CardTitle className="text-white text-lg group-hover:text-blue-300 transition-colors">
                      {chapter.title}
                    </CardTitle>
                  </div>
                  <ChevronRight className="h-5 w-5 text-white/60 group-hover:text-white transition-colors" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-white/60 text-sm">
                    <span>📚 Estimated time: {chapter.estimatedTime}</span>
                    {chapter.completed && (
                      <span className="text-green-400">✓ Completed</span>
                    )}
                  </div>
                  {chapter.tnBoardMapping && (
                    <div className="text-xs text-blue-300 bg-blue-500/10 p-2 rounded">
                      TN Board: {chapter.tnBoardMapping}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Progress Overview */}
        <Card className="glass-card mt-8">
          <CardHeader>
            <CardTitle className="text-white">Progress Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-2xl text-white mb-1">
                  {selectedSubject.chapters.filter(c => c.completed).length}
                </div>
                <div className="text-white/60">Completed</div>
              </div>
              <div>
                <div className="text-2xl text-white mb-1">
                  {selectedSubject.chapters.length}
                </div>
                <div className="text-white/60">Total Chapters</div>
              </div>
              <div>
                <div className="text-2xl text-white mb-1">
                  {Math.round((selectedSubject.chapters.filter(c => c.completed).length / selectedSubject.chapters.length) * 100)}%
                </div>
                <div className="text-white/60">Progress</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}