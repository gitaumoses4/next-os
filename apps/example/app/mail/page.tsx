'use client'

import { useState } from 'react'
import { Avatar, Button, Divider } from '@heroui/react'
import {
  HiOutlineInbox,
  HiOutlinePaperAirplane,
  HiOutlineStar,
  HiOutlineArchiveBox,
  HiOutlineTrash,
  HiOutlineArrowUturnLeft,
} from 'react-icons/hi2'

const folders = [
  { id: 'inbox', label: 'Inbox', icon: HiOutlineInbox, count: 12 },
  { id: 'sent', label: 'Sent', icon: HiOutlinePaperAirplane, count: 0 },
  { id: 'starred', label: 'Starred', icon: HiOutlineStar, count: 3 },
  { id: 'archive', label: 'Archive', icon: HiOutlineArchiveBox, count: 0 },
  { id: 'trash', label: 'Trash', icon: HiOutlineTrash, count: 0 },
]

const emails = [
  {
    id: 1,
    from: 'Sarah Chen',
    avatar: 'SC',
    subject: 'Q1 Product Roadmap Review',
    preview:
      "Hey team, I've attached the updated roadmap for Q1. Let me know your thoughts on the new priorities...",
    body: "Hey team,\n\nI've attached the updated roadmap for Q1. Let me know your thoughts on the new priorities we discussed last Friday.\n\nKey changes:\n- Moved auth overhaul to P0\n- Added analytics dashboard to the sprint\n- Deferred mobile app to Q2\n\nPlease review and add comments by EOD Thursday.\n\nBest,\nSarah",
    time: '10:32 AM',
    unread: true,
    starred: true,
  },
  {
    id: 2,
    from: 'Alex Rivera',
    avatar: 'AR',
    subject: 'Re: Design system tokens',
    preview:
      "Looks great! I've pushed the updated color scale to the Figma library. The spacing tokens...",
    body: "Looks great! I've pushed the updated color scale to the Figma library.\n\nThe spacing tokens are aligned with the 4px grid now. Let me know if you want me to adjust the border radius values as well.\n\nAlso, should we schedule a sync with the front-end team to go over the migration path?\n\n—Alex",
    time: '9:15 AM',
    unread: true,
    starred: false,
  },
  {
    id: 3,
    from: 'CI Pipeline',
    avatar: 'CI',
    subject: 'Build #482 passed',
    preview: 'All 147 tests passed. Coverage: 94.2%. Deploy to staging triggered...',
    body: 'Build #482 — main branch\n\nStatus: Passed\nTests: 147/147\nCoverage: 94.2%\nDuration: 3m 12s\n\nStaging deploy triggered automatically.\nPreview: https://staging.example.com',
    time: 'Yesterday',
    unread: false,
    starred: false,
  },
  {
    id: 4,
    from: 'Jordan Lee',
    avatar: 'JL',
    subject: 'Team offsite planning',
    preview: "I've booked the venue for March 15-16. Here's the agenda draft for the two days...",
    body: "I've booked the venue for March 15-16.\n\nDay 1 — Strategy\n- 9:00 AM: Kickoff & retrospective\n- 11:00 AM: Product vision workshop\n- 2:00 PM: Technical architecture review\n\nDay 2 — Team Building\n- 10:00 AM: Escape room\n- 1:00 PM: Lunch at Chez Michel\n- 3:00 PM: Wrap up & Q2 goals\n\nLet me know if you have any conflicts!",
    time: 'Yesterday',
    unread: false,
    starred: true,
  },
  {
    id: 5,
    from: 'Morgan Wu',
    avatar: 'MW',
    subject: 'Invoice #1041 — March services',
    preview: 'Please find attached the invoice for consulting services rendered in March...',
    body: 'Hi,\n\nPlease find attached the invoice for consulting services rendered in March.\n\nAmount: $4,200.00\nDue date: April 15, 2026\nPayment terms: Net 30\n\nLet me know if you have any questions.\n\nBest,\nMorgan',
    time: 'Mar 18',
    unread: false,
    starred: false,
  },
]

export default function Mail() {
  const [activeFolder, setActiveFolder] = useState('inbox')
  const [selectedEmail, setSelectedEmail] = useState<number | null>(1)
  const current = emails.find((e) => e.id === selectedEmail)

  return (
    <div className="flex h-screen bg-default-50">
      {/* Sidebar */}
      <div className="flex w-48 shrink-0 flex-col border-r border-divider bg-content1 p-3">
        <Button color="primary" size="sm" className="mb-3 w-full font-medium">
          Compose
        </Button>
        <nav className="flex flex-col gap-0.5">
          {folders.map((f) => (
            <button
              key={f.id}
              onClick={() => setActiveFolder(f.id)}
              className={`flex items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                activeFolder === f.id
                  ? 'bg-primary-50 font-medium text-primary'
                  : 'text-foreground/70 hover:bg-default-100'
              }`}
            >
              <f.icon className="h-4 w-4" />
              <span className="flex-1">{f.label}</span>
              {f.count > 0 && <span className="text-xs text-default-400">{f.count}</span>}
            </button>
          ))}
        </nav>
      </div>

      {/* Email list */}
      <div className="flex w-72 shrink-0 flex-col border-r border-divider bg-content1">
        <div className="border-b border-divider px-4 py-3">
          <h2 className="text-sm font-semibold text-foreground">Inbox</h2>
        </div>
        <div className="flex-1 overflow-y-auto">
          {emails.map((email) => (
            <button
              key={email.id}
              onClick={() => setSelectedEmail(email.id)}
              className={`w-full border-b border-divider/50 px-4 py-3 text-left transition-colors ${
                selectedEmail === email.id ? 'bg-primary-50' : 'hover:bg-default-50'
              }`}
            >
              <div className="flex items-center gap-2">
                <span
                  className={`flex-1 truncate text-sm ${
                    email.unread ? 'font-semibold text-foreground' : 'text-foreground/80'
                  }`}
                >
                  {email.from}
                </span>
                <span className="shrink-0 text-xs text-default-400">{email.time}</span>
              </div>
              <p
                className={`mt-0.5 truncate text-sm ${
                  email.unread ? 'font-medium text-foreground/90' : 'text-foreground/70'
                }`}
              >
                {email.subject}
              </p>
              <p className="mt-0.5 truncate text-xs text-default-400">{email.preview}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Email detail */}
      <div className="flex flex-1 flex-col bg-content1">
        {current ? (
          <>
            <div className="flex items-center gap-2 border-b border-divider px-6 py-3">
              <Button isIconOnly variant="light" size="sm">
                <HiOutlineArchiveBox className="h-4 w-4" />
              </Button>
              <Button isIconOnly variant="light" size="sm">
                <HiOutlineTrash className="h-4 w-4" />
              </Button>
              <Button isIconOnly variant="light" size="sm">
                <HiOutlineArrowUturnLeft className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-5">
              <h2 className="text-lg font-semibold text-foreground">{current.subject}</h2>
              <div className="mt-4 flex items-center gap-3">
                <Avatar
                  name={current.avatar}
                  size="sm"
                  className="bg-default-100 text-xs text-default-600"
                />
                <div>
                  <p className="text-sm font-medium text-foreground">{current.from}</p>
                  <p className="text-xs text-default-400">{current.time}</p>
                </div>
                {current.starred && <HiOutlineStar className="ml-auto h-4 w-4 text-amber-400" />}
              </div>
              <Divider className="my-4" />
              <div className="whitespace-pre-wrap text-sm leading-relaxed text-foreground/80">
                {current.body}
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-1 items-center justify-center text-sm text-default-400">
            Select an email to read
          </div>
        )}
      </div>
    </div>
  )
}
