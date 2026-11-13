// src/app/dashboard/student/portfolio/portfolio-manager.tsx
'use client'

import { useState } from 'react'
import { addSkill, deleteSkill, addProject, deleteProject } from './actions'

interface Skill {
  id: string
  skill_name: string
  category: string
  proficiency_level: string
}

interface Project {
  id: string
  title: string
  description: string
  github_url: string | null
  live_url: string | null
  tech_stack: string[]
}

export default function PortfolioManager({
  skills,
  projects
}: {
  skills: Skill[]
  projects: Project[]
}) {
  // Skill form state
  const [skillName, setSkillName] = useState('')
  const [category, setCategory] = useState('Programming Languages')
  const [level, setLevel] = useState('Intermediate')
  const [skillLoading, setSkillLoading] = useState(false)

  // Project form state
  const [projTitle, setProjTitle] = useState('')
  const [projDesc, setProjDesc] = useState('')
  const [projGithub, setProjGithub] = useState('')
  const [projLive, setProjLive] = useState('')
  const [projTech, setProjTech] = useState('')
  const [projLoading, setProjLoading] = useState(false)

  const handleAddSkill = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!skillName.trim()) return
    setSkillLoading(true)
    const res = await addSkill(skillName.trim(), category, level)
    if (!res.success) alert(res.error)
    else setSkillName('')
    setSkillLoading(false)
  }

  const handleDeleteSkill = async (id: string) => {
    const res = await deleteSkill(id)
    if (!res.success) alert(res.error)
  }

  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!projTitle.trim() || !projDesc.trim()) return
    setProjLoading(true)
    const res = await addProject(projTitle.trim(), projDesc.trim(), projGithub.trim(), projLive.trim(), projTech)
    if (!res.success) alert(res.error)
    else {
      setProjTitle('')
      setProjDesc('')
      setProjGithub('')
      setProjLive('')
      setProjTech('')
    }
    setProjLoading(false)
  }

  const handleDeleteProject = async (id: string) => {
    const res = await deleteProject(id)
    if (!res.success) alert(res.error)
  }

  return (
    <div className="space-y-12">
      {/* SECTION 1: TECHNICAL SKILLS */}
      <section className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <span>🛠️</span> Technical Skills & Competencies
        </h2>

        {/* Add Skill Form */}
        <form onSubmit={handleAddSkill} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8 bg-gray-50 p-4 rounded-xl border border-gray-100">
          <input
            type="text"
            placeholder="Skill (e.g., Next.js, Python, SQL)"
            value={skillName}
            onChange={(e) => setSkillName(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900"
            required
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 bg-white"
          >
            <option>Programming Languages</option>
            <option>Frameworks & Libraries</option>
            <option>Databases & Cloud</option>
            <option>Tools & DevOps</option>
            <option>Cybersecurity & Networking</option>
          </select>
          <select
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 bg-white"
          >
            <option>Beginner</option>
            <option>Intermediate</option>
            <option>Advanced</option>
            <option>Expert</option>
          </select>
          <button
            type="submit"
            disabled={skillLoading}
            className="bg-blue-900 text-white font-semibold rounded-lg px-4 py-2 hover:bg-blue-800 disabled:opacity-50 transition-all"
          >
            {skillLoading ? 'Adding...' : '+ Add Skill'}
          </button>
        </form>

        {/* Skill Chips List */}
        {skills.length === 0 ? (
          <p className="text-gray-500 text-center py-6 italic">No skills added yet. Add your technical stack above!</p>
        ) : (
          <div className="flex flex-wrap gap-3">
            {skills.map((skill) => (
              <div key={skill.id} className="bg-blue-50 border border-blue-200 text-blue-900 px-4 py-2 rounded-xl flex items-center gap-3">
                <div>
                  <div className="font-semibold text-sm">{skill.skill_name}</div>
                  <div className="text-xs text-blue-700">{skill.category} • <span className="italic">{skill.proficiency_level}</span></div>
                </div>
                <button
                  onClick={() => handleDeleteSkill(skill.id)}
                  className="text-blue-400 hover:text-red-600 font-bold text-sm ml-2"
                  title="Remove skill"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* SECTION 2: TECHNICAL PROJECTS */}
      <section className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <span>🚀</span> Featured Technical Projects
        </h2>

        {/* Add Project Form */}
        <form onSubmit={handleAddProject} className="space-y-4 mb-8 bg-gray-50 p-6 rounded-xl border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Project Title (e.g., Smart Campus Mobile App)"
              value={projTitle}
              onChange={(e) => setProjTitle(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900"
              required
            />
            <input
              type="text"
              placeholder="Technologies Used (comma-separated: Next.js, Supabase, Tailwind)"
              value={projTech}
              onChange={(e) => setProjTech(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900"
              required
            />
          </div>
          <textarea
            placeholder="Project Description (Highlight problem solved, your role, and technical achievements)"
            value={projDesc}
            onChange={(e) => setProjDesc(e.target.value)}
            rows={3}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900"
            required
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="url"
              placeholder="GitHub Repository URL (optional)"
              value={projGithub}
              onChange={(e) => setProjGithub(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900"
            />
            <input
              type="url"
              placeholder="Live Demo URL (optional)"
              value={projLive}
              onChange={(e) => setProjLive(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900"
            />
          </div>
          <button
            type="submit"
            disabled={projLoading}
            className="bg-blue-900 text-white font-semibold rounded-lg px-6 py-2.5 hover:bg-blue-800 disabled:opacity-50 transition-all"
          >
            {projLoading ? 'Saving Project...' : '+ Save Project to Portfolio'}
          </button>
        </form>

        {/* Projects Cards List */}
        {projects.length === 0 ? (
          <p className="text-gray-500 text-center py-6 italic">No projects added yet. Share your capstones, side projects, or course assignments!</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map((proj) => (
              <div key={proj.id} className="border border-gray-200 rounded-xl p-5 hover:border-blue-300 transition-all bg-white flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg text-gray-900">{proj.title}</h3>
                    <button
                      onClick={() => handleDeleteProject(proj.id)}
                      className="text-gray-400 hover:text-red-600 text-sm"
                      title="Delete Project"
                    >
                      🗑️
                    </button>
                  </div>
                  <p className="text-gray-600 text-sm mb-4">{proj.description}</p>
                  
                  {proj.tech_stack && proj.tech_stack.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {proj.tech_stack.map((tech, i) => (
                        <span key={i} className="bg-gray-100 text-gray-700 text-xs px-2.5 py-1 rounded-md font-medium">
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex gap-4 border-t pt-3 text-sm">
                  {proj.github_url && (
                    <a href={proj.github_url} target="_blank" rel="noreferrer" className="text-blue-900 font-semibold hover:underline flex items-center gap-1">
                      📁 GitHub
                    </a>
                  )}
                  {proj.live_url && (
                    <a href={proj.live_url} target="_blank" rel="noreferrer" className="text-green-700 font-semibold hover:underline flex items-center gap-1">
                      🌐 Live Demo
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}