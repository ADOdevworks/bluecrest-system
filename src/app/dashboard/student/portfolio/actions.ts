// src/app/dashboard/student/portfolio/actions.ts
'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function addSkill(skillName: string, category: string, level: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const { error } = await supabase.from('skills').insert({
    user_id: user.id,
    skill_name: skillName,
    category: category,
    proficiency_level: level
  })

  if (error) return { success: false, error: error.message }
  revalidatePath('/dashboard/student/portfolio')
  return { success: true }
}

export async function deleteSkill(skillId: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('skills').delete().eq('id', skillId)
  if (error) return { success: false, error: error.message }
  revalidatePath('/dashboard/student/portfolio')
  return { success: true }
}

export async function addProject(
  title: string, 
  description: string, 
  githubUrl: string, 
  liveUrl: string, 
  techStack: string
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const stackArray = techStack.split(',').map(item => item.trim()).filter(Boolean)

  const { error } = await supabase.from('projects').insert({
    user_id: user.id,
    title,
    description,
    github_url: githubUrl || null,
    live_url: liveUrl || null,
    tech_stack: stackArray
  })

  if (error) return { success: false, error: error.message }
  revalidatePath('/dashboard/student/portfolio')
  return { success: true }
}

export async function deleteProject(projectId: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('projects').delete().eq('id', projectId)
  if (error) return { success: false, error: error.message }
  revalidatePath('/dashboard/student/portfolio')
  return { success: true }
}