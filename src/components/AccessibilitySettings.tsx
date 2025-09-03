import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Switch } from './ui/switch'
import { ArrowLeft, Eye, Volume2, Keyboard, Type, Monitor } from 'lucide-react'
import { useAccessibility } from './AccessibilityProvider'

interface AccessibilitySettingsProps {
  onNavigate: (screen: string) => void
}

export function AccessibilitySettings({ onNavigate }: AccessibilitySettingsProps) {
  const { settings, updateSettings } = useAccessibility()

  const settingsGroups = [
    {
      title: 'Visual Accessibility',
      icon: <Eye className="w-5 h-5" />,
      settings: [
        {
          key: 'high_contrast' as keyof typeof settings,
          label: 'High Contrast Mode',
          description: 'Increase contrast for better visibility',
          icon: <Monitor className="w-4 h-4" />
        },
        {
          key: 'large_text' as keyof typeof settings,
          label: 'Large Text',
          description: 'Increase font size throughout the app',
          icon: <Type className="w-4 h-4" />
        }
      ]
    },
    {
      title: 'Motion & Animation',
      icon: <Monitor className="w-5 h-5" />,
      settings: [
        {
          key: 'reduce_motion' as keyof typeof settings,
          label: 'Reduce Motion',
          description: 'Minimize animations and transitions',
          icon: <Monitor className="w-4 h-4" />
        }
      ]
    },
    {
      title: 'Assistive Technology',
      icon: <Volume2 className="w-5 h-5" />,
      settings: [
        {
          key: 'screen_reader_optimized' as keyof typeof settings,
          label: 'Screen Reader Optimization',
          description: 'Enhanced support for screen readers',
          icon: <Volume2 className="w-4 h-4" />
        },
        {
          key: 'keyboard_navigation' as keyof typeof settings,
          label: 'Enhanced Keyboard Navigation',
          description: 'Improved keyboard shortcuts and focus management',
          icon: <Keyboard className="w-4 h-4" />
        },
        {
          key: 'audio_descriptions' as keyof typeof settings,
          label: 'Audio Descriptions',
          description: 'Detailed audio descriptions for visual content',
          icon: <Volume2 className="w-4 h-4" />
        }
      ]
    }
  ]

  return (
    <div className="min-h-screen cosmic-gradient">
      {/* Header */}
      <div className="p-4 flex items-center space-x-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onNavigate('subscription')}
          className="text-white hover:bg-white/10"
          aria-label="Go back to settings"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-xl text-white">Accessibility Settings</h1>
      </div>

      <div className="p-4 space-y-6">
        <div className="text-center">
          <p className="text-blue-200">
            Customize the app to meet your accessibility needs
          </p>
        </div>

        {settingsGroups.map((group, groupIndex) => (
          <Card key={groupIndex} className="glass-card">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                {group.icon}
                <span className="ml-2">{group.title}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {group.settings.map((setting) => (
                <div
                  key={setting.key}
                  className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                >
                  <div className="flex items-start space-x-3 flex-1">
                    <div className="text-blue-300 mt-1">
                      {setting.icon}
                    </div>
                    <div className="flex-1">
                      <div className="text-white font-medium">
                        {setting.label}
                      </div>
                      <div className="text-blue-200 text-sm mt-1">
                        {setting.description}
                      </div>
                    </div>
                  </div>
                  <Switch
                    checked={settings[setting.key]}
                    onCheckedChange={(checked) => 
                      updateSettings({ [setting.key]: checked })
                    }
                    aria-label={`Toggle ${setting.label}`}
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        ))}

        {/* System Settings Integration */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-white">System Integration</CardTitle>
            <CardDescription className="text-blue-200">
              The app also respects your system accessibility preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex items-center text-blue-200">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
              Automatically detects system dark mode preference
            </div>
            <div className="flex items-center text-blue-200">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
              Respects system "reduce motion" settings
            </div>
            <div className="flex items-center text-blue-200">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
              Compatible with VoiceOver, NVDA, and other screen readers
            </div>
            <div className="flex items-center text-blue-200">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
              Supports high contrast mode detection
            </div>
          </CardContent>
        </Card>

        {/* Accessibility Features Info */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-white">Available Features</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-white font-medium mb-2">Visual Features</h4>
                <ul className="text-blue-200 space-y-1">
                  <li>• Adjustable text size</li>
                  <li>• High contrast themes</li>
                  <li>• Clear focus indicators</li>
                  <li>• Consistent layout patterns</li>
                </ul>
              </div>
              <div>
                <h4 className="text-white font-medium mb-2">Interactive Features</h4>
                <ul className="text-blue-200 space-y-1">
                  <li>• Full keyboard navigation</li>
                  <li>• Skip links for content</li>
                  <li>• Voice pronunciation guides</li>
                  <li>• Alternative input methods</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Reset to Defaults */}
        <Card className="glass-card">
          <CardContent className="p-4 text-center">
            <Button
              variant="outline"
              onClick={() => {
                updateSettings({
                  high_contrast: false,
                  large_text: false,
                  reduce_motion: false,
                  screen_reader_optimized: false,
                  keyboard_navigation: true,
                  audio_descriptions: false
                })
              }}
              className="border-blue-400 text-blue-300 hover:bg-blue-400/20"
            >
              Reset to Default Settings
            </Button>
          </CardContent>
        </Card>

        {/* Contact Support */}
        <Card className="glass-card border-blue-500/30">
          <CardHeader>
            <CardTitle className="text-white">Need Help?</CardTitle>
            <CardDescription className="text-blue-200">
              We're committed to making language learning accessible for everyone
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-blue-200 text-sm mb-4">
              If you need additional accessibility features or encounter any issues, 
              please contact our support team. We welcome feedback to improve accessibility.
            </p>
            <Button 
              variant="outline"
              className="border-blue-400 text-blue-300 hover:bg-blue-400/20"
            >
              Contact Accessibility Support
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}