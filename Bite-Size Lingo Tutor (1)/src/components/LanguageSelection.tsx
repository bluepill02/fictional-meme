import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { ArrowLeft, Globe, Users, Briefcase } from 'lucide-react'
import { apiCall } from '../utils/api'

interface Language {
  id: string
  name: string
  description: string
}

interface LanguageSelectionProps {
  onNavigate: (screen: string, data?: any) => void
}

export function LanguageSelection({ onNavigate }: LanguageSelectionProps) {
  const [languages, setLanguages] = useState<Language[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadLanguages()
  }, [])

  const loadLanguages = async () => {
    try {
      const data = await apiCall('/languages')
      setLanguages(data.languages || [])
    } catch (error) {
      console.error('Failed to load languages:', error)
    } finally {
      setLoading(false)
    }
  }

  const getLanguageIcon = (languageId: string) => {
    switch (languageId) {
      case 'business-hindi':
        return <Briefcase className="w-8 h-8 text-blue-300" />
      case 'travel-spanish':
        return <Globe className="w-8 h-8 text-blue-300" />
      case 'tech-english':
        return <Users className="w-8 h-8 text-blue-300" />
      default:
        return <Globe className="w-8 h-8 text-blue-300" />
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen cosmic-gradient flex items-center justify-center">
        <div className="text-white">Loading languages...</div>
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
        <h1 className="text-xl text-white">Choose Your Language</h1>
      </div>

      <div className="p-4 space-y-4">
        <p className="text-blue-200 text-center">
          Select a language to start learning with bite-sized lessons
        </p>

        <div className="space-y-4">
          {languages.map((language) => (
            <Card
              key={language.id}
              className="glass-card cursor-pointer hover:bg-white/10 transition-all duration-300"
              onClick={() => onNavigate('decks', { languageId: language.id, languageName: language.name })}
            >
              <CardHeader>
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    {getLanguageIcon(language.id)}
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-white text-lg">
                      {language.name}
                    </CardTitle>
                    <CardDescription className="text-blue-200 mt-2">
                      {language.description}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div className="text-sm text-blue-300">
                    3 lesson decks available
                  </div>
                  <Button 
                    variant="outline"
                    size="sm"
                    className="border-blue-400 text-blue-300 hover:bg-blue-400/20"
                  >
                    Start Learning
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Coming Soon */}
        <Card className="glass-card opacity-60">
          <CardHeader>
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <Globe className="w-8 h-8 text-gray-400" />
              </div>
              <div className="flex-1">
                <CardTitle className="text-gray-300 text-lg">
                  More Languages Coming Soon
                </CardTitle>
                <CardDescription className="text-gray-400 mt-2">
                  French, German, Japanese, and more languages will be available soon
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-gray-400">
              Stay tuned for updates!
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}