import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { ArrowLeft, Play, Clock, CheckCircle, BookOpen } from 'lucide-react'
import { apiCall } from '../utils/api'

interface Deck {
  id: string
  title: string
  orderIndex: number
}

interface DeckListProps {
  languageId: string
  languageName: string
  onNavigate: (screen: string, data?: any) => void
}

export function DeckList({ languageId, languageName, onNavigate }: DeckListProps) {
  const [decks, setDecks] = useState<Deck[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDecks()
  }, [languageId])

  const loadDecks = async () => {
    try {
      const data = await apiCall(`/decks/${languageId}`)
      setDecks(data.decks || [])
    } catch (error) {
      console.error('Failed to load decks:', error)
    } finally {
      setLoading(false)
    }
  }

  const getDeckIcon = (deckId: string) => {
    // Different icons based on deck content
    if (deckId.includes('cafe') || deckId.includes('restaurant')) {
      return '☕'
    } else if (deckId.includes('office') || deckId.includes('business')) {
      return '💼'
    } else if (deckId.includes('phone') || deckId.includes('call')) {
      return '📞'
    } else if (deckId.includes('airport') || deckId.includes('travel')) {
      return '✈️'
    } else if (deckId.includes('hotel')) {
      return '🏨'
    } else if (deckId.includes('code') || deckId.includes('tech')) {
      return '💻'
    } else if (deckId.includes('project')) {
      return '📊'
    } else if (deckId.includes('debug')) {
      return '🐛'
    }
    return '📚'
  }

  const getEstimatedTime = () => {
    return '2-3 min'
  }

  if (loading) {
    return (
      <div className="min-h-screen cosmic-gradient flex items-center justify-center">
        <div className="text-white">Loading lesson decks...</div>
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
          onClick={() => onNavigate('languages')}
          className="text-white hover:bg-white/10"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-xl text-white">{languageName}</h1>
          <p className="text-sm text-blue-200">Choose a lesson deck</p>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {decks.map((deck, index) => (
          <Card
            key={deck.id}
            className="glass-card cursor-pointer hover:bg-white/10 transition-all duration-300"
            onClick={() => onNavigate('lessons', { 
              deckId: deck.id, 
              deckTitle: deck.title,
              languageName 
            })}
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className="text-3xl">{getDeckIcon(deck.id)}</div>
                  <div className="flex-1">
                    <CardTitle className="text-white text-lg">
                      {deck.title}
                    </CardTitle>
                    <CardDescription className="text-blue-200 mt-2">
                      Real-world conversations and vocabulary
                    </CardDescription>
                  </div>
                </div>
                <Badge variant="outline" className="border-blue-400 text-blue-300">
                  Deck {deck.orderIndex}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 text-sm text-blue-300">
                  <div className="flex items-center space-x-1">
                    <BookOpen className="w-4 h-4" />
                    <span>1 lesson</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{getEstimatedTime()}</span>
                  </div>
                </div>
                
                <Button 
                  size="sm"
                  className="cosmic-button"
                >
                  <Play className="w-4 h-4 mr-1" />
                  Start
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Progress indicator */}
        <div className="mt-8 p-4 glass-card rounded-lg">
          <div className="flex items-center justify-between text-sm">
            <span className="text-blue-200">Your Progress</span>
            <span className="text-white">0 of {decks.length} decks completed</span>
          </div>
          <div className="mt-2 bg-white/10 rounded-full h-2">
            <div className="bg-blue-500 h-2 rounded-full" style={{ width: '0%' }}></div>
          </div>
        </div>

        {/* Tips */}
        <Card className="glass-card mt-4">
          <CardContent className="p-4">
            <h3 className="text-white font-medium mb-2">💡 Learning Tips</h3>
            <ul className="text-sm text-blue-200 space-y-1">
              <li>• Complete lessons daily for best results</li>
              <li>• Listen to audio multiple times</li>
              <li>• Practice pronunciation out loud</li>
              <li>• Review difficult words regularly</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}