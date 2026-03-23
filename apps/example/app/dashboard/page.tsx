'use client'

import { Card, CardBody, CardHeader, Chip, Divider, Progress, Avatar } from '@heroui/react'
import {
  HiOutlineUsers,
  HiOutlineCurrencyDollar,
  HiOutlineBolt,
  HiOutlineArrowTrendingUp,
} from 'react-icons/hi2'

const stats = [
  {
    label: 'Total Users',
    value: '12,847',
    change: '+14.2%',
    positive: true,
    icon: HiOutlineUsers,
    color: 'text-blue-600 bg-blue-50',
  },
  {
    label: 'Revenue',
    value: '$48,290',
    change: '+8.1%',
    positive: true,
    icon: HiOutlineCurrencyDollar,
    color: 'text-emerald-600 bg-emerald-50',
  },
  {
    label: 'Active Now',
    value: '342',
    change: '+23.5%',
    positive: true,
    icon: HiOutlineBolt,
    color: 'text-amber-600 bg-amber-50',
  },
  {
    label: 'Conversion',
    value: '3.24%',
    change: '-2.1%',
    positive: false,
    icon: HiOutlineArrowTrendingUp,
    color: 'text-violet-600 bg-violet-50',
  },
]

const recentActivity = [
  { user: 'Sarah Chen', action: 'Upgraded to Pro plan', time: '2m ago', avatar: 'SC' },
  { user: 'Alex Rivera', action: 'Created new project', time: '14m ago', avatar: 'AR' },
  { user: 'Jordan Lee', action: 'Invited 3 team members', time: '1h ago', avatar: 'JL' },
  { user: 'Taylor Kim', action: 'Completed onboarding', time: '2h ago', avatar: 'TK' },
  { user: 'Morgan Wu', action: 'Exported analytics report', time: '3h ago', avatar: 'MW' },
]

const topPages = [
  { page: '/dashboard', views: 4821, pct: 100 },
  { page: '/analytics', views: 3104, pct: 64 },
  { page: '/settings', views: 1872, pct: 39 },
  { page: '/files', views: 1340, pct: 28 },
  { page: '/notes', views: 980, pct: 20 },
]

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-slate-50/50 p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-sm text-slate-500">Overview of your workspace activity</p>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="border border-slate-200 shadow-sm">
            <CardBody className="gap-2 p-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500">{stat.label}</span>
                <div
                  className={`${stat.color} flex h-8 w-8 items-center justify-center rounded-lg`}
                >
                  <stat.icon className="h-4 w-4" />
                </div>
              </div>
              <div className="flex items-end gap-2">
                <span className="text-2xl font-bold text-slate-900">{stat.value}</span>
                <Chip
                  size="sm"
                  variant="flat"
                  color={stat.positive ? 'success' : 'danger'}
                  className="mb-0.5"
                >
                  {stat.change}
                </Chip>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
        <Card className="border border-slate-200 shadow-sm lg:col-span-3">
          <CardHeader className="flex-col items-start px-4 pb-0 pt-4">
            <h3 className="text-sm font-semibold text-slate-900">Recent Activity</h3>
          </CardHeader>
          <CardBody className="px-4 py-3">
            <div className="flex flex-col gap-0">
              {recentActivity.map((item, i) => (
                <div key={i}>
                  <div className="flex items-center gap-3 py-3">
                    <Avatar
                      name={item.avatar}
                      size="sm"
                      className="shrink-0 bg-slate-200 text-xs text-slate-600"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-slate-900">{item.user}</p>
                      <p className="truncate text-xs text-slate-500">{item.action}</p>
                    </div>
                    <span className="shrink-0 text-xs text-slate-400">{item.time}</span>
                  </div>
                  {i < recentActivity.length - 1 && <Divider />}
                </div>
              ))}
            </div>
          </CardBody>
        </Card>

        <Card className="border border-slate-200 shadow-sm lg:col-span-2">
          <CardHeader className="flex-col items-start px-4 pb-0 pt-4">
            <h3 className="text-sm font-semibold text-slate-900">Top Pages</h3>
          </CardHeader>
          <CardBody className="gap-4 px-4 py-3">
            {topPages.map((page) => (
              <div key={page.page} className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-700">{page.page}</span>
                  <span className="text-xs font-medium text-slate-500">
                    {page.views.toLocaleString()}
                  </span>
                </div>
                <Progress size="sm" value={page.pct} color="primary" className="h-1.5" />
              </div>
            ))}
          </CardBody>
        </Card>
      </div>
    </div>
  )
}
