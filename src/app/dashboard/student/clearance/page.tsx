// src/app/dashboard/student/clearance/page.tsx
import { createClient } from '@/lib/supabase/server'
import InitiateButton from './initiate-button'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function StudentClearancePage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  // We fetch records for the logged-in user
  const { data: records, error } = await supabase
    .from('clearance_records')
    .select(`
      *,
      office:clearance_offices (
        name,
        description
      )
    `)
    .eq('student_id', user.id)

  if (error) {
    return <div className="p-8 text-red-500">Error loading clearance: {error.message}</div>
  }

  const hasStarted = records && records.length > 0

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Exit-Clearance Progress Tracker</h1>
          <p className="text-gray-600">Official clearance status across all BlueCrest administrative offices.</p>
        </div>
        <Link href="/dashboard/student" className="text-blue-900 hover:underline text-sm font-medium">
          &larr; Back to Dashboard
        </Link>
      </div>

      {!hasStarted ? (
        <div className="bg-white border border-blue-100 rounded-2xl p-12 text-center shadow-sm">
          <div className="w-16 h-16 bg-blue-900 text-white rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">!</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Clearance Process Not Started</h2>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            You have not initiated your exit clearance yet. Click below to generate your official clearance checklist.
          </p>
          <InitiateButton studentId={user.id} />
        </div>
      ) : (
        <div className="grid gap-4">
          {records.map((record) => (
            <div key={record.id} className="bg-white p-6 rounded-xl border border-gray-200 flex items-center justify-between shadow-sm">
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900">{(record.office as any)?.name}</h3>
                <p className="text-sm text-gray-500">{(record.office as any)?.description}</p>
                {record.remarks && (
                  <p className="mt-2 text-sm text-amber-700 bg-amber-50 p-2 rounded italic">
                    Note: {record.remarks}
                  </p>
                )}
              </div>
              
              <div className="flex items-center gap-4">
                <span className={`px-4 py-1.5 rounded-full text-sm font-semibold border ${
                  record.status === 'Approved' ? 'bg-green-100 text-green-700 border-green-200' :
                  record.status === 'Rejected' ? 'bg-red-100 text-red-700 border-red-200' :
                  'bg-blue-50 text-blue-700 border-blue-200'
                }`}>
                  {record.status}
                </span>
                <span className="text-xs text-gray-400">
                  Last updated: {new Date(record.updated_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
          
          <div className="mt-8 p-6 bg-blue-50 rounded-xl border border-blue-100">
            <h4 className="text-blue-900 font-bold mb-2">Final Clearance Requirement</h4>
            <p className="text-sm text-blue-800">
              Once all 5 departments above show <span className="font-bold">Approved</span>, your Digital Technical Portfolio will be permanently unlocked as an Alumni Profile.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}