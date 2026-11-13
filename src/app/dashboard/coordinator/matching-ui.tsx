// src/app/dashboard/coordinator/matching-ui.tsx
'use client'

import { useState } from 'react'
import { createJobOpportunity, calculateJobMatches } from './actions'

interface Job {
  id: string
  title: string
  company: string
  description: string
  required_skills: string[]
}

interface CandidateMatch {
  candidateId: string
  fullName: string
  studentId: string
  matchedSkills: string[]
  allSkills: string[]
  matchScore: number
}

export default function CoordinatorMatchingUI({ initialJobs }: { initialJobs: Job[] }) {
  // Form State
  const [title, setTitle] = useState('')
  const [company, setCompany] = useState('')
  const [desc, setDesc] = useState('')
  const [skills, setSkills] = useState('')
  const [posting, setPosting] = useState(false)

  // Matching State
  const [matchingJobId, setMatchingJobId] = useState<string | null>(null)
  const [matchResults, setMatchResults] = useState<CandidateMatch[] | null>(null)
  const [activeJobInfo, setActiveJobInfo] = useState<{ title: string; company: string } | null>(null)

  const handlePostJob = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title || !company || !skills) return
    setPosting(true)
    const res = await createJobOpportunity(title, company, desc, skills)
    if (!res.success) {
      alert(res.error)
    } else {
      setTitle('')
      setCompany('')
      setDesc('')
      setSkills('')
    }
    setPosting(false)
  }

  const handleRunMatch = async (jobId: string) => {
    setMatchingJobId(jobId)
    const res = await calculateJobMatches(jobId)
    if (res.success && res.matches) {
      setMatchResults(res.matches)
      setActiveJobInfo({ title: res.jobTitle || '', company: res.company || '' })
    } else {
      alert(res.error)
    }
    setMatchingJobId(null)
  }

  return (
    <div className="space-y-10">
      {/* JOB CREATION FORM */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <span>💼</span> Post New Job Opportunity
        </h2>
        <form onSubmit={handlePostJob} className="space-y-4 bg-gray-50 p-6 rounded-xl border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Job Title (e.g. Full Stack Next.js Developer)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900"
              required
            />
            <input
              type="text"
              placeholder="Company Name (e.g. Hubtel Ghana)"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900"
              required
            />
          </div>
          <input
            type="text"
            placeholder="Required Skills (Comma separated: next.js, typescript, postgresql)"
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900"
            required
          />
          <textarea
            placeholder="Job Description and Responsibilities..."
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            rows={2}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900"
          />
          <button
            type="submit"
            disabled={posting}
            className="bg-blue-900 text-white font-semibold rounded-lg px-6 py-2.5 hover:bg-blue-800 disabled:opacity-50 transition-all"
          >
            {posting ? 'Posting...' : '+ Create Job & Enable Match Engine'}
          </button>
        </form>
      </div>

      {/* JOB LISTINGS */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <span>🎯</span> Active Opportunities & Matching Engine
        </h2>

        {initialJobs.length === 0 ? (
          <p className="text-gray-500 text-center py-6 italic">No job postings created yet. Create one above to test candidate matching.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {initialJobs.map((job) => (
              <div key={job.id} className="border border-gray-200 rounded-xl p-5 bg-white flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-bold text-lg text-gray-900">{job.title}</h3>
                      <p className="text-sm font-semibold text-blue-900">{job.company}</p>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{job.description}</p>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {(job.required_skills || []).map((sk: string, i: number) => (
                      <span key={i} className="bg-blue-50 text-blue-800 text-xs px-2.5 py-1 rounded-md font-medium border border-blue-100">
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => handleRunMatch(job.id)}
                  disabled={matchingJobId === job.id}
                  className="w-full bg-emerald-700 text-white font-semibold py-2 rounded-lg hover:bg-emerald-800 disabled:opacity-50 transition-all text-sm flex items-center justify-center gap-2"
                >
                  {matchingJobId === job.id ? 'Running Match Algorithm...' : '⚡ Run Match Algorithm'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MATCH RESULTS EVALUATION DISPLAY */}
      {matchResults && activeJobInfo && (
        <div className="bg-white p-6 rounded-2xl border-2 border-emerald-500 shadow-md">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Match Results for: <span className="text-emerald-700">{activeJobInfo.title}</span>
              </h2>
              <p className="text-sm text-gray-600">Company: {activeJobInfo.company} • Human-in-the-Loop Decision Support Mode</p>
            </div>
            <button
              onClick={() => setMatchResults(null)}
              className="text-gray-400 hover:text-gray-600 font-bold"
            >
              ✕ Close
            </button>
          </div>

          <div className="space-y-4">
            {matchResults.map((candidate, idx) => (
              <div key={idx} className="border border-gray-200 rounded-xl p-4 flex items-center justify-between bg-gray-50">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="font-bold text-gray-900">{candidate.fullName}</h3>
                    <span className="text-xs bg-gray-200 text-gray-700 px-2 py-0.5 rounded font-mono">
                      {candidate.studentId}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Matched Skills: <span className="font-semibold text-gray-800">{candidate.matchedSkills.join(', ') || 'None'}</span>
                  </p>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <div className={`text-2xl font-extrabold ${
                      candidate.matchScore >= 70 ? 'text-green-600' :
                      candidate.matchScore >= 40 ? 'text-amber-600' : 'text-gray-400'
                    }`}>
                      {candidate.matchScore}%
                    </div>
                    <div className="text-xs text-gray-500 font-medium">Match Score</div>
                  </div>

                  <button
                    onClick={() => alert(`Candidate Recommendation Recorded for ${candidate.fullName}. Final hiring decision remains with Alumni Coordinator & Employer.`)}
                    className="bg-blue-900 text-white text-xs font-semibold px-4 py-2 rounded-lg hover:bg-blue-800"
                  >
                    Recommend Candidate
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}