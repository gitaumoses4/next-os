'use client'

import { useState } from 'react'

export default function Settings() {
  const [name, setName] = useState('Moses Gitau')
  const [email, setEmail] = useState('moses@example.com')
  const [notifications, setNotifications] = useState(true)
  const [darkMode, setDarkMode] = useState(false)

  return (
    <div style={{ padding: 24, maxWidth: 480 }}>
      <h1 style={{ fontSize: 22, marginBottom: 20 }}>Settings</h1>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <span style={{ fontSize: 13, fontWeight: 500 }}>Name</span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{
              padding: '8px 12px',
              borderRadius: 6,
              border: '1px solid #ddd',
              fontSize: 14,
            }}
          />
        </label>

        <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <span style={{ fontSize: 13, fontWeight: 500 }}>Email</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              padding: '8px 12px',
              borderRadius: 6,
              border: '1px solid #ddd',
              fontSize: 14,
            }}
          />
        </label>

        <label
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '8px 0',
          }}
        >
          <span style={{ fontSize: 14 }}>Email notifications</span>
          <input
            type="checkbox"
            checked={notifications}
            onChange={(e) => setNotifications(e.target.checked)}
            style={{ width: 18, height: 18 }}
          />
        </label>

        <label
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '8px 0',
          }}
        >
          <span style={{ fontSize: 14 }}>Dark mode</span>
          <input
            type="checkbox"
            checked={darkMode}
            onChange={(e) => setDarkMode(e.target.checked)}
            style={{ width: 18, height: 18 }}
          />
        </label>

        <button
          style={{
            marginTop: 8,
            padding: '10px 20px',
            background: '#0070f3',
            color: '#fff',
            border: 'none',
            borderRadius: 6,
            fontSize: 14,
            cursor: 'pointer',
            alignSelf: 'flex-start',
          }}
        >
          Save changes
        </button>
      </div>
    </div>
  )
}
