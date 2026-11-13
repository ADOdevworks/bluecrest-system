// src/app/dashboard/student/portfolio/page.tsx
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import PortfolioManager from './portfolio-manager'

export default async function StudentPortfolioPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  // Fetch Skills
  const { data: skills } = await supabase
    .from('skills')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  // Fetch Projects
  const { data: projects } = await supabase
    .from('projects')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Digital Technical Portfolio</h1>
          <p className="text-gray-600">Document your technical skills and showcase projects for job-matching after graduation.</p>
        </div>
        <Link href="/dashboard/student" className="text-blue-900 hover:underline text-sm font-medium">
          &larr; Back to Dashboard
        </Link>
      </div>

      <PortfolioManager
        skills={skills || []}
        projects={projects || []}
      />
    </div>
  )
}