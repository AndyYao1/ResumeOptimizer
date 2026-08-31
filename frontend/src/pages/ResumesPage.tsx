import { useEffect, useState } from 'react'
import { deleteResume, fetchResumes } from '../api/resume'

type Resume = {
  id: string
  original_filename: string | null
  created_at: string | null
}

export default function ResumesPage() {
  const [resumes, setResumes] = useState<Resume[]>([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadResumes() {
      try {
        const data = await fetchResumes()
        setResumes(data.resumes ?? [])
      } catch {
        setError('We could not load your saved resumes.')
      } finally {
        setLoading(false)
      }
    }
    void loadResumes()
  }, [])

  async function handleDelete(resume: Resume) {
    const name = resume.original_filename || 'this resume'
    if (!window.confirm(`Delete ${name}? This cannot be undone.`)) return

    setDeletingId(resume.id)
    setError('')
    try {
      await deleteResume(resume.id)
      setResumes((current) => current.filter((item) => item.id !== resume.id))
    } catch {
      setError('The resume could not be deleted. Please try again.')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <section className="max-w-[920px] px-6 py-9 sm:px-12 sm:py-14 lg:px-[72px]">
      <div className="mb-8">
        <div>
          <p className="mb-1.5 text-xs font-bold tracking-[.08em] text-indigo-600 uppercase">Library</p>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">My resumes</h1>
          <p className="mt-2.5 text-slate-500">Manage the resumes you have uploaded for tailoring.</p>
        </div>
      </div>

      {error && <p className="mb-4 rounded-xl border border-red-200 bg-white p-7 text-left text-red-700" role="alert">{error}</p>}

      {loading ? (
        <p className="rounded-xl border border-dashed border-slate-300 bg-white p-7 text-center text-slate-500">Loading your resumes…</p>
      ) : resumes.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-7 text-center text-slate-500">
          <h2 className="text-base font-semibold text-slate-800">No saved resumes yet</h2>
          <p className="mt-2">Upload a resume from the Create resume page to see it here.</p>
        </div>
      ) : (
        <div className="grid gap-3">
          {resumes.map((resume) => (
            <article className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white px-5 py-[18px] shadow-sm" key={resume.id}>
              <div className="grid size-11 place-items-center rounded-[9px] bg-indigo-50 text-xs font-extrabold text-indigo-700">PDF</div>
              <div className="min-w-0 flex-1">
                <h2 className="truncate text-base font-semibold text-slate-800">{resume.original_filename || 'Untitled resume'}</h2>
                <p className="mt-1 text-sm text-slate-500">Uploaded {formatDate(resume.created_at)}</p>
              </div>
              <button
                className="cursor-pointer rounded-md border border-red-200 bg-white px-3 py-2 text-sm font-semibold text-red-700 hover:bg-red-50 disabled:cursor-wait disabled:opacity-65"
                disabled={deletingId === resume.id}
                onClick={() => void handleDelete(resume)}
              >
                {deletingId === resume.id ? 'Deleting…' : 'Delete'}
              </button>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}

function formatDate(value: string | null) {
  if (!value) return 'recently'
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? 'recently' : date.toLocaleDateString()
}
