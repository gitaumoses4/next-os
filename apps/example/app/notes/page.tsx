'use client'

import { useState } from 'react'

const initialNotes = [
  { id: 1, title: 'Project ideas', body: 'Build a desktop OS shell for Next.js apps...' },
  { id: 2, title: 'Meeting notes', body: 'Discussed v1 milestones and timeline.' },
]

export default function Notes() {
  const [notes, setNotes] = useState(initialNotes)
  const [selected, setSelected] = useState(notes[0].id)
  const current = notes.find((n) => n.id === selected)

  const updateBody = (body: string) => {
    setNotes((prev) =>
      prev.map((n) => (n.id === selected ? { ...n, body } : n))
    )
  }

  const addNote = () => {
    const id = Date.now()
    const note = { id, title: 'Untitled', body: '' }
    setNotes((prev) => [...prev, note])
    setSelected(id)
  }

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <div
        style={{
          width: 200,
          borderRight: '1px solid #e5e5e5',
          background: '#fafafa',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div
          style={{
            padding: '12px 16px',
            borderBottom: '1px solid #e5e5e5',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <span style={{ fontSize: 13, fontWeight: 600 }}>Notes</span>
          <button
            onClick={addNote}
            style={{
              background: 'none',
              border: 'none',
              fontSize: 18,
              cursor: 'pointer',
              color: '#0070f3',
              lineHeight: 1,
            }}
          >
            +
          </button>
        </div>
        <div style={{ flex: 1, overflow: 'auto' }}>
          {notes.map((note) => (
            <div
              key={note.id}
              onClick={() => setSelected(note.id)}
              style={{
                padding: '10px 16px',
                cursor: 'pointer',
                background: note.id === selected ? '#e8f0fe' : 'transparent',
                borderBottom: '1px solid #eee',
              }}
            >
              <div style={{ fontSize: 13, fontWeight: 500 }}>{note.title}</div>
              <div
                style={{
                  fontSize: 12,
                  color: '#999',
                  marginTop: 2,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {note.body || 'Empty note'}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {current && (
          <>
            <input
              value={current.title}
              onChange={(e) =>
                setNotes((prev) =>
                  prev.map((n) =>
                    n.id === selected ? { ...n, title: e.target.value } : n
                  )
                )
              }
              style={{
                padding: '12px 16px',
                border: 'none',
                borderBottom: '1px solid #e5e5e5',
                fontSize: 16,
                fontWeight: 600,
                outline: 'none',
              }}
            />
            <textarea
              value={current.body}
              onChange={(e) => updateBody(e.target.value)}
              style={{
                flex: 1,
                padding: 16,
                border: 'none',
                resize: 'none',
                fontSize: 14,
                lineHeight: 1.6,
                outline: 'none',
              }}
            />
          </>
        )}
      </div>
    </div>
  )
}
