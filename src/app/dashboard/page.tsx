import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-blue-900 to-indigo-900 flex items-center justify-center px-4">
      <div className="text-center text-white max-w-2xl">
        <div className="inline-block bg-blue-800/50 px-4 py-1.5 rounded-full text-blue-200 text-xs font-semibold uppercase tracking-wider mb-6 border border-blue-400/20">
          BlueCrest University College
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight leading-tight">
          Automated Exit-Clearance & Digital Technical Portfolio System
        </h1>
        <p className="text-lg text-blue-100/90 mb-8 max-w-xl mx-auto font-light">
          A centralized platform combining administrative clearance tracking, persistent technical portfolios, and decision-support job matching.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/auth/login"
            className="bg-white text-blue-900 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-all shadow-lg"
          >
            Sign In
          </Link>
          <Link
            href="/auth/signup"
            className="border border-white/40 text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/10 transition-all"
          >
            Create Account
          </Link>
        </div>
      </div>
    </div>
  )
}