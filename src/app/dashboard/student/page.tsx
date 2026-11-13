import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function StudentDashboard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  // Fetch clearance status
  const { data: clearances } = await supabase
    .from('clearance_records')
    .select('*')
    .eq('student_id', user.id)

  const totalOffices = clearances?.length || 0
  const clearedCount = clearances?.filter((c) => c.status === 'cleared').length || 0

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">
        Welcome, {profile?.full_name || 'Student'}
      </h1>
      <p className="text-gray-600 mb-8">
        {profile?.programme || 'BSc Information Technology'} •{' '}
        <span className="capitalize font-semibold text-blue-900">{profile?.status || 'Student'}</span>
      </p>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Clearance Progress
          </h3>
          <p className="text-3xl font-bold text-blue-900 mt-2">
            {clearedCount}/{totalOffices > 0 ? totalOffices : 5}
          </p>
          <p className="text-sm text-gray-500 mt-1">Offices Cleared</p>
          <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-green-500 h-2 rounded-full transition-all"
              style={{
                width: totalOffices > 0 ? `${(clearedCount / totalOffices) * 100}%` : '0%',
              }}
            />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Technical Portfolio
          </h3>
          <p className="text-3xl font-bold text-blue-900 mt-2">Active</p>
          <p className="text-sm text-gray-500 mt-1">
            {profile?.specialization || 'Specialization not set'}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Account Status
          </h3>
          <p className="text-3xl font-bold text-green-600 mt-2 capitalize">
            {profile?.status || 'Active'}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            {profile?.graduation_year ? `Class of ${profile.graduation_year}` : 'Student Record'}
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Navigation</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            href="/dashboard/student/clearance"
            className="border border-gray-200 rounded-xl p-5 hover:border-blue-500 hover:shadow-md transition-all block bg-blue-50/30"
          >
            <h3 className="font-bold text-blue-900 mb-1">Exit Clearance Tracker →</h3>
            <p className="text-sm text-gray-600">
              Check approval status across all 5 administrative offices.
            </p>
          </Link>
          <Link
            href="/dashboard/student/portfolio"
            className="border border-gray-200 rounded-xl p-5 hover:border-blue-500 hover:shadow-md transition-all block bg-blue-50/30"
          >
            <h3 className="font-bold text-blue-900 mb-1">Digital Technical Portfolio →</h3>
            <p className="text-sm text-gray-600">
              Manage skills, project showcases, certificates, and work history.
            </p>
          </Link>
        </div>
      </div>
    </div>
  )
}