// src/app/dashboard/coordinator/page.tsx
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import CoordinatorMatchingUI from './matching-ui'

export default async function CoordinatorDashboardPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: jobs } = await supabase
    .from('job_opportunities')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Alumni Job-Matching Dashboard</h1>
        <p className="text-gray-600">Post industry opportunities and run tag-based portfolio matching algorithms to identify top alumni candidates.</p>
      </div>

      <CoordinatorMatchingUI initialJobs={jobs || []} />
    </div>
  )
}