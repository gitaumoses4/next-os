'use client'

import { useState } from 'react'
import { Card, CardBody, Chip, Avatar } from '@heroui/react'

const today = new Date()
const currentMonth = today.getMonth()
const currentYear = today.getFullYear()

function getDaysInMonth(month: number, year: number) {
  return new Date(year, month + 1, 0).getDate()
}

function getFirstDayOfMonth(month: number, year: number) {
  return new Date(year, month, 1).getDay()
}

const events: Record<number, { title: string; color: string; time: string }[]> = {
  3: [{ title: 'Design review', color: 'bg-blue-500', time: '10:00 AM' }],
  7: [{ title: 'Sprint planning', color: 'bg-violet-500', time: '9:00 AM' }],
  12: [
    { title: 'Team standup', color: 'bg-emerald-500', time: '9:30 AM' },
    { title: '1:1 with Sarah', color: 'bg-amber-500', time: '2:00 PM' },
  ],
  15: [{ title: 'Product demo', color: 'bg-rose-500', time: '3:00 PM' }],
  18: [{ title: 'Offsite day 1', color: 'bg-cyan-500', time: 'All day' }],
  19: [{ title: 'Offsite day 2', color: 'bg-cyan-500', time: 'All day' }],
  23: [{ title: 'Retro', color: 'bg-violet-500', time: '11:00 AM' }],
  28: [{ title: 'Release v2.4', color: 'bg-emerald-500', time: '4:00 PM' }],
}

const upcomingEvents = [
  { title: 'Design review', time: 'Today, 10:00 AM', avatar: 'DR', color: 'bg-blue-500' },
  { title: 'Sprint planning', time: 'Mar 7, 9:00 AM', avatar: 'SP', color: 'bg-violet-500' },
  { title: 'Team standup', time: 'Mar 12, 9:30 AM', avatar: 'TS', color: 'bg-emerald-500' },
  { title: '1:1 with Sarah', time: 'Mar 12, 2:00 PM', avatar: 'SC', color: 'bg-amber-500' },
  { title: 'Product demo', time: 'Mar 15, 3:00 PM', avatar: 'PD', color: 'bg-rose-500' },
]

const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

export default function Calendar() {
  const [selectedDay, setSelectedDay] = useState(today.getDate())
  const daysInMonth = getDaysInMonth(currentMonth, currentYear)
  const firstDay = getFirstDayOfMonth(currentMonth, currentYear)

  const blanks = Array.from({ length: firstDay }, (_, i) => i)
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1)

  return (
    <div className="flex h-screen bg-slate-50/50">
      {/* Calendar grid */}
      <div className="flex flex-1 flex-col p-6">
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-slate-900">
            {monthNames[currentMonth]} {currentYear}
          </h1>
        </div>

        <Card className="flex-1 border border-slate-200 shadow-sm">
          <CardBody className="p-0">
            {/* Day headers */}
            <div className="grid grid-cols-7 border-b border-slate-200">
              {dayNames.map((d) => (
                <div
                  key={d}
                  className="py-2 text-center text-xs font-medium text-slate-500"
                >
                  {d}
                </div>
              ))}
            </div>

            {/* Day cells */}
            <div className="grid flex-1 grid-cols-7">
              {blanks.map((b) => (
                <div
                  key={`blank-${b}`}
                  className="min-h-[80px] border-b border-r border-slate-100"
                />
              ))}
              {days.map((day) => {
                const dayEvents = events[day] ?? []
                const isToday = day === today.getDate()
                const isSelected = day === selectedDay

                return (
                  <button
                    key={day}
                    onClick={() => setSelectedDay(day)}
                    className={`min-h-[80px] border-b border-r border-slate-100 p-1.5 text-left transition-colors ${
                      isSelected ? 'bg-primary-50' : 'hover:bg-slate-50'
                    }`}
                  >
                    <span
                      className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs ${
                        isToday
                          ? 'bg-primary font-bold text-white'
                          : 'font-medium text-slate-700'
                      }`}
                    >
                      {day}
                    </span>
                    <div className="mt-1 flex flex-col gap-0.5">
                      {dayEvents.slice(0, 2).map((ev, i) => (
                        <div
                          key={i}
                          className={`${ev.color} truncate rounded px-1 py-0.5 text-[10px] font-medium text-white`}
                        >
                          {ev.title}
                        </div>
                      ))}
                      {dayEvents.length > 2 && (
                        <span className="text-[10px] text-slate-400">
                          +{dayEvents.length - 2} more
                        </span>
                      )}
                    </div>
                  </button>
                )
              })}
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Sidebar */}
      <div className="w-64 shrink-0 border-l border-slate-200 bg-white p-4">
        <h3 className="mb-3 text-sm font-semibold text-slate-900">Upcoming</h3>
        <div className="flex flex-col gap-3">
          {upcomingEvents.map((ev, i) => (
            <div key={i} className="flex items-start gap-2.5">
              <Avatar
                name={ev.avatar}
                size="sm"
                className={`${ev.color} shrink-0 text-[10px] text-white`}
              />
              <div>
                <p className="text-sm font-medium text-slate-800">
                  {ev.title}
                </p>
                <p className="text-xs text-slate-400">{ev.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
