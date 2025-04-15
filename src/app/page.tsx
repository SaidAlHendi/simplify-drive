'use client'
import { useOrganization, useUser } from '@clerk/nextjs'
import { useQuery } from 'convex/react'
import { api } from '../../convex/_generated/api'
import UploadButton from './uploadButton'

import { FileCard } from './fileCard'
import Image from 'next/image'
import { Loader2 } from 'lucide-react'
export default function Home() {
  const organzation = useOrganization()
  const user = useUser()
  let orgId: string | undefined = undefined
  if (organzation.isLoaded && user.isLoaded) {
    orgId = organzation.organization?.id ?? user.user?.id
  }
  const getFiles = useQuery(api.files.getFiles, orgId ? { orgId } : 'skip')
  const isLoading = getFiles === undefined
  return (
    <main className='container mx-auto pt-12'>
      {isLoading && (
        <div className='flex flex-col items-center mt-24 gap-8 '>
          <div>
            <Loader2 className='h-32 w-32 animate-spin ' />
            <div className='text-2xl'>Loading...</div>
          </div>
        </div>
      )}
      {!isLoading && getFiles.length === 0 && (
        <div className='flex flex-col items-center mt-24 gap-8 '>
          <Image alt='icon empty' src='/empty.svg' width='300' height='300' />
          <div className='text-xl'>You have no files, upload one now</div>
          <UploadButton />
        </div>
      )}
      {!isLoading && getFiles.length > 0 && (
        <>
          <div className='flex justify-between item-center mb-8 '>
            <h1 className='text-4xl font-bold'>Your Files</h1>

            <UploadButton />
          </div>
          <div className='grid grid-cols-3 gap-4 '>
            {getFiles &&
              getFiles?.map((file) => {
                return <FileCard key={file._id} file={file} />
              })}
          </div>
        </>
      )}
    </main>
  )
}
