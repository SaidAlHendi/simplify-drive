'use client'
import React, { ReactNode, useState } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { formatRelative } from 'date-fns'

import { Doc, Id } from '../../../../convex/_generated/dataModel'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  FileIcon,
  FileTextIcon,
  GanttChartIcon,
  ImageIcon,
  MoreVertical,
  StarHalf,
  StarIcon,
  Trash2Icon,
  UndoIcon,
} from 'lucide-react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { useMutation, useQuery } from 'convex/react'
import { api } from '../../../../convex/_generated/api'
import { toast } from 'sonner'
import Image from 'next/image'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { DropdownMenuSeparator } from '@radix-ui/react-dropdown-menu'

function FileCardAction({
  file,
  isFavorited,
}: {
  file: Doc<'files'>
  isFavorited: boolean
}) {
  const [isConfirmOpen, setIsConfirmOpen] = useState<boolean>(false)
  const deleteFile = useMutation(api.files.deleteFile)
  const toggleFavorite = useMutation(api.files.toggleFavorite)
  const restoreFile = useMutation(api.files.restoreFile)
  const fileUrl = useQuery(api.files.getImageUrl, {
    imageId: file.fileId,
  })
  return (
    <>
      <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will mark the file for deletion process.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                deleteFile({ fileId: file._id })
                toast.info('File marked for deletion', {
                  description: 'Your File will be deleted soon',
                })
              }}
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <DropdownMenu>
        <DropdownMenuTrigger>
          <MoreVertical />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => {
              if (fileUrl) {
                window.open(fileUrl, '_blank')
              }
            }}
            className='flex gap-1 items-center cursor-pointer'
          >
            <FileIcon className='w-4 h-4' /> Download
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              if (file.shouldDelete) {
                restoreFile({
                  fileId: file._id,
                })
              } else {
                setIsConfirmOpen(true)
              }
            }}
            className='flex gap-1 items-center cursor-pointer'
          >
            {file.shouldDelete ? (
              <div className='flex gap-1 text-green-600 items-center cursor-pointer'>
                <UndoIcon className='w-4 h-4 text-green-600 ' /> Restore
              </div>
            ) : (
              <div className='flex gap-1 text-red-600 items-center cursor-pointer'>
                <Trash2Icon className='w-4 h-4 text-red-600 ' /> Delete
              </div>
            )}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => {
              toggleFavorite({
                fileId: file._id,
              })
            }}
            className='flex gap-1 items-center cursor-pointer'
          >
            {isFavorited ? (
              <div className='flex gap-1 items-center'>
                <StarIcon className='w-4 h-4' /> Unfavorite
              </div>
            ) : (
              <div className='flex gap-1 items-center'>
                <StarHalf className='w-4 h-4' /> Favorite
              </div>
            )}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}

export const FileCard = ({
  file,
  favorites,
}: {
  file: Doc<'files'>
  favorites: Doc<'favorites'>[]
}) => {
  const isFavorited = favorites.some((favorite) => favorite.fileId === file._id)
  const userProfile = useQuery(api.users.getUserProfile, {
    userId: file.userId,
  })
  const fileUrl = useQuery(api.files.getImageUrl, {
    imageId: file.fileId,
  })
  const types = {
    image: <ImageIcon />,
    pdf: <FileTextIcon />,
    csv: <GanttChartIcon />,
  } as Record<Doc<'files'>['type'], ReactNode>

  return (
    <Card>
      <CardHeader className=' relative '>
        <CardTitle className='flex gap-2 font-normal '>
          {' '}
          <div className='flex justify-center'>{types[file.type]}</div>
          {file.name}
        </CardTitle>
        <div className='absolute top-0 right-2 '>
          <FileCardAction file={file} isFavorited={isFavorited} />
        </div>
      </CardHeader>
      <CardContent className='h-[200px] flex justify-center items-center'>
        {file.type === 'image' && fileUrl && (
          <Image alt={file.name} src={fileUrl} width='200' height='100' />
        )}

        {file.type === 'csv' && <GanttChartIcon className='w-20 h-20' />}
        {file.type === 'pdf' && <FileTextIcon className='w-20 h-20' />}
      </CardContent>
      <CardFooter className='flex justify-between'>
        <div className='flex gap-2 text-xs text-gray-700 w-40 items-center'>
          <Avatar className='w-6 h-6'>
            <AvatarImage src={userProfile?.image} />

            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          {userProfile?.name}
        </div>
        <div className='text-xs text-gray-700'>
          Uploaded on {formatRelative(new Date(file._creationTime), new Date())}
        </div>
      </CardFooter>
    </Card>
  )
}
