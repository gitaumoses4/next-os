'use client'

import {
  Card,
  CardBody,
  CardHeader,
  Chip,
  Tab,
  Tabs,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from '@heroui/react'

const metrics = [
  { label: 'Page Views', value: '284,103', change: '+12%', positive: true },
  { label: 'Unique Visitors', value: '42,891', change: '+8%', positive: true },
  { label: 'Bounce Rate', value: '34.2%', change: '-3%', positive: true },
  { label: 'Avg. Session', value: '4m 32s', change: '+18%', positive: true },
]

const barData = [
  { day: 'Mon', value: 72 },
  { day: 'Tue', value: 85 },
  { day: 'Wed', value: 60 },
  { day: 'Thu', value: 92 },
  { day: 'Fri', value: 78 },
  { day: 'Sat', value: 45 },
  { day: 'Sun', value: 38 },
]

const referrers = [
  { source: 'Google Search', visitors: '18,204', pct: '42.4%', trend: '+5.2%' },
  { source: 'Direct', visitors: '12,891', pct: '30.0%', trend: '+2.1%' },
  { source: 'Twitter / X', visitors: '5,340', pct: '12.4%', trend: '+18.7%' },
  { source: 'GitHub', visitors: '3,891', pct: '9.1%', trend: '+31.2%' },
  { source: 'Hacker News', visitors: '1,542', pct: '3.6%', trend: '-8.3%' },
  { source: 'Other', visitors: '1,023', pct: '2.4%', trend: '+0.4%' },
]

const maxBar = Math.max(...barData.map((d) => d.value))

export default function Analytics() {
  return (
    <div className="min-h-screen bg-slate-50/50 p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Analytics</h1>
          <p className="text-sm text-slate-500">Traffic &amp; engagement</p>
        </div>
        <Tabs size="sm" variant="bordered">
          <Tab key="7d" title="7 days" />
          <Tab key="30d" title="30 days" />
          <Tab key="90d" title="90 days" />
        </Tabs>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {metrics.map((m) => (
          <Card key={m.label} className="border border-slate-200 shadow-sm">
            <CardBody className="gap-1 p-4">
              <span className="text-xs font-medium text-slate-500">
                {m.label}
              </span>
              <div className="flex items-end gap-2">
                <span className="text-xl font-bold text-slate-900">
                  {m.value}
                </span>
                <Chip
                  size="sm"
                  variant="flat"
                  color={m.positive ? 'success' : 'danger'}
                >
                  {m.change}
                </Chip>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="border border-slate-200 shadow-sm lg:col-span-2">
          <CardHeader className="flex-col items-start px-4 pb-0 pt-4">
            <h3 className="text-sm font-semibold text-slate-900">
              Weekly Traffic
            </h3>
          </CardHeader>
          <CardBody className="px-4 pb-4 pt-6">
            <div className="flex items-end gap-3" style={{ height: 180 }}>
              {barData.map((d) => (
                <div
                  key={d.day}
                  className="flex flex-1 flex-col items-center gap-2"
                >
                  <div className="w-full flex items-end justify-center" style={{ height: 150 }}>
                    <div
                      className="w-full max-w-[40px] rounded-t-md bg-primary transition-all hover:bg-primary-400"
                      style={{ height: `${(d.value / maxBar) * 150}px` }}
                    />
                  </div>
                  <span className="text-xs text-slate-500">{d.day}</span>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>

        <Card className="border border-slate-200 shadow-sm">
          <CardHeader className="flex-col items-start px-4 pb-0 pt-4">
            <h3 className="text-sm font-semibold text-slate-900">
              Devices
            </h3>
          </CardHeader>
          <CardBody className="flex flex-col justify-center gap-4 px-4">
            {[
              { label: 'Desktop', pct: 58, color: 'bg-blue-500' },
              { label: 'Mobile', pct: 34, color: 'bg-violet-500' },
              { label: 'Tablet', pct: 8, color: 'bg-amber-500' },
            ].map((d) => (
              <div key={d.label} className="flex items-center gap-3">
                <div className={`h-3 w-3 rounded-full ${d.color}`} />
                <span className="flex-1 text-sm text-slate-700">
                  {d.label}
                </span>
                <span className="text-sm font-semibold text-slate-900">
                  {d.pct}%
                </span>
              </div>
            ))}
          </CardBody>
        </Card>
      </div>

      <Card className="border border-slate-200 shadow-sm">
        <CardHeader className="flex-col items-start px-4 pb-0 pt-4">
          <h3 className="text-sm font-semibold text-slate-900">
            Top Referrers
          </h3>
        </CardHeader>
        <CardBody className="px-0 py-0">
          <Table
            removeWrapper
            aria-label="Top referrers"
            className="min-w-full"
          >
            <TableHeader>
              <TableColumn>SOURCE</TableColumn>
              <TableColumn>VISITORS</TableColumn>
              <TableColumn>SHARE</TableColumn>
              <TableColumn>TREND</TableColumn>
            </TableHeader>
            <TableBody>
              {referrers.map((r) => (
                <TableRow key={r.source}>
                  <TableCell className="font-medium">{r.source}</TableCell>
                  <TableCell>{r.visitors}</TableCell>
                  <TableCell>{r.pct}</TableCell>
                  <TableCell>
                    <Chip
                      size="sm"
                      variant="flat"
                      color={r.trend.startsWith('+') ? 'success' : 'danger'}
                    >
                      {r.trend}
                    </Chip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardBody>
      </Card>
    </div>
  )
}
