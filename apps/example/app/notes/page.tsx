'use client'

import { useState } from 'react'
import { Button, Input } from '@heroui/react'
import { HiOutlinePlus, HiOutlineTrash, HiOutlineMagnifyingGlass } from 'react-icons/hi2'

interface Note {
  id: number
  title: string
  body: string
  updated: string
}

const initialNotes: Note[] = [
  {
    id: 1,
    title: 'Project Ideas',
    body: 'Build a desktop OS shell for Next.js apps.\n\nFeatures:\n- Window management with drag & resize\n- Dock/taskbar with running indicators\n- Theme system (macOS, Windows 11, Ubuntu)\n- iframe-based app isolation',
    updated: 'Just now',
  },
  {
    id: 2,
    title: 'Meeting Notes — Q1 Planning',
    body: 'Discussed v1 milestones and timeline.\n\nAction items:\n- Finalize auth middleware rewrite (Sarah)\n- Design system token migration (Alex)\n- Set up staging environment (Jordan)\n\nNext sync: Friday 3pm',
    updated: '2h ago',
  },
  {
    id: 3,
    title: 'Reading List',
    body: '- The Pragmatic Programmer\n- Designing Data-Intensive Applications\n- Staff Engineer by Will Larson\n- Building Microservices (Sam Newman)',
    updated: 'Yesterday',
  },
  {
    id: 4,
    title: 'Recipe — Pasta Aglio e Olio',
    body: 'Ingredients:\n- 400g spaghetti\n- 6 cloves garlic, thinly sliced\n- 1/2 cup olive oil\n- 1 tsp red pepper flakes\n- Fresh parsley\n- Parmesan\n\n1. Cook pasta al dente\n2. Sauté garlic in olive oil until golden\n3. Add red pepper flakes\n4. Toss with pasta and pasta water\n5. Finish with parsley and parmesan',
    updated: 'Mar 18',
  },
]

export default function Notes() {
  const [notes, setNotes] = useState(initialNotes)
  const [selected, setSelected] = useState(notes[0].id)
  const [search, setSearch] = useState('')
  const current = notes.find((n) => n.id === selected)

  const filtered = search
    ? notes.filter(
        (n) =>
          n.title.toLowerCase().includes(search.toLowerCase()) ||
          n.body.toLowerCase().includes(search.toLowerCase()),
      )
    : notes

  const addNote = () => {
    const id = Date.now()
    const note: Note = { id, title: 'Untitled', body: '', updated: 'Just now' }
    setNotes((prev) => [note, ...prev])
    setSelected(id)
  }

  const deleteNote = (id: number) => {
    setNotes((prev) => prev.filter((n) => n.id !== id))
    if (selected === id) {
      const remaining = notes.filter((n) => n.id !== id)
      setSelected(remaining[0]?.id ?? -1)
    }
  }

  return (
    <div className="flex h-screen bg-white">
      {/* Sidebar */}
      <div className="flex w-64 shrink-0 flex-col border-r border-slate-200 bg-slate-50">
        <div className="flex items-center gap-2 border-b border-slate-200 p-3">
          <Input
            size="sm"
            placeholder="Search notes..."
            value={search}
            onValueChange={setSearch}
            startContent={<HiOutlineMagnifyingGlass className="h-4 w-4 text-slate-400" />}
            classNames={{
              inputWrapper: 'bg-white border border-slate-200 shadow-none',
            }}
          />
          <Button isIconOnly size="sm" variant="flat" onPress={addNote} className="shrink-0">
            <HiOutlinePlus className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto">
          {filtered.map((note) => (
            <button
              key={note.id}
              onClick={() => setSelected(note.id)}
              className={`group w-full border-b border-slate-100 px-4 py-3 text-left transition-colors ${
                selected === note.id ? 'bg-primary-50' : 'hover:bg-slate-100'
              }`}
            >
              <div className="flex items-start justify-between">
                <span className="truncate text-sm font-semibold text-slate-800">{note.title}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    deleteNote(note.id)
                  }}
                  className="ml-2 shrink-0 opacity-0 transition-opacity group-hover:opacity-100"
                >
                  <HiOutlineTrash className="h-3.5 w-3.5 text-slate-400 hover:text-red-500" />
                </button>
              </div>
              <p className="mt-0.5 truncate text-xs text-slate-500">
                {note.body.split('\n')[0] || 'Empty note'}
              </p>
              <p className="mt-1 text-[11px] text-slate-400">{note.updated}</p>
            </button>
          ))}
          {filtered.length === 0 && (
            <div className="p-4 text-center text-sm text-slate-400">No notes found</div>
          )}
        </div>
      </div>

      {/* Editor */}
      <div className="flex flex-1 flex-col">
        {current ? (
          <>
            <input
              value={current.title}
              onChange={(e) =>
                setNotes((prev) =>
                  prev.map((n) => (n.id === selected ? { ...n, title: e.target.value } : n)),
                )
              }
              className="border-b border-slate-200 px-6 py-4 text-xl font-bold text-slate-900 outline-none placeholder:text-slate-300"
              placeholder="Note title"
            />
            <textarea
              value={current.body}
              onChange={(e) =>
                setNotes((prev) =>
                  prev.map((n) => (n.id === selected ? { ...n, body: e.target.value } : n)),
                )
              }
              className="flex-1 resize-none px-6 py-4 text-sm leading-relaxed text-slate-700 outline-none placeholder:text-slate-300"
              placeholder="Start writing..."
            />
          </>
        ) : (
          <div className="flex flex-1 items-center justify-center text-sm text-slate-400">
            Select a note or create a new one
          </div>
        )}
      </div>
    </div>
  )
}
