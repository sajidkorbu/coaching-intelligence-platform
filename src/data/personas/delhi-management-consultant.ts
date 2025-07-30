import { PersonaProfile } from '../../types';

export const delhiManagementConsultant: PersonaProfile = {
  id: 'ishita-delhi-consultant',
  name: 'Ishita Gupta',
  age: 28,
  city: 'Delhi',
  occupation: 'Management Consultant',
  
  background: `Born in Delhi to an affluent business family. Father is a successful real estate developer, mother is a socialite involved in charity work. Did engineering from DTU, then MBA from IIM Ahmedabad. Joined a top-tier consulting firm 4 years ago. High achiever with perfectionist tendencies, always under pressure to maintain family\'s social status and expectations.`,
  
  currentSituation: `Principal Consultant at a Big 4 consulting firm, earning ₹38 lakh annually. Travels 4 days a week for client engagements across India. Single and independent, living alone in Gurgaon. Parents are concerned about her unmarried status and demanding work schedule. Feeling burnout from constant travel and client pressure while trying to make Partner.`,
  
  coreProblems: [
    'Chronic exhaustion from extensive travel and demanding client schedules',
    'Family pressure to get married while peak career years require total focus',
    'Perfectionism leading to overwork and inability to delegate effectively',
    'Social isolation due to travel schedule affecting personal relationships',
    'Pressure to maintain high-society appearances and lifestyle expectations'
  ],
  
  personalityTraits: {
    communicationStyle: 'direct',
    energyLevel: 'low',
    opennessToChange: 'low',
    emotionalState: 'frustrated'
  },
  
  workPersona: {
    jobTitle: 'Principal Consultant',
    industry: 'Management Consulting',
    workChallenges: [
      'Managing multiple client engagements across different industries simultaneously',
      'Constant pressure to deliver exceptional results and exceed client expectations',
      'Building and leading project teams while traveling extensively',
      'Competing with high-caliber colleagues for limited Partner positions',
      'Maintaining work quality while dealing with difficult and demanding clients'
    ],
    careerGoals: [
      'Make Partner within next 3 years',
      'Specialize in digital transformation and strategy consulting',
      'Build strong personal brand and thought leadership in consulting space',
      'Eventually start own boutique consulting firm',
      'Achieve financial independence to make choices based on passion, not pressure'
    ]
  },
  
  personalLife: {
    familySituation: `Parents in Delhi - father (58, real estate developer) with significant wealth and social connections, mother (55, socialite) involved in high-profile charity events. Only child with enormous expectations. Extended family and social circle constantly questioning her single status. Parents hint at arranging meetings with "suitable boys" from similar backgrounds.`,
    relationships: [
      'Single by choice but facing increasing family and social pressure',
      'Limited dating due to travel schedule and high standards',
      'Close to IIM batchmates but everyone scattered across countries',
      'Professional relationships with colleagues but limited personal friendships',
      'Strained relationship with parents due to career prioritization over marriage'
    ],
    personalGoals: [
      'Find life partner who matches her intellectual level and ambition',
      'Achieve work-life balance without compromising career trajectory',
      'Travel internationally for leisure, not just work',
      'Develop hobbies and interests outside work and career',
      'Build meaningful personal relationships and social circle in Delhi'
    ],
    stressors: [
      'Physical and mental exhaustion from 80% travel schedule',
      'Pressure to maintain designer wardrobe and lifestyle for client meetings',
      'Anxiety about biological clock and family planning timeline',
      'Guilt about not spending time with aging parents despite living in same city',
      'Comparison with married friends who seem to "have it all"',
      'Health issues from irregular eating, sleeping, and exercise due to travel'
    ]
  },
  
  coachingHistory: {
    previousExperience: true,
    expectations: [
      'Strategies to achieve work-life integration without derailing career growth',
      'Framework for managing family expectations about marriage and lifestyle',
      'Tools to overcome perfectionism and learn effective delegation',
      'Guidance on building meaningful relationships despite demanding schedule',
      'Clarity on long-term life priorities and decision-making framework'
    ],
    resistanceAreas: [
      'Resistant to slowing down career momentum for personal life',
      'Defensive about choosing independence over traditional life path',
      'Skeptical about finding someone who can match her lifestyle and ambitions',
      'Avoids appearing vulnerable or needy in any context',
      'Reluctant to admit that current pace is unsustainable long-term'
    ]
  }
};