import React, { useState } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Doc } from '../../convex/_generated/dataModel'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { MoreVertical, Trash2Icon } from 'lucide-react'
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
import { useMutation } from 'convex/react'
import { api } from '../../convex/_generated/api'
import { toast } from 'sonner'

function FileCardAction({ file }: { file: Doc<'files'> }) {
  const [isConfirmOpen, setIsConfirmOpen] = useState<boolean>(false)
  const deleteFile = useMutation(api.files.deleteFile)
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
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}
export const FileCard = ({ file }: { file: Doc<'files'> }) => {
  return (
    <Card>
      <CardHeader className=' relative '>
        <CardTitle>{file.name}</CardTitle>
        <div className='absolute top-0 right-2 '>
          <FileCardAction file={file} />
        </div>
      </CardHeader>
      <CardContent>
        <p>Card Content</p>
      </CardContent>
      <CardFooter>
        <p>Card Footer</p>
        <Button>Download</Button>
      </CardFooter>
    </Card>
  )
}
