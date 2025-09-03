import React from 'react'
import { Globe, Headphones, BookOpen } from 'lucide-react'
import { Button } from './ui/button'

interface SplashScreenProps {
  onGetStarted: () => void
}

export function SplashScreen({ onGetStarted }: SplashScreenProps) {
  return (
    <div className="min-h-screen cosmic-gradient flex flex-col items-center justify-center p-6">
      <div className="text-center space-y-8 max-w-md mx-auto">
        {/* Logo and Title */}
        <div className="space-y-4">
          <div className="flex items-center justify-center space-x-2 mb-6">
            <div className="relative">
              <Globe className="w-12 h-12 text-white" />
              <Headphones className="w-6 h-6 text-blue-300 absolute -bottom-1 -right-1" />
            </div>
          </div>
          
          <h1 className="text-4xl font-bold text-white mb-2">
            Bite-Size Lingo
          </h1>
          <h2 className="text-xl text-blue-200 mb-6">
            Tutor
          </h2>
          
          <p className="text-lg text-blue-100 leading-relaxed">
            Master languages in just 2-3 minutes daily with AI-powered flashcards, 
            audio lessons, and smart spaced repetition.
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-3 gap-4 my-8">
          <div className="text-center">
            <BookOpen className="w-8 h-8 text-blue-300 mx-auto mb-2" />
            <p className="text-sm text-blue-100">Smart Cards</p>
          </div>
          <div className="text-center">
            <Headphones className="w-8 h-8 text-blue-300 mx-auto mb-2" />
            <p className="text-sm text-blue-100">Audio Learning</p>
          </div>
          <div className="text-center">
            <Globe className="w-8 h-8 text-blue-300 mx-auto mb-2" />
            <p className="text-sm text-blue-100">Real Situations</p>
          </div>
        </div>

        {/* CTA Button */}
        <Button 
          onClick={onGetStarted}
          className="w-full py-4 cosmic-button text-white border-0 rounded-xl"
          size="lg"
        >
          Get Started
        </Button>

        {/* Subscription hint */}
        <p className="text-sm text-blue-200">
          Free trial • Premium ₹99/month
        </p>
      </div>
    </div>
  )
}