'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateClearanceStatus(
  recordId: string, 
  status: 'Approved' | 'Rejected', 
  remarks: string
) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('clearance_records')
    .update({
      status,
      remarks,
      updated_at: new Date().toISOString()
    })
    .eq('id', recordId)

  if (error) return { success: false, error: error.message }

  revalidatePath('/dashboard/staff/clearance')
  revalidatePath('/dashboard/student/clearance')
  return { success: true }
}