'use client'
import { useOrganization, useUser } from '@clerk/nextjs'
import { useQuery } from 'convex/react'

import Image from 'next/image'
import { Loader2 } from 'lucide-react'
import { useState } from 'react'
import SearchBar from '@/app/dashboard/_components/searchBar'
import { FileCard } from '../_components/fileCard'
import { api } from '../../../../convex/_generated/api'
import UploadButton from '../_components/uploadButton'
export default function FilesBrowser({
  title,
  favorites,
  deletedOnly,
}: {
  title: string
  favorites?: boolean
  deletedOnly?: boolean
}) {
  const organzation = useOrganization()
  const user = useUser()
  const [query, setQuery] = useState('')
  let orgId: string | undefined = undefined
  if (organzation.isLoaded && user.isLoaded) {
    orgId = organzation.organization?.id ?? user.user?.id
  }
  const getFiles = useQuery(
    api.files.getFiles,
    orgId ? { orgId, query, favorites, deletedOnly } : 'skip'
  )
  const getFavorites = useQuery(
    api.files.getAllFavorites,
    orgId ? { orgId } : 'skip'
  )
  const isLoading = getFiles === undefined
  return (
    <div className='w-full'>
      {isLoading && (
        <div className='flex flex-col items-center mt-24 gap-8 '>
          <div>
            <Loader2 className='h-32 w-32 animate-spin ' />
            <div className='text-2xl'>Loading...</div>
          </div>
        </div>
      )}
      {!isLoading && getFiles?.length === 0 && (
        <div className='flex flex-col items-center mt-24 gap-8 '>
          <Image alt='icon empty' src='/empty.svg' width='300' height='300' />
          <div className='text-xl'>You have no files, upload one now</div>
          <UploadButton />
        </div>
      )}
      {!isLoading && getFiles && getFiles?.length > 0 && (
        <>
          <div className='flex justify-between item-center mb-8 '>
            <h1 className='text-4xl font-bold'>{title}</h1>
            <SearchBar query={query} setQuery={setQuery} />
            <UploadButton />
          </div>
          <div className='grid grid-cols-3 gap-4 '>
            {getFiles &&
              getFiles?.map((file) => {
                return (
                  <FileCard
                    key={file._id}
                    file={file}
                    favorites={getFavorites ?? []}
                  />
                )
              })}
          </div>
        </>
      )}
    </div>
  )
}
