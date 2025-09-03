import React, { createContext, useContext, useEffect, useState } from 'react'
import { useAuth } from './AuthProvider'
import { authenticatedApiCall } from '../utils/api'

interface AccessibilitySettings {
  high_contrast: boolean
  large_text: boolean
  reduce_motion: boolean
  screen_reader_optimized: boolean
  keyboard_navigation: boolean
  audio_descriptions: boolean
}

interface AccessibilityContextType {
  settings: AccessibilitySettings
  updateSettings: (newSettings: Partial<AccessibilitySettings>) => Promise<void>
  isHighContrast: boolean
  isLargeText: boolean
  isReducedMotion: boolean
}

const defaultSettings: AccessibilitySettings = {
  high_contrast: false,
  large_text: false,
  reduce_motion: false,
  screen_reader_optimized: false,
  keyboard_navigation: true,
  audio_descriptions: false
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined)

export function AccessibilityProvider({ children }: { children: React.ReactNode }) {
  const { session, user } = useAuth()
  const [settings, setSettings] = useState<AccessibilitySettings>(defaultSettings)

  useEffect(() => {
    // Load accessibility settings from user preferences
    if (user?.user_metadata?.accessibility_settings) {
      setSettings({ ...defaultSettings, ...user.user_metadata.accessibility_settings })
    }
    
    // Apply system preferences if available
    if (window.matchMedia) {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
      const prefersHighContrast = window.matchMedia('(prefers-contrast: high)')
      
      if (prefersReducedMotion.matches) {
        setSettings(prev => ({ ...prev, reduce_motion: true }))
      }
      
      if (prefersHighContrast.matches) {
        setSettings(prev => ({ ...prev, high_contrast: true }))
      }
    }
  }, [user])

  useEffect(() => {
    // Apply accessibility settings to document
    const root = document.documentElement
    
    if (settings.high_contrast) {
      root.classList.add('high-contrast')
    } else {
      root.classList.remove('high-contrast')
    }
    
    if (settings.large_text) {
      root.classList.add('large-text')
    } else {
      root.classList.remove('large-text')
    }
    
    if (settings.reduce_motion) {
      root.classList.add('reduce-motion')
    } else {
      root.classList.remove('reduce-motion')
    }
    
    if (settings.screen_reader_optimized) {
      root.classList.add('screen-reader-optimized')
    } else {
      root.classList.remove('screen-reader-optimized')
    }
  }, [settings])

  const updateSettings = async (newSettings: Partial<AccessibilitySettings>) => {
    const updatedSettings = { ...settings, ...newSettings }
    setSettings(updatedSettings)
    
    if (session?.access_token) {
      try {
        await authenticatedApiCall('/accessibility/update', session.access_token, {
          method: 'POST',
          body: JSON.stringify({ settings: updatedSettings })
        })
      } catch (error) {
        console.error('Failed to update accessibility settings:', error)
      }
    }
  }

  const value = {
    settings,
    updateSettings,
    isHighContrast: settings.high_contrast,
    isLargeText: settings.large_text,
    isReducedMotion: settings.reduce_motion
  }

  return (
    <AccessibilityContext.Provider value={value}>
      {children}
    </AccessibilityContext.Provider>
  )
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext)
  if (context === undefined) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider')
  }
  return context
}