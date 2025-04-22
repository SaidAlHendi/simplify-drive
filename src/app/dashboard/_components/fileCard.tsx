'use client'
import { useQuery } from 'convex/react'
import { Doc } from '../../../../convex/_generated/dataModel'
import { api } from '../../../../convex/_generated/api'
import { FileTextIcon, GanttChartIcon, ImageIcon } from 'lucide-react'
import { ReactNode } from 'react'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import Image from 'next/image'
import { formatRelative } from 'date-fns'
import { AvatarImage, Avatar, AvatarFallback } from '@/components/ui/avatar'
import { FileCardActions } from './FileCardAction'

export const FileCard = ({
  file,
}: {
  file: Doc<'files'> & { isFavorited: boolean }
}) => {
  const isDeleted = !!file.deletedAt
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
          <FileCardActions file={file} isFavorited={file.isFavorited} />
        </div>
      </CardHeader>
      <CardContent className='h-[200px] flex justify-center items-center'>
        {file.type === 'image' && fileUrl && (
          <Image alt={file.name} src={fileUrl} width='200' height='100' />
        )}

        {file.type === 'csv' && <GanttChartIcon className='w-20 h-20' />}
        {file.type === 'pdf' && <FileTextIcon className='w-20 h-20' />}
      </CardContent>
      <CardFooter className='flex justify-between pt-4'>
        <div className='flex gap-2 text-xs text-gray-700 w-40 items-center'>
          <Avatar className='w-6 h-6'>
            <AvatarImage src={userProfile?.image} />

            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          {userProfile?.name}
        </div>
        <div className='text-xs text-gray-700'>
          {isDeleted
            ? `Deleted on ${formatRelative(new Date(file.deletedAt!), new Date())}`
            : `Uploaded on ${formatRelative(new Date(file._creationTime), new Date())}`}
        </div>
      </CardFooter>
    </Card>
  )
}
