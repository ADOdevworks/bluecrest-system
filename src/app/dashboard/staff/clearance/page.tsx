// src/app/dashboard/staff/clearance/page.tsx
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import ClearanceManager from './clearance-manager'

export default async function StaffClearancePage() {
  const supabase = await createClient()

  // 1. Get the current staff user
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  // 2. Get the staff's profile to see which office they manage
  const { data: profile } = await supabase
    .from('profiles')
    .select('role, office_id')
    .eq('id', user.id)
    .single()

  if (!profile || profile.role !== 'staff' || !profile.office_id) {
    return <div className="p-8 text-red-500">Access Denied: Staff Office not assigned.</div>
  }

  // 3. Fetch all pending clearance records for THIS office
  const { data: records, error } = await supabase
    .from('clearance_records')
    .select(`
      id,
      status,
      remarks,
      student:profiles!student_id (
        full_name,
        student_id_number
      )
    `)
    .eq('office_id', profile.office_id)

  if (error) {
    return <div className="p-8 text-red-500">Error loading records: {error.message}</div>
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Departmental Clearance Manager</h1>
        <p className="text-gray-600">Review and approve student exit clearance requests for your office.</p>
      </div>

      <ClearanceManager records={records || []} />
    </div>
  )
}