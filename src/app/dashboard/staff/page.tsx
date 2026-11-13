import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function StaffDashboard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  const { count: pendingCount } = await supabase
    .from('clearance_records')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'pending')

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">
        Clearance Staff Dashboard
      </h1>
      <p className="text-gray-600 mb-8">Welcome, {profile?.full_name}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6 border border-gray-100">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Pending Clearance Requests
          </h3>
          <p className="text-3xl font-bold text-amber-600 mt-2">{pendingCount || 0}</p>
          <p className="text-sm text-gray-500 mt-1">Students awaiting office verification</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6 border border-gray-100">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Role Responsibility
          </h3>
          <p className="text-3xl font-bold text-blue-900 mt-2 capitalize">
            {profile?.role}
          </p>
          <p className="text-sm text-gray-500 mt-1">Administrative clearance officer</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6 border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Navigation</h2>
        <Link
          href="/dashboard/staff/clearance"
          className="border border-gray-200 rounded-lg p-5 hover:border-blue-500 hover:shadow-sm transition-all block max-w-md"
        >
          <h3 className="font-semibold text-blue-900 mb-1">Clearance Approvals</h3>
          <p className="text-sm text-gray-600">Review student records and log clearance decisions.</p>
        </Link>
      </div>
    </div>
  )
}