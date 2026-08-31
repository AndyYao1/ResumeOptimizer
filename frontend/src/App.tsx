import './App.css'
import { useState } from 'react'
import GeneratePage from './pages/GeneratePage'
import ResumesPage from './pages/ResumesPage'

function App() {
  const [page, setPage] = useState<'generate' | 'resumes'>('generate')

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900">
      <aside className="group sticky top-0 z-10 h-screen w-[72px] shrink-0 overflow-hidden bg-[#14213d] text-slate-200 transition-[width] duration-200 hover:w-56" aria-label="Main navigation">
        <div className="grid size-[38px] place-items-center rounded-[11px] bg-indigo-600 text-white m-[20px_17px_34px]" aria-hidden="true">
          <svg className="size-5 fill-none stroke-current stroke-2 [stroke-linecap:round]" viewBox="0 0 24 24">
            <path d="M4 7h16M4 12h16M4 17h16" />
          </svg>
        </div>
        <nav className="hidden gap-2 px-3 group-hover:grid">
          <button
            className={`flex h-12 w-[200px] items-center gap-4 rounded-[9px] px-4 text-left whitespace-nowrap transition-colors hover:bg-[#253657] hover:text-white ${page === 'generate' ? 'bg-[#253657] text-white' : 'text-slate-300'}`}
            onClick={() => setPage('generate')}
            title="Create Resume"
          >
            <svg className="size-[21px] shrink-0 fill-none stroke-current stroke-[1.8] [stroke-linecap:round] [stroke-linejoin:round]" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 4h11l5 5v11H4zM15 4v5h5M8 14h8M8 17h6" /></svg>
            <span>Create Resume</span>
          </button>
          <button
            className={`flex h-12 w-[200px] items-center gap-4 rounded-[9px] px-4 text-left whitespace-nowrap transition-colors hover:bg-[#253657] hover:text-white ${page === 'resumes' ? 'bg-[#253657] text-white' : 'text-slate-300'}`}
            onClick={() => setPage('resumes')}
            title="Manage Resumes"
          >
            <svg className="size-[21px] shrink-0 fill-none stroke-current stroke-[1.8] [stroke-linecap:round] [stroke-linejoin:round]" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M9 7V5h6v2M7 7l1 13h8l1-13M10 11v5M14 11v5" /></svg>
            <span>My Resumes</span>
          </button>
        </nav>
      </aside>
      <main className="min-w-0 flex-1">
        {page === 'generate' ? <GeneratePage /> : <ResumesPage />}
      </main>
    </div>
  )
}

export default App
