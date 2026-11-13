// src/app/dashboard/coordinator/actions.ts
'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createJobOpportunity(
  title: string,
  company: string,
  description: string,
  skillsCommaSeparated: string
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const skillsArray = skillsCommaSeparated
    .split(',')
    .map(s => s.trim().toLowerCase())
    .filter(Boolean)

  const { error } = await supabase.from('job_opportunities').insert({
    title,
    company,
    description,
    required_skills: skillsArray,
    created_by: user.id
  })

  if (error) return { success: false, error: error.message }

  revalidatePath('/dashboard/coordinator')
  return { success: true }
}

export async function calculateJobMatches(jobId: string) {
  const supabase = await createClient()

  // 1. Fetch Job
  const { data: job, error: jobErr } = await supabase
    .from('job_opportunities')
    .select('*')
    .eq('id', jobId)
    .single()

  if (jobErr || !job) return { success: false, error: 'Job not found' }

  const requiredSkills: string[] = job.required_skills || []

  // 2. Fetch all profiles with their skills
  const { data: candidates, error: candidateErr } = await supabase
    .from('profiles')
    .select(`
      id,
      full_name,
      student_id_number,
      skills (
        skill_name
      )
    `)

  if (candidateErr) return { success: false, error: candidateErr.message }

  // 3. Match Engine Calculation
  const matches = (candidates || []).map((candidate: any) => {
    const candidateSkills: string[] = (candidate.skills || []).map((s: any) =>
      s.skill_name.trim().toLowerCase()
    )

    const matchedSkills = requiredSkills.filter(req =>
      candidateSkills.includes(req)
    )

    const score = requiredSkills.length > 0
      ? Math.round((matchedSkills.length / requiredSkills.length) * 100)
      : 0

    return {
      candidateId: candidate.id,
      fullName: candidate.full_name || 'Anonymous Graduate',
      studentId: candidate.student_id_number || 'N/A',
      matchedSkills,
      allSkills: candidateSkills,
      matchScore: score
    }
  }).sort((a, b) => b.matchScore - a.matchScore)

  return { success: true, matches, jobTitle: job.title, company: job.company }
}