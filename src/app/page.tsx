// src/app/dashboard/page.tsx
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role === 'staff') {
    redirect('/dashboard/staff/clearance')
  }

  if (profile?.role === 'coordinator') {
    redirect('/dashboard/coordinator')
  }

  // Default to Student Dashboard
  redirect('/dashboard/student')
}