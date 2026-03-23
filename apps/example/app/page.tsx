import { Card, CardBody } from '@heroui/react'
import Link from 'next/link'
import {
  HiOutlineChartBarSquare,
  HiOutlineCog6Tooth,
  HiOutlineDocumentText,
  HiOutlineCalendarDays,
  HiOutlineChartPie,
  HiOutlineFolder,
  HiOutlineEnvelope,
} from 'react-icons/hi2'

const apps = [
  { href: '/dashboard', label: 'Dashboard', icon: HiOutlineChartBarSquare, color: 'bg-blue-500' },
  { href: '/analytics', label: 'Analytics', icon: HiOutlineChartPie, color: 'bg-violet-500' },
  { href: '/mail', label: 'Mail', icon: HiOutlineEnvelope, color: 'bg-rose-500' },
  { href: '/calendar', label: 'Calendar', icon: HiOutlineCalendarDays, color: 'bg-amber-500' },
  { href: '/files', label: 'Files', icon: HiOutlineFolder, color: 'bg-emerald-500' },
  { href: '/notes', label: 'Notes', icon: HiOutlineDocumentText, color: 'bg-cyan-500' },
  { href: '/settings', label: 'Settings', icon: HiOutlineCog6Tooth, color: 'bg-gray-500' },
]

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="mx-auto max-w-3xl">
        <div className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">next-os</h1>
          <p className="mt-2 text-base text-slate-500">
            A desktop OS shell for your Next.js app. These routes will each render inside their own
            window.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {apps.map((app) => (
            <Link key={app.href} href={app.href}>
              <Card
                isPressable
                className="border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md"
              >
                <CardBody className="flex flex-col items-center gap-3 p-6">
                  <div
                    className={`${app.color} flex h-12 w-12 items-center justify-center rounded-xl text-white`}
                  >
                    <app.icon className="h-6 w-6" />
                  </div>
                  <span className="text-sm font-medium text-slate-700">{app.label}</span>
                </CardBody>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
