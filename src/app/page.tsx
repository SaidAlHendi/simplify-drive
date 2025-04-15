'use client'
import { useOrganization, useUser } from '@clerk/nextjs'
import { useQuery } from 'convex/react'
import { api } from '../../convex/_generated/api'
import UploadButton from './uploadButton'

import { FileCard } from './fileCard'
export default function Home() {
  const organzation = useOrganization()
  const user = useUser()
  let orgId: string | undefined = undefined
  if (organzation.isLoaded && user.isLoaded) {
    orgId = organzation.organization?.id ?? user.user?.id
  }
  const getFiles = useQuery(api.files.getFiles, orgId ? { orgId } : 'skip')

  return (
    <main className='container mx-auto pt-12'>
      <div className='flex justify-between item-center mb-8 '>
        <h1 className='text-4xl font-bold'>Your Files</h1>

        <UploadButton />
      </div>
      <div className='grid grid-cols-4 gap-4 '>
        {getFiles &&
          getFiles?.map((file) => {
            return <FileCard key={file._id} file={file} />
          })}
      </div>
    </main>
  )
}
