'use client'

import { useState } from 'react'
import { updateClearanceStatus } from './actions'

export default function ClearanceManager({ records }: { records: any[] }) {
  const [loading, setLoading] = useState<string | null>(null)

  const handleAction = async (id: string, status: 'Approved' | 'Rejected') => {
    setLoading(id)
    const remarks = status === 'Approved' ? 'All requirements met.' : 'Outstanding issues found.'
    const result = await updateClearanceStatus(id, status, remarks)
    if (!result.success) alert(result.error)
    setLoading(null)
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {records.length === 0 ? (
            <tr>
              <td colSpan={3} className="px-6 py-10 text-center text-gray-500 italic">
                No pending clearance requests for your department.
              </td>
            </tr>
          ) : (
            records.map((record) => (
              <tr key={record.id}>
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">{record.student?.full_name || 'System User'}</div>
                  <div className="text-sm text-gray-500">{record.student?.student_id_number || 'No ID'}</div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    record.status === 'Approved' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {record.status}
                  </span>
                </td>
                <td className="px-6 py-4 flex gap-2">
                  <button
                    onClick={() => handleAction(record.id, 'Approved')}
                    disabled={loading === record.id || record.status === 'Approved'}
                    className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 disabled:opacity-50"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleAction(record.id, 'Rejected')}
                    disabled={loading === record.id || record.status === 'Approved'}
                    className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 disabled:opacity-50"
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}