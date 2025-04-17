import React, { ReactNode, useState } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Doc, Id } from '../../../../convex/_generated/dataModel'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  FileTextIcon,
  GanttChartIcon,
  ImageIcon,
  MoreVertical,
  StarHalf,
  StarIcon,
  Trash2Icon,
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
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
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

  return (
    <>
      <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                deleteFile({ fileId: file._id })
                toast.info('File deleted', {
                  description: 'Your File deleted successfuly',
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
          <DropdownMenuItem
            onClick={() => setIsConfirmOpen(true)}
            className='flex gap-1 text-red-500 items-center cursor-pointer'
          >
            <Trash2Icon className='w-4 h-4 text-red-500' /> Delete
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
  const fileUrl = useQuery(api.files.getImageUrl, {
    imageId: file.fileId,
  })
  const isFavorited = favorites.some((favorite) => favorite.fileId === file._id)

  const types = {
    image: <ImageIcon />,
    pdf: <FileTextIcon />,
    csv: <GanttChartIcon />,
  } as Record<Doc<'files'>['type'], ReactNode>

  return (
    <Card>
      <CardHeader className=' relative '>
        <CardTitle className='flex gap-2'>
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
        <Button
          onClick={() => {
            if (fileUrl) {
              window.open(fileUrl, '_blank')
            }
          }}
        >
          Download
        </Button>
        <div className='flex gap-2 text-xs text-gray-700 w-40 items-center'>
          <Avatar className='w-6 h-6'>
            {/*             <AvatarImage src={userProfile?.image} />
             */}{' '}
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          {/*           {userProfile?.name}
           */}{' '}
        </div>
        <div className='text-xs text-gray-700'>
          Uploaded on{' '}
          {/* {formatRelative(new Date(file._creationTime), new Date())} */}
        </div>
      </CardFooter>
    </Card>
  )
}
