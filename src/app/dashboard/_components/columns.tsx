'use client'

import { ColumnDef } from '@tanstack/react-table'
import { Doc, Id } from '../../../../convex/_generated/dataModel'
import { formatRelative } from 'date-fns'
import { api } from '../../../../convex/_generated/api'
import { useQuery } from 'convex/react'
import { AvatarImage, Avatar, AvatarFallback } from '@/components/ui/avatar'
import { FileCardActions } from './FileCardAction'

function UserCell({ userId }: { userId: Id<'users'> }) {
  const userProfile = useQuery(api.users.getUserProfile, {
    userId: userId,
  })
  return (
    <div className='flex gap-2 text-xs text-gray-700 w-40 items-center'>
      <Avatar className='w-6 h-6'>
        <AvatarImage src={userProfile?.image} />

        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      {userProfile?.name}
    </div>
  )
}

export const columns: ColumnDef<Doc<'files'> & { isFavorited: boolean }>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'type',
    header: 'Type',
  },
  {
    accessorKey: 'User',
    cell: ({ row }) => {
      return <UserCell userId={row.original.userId} />
    },
  },
  {
    accessorKey: 'Uploaded on',
    cell: ({ row }) => {
      const isDeleted = !!row.original.deletedAt

      return (
        <div className='text-xs text-gray-700'>
          {isDeleted
            ? `Deleted on ${formatRelative(new Date(row.original.deletedAt!), new Date())}`
            : `Uploaded on ${formatRelative(new Date(row.original._creationTime), new Date())}`}
        </div>
      )
    },
  },
  {
    accessorKey: 'Action',
    cell: ({ row }) => {
      return (
        <FileCardActions
          file={row.original}
          isFavorited={row.original.isFavorited}
        />
      )
    },
  },
]
