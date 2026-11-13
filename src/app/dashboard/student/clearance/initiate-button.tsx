// src/app/dashboard/student/clearance/initiate-button.tsx
'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function InitiateButton({ studentId }: { studentId: string }) {
  const [loading, setLoading] = useState(false)
  const supabase = createClient()
  const router = useRouter()

  const handleInitiate = async () => {
    setLoading(true)
    
    // 1. Get all offices
    const { data: offices, error: officeError } = await supabase
      .from('clearance_offices')
      .select('*')

    if (officeError) {
      console.error('Database Error (Offices):', officeError) // THIS LINE IS NEW
      alert(`Error fetching offices: ${officeError.message}`)
      setLoading(false)
      return
    }

    if (!offices || offices.length === 0) {
      alert('No clearance offices found in the database. Please contact admin.')
      setLoading(false)
      return
    }

    // 2. Create a record for each office
    const clearanceRecords = offices.map(office => ({
      student_id: studentId,
      office_id: office.id,
      status: 'Pending',
    }))

    const { error: insertError } = await supabase
      .from('clearance_records')
      .insert(clearanceRecords)

    if (insertError) {
      console.error('Database Error (Insert):', insertError) // THIS LINE IS NEW
      alert(`Error creating checklist: ${insertError.message}`)
      setLoading(false)
      return
    }

    router.refresh()
    setLoading(false)
  }

  return (
    <button
      onClick={handleInitiate}
      disabled={loading}
      className="bg-blue-900 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-800 disabled:opacity-50 transition-all"
    >
      {loading ? 'Generating Checklist...' : 'Initiate Exit Clearance'}
    </button>
  )
}