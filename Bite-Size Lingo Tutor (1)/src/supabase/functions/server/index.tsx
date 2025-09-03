import { Hono } from "npm:hono"
import { cors } from "npm:hono/cors"
import { logger } from "npm:hono/logger"
import { createClient } from "npm:@supabase/supabase-js@2"
import * as kv from './kv_store.tsx'

const app = new Hono()

app.use("*", cors())
app.use("*", logger(console.log))

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
)

// FSRS Algorithm Implementation
interface FSRSCard {
  stability: number
  difficulty: number
  last_review: string
  due_date: string
  state: 'new' | 'learning' | 'review' | 'relearning'
  reps: number
  lapses: number
}

function calculateFSRS(card: FSRSCard, grade: number, now: Date): FSRSCard {
  const { stability, difficulty, state, reps, lapses } = card
  
  let newStability = stability
  let newDifficulty = difficulty
  let newState = state
  let newReps = reps + 1
  let newLapses = lapses

  // FSRS parameters (simplified)
  const w = [0.4, 0.6, 2.4, 5.8, 4.93, 0.94, 0.86, 0.01, 1.49, 0.14, 0.94, 2.18, 0.05, 0.34, 1.26, 0.29, 2.61]
  
  if (grade < 3) { // Failed (Again/Hard)
    newLapses += 1
    newState = 'relearning'
    newStability = Math.max(newStability * w[11], 0.01)
    newDifficulty = Math.min(newDifficulty + w[6], 10)
  } else { // Passed (Good/Easy)
    if (state === 'new') {
      newState = 'learning'
      newStability = w[grade - 3]
    } else {
      const retention = Math.pow(0.9, Math.sqrt(newDifficulty))
      const delta_t = (now.getTime() - new Date(card.last_review).getTime()) / (1000 * 60 * 60 * 24)
      const retrievability = Math.pow(1 + delta_t / (9 * newStability), -1)
      
      newDifficulty = Math.max(0.1, Math.min(10, newDifficulty + w[7] * (grade - 3)))
      newStability = newStability * (1 + Math.exp(w[8]) * (11 - newDifficulty) * Math.pow(newStability, -w[9]) * (Math.exp((1 - retrievability) * w[10]) - 1))
      
      if (grade === 4) { // Easy
        newStability *= 1.3
      }
      newState = 'review'
    }
  }

  const interval = Math.max(1, Math.round(newStability))
  const dueDate = new Date(now.getTime() + interval * 24 * 60 * 60 * 1000)

  return {
    stability: newStability,
    difficulty: newDifficulty,
    last_review: now.toISOString(),
    due_date: dueDate.toISOString(),
    state: newState,
    reps: newReps,
    lapses: newLapses
  }
}

// Auth endpoints
app.post('/make-server-99270936/signup', async (c) => {
  try {
    const { email, password, name, preferredLanguage = 'en', timezone = 'UTC' } = await c.req.json()
    
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { 
        name, 
        preferred_language: preferredLanguage,
        timezone,
        avatar_url: null,
        srs_settings: {
          daily_new_cards: 20,
          daily_review_limit: 200,
          graduation_interval: 1,
          easy_interval: 4,
          starting_ease: 2.5
        }
      },
      // Automatically confirm the user's email since an email server hasn't been configured.
      email_confirm: true
    })
    
    if (error) {
      console.log('Signup error:', error)
      return c.json({ error: error.message }, 400)
    }
    
    // Initialize user profile with enhanced data
    const userId = data.user.id
    await kv.set(`user:${userId}:profile`, JSON.stringify({
      subscription_status: 'free',
      joined_date: new Date().toISOString(),
      lessons_completed_this_month: 0,
      total_words_learned: 0,
      current_streak: 0,
      longest_streak: 0,
      last_activity_date: new Date().toISOString(),
      cefr_level: 'A1',
      preferred_study_time: '09:00',
      study_reminders_enabled: true,
      accessibility_settings: {
        high_contrast: false,
        large_text: false,
        reduce_motion: false,
        screen_reader_optimized: false
      },
      privacy_consent: {
        analytics: false,
        notifications: false,
        data_processing: true,
        marketing: false
      }
    }))
    
    // Initialize empty flashcard state
    await kv.set(`user:${userId}:flashcards`, JSON.stringify([]))
    
    return c.json({ user: data.user })
  } catch (error) {
    console.log('Signup error:', error)
    return c.json({ error: 'Signup failed' }, 500)
  }
})

// User progress endpoints
app.get('/make-server-99270936/user/progress', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1]
    const { data: { user }, error } = await supabase.auth.getUser(accessToken)
    
    if (!user?.id) {
      return c.json({ error: 'Unauthorized' }, 401)
    }
    
    const userId = user.id
    
    // Get user profile
    const profileData = await kv.get(`user:${userId}:profile`)
    const profile = profileData ? JSON.parse(profileData) : {}
    
    // Get flashcards data
    const flashcardsData = await kv.get(`user:${userId}:flashcards`) || '[]'
    const flashcards = JSON.parse(flashcardsData)
    
    // Get lesson progress
    const progressKeys = await kv.getByPrefix(`user:${userId}:lesson:`)
    const lessonsProgress = []
    
    for (const key of progressKeys) {
      const lessonId = key.split(':')[3]
      const progressValue = await kv.get(key)
      if (progressValue) {
        lessonsProgress.push({
          lessonId,
          ...JSON.parse(progressValue)
        })
      }
    }
    
    // Calculate advanced analytics
    const totalFlashcards = flashcards.length
    const masteredCards = flashcards.filter(f => f.state === 'review' && f.reps >= 5).length
    const learningCards = flashcards.filter(f => f.state === 'learning').length
    const newCards = flashcards.filter(f => f.state === 'new').length
    const lapseRate = totalFlashcards > 0 ? (flashcards.reduce((sum, f) => sum + f.lapses, 0) / totalFlashcards) : 0
    
    // Calculate CEFR progress
    const cefrProgress = {
      A1: flashcards.filter(f => f.cefr_level === 'A1' && f.state === 'review').length,
      A2: flashcards.filter(f => f.cefr_level === 'A2' && f.state === 'review').length,
      B1: flashcards.filter(f => f.cefr_level === 'B1' && f.state === 'review').length,
      B2: flashcards.filter(f => f.cefr_level === 'B2' && f.state === 'review').length,
      C1: flashcards.filter(f => f.cefr_level === 'C1' && f.state === 'review').length,
      C2: flashcards.filter(f => f.cefr_level === 'C2' && f.state === 'review').length
    }
    
    // Get due cards for today
    const now = new Date()
    const dueCards = flashcards.filter(f => new Date(f.due_date) <= now)
    
    // Calculate weekly activity
    const weeklyActivity = []
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now)
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split('T')[0]
      
      const dayActivity = lessonsProgress.filter(p => 
        p.lastReviewedDate && p.lastReviewedDate.startsWith(dateStr)
      ).length
      
      weeklyActivity.push({
        date: dateStr,
        lessons: dayActivity,
        reviews: 0 // Would calculate from review history
      })
    }
    
    return c.json({
      // Basic info
      subscription: profile.subscription_status || 'free',
      lessonsCompleted: profile.lessons_completed_this_month || 0,
      joinedDate: profile.joined_date,
      
      // Progress stats
      totalWordsLearned: profile.total_words_learned || 0,
      currentStreak: profile.current_streak || 0,
      longestStreak: profile.longest_streak || 0,
      lastActivityDate: profile.last_activity_date,
      
      // Flashcard analytics
      flashcardStats: {
        total: totalFlashcards,
        mastered: masteredCards,
        learning: learningCards,
        new: newCards,
        due: dueCards.length,
        lapseRate: Math.round(lapseRate * 100) / 100
      },
      
      // CEFR progress
      cefrProgress,
      currentCefrLevel: profile.cefr_level || 'A1',
      
      // Activity data
      weeklyActivity,
      
      // SRS settings
      srsSettings: user.user_metadata?.srs_settings || {
        daily_new_cards: 20,
        daily_review_limit: 200
      },
      
      // Accessibility and preferences
      accessibilitySettings: profile.accessibility_settings || {},
      preferredLanguage: user.user_metadata?.preferred_language || 'en',
      timezone: user.user_metadata?.timezone || 'UTC',
      
      // Raw data
      progress: lessonsProgress,
      flashcards: flashcards.slice(0, 10) // Return sample for debugging
    })
  } catch (error) {
    console.log('Get progress error:', error)
    return c.json({ error: 'Failed to get progress' }, 500)
  }
})

app.post('/make-server-99270936/lesson/complete', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1]
    const { data: { user }, error } = await supabase.auth.getUser(accessToken)
    
    if (!user?.id) {
      return c.json({ error: 'Unauthorized' }, 401)
    }
    
    const { lessonId, score, timeSpent, flashcardResults = [] } = await c.req.json()
    const userId = user.id
    const now = new Date()
    
    // Update lesson progress
    const existingProgress = await kv.get(`user:${userId}:lesson:${lessonId}`)
    let progress = existingProgress ? JSON.parse(existingProgress) : {
      reviewInterval: 1,
      timesReviewed: 0,
      totalTimeSpent: 0
    }
    
    progress.lastScore = score
    progress.lastReviewedDate = now.toISOString()
    progress.timesReviewed += 1
    progress.totalTimeSpent = (progress.totalTimeSpent || 0) + timeSpent
    
    // Enhanced spaced repetition using FSRS
    const multiplier = score >= 90 ? 2.8 : score >= 80 ? 2.5 : score >= 70 ? 2.0 : score >= 60 ? 1.5 : 1.2
    progress.reviewInterval = Math.ceil(progress.reviewInterval * multiplier)
    progress.nextReviewDate = new Date(now.getTime() + progress.reviewInterval * 24 * 60 * 60 * 1000).toISOString()
    
    await kv.set(`user:${userId}:lesson:${lessonId}`, JSON.stringify(progress))
    
    // Process individual flashcard results using FSRS
    const flashcards = await kv.get(`user:${userId}:flashcards`) || '[]'
    let userFlashcards = JSON.parse(flashcards)
    
    for (const result of flashcardResults) {
      const { vocabId, grade, responseTime } = result
      
      let flashcard = userFlashcards.find(f => f.vocab_id === vocabId)
      if (!flashcard) {
        // Create new flashcard
        flashcard = {
          vocab_id: vocabId,
          user_id: userId,
          stability: 0.4,
          difficulty: 5.0,
          last_review: now.toISOString(),
          due_date: now.toISOString(),
          state: 'new',
          reps: 0,
          lapses: 0,
          review_count: 0,
          average_response_time: responseTime || 3000,
          created_at: now.toISOString()
        }
        userFlashcards.push(flashcard)
      }
      
      // Update flashcard using FSRS
      const fsrsResult = calculateFSRS(flashcard, grade, now)
      Object.assign(flashcard, fsrsResult)
      
      // Update response time average
      flashcard.review_count += 1
      flashcard.average_response_time = ((flashcard.average_response_time * (flashcard.review_count - 1)) + (responseTime || 3000)) / flashcard.review_count
      
      // Log review history
      await kv.set(`review:${userId}:${vocabId}:${now.getTime()}`, JSON.stringify({
        user_id: userId,
        vocab_id: vocabId,
        rating: grade,
        reviewed_at: now.toISOString(),
        response_time: responseTime || 3000,
        previous_stability: flashcard.stability,
        new_stability: fsrsResult.stability
      }))
    }
    
    await kv.set(`user:${userId}:flashcards`, JSON.stringify(userFlashcards))
    
    // Update user profile stats
    const profileData = await kv.get(`user:${userId}:profile`)
    let profile = profileData ? JSON.parse(profileData) : {}
    
    profile.lessons_completed_this_month = (profile.lessons_completed_this_month || 0) + 1
    profile.total_words_learned = userFlashcards.filter(f => f.state === 'review' && f.reps >= 3).length
    profile.last_activity_date = now.toISOString()
    
    // Update streak
    const lastActivity = new Date(profile.last_activity_date || now)
    const daysDiff = Math.floor((now.getTime() - lastActivity.getTime()) / (1000 * 60 * 60 * 24))
    
    if (daysDiff <= 1) {
      profile.current_streak = (profile.current_streak || 0) + (daysDiff === 1 ? 1 : 0)
    } else {
      profile.current_streak = 1
    }
    
    profile.longest_streak = Math.max(profile.longest_streak || 0, profile.current_streak)
    
    await kv.set(`user:${userId}:profile`, JSON.stringify(profile))
    
    return c.json({ 
      success: true, 
      progress,
      flashcardsUpdated: flashcardResults.length,
      streak: profile.current_streak,
      wordsLearned: profile.total_words_learned
    })
  } catch (error) {
    console.log('Complete lesson error:', error)
    return c.json({ error: 'Failed to complete lesson' }, 500)
  }
})

app.get('/make-server-99270936/lessons/due', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1]
    const { data: { user }, error } = await supabase.auth.getUser(accessToken)
    
    if (!user?.id) {
      return c.json({ error: 'Unauthorized' }, 401)
    }
    
    const userId = user.id
    const now = new Date()
    
    // Get due flashcards
    const flashcardsData = await kv.get(`user:${userId}:flashcards`) || '[]'
    const flashcards = JSON.parse(flashcardsData)
    
    const dueFlashcards = flashcards.filter(f => new Date(f.due_date) <= now)
    
    // Get lesson progress to find lessons with due content
    const progressKeys = await kv.getByPrefix(`user:${userId}:lesson:`)
    const dueLessons = []
    
    for (const key of progressKeys) {
      const lessonId = key.split(':')[3]
      const progressValue = await kv.get(key)
      if (progressValue) {
        const progress = JSON.parse(progressValue)
        if (progress.nextReviewDate && progress.nextReviewDate <= now.toISOString()) {
          dueLessons.push({
            lessonId,
            nextReviewDate: progress.nextReviewDate,
            lastScore: progress.lastScore,
            priority: progress.lastScore < 70 ? 'high' : 'normal'
          })
        }
      }
    }
    
    // Get user's SRS settings
    const srsSettings = user.user_metadata?.srs_settings || {
      daily_new_cards: 20,
      daily_review_limit: 200
    }
    
    // Calculate recommendations
    const recommendations = {
      newCardsToday: Math.min(srsSettings.daily_new_cards, 
        flashcards.filter(f => f.state === 'new').length),
      reviewsDue: Math.min(srsSettings.daily_review_limit, dueFlashcards.length),
      estimatedTimeMinutes: Math.ceil((dueFlashcards.length * 15 + dueLessons.length * 180) / 60),
      priority: dueFlashcards.length > 50 ? 'urgent' : 
               dueFlashcards.length > 20 ? 'high' : 'normal'
    }
    
    return c.json({ 
      dueLessons,
      dueFlashcards: dueFlashcards.length,
      recommendations,
      scheduleSummary: {
        totalDue: dueLessons.length + dueFlashcards.length,
        lessons: dueLessons.length,
        flashcards: dueFlashcards.length,
        newWords: flashcards.filter(f => f.state === 'new').length
      }
    })
  } catch (error) {
    console.log('Get due lessons error:', error)
    return c.json({ error: 'Failed to get due lessons' }, 500)
  }
})

app.post('/make-server-99270936/subscription/upgrade', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1]
    const { data: { user }, error } = await supabase.auth.getUser(accessToken)
    
    if (!user?.id) {
      return c.json({ error: 'Unauthorized' }, 401)
    }
    
    // In a real app, this would integrate with Stripe/Razorpay
    // For now, we'll simulate the upgrade
    await kv.set(`user:${user.id}:subscription`, 'paid')
    await kv.set(`user:${user.id}:subscription_date`, new Date().toISOString())
    
    return c.json({ success: true })
  } catch (error) {
    console.log('Subscription upgrade error:', error)
    return c.json({ error: 'Failed to upgrade subscription' }, 500)
  }
})

// Lesson data endpoints
// Enhanced vocabulary and dialogue data
const vocabularyData = {
  'business-hindi': [
    { 
      vocab_id: 'bh_001', 
      word: 'नमस्ते', 
      translation: 'Hello/Greetings', 
      part_of_speech: 'interjection',
      sample_sentence: 'नमस्ते, आप कैसे हैं? (Hello, how are you?)',
      pronunciation: 'na-mas-te',
      cefr_level: 'A1',
      difficulty_score: 1.2
    },
    { 
      vocab_id: 'bh_002', 
      word: 'कॉफी', 
      translation: 'Coffee', 
      part_of_speech: 'noun',
      sample_sentence: 'मुझे एक कॉफी चाहिए। (I need a coffee.)',
      pronunciation: 'kof-fee',
      cefr_level: 'A1',
      difficulty_score: 1.0
    },
    { 
      vocab_id: 'bh_003', 
      word: 'बैठक', 
      translation: 'Meeting', 
      part_of_speech: 'noun',
      sample_sentence: 'आज दो बजे बैठक है। (There is a meeting at 2 o\'clock today.)',
      pronunciation: 'bai-thak',
      cefr_level: 'A2',
      difficulty_score: 2.1
    },
    { 
      vocab_id: 'bh_004', 
      word: 'प्रस्तुति', 
      translation: 'Presentation', 
      part_of_speech: 'noun',
      sample_sentence: 'कल मेरी प्रस्तुति है। (I have a presentation tomorrow.)',
      pronunciation: 'pras-tu-ti',
      cefr_level: 'B1',
      difficulty_score: 3.2
    }
  ],
  'travel-spanish': [
    { 
      vocab_id: 'ts_001', 
      word: 'Aeropuerto', 
      translation: 'Airport', 
      part_of_speech: 'noun',
      sample_sentence: '¿Dónde está el aeropuerto? (Where is the airport?)',
      pronunciation: 'ah-eh-ro-PWER-to',
      cefr_level: 'A1',
      difficulty_score: 1.5
    },
    { 
      vocab_id: 'ts_002', 
      word: 'Pasaporte', 
      translation: 'Passport', 
      part_of_speech: 'noun',
      sample_sentence: 'Necesito mi pasaporte. (I need my passport.)',
      pronunciation: 'pa-sa-POR-te',
      cefr_level: 'A1',
      difficulty_score: 1.3
    }
  ],
  'tech-english': [
    { 
      vocab_id: 'te_001', 
      word: 'Debug', 
      translation: 'Find and fix errors', 
      part_of_speech: 'verb',
      sample_sentence: 'We need to debug this code before deployment.',
      pronunciation: 'dee-bug',
      cefr_level: 'B2',
      difficulty_score: 2.8
    },
    { 
      vocab_id: 'te_002', 
      word: 'Deploy', 
      translation: 'Release to production', 
      part_of_speech: 'verb',
      sample_sentence: 'Let\'s deploy the new features to production.',
      pronunciation: 'dee-ploi',
      cefr_level: 'B2',
      difficulty_score: 3.0
    }
  ]
}

const dialogueData = {
  'chennai-cafe': {
    dialogue_id: 'cc_001',
    title: 'Ordering Coffee in Chennai',
    situation: 'Business meeting at a local café',
    language_code: 'hi',
    lines: [
      { speaker: 'Customer', text: 'नमस्ते, एक कॉफी दे सकते हैं?', translation: 'Hello, can you give me a coffee?' },
      { speaker: 'Barista', text: 'हाँ जी, कितने रुपये की?', translation: 'Yes sir, for how much money?' },
      { speaker: 'Customer', text: 'पचास रुपये की।', translation: 'For fifty rupees.' },
      { speaker: 'Barista', text: 'ठीक है, दो मिनट में तैयार हो जाएगी।', translation: 'Okay, it will be ready in two minutes.' }
    ]
  }
}

app.get('/make-server-99270936/languages', async (c) => {
  try {
    const languages = [
      { 
        id: 'business-hindi', 
        name: 'Business Hindi', 
        description: 'Professional Hindi for workplace communication',
        language_code: 'hi',
        flag: '🇮🇳',
        total_vocabulary: vocabularyData['business-hindi'].length,
        cefr_levels: ['A1', 'A2', 'B1']
      },
      { 
        id: 'travel-spanish', 
        name: 'Travel Spanish', 
        description: 'Essential Spanish for travelers',
        language_code: 'es',
        flag: '🇪🇸',
        total_vocabulary: vocabularyData['travel-spanish'].length,
        cefr_levels: ['A1', 'A2']
      },
      { 
        id: 'tech-english', 
        name: 'Tech English', 
        description: 'Technical English for developers',
        language_code: 'en',
        flag: '🇺🇸',
        total_vocabulary: vocabularyData['tech-english'].length,
        cefr_levels: ['B1', 'B2', 'C1']
      }
    ]
    
    return c.json({ languages })
  } catch (error) {
    console.log('Get languages error:', error)
    return c.json({ error: 'Failed to get languages' }, 500)
  }
})

app.get('/make-server-99270936/decks/:languageId', async (c) => {
  try {
    const languageId = c.req.param('languageId')
    
    // Mock deck data
    const decksByLanguage = {
      'business-hindi': [
        { id: 'chennai-cafe', title: 'Chennai Café Conversation', orderIndex: 1 },
        { id: 'office-meetings', title: 'Office Meetings', orderIndex: 2 },
        { id: 'phone-calls', title: 'Professional Phone Calls', orderIndex: 3 }
      ],
      'travel-spanish': [
        { id: 'airport-basics', title: 'Airport Basics', orderIndex: 1 },
        { id: 'hotel-check-in', title: 'Hotel Check-in', orderIndex: 2 },
        { id: 'restaurant-ordering', title: 'Restaurant Ordering', orderIndex: 3 }
      ],
      'tech-english': [
        { id: 'code-review', title: 'Code Review Vocabulary', orderIndex: 1 },
        { id: 'project-management', title: 'Project Management', orderIndex: 2 },
        { id: 'debugging-terms', title: 'Debugging Terminology', orderIndex: 3 }
      ]
    }
    
    const decks = decksByLanguage[languageId] || []
    return c.json({ decks })
  } catch (error) {
    console.log('Get decks error:', error)
    return c.json({ error: 'Failed to get decks' }, 500)
  }
})

app.get('/make-server-99270936/lessons/:deckId', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1]
    const deckId = c.req.param('deckId')
    
    // Get user for personalization if available
    let userId = null
    if (accessToken) {
      const { data: { user } } = await supabase.auth.getUser(accessToken)
      userId = user?.id
    }
    
    // Enhanced lesson data with vocabulary integration
    const lessonsByDeck = {
      'chennai-cafe': [{
        id: 'cafe-lesson-1',
        deckId: 'chennai-cafe',
        title: 'Chennai Café Essentials',
        content_type: 'vocabulary_dialogue',
        duration_sec: 180,
        cefr_level: 'A1',
        vocabList: vocabularyData['business-hindi'].slice(0, 4).map(v => ({
          vocab_id: v.vocab_id,
          word: v.word,
          translation: v.translation,
          pronunciation: v.pronunciation,
          part_of_speech: v.part_of_speech,
          sample_sentence: v.sample_sentence,
          difficulty_score: v.difficulty_score,
          audio_url: null // Would be real audio in production
        })),
        dialogue: dialogueData['chennai-cafe'],
        learning_objectives: [
          'Greet people professionally in Hindi',
          'Order food and beverages',
          'Handle basic transactions',
          'Use polite expressions'
        ],
        cultural_notes: 'In Chennai, English and Tamil are widely spoken, but Hindi is appreciated in business contexts.'
      }],
      'office-meetings': [{
        id: 'office-lesson-1',
        deckId: 'office-meetings',
        title: 'Professional Meeting Vocabulary',
        content_type: 'vocabulary',
        duration_sec: 200,
        cefr_level: 'A2',
        vocabList: vocabularyData['business-hindi'].slice(2, 4).map(v => ({
          vocab_id: v.vocab_id,
          word: v.word,
          translation: v.translation,
          pronunciation: v.pronunciation,
          part_of_speech: v.part_of_speech,
          sample_sentence: v.sample_sentence,
          difficulty_score: v.difficulty_score,
          audio_url: null
        })),
        dialogue: null,
        learning_objectives: [
          'Schedule and discuss meetings',
          'Present ideas professionally',
          'Ask clarifying questions'
        ]
      }],
      'airport-basics': [{
        id: 'airport-lesson-1',
        deckId: 'airport-basics',
        title: 'Airport Navigation',
        content_type: 'vocabulary_dialogue',
        duration_sec: 160,
        cefr_level: 'A1',
        vocabList: vocabularyData['travel-spanish'].map(v => ({
          vocab_id: v.vocab_id,
          word: v.word,
          translation: v.translation,
          pronunciation: v.pronunciation,
          part_of_speech: v.part_of_speech,
          sample_sentence: v.sample_sentence,
          difficulty_score: v.difficulty_score,
          audio_url: null
        })),
        dialogue: {
          dialogue_id: 'airport_001',
          title: 'Finding Your Gate',
          situation: 'Lost at the airport',
          lines: [
            { speaker: 'Traveler', text: '¿Dónde está la puerta 15?', translation: 'Where is gate 15?' },
            { speaker: 'Staff', text: 'Al final del pasillo, a la derecha.', translation: 'At the end of the hallway, on the right.' }
          ]
        },
        learning_objectives: [
          'Navigate airport facilities',
          'Ask for directions',
          'Understand basic travel vocabulary'
        ]
      }],
      'code-review': [{
        id: 'code-lesson-1',
        deckId: 'code-review',
        title: 'Development Workflow Terms',
        content_type: 'vocabulary',
        duration_sec: 220,
        cefr_level: 'B2',
        vocabList: vocabularyData['tech-english'].map(v => ({
          vocab_id: v.vocab_id,
          word: v.word,
          translation: v.translation,
          pronunciation: v.pronunciation,
          part_of_speech: v.part_of_speech,
          sample_sentence: v.sample_sentence,
          difficulty_score: v.difficulty_score,
          audio_url: null
        })),
        dialogue: null,
        learning_objectives: [
          'Understand software development terminology',
          'Communicate technical issues',
          'Participate in code reviews'
        ]
      }]
    }
    
    let lessons = lessonsByDeck[deckId] || []
    
    // Personalize lesson order if user is authenticated
    if (userId) {
      const userFlashcards = await kv.get(`user:${userId}:flashcards`) || '[]'
      const flashcards = JSON.parse(userFlashcards)
      
      // Prioritize lessons with due flashcards
      lessons = lessons.map(lesson => {
        const dueCards = lesson.vocabList.filter(vocab => {
          const card = flashcards.find(f => f.vocab_id === vocab.vocab_id)
          return card && new Date(card.due_date) <= new Date()
        })
        
        return {
          ...lesson,
          due_flashcards: dueCards.length,
          recommended: dueCards.length > 0
        }
      }).sort((a, b) => b.due_flashcards - a.due_flashcards)
    }
    
    return c.json({ lessons })
  } catch (error) {
    console.log('Get lessons error:', error)
    return c.json({ error: 'Failed to get lessons' }, 500)
  }
})

// Notifications and AI recommendations
app.post('/make-server-99270936/notifications/schedule', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1]
    const { data: { user }, error } = await supabase.auth.getUser(accessToken)
    
    if (!user?.id) {
      return c.json({ error: 'Unauthorized' }, 401)
    }
    
    const { type, message, scheduledFor } = await c.req.json()
    const userId = user.id
    const notificationId = `${userId}_${Date.now()}`
    
    const notification = {
      notification_id: notificationId,
      user_id: userId,
      type,
      message,
      scheduled_for: scheduledFor,
      status: 'pending',
      created_at: new Date().toISOString()
    }
    
    await kv.set(`notification:${notificationId}`, JSON.stringify(notification))
    
    return c.json({ success: true, notificationId })
  } catch (error) {
    console.log('Schedule notification error:', error)
    return c.json({ error: 'Failed to schedule notification' }, 500)
  }
})

app.get('/make-server-99270936/ai/recommendations', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1]
    const { data: { user }, error } = await supabase.auth.getUser(accessToken)
    
    if (!user?.id) {
      return c.json({ error: 'Unauthorized' }, 401)
    }
    
    const userId = user.id
    
    // Get user's learning data
    const flashcardsData = await kv.get(`user:${userId}:flashcards`) || '[]'
    const flashcards = JSON.parse(flashcardsData)
    
    const profileData = await kv.get(`user:${userId}:profile`)
    const profile = profileData ? JSON.parse(profileData) : {}
    
    // Analyze learning patterns
    const weakAreas = flashcards
      .filter(f => f.lapses > 2 || f.average_response_time > 5000)
      .sort((a, b) => (b.lapses + b.average_response_time/1000) - (a.lapses + a.average_response_time/1000))
      .slice(0, 5)
    
    const strongAreas = flashcards
      .filter(f => f.state === 'review' && f.stability > 10 && f.lapses === 0)
      .slice(0, 5)
    
    // Generate AI-like recommendations
    const recommendations = {
      studyPlan: {
        focusAreas: weakAreas.map(f => f.vocab_id),
        suggestedDuration: Math.min(15, Math.max(5, Math.ceil(weakAreas.length * 2))),
        difficulty: profile.current_streak > 7 ? 'increase' : 'maintain',
        nextCefrTarget: profile.cefr_level === 'A1' ? 'A2' : 
                      profile.cefr_level === 'A2' ? 'B1' : 'B2'
      },
      personalizedContent: {
        reviewFirst: weakAreas.slice(0, 3).map(f => f.vocab_id),
        skipToday: strongAreas.slice(0, 2).map(f => f.vocab_id),
        newWordsLimit: profile.current_streak > 5 ? 25 : 15
      },
      motivationalInsights: [
        `You've learned ${profile.total_words_learned || 0} words so far!`,
        profile.current_streak > 0 ? 
          `Keep your ${profile.current_streak}-day streak going!` : 
          'Start a new learning streak today!',
        weakAreas.length > 0 ? 
          `Focus on these challenging words to boost your progress.` :
          'Great job! You\'re mastering your vocabulary consistently.'
      ]
    }
    
    return c.json({ recommendations })
  } catch (error) {
    console.log('Get AI recommendations error:', error)
    return c.json({ error: 'Failed to get recommendations' }, 500)
  }
})

app.post('/make-server-99270936/accessibility/update', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1]
    const { data: { user }, error } = await supabase.auth.getUser(accessToken)
    
    if (!user?.id) {
      return c.json({ error: 'Unauthorized' }, 401)
    }
    
    const { settings } = await c.req.json()
    const userId = user.id
    
    const profileData = await kv.get(`user:${userId}:profile`)
    let profile = profileData ? JSON.parse(profileData) : {}
    
    profile.accessibility_settings = {
      ...profile.accessibility_settings,
      ...settings
    }
    
    await kv.set(`user:${userId}:profile`, JSON.stringify(profile))
    
    return c.json({ success: true })
  } catch (error) {
    console.log('Update accessibility error:', error)
    return c.json({ error: 'Failed to update accessibility settings' }, 500)
  }
})

app.post('/make-server-99270936/privacy/consent', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1]
    const { data: { user }, error } = await supabase.auth.getUser(accessToken)
    
    if (!user?.id) {
      return c.json({ error: 'Unauthorized' }, 401)
    }
    
    const { consent } = await c.req.json()
    const userId = user.id
    
    const profileData = await kv.get(`user:${userId}:profile`)
    let profile = profileData ? JSON.parse(profileData) : {}
    
    profile.privacy_consent = {
      ...profile.privacy_consent,
      ...consent,
      updated_at: new Date().toISOString()
    }
    
    await kv.set(`user:${userId}:profile`, JSON.stringify(profile))
    
    return c.json({ success: true })
  } catch (error) {
    console.log('Update privacy consent error:', error)
    return c.json({ error: 'Failed to update privacy consent' }, 500)
  }
})

app.delete('/make-server-99270936/user/data', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1]
    const { data: { user }, error } = await supabase.auth.getUser(accessToken)
    
    if (!user?.id) {
      return c.json({ error: 'Unauthorized' }, 401)
    }
    
    const userId = user.id
    
    // Delete all user data (GDPR compliance)
    const keysToDelete = [
      `user:${userId}:profile`,
      `user:${userId}:flashcards`,
      ...await kv.getByPrefix(`user:${userId}:lesson:`),
      ...await kv.getByPrefix(`review:${userId}:`),
      ...await kv.getByPrefix(`notification:${userId}`)
    ]
    
    await kv.mdel(keysToDelete)
    
    // Note: In production, would also delete from Supabase Auth
    return c.json({ success: true, message: 'All user data deleted' })
  } catch (error) {
    console.log('Delete user data error:', error)
    return c.json({ error: 'Failed to delete user data' }, 500)
  }
})

Deno.serve(app.fetch)