const stats = [
  { label: 'Total Users', value: '12,847', change: '+14%' },
  { label: 'Revenue', value: '$48,290', change: '+8%' },
  { label: 'Active Now', value: '342', change: '+23%' },
  { label: 'Conversion', value: '3.2%', change: '-2%' },
]

export default function Dashboard() {
  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ fontSize: 22, marginBottom: 20 }}>Dashboard</h1>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: 16,
          marginBottom: 24,
        }}
      >
        {stats.map((stat) => (
          <div
            key={stat.label}
            style={{
              padding: 16,
              background: '#fff',
              borderRadius: 8,
              border: '1px solid #e5e5e5',
            }}
          >
            <div style={{ fontSize: 13, color: '#888' }}>{stat.label}</div>
            <div style={{ fontSize: 24, fontWeight: 600, marginTop: 4 }}>
              {stat.value}
            </div>
            <div
              style={{
                fontSize: 13,
                marginTop: 4,
                color: stat.change.startsWith('+') ? '#16a34a' : '#dc2626',
              }}
            >
              {stat.change} from last month
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          padding: 24,
          background: '#fff',
          borderRadius: 8,
          border: '1px solid #e5e5e5',
          height: 240,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#aaa',
          fontSize: 14,
        }}
      >
        Chart placeholder — weekly activity
      </div>
    </div>
  )
}
