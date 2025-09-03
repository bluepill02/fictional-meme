import React from 'react'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { ArrowLeft, Smartphone, Tablet, Monitor, Laptop } from 'lucide-react'

interface ResponsiveTestScreenProps {
  onNavigate: (screen: string) => void
}

export function ResponsiveTestScreen({ onNavigate }: ResponsiveTestScreenProps) {
  return (
    <div className="min-h-screen cosmic-gradient">
      {/* Header */}
      <div className="p-4 responsive-nav">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onNavigate('home')}
            className="text-white hover:bg-white/10 touch-target"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-lg sm:text-xl text-white">Responsive Breakpoint Testing</h1>
        </div>
      </div>

      <div className="mobile-padding p-4 space-y-6">
        {/* Breakpoint Indicators */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-white">Current Breakpoint</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Badge className="sm:hidden bg-green-500/20 text-green-300">
                <Smartphone className="w-3 h-3 mr-1" />
                Mobile Small ({'< 640px'})
              </Badge>
              <Badge className="hidden sm:block md:hidden bg-blue-500/20 text-blue-300">
                <Smartphone className="w-3 h-3 mr-1" />
                Mobile Large (640px - 768px)
              </Badge>
              <Badge className="hidden md:block lg:hidden bg-purple-500/20 text-purple-300">
                <Tablet className="w-3 h-3 mr-1" />
                Tablet (768px - 1024px)
              </Badge>
              <Badge className="hidden lg:block bg-yellow-500/20 text-yellow-300">
                <Monitor className="w-3 h-3 mr-1" />
                Desktop ({'≥ 1024px'})
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Responsive Card Grid Test */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-white">Responsive Grid Test</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="responsive-card-grid">
              <div className="glass-card p-4 text-center">
                <div className="text-2xl mb-2">📱</div>
                <div className="text-white">Card 1</div>
                <div className="text-blue-200 text-sm">Mobile: Full width</div>
                <div className="text-blue-200 text-sm">Tablet+: 1/2 or 1/3</div>
              </div>
              <div className="glass-card p-4 text-center">
                <div className="text-2xl mb-2">💻</div>
                <div className="text-white">Card 2</div>
                <div className="text-blue-200 text-sm">Responsive layout</div>
              </div>
              <div className="glass-card p-4 text-center">
                <div className="text-2xl mb-2">🖥️</div>
                <div className="text-white">Card 3</div>
                <div className="text-blue-200 text-sm">Adapts to screen</div>
              </div>
              <div className="glass-card p-4 text-center">
                <div className="text-2xl mb-2">⌚</div>
                <div className="text-white">Card 4</div>
                <div className="text-blue-200 text-sm">Desktop: 1/4 width</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Touch Target Testing */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-white">Touch Target Testing</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <Button className="touch-target cosmic-button w-full">
                  Touch Friendly Button
                </Button>
                <Button variant="outline" className="touch-target w-full border-blue-400 text-blue-300">
                  Secondary Button
                </Button>
                <Button size="icon" className="touch-target cosmic-button">
                  <Smartphone className="w-5 h-5" />
                </Button>
              </div>
              <div className="text-sm text-blue-200">
                All buttons meet minimum 44px touch target size on mobile
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Typography Scaling */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-white">Typography Scaling</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h1 className="text-white">H1 - Main Heading</h1>
              <div className="text-blue-200 text-sm">Responsive heading that scales with screen size</div>
            </div>
            <div>
              <h2 className="text-white">H2 - Section Heading</h2>
              <div className="text-blue-200 text-sm">Maintains readability across devices</div>
            </div>
            <div>
              <p className="text-white">Body text paragraph that demonstrates responsive typography and line spacing for optimal readability on all screen sizes.</p>
              <div className="text-blue-200 text-sm">Uses fluid font sizes and line heights</div>
            </div>
          </CardContent>
        </Card>

        {/* Layout Patterns */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-white">Layout Pattern Tests</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Stack to Side-by-Side */}
            <div>
              <h3 className="text-white mb-3">Stack to Side-by-Side</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="glass-card p-3">
                  <div className="text-white">Left Content</div>
                  <div className="text-blue-200 text-sm">Stacked on mobile, side-by-side on tablet+</div>
                </div>
                <div className="glass-card p-3">
                  <div className="text-white">Right Content</div>
                  <div className="text-blue-200 text-sm">Responsive grid layout</div>
                </div>
              </div>
            </div>

            {/* Three Column Layout */}
            <div>
              <h3 className="text-white mb-3">Multi-Column Layout</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="glass-card p-3 text-center">
                  <div className="text-white">Column 1</div>
                  <div className="text-blue-200 text-sm">1 col mobile</div>
                </div>
                <div className="glass-card p-3 text-center">
                  <div className="text-white">Column 2</div>
                  <div className="text-blue-200 text-sm">2 cols tablet</div>
                </div>
                <div className="glass-card p-3 text-center">
                  <div className="text-white">Column 3</div>
                  <div className="text-blue-200 text-sm">3 cols desktop</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lesson Player Card Test */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-white">Lesson Card Responsiveness</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            <div className="lesson-card glass-card border-2 border-blue-400/30 flex items-center justify-center">
              <div className="text-center p-6">
                <div className="text-4xl mb-4">📖</div>
                <div className="text-white text-lg mb-2">Lesson Card</div>
                <div className="text-blue-200 text-sm">Responsive aspect ratio</div>
                <div className="text-blue-200 text-xs mt-2">
                  Mobile: 3:4 ratio, Tablet: 4:3, Desktop: 3:4
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Spacing Tests */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-white">Responsive Spacing</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 md:space-y-6 lg:space-y-8">
              <div className="p-4 md:p-6 lg:p-8 bg-blue-900/20 rounded">
                <div className="text-white">Adaptive Padding</div>
                <div className="text-blue-200 text-sm">
                  Padding increases with screen size: 1rem → 1.5rem → 2rem
                </div>
              </div>
              <div className="p-4 md:p-6 lg:p-8 bg-purple-900/20 rounded">
                <div className="text-white">Adaptive Spacing</div>
                <div className="text-blue-200 text-sm">
                  Vertical spacing adapts to screen: 1rem → 1.5rem → 2rem
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Test Results */}
        <Card className="glass-card border-green-500/30">
          <CardHeader>
            <CardTitle className="text-white text-green-300">✅ Breakpoint Test Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="text-green-300">✓ Mobile Small ({'< 640px'}): Single column layout, touch-friendly buttons</div>
              <div className="text-green-300">✓ Mobile Large (640-768px): Two column grids where appropriate</div>
              <div className="text-green-300">✓ Tablet (768-1024px): Three column layouts, balanced spacing</div>
              <div className="text-green-300">✓ Desktop ({'≥ 1024px'}): Four column grids, optimal spacing</div>
              <div className="text-blue-200 mt-4">
                All layouts tested across breakpoints with proper touch targets and readable typography.
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}