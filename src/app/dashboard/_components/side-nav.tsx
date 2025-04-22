'use client'
import { FileIcon, StarIcon, TrashIcon } from 'lucide-react'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import Link from 'next/link'
import { cn } from '@/lib/utils' // falls du ein `cn()` Utility nutzt (optional)
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { motion, AnimatePresence } from 'framer-motion'

// Menu items
const items = [
  {
    title: 'All Files',
    url: '/dashboard/files',
    icon: FileIcon,
  },
  {
    title: 'Favorites',
    url: '/dashboard/favorites',
    icon: StarIcon,
  },
  {
    title: 'Trash',
    url: '/dashboard/trash',
    icon: TrashIcon,
  },
]

export function AppSidebar() {
  const pathname = usePathname()
  return (
    <Sidebar className='border-r h-full bg-muted/40 p-4'>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className='text-muted-foreground text-sm mb-2'>
            Menu
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className='space-y-1'>
              {items.map((item) => {
                const isActive = pathname === item.url
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link
                        key={item.url}
                        href={item.url}
                        className='block relative'
                      >
                        <Button
                          variant='ghost'
                          className={cn(
                            'w-full justify-start gap-3 text-base font-medium transition-all duration-200 hover:bg-gray-200/70',
                            isActive
                              ? 'text-primary'
                              : 'text-secondary-foreground'
                          )}
                        >
                          <span
                            className={cn(
                              'transition-colors duration-200',
                              isActive
                                ? 'text-primary'
                                : 'text-secondary-foreground'
                            )}
                          >
                            {item.title}
                          </span>
                        </Button>

                        {isActive && (
                          <motion.div
                            layoutId='sidebar-indicator'
                            className='absolute left-0 top-0 h-full w-1 bg-primary -r-full'
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.2 }}
                          />
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
