'use client'

import { useState } from 'react'
import { Card, CardBody, Button, Chip, Progress, Breadcrumbs, BreadcrumbItem } from '@heroui/react'
import {
  HiOutlineFolder,
  HiOutlineDocument,
  HiOutlinePhoto,
  HiOutlineFilm,
  HiOutlineMusicalNote,
  HiOutlineArchiveBox,
  HiOutlineArrowUpTray,
  HiOutlineSquares2X2,
  HiOutlineBars3,
} from 'react-icons/hi2'

interface FileItem {
  name: string
  type: 'folder' | 'document' | 'image' | 'video' | 'audio' | 'archive'
  size?: string
  modified: string
  items?: number
}

const iconMap = {
  folder: HiOutlineFolder,
  document: HiOutlineDocument,
  image: HiOutlinePhoto,
  video: HiOutlineFilm,
  audio: HiOutlineMusicalNote,
  archive: HiOutlineArchiveBox,
}

const colorMap = {
  folder: 'text-blue-500',
  document: 'text-slate-500',
  image: 'text-rose-500',
  video: 'text-violet-500',
  audio: 'text-amber-500',
  archive: 'text-emerald-500',
}

const files: FileItem[] = [
  { name: 'Documents', type: 'folder', modified: 'Mar 20', items: 24 },
  { name: 'Photos', type: 'folder', modified: 'Mar 18', items: 1842 },
  { name: 'Projects', type: 'folder', modified: 'Mar 22', items: 8 },
  { name: 'Music', type: 'folder', modified: 'Feb 14', items: 312 },
  { name: 'Q1 Report.pdf', type: 'document', size: '2.4 MB', modified: 'Mar 21' },
  { name: 'Roadmap.xlsx', type: 'document', size: '890 KB', modified: 'Mar 19' },
  { name: 'Brand Guidelines.pdf', type: 'document', size: '14.2 MB', modified: 'Mar 15' },
  { name: 'Screenshot 2026-03-20.png', type: 'image', size: '1.8 MB', modified: 'Mar 20' },
  { name: 'Product Demo.mp4', type: 'video', size: '248 MB', modified: 'Mar 17' },
  { name: 'Podcast Episode 12.mp3', type: 'audio', size: '42 MB', modified: 'Mar 10' },
  { name: 'source-code-backup.zip', type: 'archive', size: '156 MB', modified: 'Mar 8' },
]

export default function Files() {
  const [view, setView] = useState<'grid' | 'list'>('list')

  return (
    <div className="min-h-screen bg-slate-50/50 p-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Files</h1>
          <Breadcrumbs className="mt-1" size="sm">
            <BreadcrumbItem>Home</BreadcrumbItem>
            <BreadcrumbItem>My Files</BreadcrumbItem>
          </Breadcrumbs>
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="bordered"
            startContent={<HiOutlineArrowUpTray className="h-4 w-4" />}
          >
            Upload
          </Button>
          <div className="flex rounded-lg border border-slate-200">
            <button
              onClick={() => setView('grid')}
              className={`rounded-l-lg p-1.5 ${
                view === 'grid' ? 'bg-slate-200' : 'bg-white hover:bg-slate-50'
              }`}
            >
              <HiOutlineSquares2X2 className="h-4 w-4 text-slate-600" />
            </button>
            <button
              onClick={() => setView('list')}
              className={`rounded-r-lg p-1.5 ${
                view === 'list' ? 'bg-slate-200' : 'bg-white hover:bg-slate-50'
              }`}
            >
              <HiOutlineBars3 className="h-4 w-4 text-slate-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Storage bar */}
      <Card className="mb-4 border border-slate-200 shadow-sm">
        <CardBody className="flex-row items-center gap-4 p-3">
          <div className="flex-1">
            <Progress size="sm" value={68} color="primary" className="max-w-full" />
          </div>
          <span className="shrink-0 text-xs text-slate-500">6.8 GB of 10 GB used</span>
        </CardBody>
      </Card>

      {view === 'list' ? (
        <Card className="border border-slate-200 shadow-sm">
          <CardBody className="p-0">
            {/* Header */}
            <div className="grid grid-cols-12 gap-2 border-b border-slate-200 px-4 py-2 text-xs font-medium text-slate-500">
              <div className="col-span-6">Name</div>
              <div className="col-span-2">Size</div>
              <div className="col-span-2">Modified</div>
              <div className="col-span-2">Type</div>
            </div>
            {files.map((file) => {
              const Icon = iconMap[file.type]
              return (
                <button
                  key={file.name}
                  className="grid w-full grid-cols-12 items-center gap-2 border-b border-slate-50 px-4 py-2.5 text-left transition-colors last:border-0 hover:bg-slate-50"
                >
                  <div className="col-span-6 flex items-center gap-3">
                    <Icon className={`h-5 w-5 ${colorMap[file.type]}`} />
                    <span className="truncate text-sm font-medium text-slate-800">{file.name}</span>
                  </div>
                  <div className="col-span-2 text-sm text-slate-500">
                    {file.size ?? `${file.items} items`}
                  </div>
                  <div className="col-span-2 text-sm text-slate-500">{file.modified}</div>
                  <div className="col-span-2">
                    <Chip size="sm" variant="flat" className="capitalize">
                      {file.type}
                    </Chip>
                  </div>
                </button>
              )
            })}
          </CardBody>
        </Card>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {files.map((file) => {
            const Icon = iconMap[file.type]
            return (
              <Card key={file.name} isPressable className="border border-slate-200 shadow-sm">
                <CardBody className="flex flex-col items-center gap-2 p-4">
                  <Icon className={`h-10 w-10 ${colorMap[file.type]}`} />
                  <span className="w-full truncate text-center text-sm font-medium text-slate-800">
                    {file.name}
                  </span>
                  <span className="text-xs text-slate-400">
                    {file.size ?? `${file.items} items`}
                  </span>
                </CardBody>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
