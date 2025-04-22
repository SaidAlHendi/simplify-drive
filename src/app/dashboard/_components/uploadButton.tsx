'use client'
import { Button } from '@/components/ui/button'
import { useOrganization, useUser } from '@clerk/nextjs'
import { useMutation } from 'convex/react'
import { api } from '../../../../convex/_generated/api'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Loader2 } from 'lucide-react'

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useState } from 'react'
import { toast } from 'sonner'
import { Doc } from '../../../../convex/_generated/dataModel'
const formSchema = z.object({
  title: z.string().min(1).max(200),
  file: z
    .custom<FileList>((val) => val instanceof FileList, 'Required')
    .refine((files) => files.length > 0, `Required`),
})
export default function UploadButton() {
  const organzation = useOrganization()
  const user = useUser()
  let orgId: string | undefined = undefined
  if (organzation.isLoaded && user.isLoaded) {
    orgId = organzation.organization?.id ?? user.user?.id
  }
  const createFile = useMutation(api.files.createFile)
  const [isFileDialogOpen, setIsFileDialogOpen] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      file: undefined,
    },
  })

  const generateUploadUrl = useMutation(api.files.generateUploadUrl)

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      if (!orgId) return
      const fileType = values.file[0].type
      const postUrl = await generateUploadUrl()
      const result = await fetch(postUrl, {
        method: 'POST',
        headers: { 'Content-Type': fileType },
        body: values.file[0],
      })
      const { storageId } = await result.json()
      const types = {
        'image/png': 'image',
        'image/jpeg': 'image',
        'image/jpg': 'image',
        'image/webp': 'image',
        'image/gif': 'image',
        'image/svg+xml': 'image',
        'application/pdf': 'pdf',
        'text/csv': 'csv',
      } as Record<string, Doc<'files'>['type']>

      await createFile({
        name: values.title,
        orgId: orgId,
        fileId: storageId,
        type: types[fileType],
      })
      form.reset()
      setIsFileDialogOpen(false)
      toast.success('File Uploaded', {
        description: 'Now everyone can view your file',
      })
    } catch (error) {
      console.error('Upload failed:', error)

      toast.error('Something went wrong', {
        description: 'Your file could not be uploaded, try again later',
      })
    }
  }
  return (
    <Dialog
      open={isFileDialogOpen}
      onOpenChange={(isOpen) => {
        setIsFileDialogOpen(isOpen)
        form.reset()
      }}
    >
      {' '}
      <DialogTrigger asChild>
        <Button>Upload File</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className='mb-8'>Upload your File </DialogTitle>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
              <FormField
                control={form.control}
                name='title'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='file'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>File</FormLabel>
                    <FormControl>
                      <Input
                        onChange={(e) => field.onChange(e.target.files)}
                        accept='image/*,application/pdf,text/csv'
                        type='file'
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type='submit'
                disabled={form.formState.isSubmitting}
                className='flex gap-1'
              >
                {form.formState.isSubmitting && (
                  <Loader2 className='h-4 w-4 animate-spin' />
                )}
                {form.formState.isSubmitting ? 'Uploading...' : 'Submit'}
              </Button>
            </form>
          </Form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}
