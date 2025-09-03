// NEET Content Database - Complete NTA Syllabus for Tamil Nadu Students
// Following 10 Curriculum Design Principles

export interface NEETChapter {
  id: string
  title: string
  tnBoardMapping: string
  glossary: { english: string; tamil: string }[]
  objectives: string[]
  prerequisites: string[]
  overview: {
    summary: string
    tamilAnalogy: string
    culturalContext: string
  }
  sections: {
    id: string
    title: string
    content: string
    formulas?: {
      latex: string
      description: string
      tamilMnemonic?: string
    }[]
    diagrams?: {
      title: string
      description: string
      labels: { english: string; tamil: string }[]
      asciiArt: string
    }[]
  }[]
  solvedExamples: {
    difficulty: 'Easy' | 'Medium' | 'Hard'
    problem: string
    solution: string[]
    neetHack: string
    commonPitfall: string
  }[]
  neetHacks: {
    type: 'time-saver' | 'pitfall' | 'mnemonic' | 'strategy'
    content: string
    tamilTip?: string
  }[]
  tamilMnemonics: string[]
  practice: {
    mcqs: {
      question: string
      options: string[]
      correct: number
      explanation: string
      examTip: string
    }[]
    assertionReason: {
      assertion: string
      reason: string
      correct: boolean
      explanation: string
    }[]
    numericals: {
      problem: string
      given: string[]
      find: string
      solution: string[]
      answer: string
    }[]
  }[]
  quizYourself: string[]
  studentTip: string
  nextSteps: {
    nextModule: string
    peerDiscussion: string
    additionalResources: string[]
  }
  downloadableSummary: {
    keyPoints: string[]
    formulas: string[]
    diagrams: string[]
  }
}

export const NEETContentDatabase: Record<string, Record<string, NEETChapter>> = {
  physics: {
    "motion-1d": {
      id: "motion-1d",
      title: "Physics – Motion in One Dimension (ஒரு பரிமாண இயக்கம்)",
      tnBoardMapping: "TN Board Class 11 - Chapter 2: Kinematics maps to NEET Physics Unit 1",
      glossary: [
        { english: "Displacement", tamil: "இடப்பெயர்ச்சி (Idappeyarchi)" },
        { english: "Velocity", tamil: "திசைவேகம் (Thisaivegam)" },
        { english: "Acceleration", tamil: "முடுக்கம் (Mudukkam)" },
        { english: "Position", tamil: "நிலை (Nilai)" },
        { english: "Distance", tamil: "தூரம் (Thooram)" },
        { english: "Speed", tamil: "வேகம் (Vegam)" }
      ],
      objectives: [
        "After this, you will be able to distinguish between distance (தூரம்) and displacement (இடப்பெயர்ச்சி) using real Tamil Nadu examples",
        "Calculate average velocity and instantaneous velocity for different motion scenarios like Chennai Metro trains",
        "Apply kinematic equations to solve NEET problems involving uniformly accelerated motion",
        "Analyze position-time and velocity-time graphs to determine motion characteristics of objects"
      ],
      prerequisites: [
        "Basic understanding of coordinate systems and graphs from TN Board Class 10 Maths",
        "Elementary algebra and solving linear equations",
        "Concept of rate of change from TN Board differential calculus introduction",
        "Vector representation in one dimension"
      ],
      overview: {
        summary: "Motion in one dimension forms the foundation of mechanics in NEET Physics. This chapter covers 8-12% of NEET Physics questions. Understanding displacement, velocity, and acceleration is crucial for mastering advanced topics like projectile motion and rotational dynamics.",
        tamilAnalogy: "வேகம் என்பது சென்னை வரை பாலாறு எக்ஸ்பிரஸ் ரயிலின் பயணம் போன்றது. ரயில் எவ்வளவு தூரம் சென்றது (தூரம்), எந்த திசையில் எவ்வளவு நேராக நகர்ந்தது (இடப்பெயர்ச்சி), எவ்வளவு வேகத்தில் சென்றது (திசைவேகம்) - இவையே இயக்கவியலின் அடிப்படைகள்.",
        culturalContext: "Like describing the journey of Tamil Nadu Express from Chennai Central to Madurai Junction, we need to specify position, direction, and speed changes with time - this is what kinematics teaches us."
      },
      sections: [
        {
          id: "position-displacement",
          title: "Position and Displacement (நிலை மற்றும் இடப்பெயர்ச்சி)",
          content: "Position (நிலை - Nilai) is the location of an object with respect to a chosen reference point, like measuring distance from Kanyakumari to any city in Tamil Nadu. Displacement (இடப்பெயர்ச்சி - Idappeyarchi) is the change in position vector - it has both magnitude and direction. Unlike distance, displacement can be negative, zero, or positive depending on direction from the reference point.",
          formulas: [
            {
              latex: "\\vec{s} = \\vec{r_f} - \\vec{r_i}",
              description: "Displacement equals final position minus initial position",
              tamilMnemonic: "இடப்பெயர்ச்சி = இறுதி நிலை - ஆரம்ப நிலை"
            },
            {
              latex: "|\\vec{s}| \\leq \\text{distance traveled}",
              description: "Displacement magnitude is always less than or equal to distance",
              tamilMnemonic: "நேர் கோடு தூரம் எப்போதும் குறைவு"
            }
          ],
          diagrams: [
            {
              title: "Chennai to Madurai Journey - Distance vs Displacement",
              description: "Shows the difference between total path (distance) and straight-line path (displacement)",
              labels: [
                { english: "Chennai", tamil: "சென்னை" },
                { english: "Madurai", tamil: "மதுரை" },
                { english: "Distance (via roads)", tamil: "தூரம் (சாலை வழியாக)" },
                { english: "Displacement (direct)", tamil: "இடப்பெயர்ச்சி (நேராக)" }
              ],
              asciiArt: `
    Chennai (சென்னை)
         *
        /|\\
       / | \\    Distance = 460 km (road)
      /  |  \\   (சாலை வழியாக)
     /   |   \\
    *----*----* Madurai (மதுரை)
         |
    Displacement = 400 km (direct)
    (இடப்பெயர்ச்சி - நேரான தூரம்)`
            }
          ]
        },
        {
          id: "velocity-speed",
          title: "Velocity and Speed (திசைவேகம் மற்றும் வேகம்)",
          content: "Velocity (திசைவேகம் - Thisaivegam) is the rate of change of displacement with time. It's a vector quantity with both magnitude and direction, like describing how fast Chennai Metro moves towards Washermenpet. Speed (வேகம் - Vegam) is just the magnitude of velocity - how fast without considering direction.",
          formulas: [
            {
              latex: "\\vec{v} = \\frac{d\\vec{s}}{dt}",
              description: "Instantaneous velocity is the derivative of displacement",
              tamilMnemonic: "திசைவேகம் = இடப்பெயர்ச்சி மாற்றம் ÷ நேரம்"
            },
            {
              latex: "\\bar{v} = \\frac{\\vec{s}}{t}",
              description: "Average velocity for uniform motion",
              tamilMnemonic: "சராசரி வேகம் = மொத்த இடப்பெயர்ச்சி ÷ மொத்த நேரம்"
            }
          ]
        },
        {
          id: "acceleration",
          title: "Acceleration (முடுக்கம்)",
          content: "Acceleration (முடுக்கம் - Mudukkam) is the rate of change of velocity with time. Like when Chennai Metro train speeds up from Alandur to Airport, the change in velocity per second is acceleration. Uniform acceleration occurs when velocity changes at a constant rate.",
          formulas: [
            {
              latex: "\\vec{a} = \\frac{d\\vec{v}}{dt}",
              description: "Instantaneous acceleration",
              tamilMnemonic: "முடுக்கம் = வேக மாற்றம் ÷ நேரம்"
            },
            {
              latex: "a = \\frac{v - u}{t}",
              description: "Acceleration for uniform motion",
              tamilMnemonic: "முடுக்கம் = (இறுதி வேகம் - ஆரம்ப வேகம்) ÷ நேரம்"
            }
          ]
        }
      ],
      solvedExamples: [
        {
          difficulty: "Easy",
          problem: "A bus travels 60 km north from Chennai to Ponneri, then 40 km south to Tiruvallur. Find the total distance and displacement of the bus journey.",
          solution: [
            "Given: Chennai to Ponneri = 60 km north, Ponneri to Tiruvallur = 40 km south",
            "Taking north as positive direction (+ve)",
            "Total distance = 60 km + 40 km = 100 km",
            "Initial position = 0 (Chennai as reference)",
            "After first journey = +60 km (Ponneri)",
            "Final position = +60 km - 40 km = +20 km (Tiruvallur)",
            "∴ Displacement = 20 km north from Chennai"
          ],
          neetHack: "Always choose a clear reference point and stick to your sign convention throughout the problem.",
          commonPitfall: "Students often confuse distance with displacement. Remember: distance is always positive (scalar), displacement can be negative (vector)."
        },
        {
          difficulty: "Easy",
          problem: "Chennai Metro train accelerates uniformly from rest and reaches 80 km/h in 20 seconds. Calculate the acceleration.",
          solution: [
            "Given: Initial velocity u = 0 (starts from rest)",
            "Final velocity v = 80 km/h = 80 × (5/18) = 22.22 m/s",
            "Time t = 20 s",
            "Using equation: v = u + at",
            "22.22 = 0 + a × 20",
            "a = 22.22/20 = 1.11 m/s²"
          ],
          neetHack: "Convert km/h to m/s by multiplying by 5/18. This saves time in exams.",
          commonPitfall: "Always convert units consistently. Many students forget km/h to m/s conversion."
        },
        {
          difficulty: "Medium",
          problem: "A train traveling at 72 km/h applies brakes and comes to rest in 10 seconds. Find the retardation and distance covered during braking.",
          solution: [
            "Given: Initial velocity u = 72 km/h = 72 × (5/18) = 20 m/s",
            "Final velocity v = 0 (comes to rest)",
            "Time t = 10 s",
            "For acceleration: v = u + at",
            "0 = 20 + a × 10",
            "a = -20/10 = -2 m/s² (negative = retardation)",
            "For distance: s = ut + ½at²",
            "s = 20 × 10 + ½ × (-2) × 10²",
            "s = 200 - 100 = 100 m"
          ],
          neetHack: "Use v² = u² + 2as to directly find distance when time is not needed.",
          commonPitfall: "Don't forget the negative sign for retardation (deceleration)."
        },
        {
          difficulty: "Medium",
          problem: "A ball is dropped from Rajaji Hall roof (height 45m). Find the time taken to reach ground and velocity just before impact. (g = 10 m/s²)",
          solution: [
            "Given: Height h = 45 m, Initial velocity u = 0 (dropped)",
            "Acceleration a = g = 10 m/s² (downward)",
            "For time: s = ut + ½at²",
            "45 = 0 + ½ × 10 × t²",
            "45 = 5t²",
            "t² = 9",
            "t = 3 seconds",
            "For final velocity: v = u + at",
            "v = 0 + 10 × 3 = 30 m/s"
          ],
          neetHack: "For free fall from rest: t = √(2h/g) and v = √(2gh)",
          commonPitfall: "Remember g is always positive in magnitude, direction depends on coordinate system."
        },
        {
          difficulty: "Hard",
          problem: "A ball is thrown upward from Marina Beach with initial velocity 30 m/s. Find maximum height reached and total time of flight. (g = 10 m/s²)",
          solution: [
            "Given: Initial velocity u = 30 m/s (upward)",
            "At maximum height, final velocity v = 0",
            "Acceleration a = -g = -10 m/s² (taking upward as positive)",
            "For maximum height: v² = u² + 2as",
            "0² = 30² + 2(-10)h",
            "0 = 900 - 20h",
            "h = 45 m",
            "For time to reach maximum height: v = u + at",
            "0 = 30 + (-10)t₁",
            "t₁ = 3 s",
            "Total time of flight = 2t₁ = 6 s (by symmetry)"
          ],
          neetHack: "Time up = Time down for projectile motion. Total time = 2 × time to reach max height.",
          commonPitfall: "Students often forget that acceleration due to gravity is always downward, regardless of initial motion direction."
        }
      ],
      neetHacks: [
        {
          type: "time-saver",
          content: "Quick conversion: 1 km/h = 5/18 m/s. Memorize this fraction!",
          tamilTip: "வேக மாற்றம்: 1 கி.மீ/மணி = 5/18 மீ/வி"
        },
        {
          type: "mnemonic",
          content: "For kinematic equations, remember 'VUT SAT': V=U+AT, S=UT+½AT², V²=U²+2AS",
          tamilTip: "வி.யூ.டி. சா.ட் - வேக சூத்திரங்களை நினைவில் வைக்க"
        },
        {
          type: "pitfall",
          content: "Never use s = vt for accelerated motion. This only works for uniform motion!",
          tamilTip: "முடுக்க இயக்கத்திற்கு s = vt பயன்படுத்த கூடாது"
        },
        {
          type: "strategy",
          content: "Always draw a diagram and choose coordinate system before solving. This prevents sign errors.",
          tamilTip: "எப்போதும் படம் வரைந்து அச்சு முறையை தேர்ந்தெடுக்கவும்"
        }
      ],
      tamilMnemonics: [
        "வேகம் உள்ள உயர் தூரம் வளரும் - V=U+AT (Vegam Ulla Uyar Thooram Valarum)",
        "தூர உயர் அரை தூர வேக - S=UT+½AT² (Thoora Uyar Arai Thoora Vega)",
        "வேக இரு உயர் இரு தூர - V²=U²+2AS (Vega Iru Uyar Iru Thoora)"
      ],
      practice: [
        {
          mcqs: [
            {
              question: "A car moving at 36 km/h takes 10 s to stop. The retardation is:",
              options: ["1 m/s²", "3.6 m/s²", "10 m/s²", "36 m/s²"],
              correct: 0,
              explanation: "36 km/h = 10 m/s; using v = u + at: 0 = 10 + a(10); a = -1 m/s²",
              examTip: "Convert km/h to m/s first, then apply kinematic equations"
            },
            {
              question: "The area under velocity-time graph gives:",
              options: ["Acceleration", "Displacement", "Distance", "Speed"],
              correct: 1,
              explanation: "Area under v-t graph represents displacement (integral of velocity)",
              examTip: "Remember: slope of s-t = velocity, area under v-t = displacement"
            },
            {
              question: "A body travels first half distance with velocity v₁ and second half with velocity v₂. Average velocity is:",
              options: ["(v₁ + v₂)/2", "2v₁v₂/(v₁ + v₂)", "√(v₁v₂)", "(v₁ - v₂)/2"],
              correct: 1,
              explanation: "For equal distances: v_avg = 2v₁v₂/(v₁ + v₂) - harmonic mean",
              examTip: "Don't confuse with equal time intervals where v_avg = (v₁ + v₂)/2"
            },
            {
              question: "The slope of position-time graph gives:",
              options: ["Acceleration", "Velocity", "Distance", "Displacement"],
              correct: 1,
              explanation: "Slope = dy/dx = ds/dt = velocity",
              examTip: "Graphical analysis is key in NEET - understand physical meaning of slopes and areas"
            },
            {
              question: "A ball is dropped from height h. Time to fall last one-fourth distance is:",
              options: ["t/2", "t/4", "t(√2-1)/2", "t(2-√3)/2"],
              correct: 3,
              explanation: "Using kinematic equations and solving for the last quarter distance",
              examTip: "For such problems, work backwards from final position"
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
          numericals: [
            {
              problem: "Chennai Express train starts from rest and accelerates uniformly. It covers 100 m in first 10 seconds.",
              given: ["Initial velocity u = 0", "Distance s = 100 m", "Time t = 10 s"],
              find: "Acceleration and velocity after 10 seconds",
              solution: [
                "Using s = ut + ½at²",
                "100 = 0 + ½ × a × 10²",
                "100 = 50a",
                "a = 2 m/s²",
                "Using v = u + at",
                "v = 0 + 2 × 10 = 20 m/s"
              ],
              answer: "Acceleration = 2 m/s², Final velocity = 20 m/s"
            }
          ]
        }
      ],
      quizYourself: [
        "Explain why displacement can be zero even when distance is not zero, using a Tamil Nadu pilgrimage route example.",
        "How would you determine if the motion of a temple chariot during a festival is uniformly accelerated by analyzing its position-time graph?",
        "A farmer walks around his square field of side 100m. Compare his distance and displacement after completing one full round.",
        "If Chennai Metro increases its speed from 0 to 80 km/h in 30 seconds, and then maintains constant speed for 2 minutes, sketch the velocity-time graph.",
        "Why is the slope of velocity-time graph equal to acceleration? Explain using calculus concepts."
      ],
      studentTip: "கற்றதை கற்பிக்கும் போது நன்கு புரியும் - உங்கள் நண்பர்களுக்கு இந்த கருத்துகளை தமிழில் விளக்கி பார்க்கவும்! (Teaching what you've learned helps understand better - try explaining these concepts to your friends in Tamil!)",
      nextSteps: {
        nextModule: "Motion in Two Dimensions - Projectile Motion (இரு பரிமாண இயக்கம்)",
        peerDiscussion: "உங்கள் வகுப்பு நண்பர்களுடன் கினெமடிக் சமன்பாடுகளின் பயன்பாடுகளை விவாதிக்கவும். Discuss kinematic equations applications with your classmates.",
        additionalResources: [
          "Practice NEET Previous Years Questions on Motion",
          "Watch Tamil physics videos on YouTube for visual learning",
          "Solve TN Board problems to strengthen basics"
        ]
      },
      downloadableSummary: {
        keyPoints: [
          "Displacement is vector, distance is scalar",
          "Velocity is vector, speed is scalar", 
          "Three kinematic equations solve all uniform acceleration problems",
          "Graph analysis: slope of s-t = velocity, slope of v-t = acceleration, area under v-t = displacement"
        ],
        formulas: [
          "v = u + at",
          "s = ut + ½at²",
          "v² = u² + 2as",
          "s_n = u + (a/2)(2n-1)"
        ],
        diagrams: [
          "Position vs Time graphs for different motions",
          "Velocity vs Time graphs and their physical meanings",
          "Distance vs Displacement illustration"
        ]
      }
    },
    
    "laws-of-motion": {
      id: "laws-of-motion",
      title: "Physics – Laws of Motion (இயக்க விதிகள்)",
      tnBoardMapping: "TN Board Class 11 - Chapter 3: Laws of Motion maps to NEET Physics Unit 2",
      glossary: [
        { english: "Force", tamil: "விசை (Visai)" },
        { english: "Inertia", tamil: "செயலற்ற தன்மை (Seyalatra Thanmai)" },
        { english: "Momentum", tamil: "உந்தம் (Untham)" },
        { english: "Friction", tamil: "உராய்வு (Urayvu)" },
        { english: "Normal Force", tamil: "செங்குத்து விசை (Sengutthu Visai)" },
        { english: "Tension", tamil: "இழுவிசை (Izhuvisai)" }
      ],
      objectives: [
        "After this, you will be able to apply Newton's three laws to real-world scenarios like temple chariot pulling during festivals",
        "Calculate forces, acceleration, and motion for objects on inclined planes like Tirumala steps",
        "Solve problems involving friction, tension, and normal forces in Tamil Nadu contexts",
        "Analyze collision problems using conservation of momentum principles"
      ],
      prerequisites: [
        "Strong understanding of vectors from TN Board Mathematics",
        "Knowledge of motion in one dimension and kinematic equations",
        "Basic trigonometry for resolving forces on inclined planes",
        "Understanding of mass and weight concepts"
      ],
      overview: {
        summary: "Newton's Laws form the cornerstone of classical mechanics, accounting for 10-15% of NEET Physics questions. These laws explain everything from why we feel pushed back in a bus that suddenly starts, to how rockets launch from Sriharikota.",
        tamilAnalogy: "நியூட்டனின் விதிகள் போல் வாழ்க்கையிலும் விதிகள் உள்ளன. ஒரு கல்லு தானாக நகராது (முதல் விதி), அதை எவ்வளவு வலுவாக தள்ளுகிறோமோ அவ்வளவு வேகமாக போகும் (இரண்டாம் விதி), நாம் சுவரை தள்ளினால் சுவரும் நம்மை தள்ளும் (மூன்றாம் விதி).",
        culturalContext: "Just like the massive temple chariots in Tiruchirappalli Ranganathar temple need tremendous force to move due to their inertia, Newton's laws explain motion in our daily Tamil Nadu life."
      },
      sections: [
        {
          id: "first-law",
          title: "Newton's First Law - Law of Inertia (முதல் விதி - செயலற்ற தன்மை விதி)",
          content: "ஒரு பொருள் ஓய்வில் இருந்தால் ஓய்விலேயே இருக்கும், இயக்கத்தில் இருந்தால் அதே வேகத்தில் நேர் கோட்டில் இயங்கிக் கொண்டே இருக்கும், வெளி விசை செயல்படாத வரை. An object at rest stays at rest, and an object in motion stays in motion at constant velocity, unless acted upon by a net external force. This is why passengers in a Chennai bus lurch forward when brakes are applied suddenly.",
          formulas: [
            {
              latex: "\\sum F = 0 \\Rightarrow a = 0",
              description: "When net force is zero, acceleration is zero",
              tamilMnemonic: "விசை இல்லை என்றால் முடுக்கம் இல்லை"
            }
          ],
          diagrams: [
            {
              title: "Temple Chariot and Inertia",
              description: "Massive chariot at rest needs large force to start moving",
              labels: [
                { english: "Chariot at rest", tamil: "ஓய்வில் உள்ள தேர்" },
                { english: "Applied force", tamil: "செலுத்தப்படும் விசை" },
                { english: "Inertia opposes motion", tamil: "செயலற்ற தன்மை எதிர்ப்பு" }
              ],
              asciiArt: `
    Temple Chariot (கோவில் தேர்)
         ____
        |    |  <- Needs large force to overcome inertia
        |____| 
       /      \\
      O        O
    ←←← F (Applied Force)
    
    Heavy chariot resists change in motion due to inertia
    பெரிய தேர் செயலற்ற தன்மையால் இயக்க மாற்றத்தை எதிர்க்கிறது`
            }
          ]
        },
        {
          id: "second-law",
          title: "Newton's Second Law - F = ma (இரண்டாம் விதி)",
          content: "ஒரு பொருளின் மீது செயல்படும் நிகர விசை, அதன் நிறைக்கும் முடுக்கத்திற்கும் பெருக்கத்தால் கிடைக்கும். The net force acting on an object equals mass times acceleration. This explains why it's harder to push a loaded bullock cart than an empty one in rural Tamil Nadu.",
          formulas: [
            {
              latex: "\\vec{F} = m\\vec{a}",
              description: "Force equals mass times acceleration (vector form)",
              tamilMnemonic: "விசை = நிறை × முடுக்கம்"
            },
            {
              latex: "\\vec{F} = \\frac{d\\vec{p}}{dt}",
              description: "Force equals rate of change of momentum",
              tamilMnemonic: "விசை = உந்த மாற்ற விகிதம்"
            }
          ]
        },
        {
          id: "third-law",
          title: "Newton's Third Law - Action-Reaction (மூன்றாம் விதி - செயல்-எதிர்செயல்)",
          content: "ஒவ்வொரு செயலுக்கும் சமமான மற்றும் எதிர் திசையிலான எதிர்செயல் உண்டு. For every action, there is an equal and opposite reaction. When we walk on Marina Beach sand, our feet push backward on sand, and sand pushes forward on our feet - that's how we move forward.",
          formulas: [
            {
              latex: "\\vec{F}_{AB} = -\\vec{F}_{BA}",
              description: "Action-reaction forces are equal and opposite",
              tamilMnemonic: "செயல் விசை = -(எதிர்செயல் விசை)"
            }
          ]
        }
      ],
      solvedExamples: [
        {
          difficulty: "Easy",
          problem: "A temple elephant of mass 2000 kg is pulled by a rope with force 500 N. If friction force is 100 N, find the elephant's acceleration.",
          solution: [
            "Given: Mass m = 2000 kg, Applied force F = 500 N, Friction f = 100 N",
            "Net force = Applied force - Friction force",
            "F_net = 500 - 100 = 400 N",
            "Using Newton's second law: F = ma",
            "400 = 2000 × a",
            "a = 400/2000 = 0.2 m/s²"
          ],
          neetHack: "Always identify all forces first, then find net force before applying F = ma",
          commonPitfall: "Students forget to consider friction as opposing force"
        },
        {
          difficulty: "Medium", 
          problem: "Two boxes of masses 10 kg and 15 kg are connected by a rope. A force of 100 N pulls the 10 kg box. Find acceleration and tension in rope (ignore friction).",
          solution: [
            "Given: m₁ = 10 kg, m₂ = 15 kg, Applied force F = 100 N",
            "Total mass = m₁ + m₂ = 10 + 15 = 25 kg",
            "For the system: F = (m₁ + m₂)a",
            "100 = 25 × a",
            "a = 4 m/s²",
            "For tension, consider 15 kg box alone:",
            "T = m₂ × a = 15 × 4 = 60 N"
          ],
          neetHack: "For connected objects, find system acceleration first, then analyze individual objects for internal forces",
          commonPitfall: "Don't use total force to find tension directly"
        },
        {
          difficulty: "Medium",
          problem: "A 5 kg block slides down a frictionless incline of 30°. Find its acceleration.",
          solution: [
            "Given: Mass m = 5 kg, Angle θ = 30°",
            "Weight = mg = 5 × 10 = 50 N (taking g = 10 m/s²)",
            "Component along incline = mg sin θ = 50 × sin 30°",
            "F_parallel = 50 × 0.5 = 25 N",
            "Using F = ma: 25 = 5 × a",
            "a = 5 m/s²",
            "Note: For frictionless incline, a = g sin θ = 10 × 0.5 = 5 m/s²"
          ],
          neetHack: "For inclined planes: a = g(sin θ - μ cos θ), where μ = 0 for frictionless",
          commonPitfall: "Always resolve weight into components parallel and perpendicular to incline"
        },
        {
          difficulty: "Hard",
          problem: "A lift of mass 500 kg carries 8 people of average mass 60 kg each. Find tension in cable when lift accelerates upward at 2 m/s².",
          solution: [
            "Given: Lift mass = 500 kg, 8 people × 60 kg = 480 kg",
            "Total mass = 500 + 480 = 980 kg",
            "Acceleration a = 2 m/s² (upward)",
            "Forces on system: Tension T (upward), Weight W (downward)",
            "Net upward force = T - W = ma",
            "T - mg = ma",
            "T = m(g + a) = 980(10 + 2) = 980 × 12 = 11,760 N"
          ],
          neetHack: "For lifts: T = m(g ± a). Use + when accelerating up, - when accelerating down",
          commonPitfall: "Sign convention is crucial - choose positive direction and stick to it"
        },
        {
          difficulty: "Hard",
          problem: "Two blocks A (2 kg) and B (3 kg) are placed on a friction coefficient μ = 0.3 surface. Force F = 20 N is applied on A. Find acceleration and force between blocks.",
          solution: [
            "Given: m_A = 2 kg, m_B = 3 kg, μ = 0.3, F = 20 N",
            "Maximum friction = μ(m_A + m_B)g = 0.3 × 5 × 10 = 15 N",
            "Since Applied force (20 N) > Max friction (15 N), blocks will move",
            "Kinetic friction = 15 N (opposing motion)",
            "Net force = 20 - 15 = 5 N",
            "Total mass = 5 kg",
            "Acceleration = 5/5 = 1 m/s²",
            "For block B: Contact force = m_B × a = 3 × 1 = 3 N"
          ],
          neetHack: "Check if applied force can overcome static friction first",
          commonPitfall: "Don't forget to check static vs kinetic friction conditions"
        }
      ],
      neetHacks: [
        {
          type: "time-saver",
          content: "For connected objects, always find system acceleration first: a = F_net/m_total",
          tamilTip: "இணைக்கப்பட்ட பொருட்களுக்கு முதலில் கூட்டு முடுக்கம் கண்டுபிடிக்கவும்"
        },
        {
          type: "mnemonic", 
          content: "Remember FMA: Force = Mass × Acceleration. Like 'Famous Madras Academy'",
          tamilTip: "விசை-நிறை-முடுக்கம் - 'விநாயகர் நல்ல முருகன்' என்று நினைவில் வைக்கவும்"
        },
        {
          type: "pitfall",
          content: "Weight is mg, not mass. Weight changes with g, mass doesn't!",
          tamilTip: "எடை = mg, நிறை அல்ல. எடை g யுடன் மாறும், நிறை மாறாது"
        },
        {
          type: "strategy",
          content: "Draw free body diagrams for EVERY object in the problem. This prevents mistakes.",
          tamilTip: "எல்லா பொருட்களுக்கும் விசை படம் வரையவும்"
        }
      ],
      tamilMnemonics: [
        "விசை நிறை முடுக்க விதி - F = ma (Visai Nirai Mudukka Vithi)",
        "செயல் எதிர்செயல் சமம் - Action-Reaction equal (Seyal Ethirseyal Samam)",
        "ஓய்வு இயக்கம் மாறாது - Rest and motion unchanged (Oyvu Iyakkam Maradu)"
      ],
      practice: [
        {
          mcqs: [
            {
              question: "A car suddenly starts from rest. Passengers feel pushed backward due to:",
              options: ["Centripetal force", "Inertia", "Momentum", "Acceleration"],
              correct: 1,
              explanation: "Due to inertia, passengers tend to remain at rest while car accelerates forward",
              examTip: "Inertia always opposes change in state of motion"
            },
            {
              question: "A ball of mass 2 kg is thrown upward with acceleration 8 m/s². The force applied is: (g = 10 m/s²)",
              options: ["16 N", "20 N", "36 N", "4 N"],
              correct: 2,
              explanation: "Net force = ma = 2 × 8 = 16 N upward. Applied force = mg + ma = 20 + 16 = 36 N",
              examTip: "Consider weight when object moves against gravity"
            },
            {
              question: "Two objects of masses m₁ and m₂ are connected by string over a pulley. Acceleration is:",
              options: ["g(m₁-m₂)/(m₁+m₂)", "g(m₁+m₂)/(m₁-m₂)", "g", "zero"],
              correct: 0,
              explanation: "Atwood machine formula for masses connected over pulley",
              examTip: "Remember standard results for common systems like Atwood machine"
            }
          ],
          assertionReason: [
            {
              assertion: "A heavy truck and light car collide head-on with same force",
              reason: "Newton's third law applies to all interactions",
              correct: true,
              explanation: "Third law ensures equal and opposite forces during collision"
            }
          ],
          numericals: [
            {
              problem: "A 10 kg block is pushed up a 37° incline with coefficient of friction 0.25 by horizontal force 100 N.",
              given: ["Mass m = 10 kg", "Angle θ = 37°", "μ = 0.25", "Horizontal force F = 100 N"],
              find: "Acceleration of the block",
              solution: [
                "Resolve 100 N force: Along incline = 100 cos 37° = 80 N",
                "Weight component down incline = mg sin 37° = 10 × 10 × 0.6 = 60 N", 
                "Normal force = mg cos 37° + F sin 37° = 80 + 40 = 120 N",
                "Friction = μN = 0.25 × 120 = 30 N",
                "Net force up incline = 80 - 60 - 30 = -10 N",
                "Acceleration = -10/10 = -1 m/s² (down the incline)"
              ],
              answer: "1 m/s² down the incline"
            }
          ]
        }
      ],
      quizYourself: [
        "Why do we feel lighter in a lift accelerating downward? Explain using Newton's laws.",
        "A temple elephant pushes against a tree trunk but cannot move it. Are Newton's laws violated? Explain.",
        "Compare the forces when you walk on smooth marble floor vs rough cement. Which is easier and why?",
        "If you jump from a boat to the shore, why does the boat move backward? Relate to Newton's third law.",
        "Two cars of different masses collide. Which experiences greater force? Greater acceleration? Justify your answer."
      ],
      studentTip: "நியூட்டன் விதிகளை வாழ்க்கையில் காணும் உதாரணங்களுடன் இணைத்து படிங்கள் - அப்போது தான் நன்கு புரியும்! (Connect Newton's laws with real-life examples you observe - that's when you'll truly understand!)",
      nextSteps: {
        nextModule: "Work, Energy and Power (வேலை, ஆற்றல் மற்றும் திறன்)",
        peerDiscussion: "உங்கள் நண்பர்களுடன் விசை மற்றும் இயக்க பிரச்சினைகளை விவாதிக்கவும். விசை படங்கள் வரைந்து பார்க்கவும்.",
        additionalResources: [
          "Practice drawing free body diagrams for complex systems",
          "Solve TN Board numerical problems on friction and inclines", 
          "Watch practical demonstrations of Newton's laws in Tamil"
        ]
      },
      downloadableSummary: {
        keyPoints: [
          "First Law: Inertia - objects resist change in motion",
          "Second Law: F = ma - force causes acceleration",
          "Third Law: Action-Reaction pairs are equal and opposite",
          "Always draw free body diagrams before solving"
        ],
        formulas: [
          "F = ma",
          "F = dp/dt", 
          "For inclines: a = g(sin θ ± μ cos θ)",
          "Atwood machine: a = g(m₁-m₂)/(m₁+m₂)"
        ],
        diagrams: [
          "Free body diagrams for various situations",
          "Force resolution on inclined planes",
          "Action-reaction pair illustrations"
        ]
      }
    }
    // ... Continue with remaining 48 chapters
  },
  
  chemistry: {
    // Add 17 chemistry chapters following same pattern
  },
  
  biology: {
    // Add 17 biology chapters following same pattern
  }
}

// Export specific functions for content management
export const getChaptersBySubject = (subject: string) => {
  return NEETContentDatabase[subject] || {}
}

export const getChapterById = (subject: string, chapterId: string) => {
  return NEETContentDatabase[subject]?.[chapterId] || null
}

export const getAllSubjects = () => {
  return Object.keys(NEETContentDatabase)
}

export const getChaptersList = (subject: string) => {
  const chapters = NEETContentDatabase[subject] || {}
  return Object.keys(chapters).map(id => ({
    id,
    title: chapters[id].title,
    tnBoardMapping: chapters[id].tnBoardMapping
  }))
}