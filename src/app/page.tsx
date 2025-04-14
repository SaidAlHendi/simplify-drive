'use client'
import { Button } from '@/components/ui/button'
import { useOrganization, useUser } from '@clerk/nextjs'
import { useMutation, useQuery } from 'convex/react'
import { api } from '../../convex/_generated/api'

export default function Home() {
  const organzation = useOrganization()
  const user = useUser()
  let orgId: string | undefined = undefined
  if (organzation.isLoaded && user.isLoaded) {
    orgId = organzation.organization?.id ?? user.user?.id
  }
  const createFile = useMutation(api.files.createFile)
  const getFiles = useQuery(api.files.getFiles, orgId ? { orgId } : 'skip')
  return (
    <div className='flex min-h-screen flex-col items-center justify-between p-24'>
      {getFiles &&
        getFiles?.map((file) => {
          return <div key={file._id}>{file.name}</div>
        })}
      <Button
        onClick={() => {
          if (orgId)
            createFile({
              name: 'HELLO SAID',
              orgId: orgId,
            })
        }}
      >
        Click me
      </Button>
    </div>
  )
}
