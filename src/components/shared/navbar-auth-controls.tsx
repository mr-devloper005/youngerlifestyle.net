'use client'

import Link from 'next/link'
import { ChevronDown, LayoutGrid, LogOut, Plus, FileText, Building2, Tag, Image as ImageIcon, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useAuth } from '@/lib/auth-context'
import { SITE_CONFIG, type TaskKey } from '@/lib/site-config'

const taskIcons: Record<TaskKey, any> = {
  article: FileText,
  listing: Building2,
  sbm: LayoutGrid,
  classified: Tag,
  image: ImageIcon,
  profile: User,
  social: LayoutGrid,
  pdf: FileText,
  org: Building2,
  comment: FileText,
}

export function NavbarAuthControls() {
  const { user, logout } = useAuth()

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            size="sm"
            className="hidden h-10 gap-1 rounded-full border border-neutral-200 bg-white px-4 text-neutral-900 shadow-sm hover:bg-neutral-50 sm:flex"
          >
            <Plus className="h-4 w-4" />
            Create
            <ChevronDown className="h-3 w-3 opacity-60" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56 border-neutral-200 bg-white">
          {SITE_CONFIG.tasks.filter((task) => task.enabled).map((task) => {
            const Icon = taskIcons[task.key] || LayoutGrid
            return (
              <DropdownMenuItem key={task.key} asChild>
                <Link href={`/create/${task.key}`}>
                  <Icon className="mr-2 h-4 w-4" />
                  Create {task.label}
                </Link>
              </DropdownMenuItem>
            )
          })}
        </DropdownMenuContent>
      </DropdownMenu>

      <div className="flex items-center gap-2 sm:gap-3">
        <div className="flex items-center gap-2" title={user?.name || 'Account'}>
          <Avatar className="h-9 w-9 border border-neutral-200">
            <AvatarImage src={user?.avatar} alt={user?.name} />
            <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
          </Avatar>
          <span className="hidden max-w-[140px] truncate text-sm font-medium text-neutral-800 md:inline">{user?.name}</span>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={logout}
          className="h-9 gap-1.5 rounded-full border-neutral-200 px-3 text-neutral-900 hover:bg-neutral-50 sm:px-4"
        >
          <LogOut className="h-4 w-4" />
          <span className="hidden sm:inline">Sign out</span>
        </Button>
      </div>
    </>
  )
}
