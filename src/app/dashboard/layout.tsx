import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, full_name')
    .eq('id', user.id)
    .single()

  const role = profile?.role || 'student'

  const navItems: Record<string, { label: string; href: string }[]> = {
    student: [
      { label: 'Dashboard', href: '/dashboard/student' },
      { label: 'Clearance', href: '/dashboard/student/clearance' },
      { label: 'Portfolio', href: '/dashboard/student/portfolio' },
    ],
    staff: [
      { label: 'Dashboard', href: '/dashboard/staff' },
      { label: 'Clearance Approvals', href: '/dashboard/staff/clearance' },
    ],
    coordinator: [
      { label: 'Dashboard', href: '/dashboard/coordinator' },
      { label: 'Job Opportunities', href: '/dashboard/coordinator/jobs' },
      { label: 'Alumni Profiles', href: '/dashboard/coordinator/alumni' },
      { label: 'Match Results', href: '/dashboard/coordinator/matches' },
    ],
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Header Navigation */}
      <nav className="bg-blue-900 text-white px-6 py-4 flex items-center justify-between shadow-md">
        <div>
          <h1 className="text-lg font-bold">BlueCrest University</h1>
          <p className="text-blue-200 text-xs">Exit-Clearance & Digital Technical Portfolio System</p>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium">{profile?.full_name}</span>
          <span className="bg-blue-700 px-2 py-1 rounded text-xs capitalize font-semibold">
            {role}
          </span>
          <form action={async () => {
            'use server'
            const supabase = await createClient()
            await supabase.auth.signOut()
            redirect('/auth/login')
          }}>
            <button type="submit" className="text-sm bg-blue-800 hover:bg-blue-700 px-3 py-1 rounded transition-colors">
              Sign Out
            </button>
          </form>
        </div>
      </nav>

      <div className="flex">
        {/* Left Sidebar */}
        <aside className="w-64 bg-white min-h-[calc(100vh-65px)] shadow-sm p-4 hidden md:block border-r border-gray-200">
          <ul className="space-y-1">
            {(navItems[role] || []).map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="block px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-900 transition-colors"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  )
}