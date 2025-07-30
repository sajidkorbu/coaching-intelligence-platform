import { supabase } from '../lib/supabase'
import { CoachingSession, CoachingReport } from '../types'

export class DatabaseService {
  
  async saveCoachingSession(
    session: CoachingSession, 
    report: CoachingReport,
    userId?: string
  ) {
    try {
      const { data, error } = await supabase
        .from('coaching_sessions')
        .insert({
          user_id: userId || null,
          persona_id: session.personaId,
          messages: session.messages,
          evaluation_report: report,
          session_duration: session.messages.length
        })
        .select()
        .single()

      if (error) {
        console.error('Supabase error:', error)
        throw error
      }

      // Save individual competency scores to user_progress
      if (data && report.coachPerformance) {
        await this.saveUserProgress(
          userId || 'anonymous',
          data.id,
          session.personaId,
          {
            activeListening: report.coachPerformance.activeListening.score,
            powerfulQuestioning: report.coachPerformance.powerfulQuestioning.score,
            rapportBuilding: report.coachPerformance.rapportBuilding.score,
            goalSetting: report.coachPerformance.goalSetting.score,
            breakthroughCreation: report.coachPerformance.breakthroughCreation.score,
            overallEffectiveness: report.coachPerformance.overallEffectiveness.score
          }
        )
      }

      return data
    } catch (error) {
      console.error('Failed to save coaching session:', error)
      throw error
    }
  }

  async getUserSessions(userId: string = 'anonymous', limit: number = 10) {
    try {
      const { data, error } = await supabase
        .from('coaching_sessions')
        .select('*')
        .eq('user_id', userId)
        .order('completed_at', { ascending: false })
        .limit(limit)

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Failed to get user sessions:', error)
      return []
    }
  }

  async getUserProgress(userId: string = 'anonymous') {
    try {
      const { data, error } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Failed to get user progress:', error)
      return []
    }
  }

  async saveUserProgress(
    userId: string,
    sessionId: string,
    personaId: string,
    competencies: Record<string, number>
  ) {
    try {
      const progressData = Object.entries(competencies).map(([competency, score]) => ({
        user_id: userId,
        session_id: sessionId,
        persona_id: personaId,
        competency,
        score: Math.round(score)
      }))

      const { data, error } = await supabase
        .from('user_progress')
        .insert(progressData)
        .select()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Failed to save user progress:', error)
      throw error
    }
  }

  async getPersonaStats(personaId: string) {
    try {
      const { data, error } = await supabase
        .from('coaching_sessions')
        .select('evaluation_report')
        .eq('persona_id', personaId)

      if (error) throw error
      
      if (!data || data.length === 0) {
        return {
          totalSessions: 0,
          averageScore: 0,
          competencyAverages: {}
        }
      }

      const reports = data.map(session => session.evaluation_report)
      const totalSessions = reports.length
      
      let totalScore = 0
      const competencyTotals: Record<string, number[]> = {}

      reports.forEach(report => {
        if (report?.coachPerformance) {
          totalScore += report.coachPerformance.overallEffectiveness.score

          Object.entries(report.coachPerformance).forEach(([key, value]: [string, any]) => {
            if (key !== 'overallEffectiveness' && value?.score) {
              if (!competencyTotals[key]) competencyTotals[key] = []
              competencyTotals[key].push(value.score)
            }
          })
        }
      })

      const averageScore = totalScore / totalSessions
      const competencyAverages: Record<string, number> = {}

      Object.entries(competencyTotals).forEach(([competency, scores]) => {
        competencyAverages[competency] = scores.reduce((a, b) => a + b, 0) / scores.length
      })

      return {
        totalSessions,
        averageScore: Math.round(averageScore),
        competencyAverages
      }
    } catch (error) {
      console.error('Failed to get persona stats:', error)
      return {
        totalSessions: 0,
        averageScore: 0,
        competencyAverages: {}
      }
    }
  }

  async getOverallUserStats(userId: string = 'anonymous') {
    try {
      const { data, error } = await supabase
        .from('user_progress')
        .select('competency, score, created_at')
        .eq('user_id', userId)
        .order('created_at', { ascending: true })

      if (error) throw error

      if (!data || data.length === 0) {
        return {
          totalSessions: 0,
          improvementTrend: 0,
          strongestCompetency: 'None yet',
          weakestCompetency: 'None yet'
        }
      }

      // Group by competency and calculate averages
      const competencyGroups: Record<string, number[]> = {}
      data.forEach(record => {
        if (!competencyGroups[record.competency]) {
          competencyGroups[record.competency] = []
        }
        competencyGroups[record.competency].push(record.score)
      })

      const competencyAverages = Object.entries(competencyGroups).map(([competency, scores]) => ({
        competency,
        average: scores.reduce((a, b) => a + b, 0) / scores.length
      }))

      const strongest = competencyAverages.reduce((prev, current) => 
        prev.average > current.average ? prev : current
      )

      const weakest = competencyAverages.reduce((prev, current) => 
        prev.average < current.average ? prev : current
      )

      // Calculate improvement trend (simplified)
      const overallScores = data.filter(d => d.competency === 'overallEffectiveness').map(d => d.score)
      const improvementTrend = overallScores.length > 1 
        ? overallScores[overallScores.length - 1] - overallScores[0]
        : 0

      return {
        totalSessions: Math.floor(data.length / 6), // Approximate since we store 6 competencies per session
        improvementTrend,
        strongestCompetency: strongest?.competency || 'None yet',
        weakestCompetency: weakest?.competency || 'None yet'
      }
    } catch (error) {
      console.error('Failed to get user stats:', error)
      return {
        totalSessions: 0,
        improvementTrend: 0,
        strongestCompetency: 'None yet',
        weakestCompetency: 'None yet'
      }
    }
  }

  async testConnection() {
    try {
      // Try a simple query to check if tables exist
      const { data, error } = await supabase
        .from('coaching_sessions')
        .select('id')
        .limit(1)

      if (error) {
        console.error('Database connection test error:', error)
        // Check if it's a "relation does not exist" error (tables not created)
        if (error.message.includes('relation') && error.message.includes('does not exist')) {
          return { 
            success: false, 
            error: 'Database tables not created yet. Please run the SQL schema in Supabase.' 
          }
        }
        return { success: false, error: error.message }
      }

      return { success: true, error: null }
    } catch (error: any) {
      console.error('Database connection test failed:', error)
      return { success: false, error: error.message || 'Unknown connection error' }
    }
  }
}