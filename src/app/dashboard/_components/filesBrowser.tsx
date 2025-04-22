'use client'
import { useOrganization, useUser } from '@clerk/nextjs'
import { useQuery } from 'convex/react'

import Image from 'next/image'
import { GridIcon, Loader2, RowsIcon } from 'lucide-react'
import { useState } from 'react'
import SearchBar from '@/app/dashboard/_components/searchBar'
import { FileCard } from '../_components/fileCard'
import { api } from '../../../../convex/_generated/api'
import UploadButton from '../_components/uploadButton'
import { DataTable } from './fileTable'
import { columns } from './columns'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Label } from '@radix-ui/react-dropdown-menu'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { Doc } from '../../../../convex/_generated/dataModel'

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
  const [type, setType] = useState<Doc<'files'>['type'] | 'all'>('all')

  let orgId: string | undefined = undefined
  if (organzation.isLoaded && user.isLoaded) {
    orgId = organzation.organization?.id ?? user.user?.id
  }
  const getFiles = useQuery(
    api.files.getFiles,
    orgId
      ? {
          orgId,
          query,
          favorites,
          deletedOnly,
          type: type === 'all' ? undefined : type,
        }
      : 'skip'
  )
  const getFavorites = useQuery(
    api.files.getAllFavorites,
    orgId ? { orgId } : 'skip'
  )

  const modifiedFiles =
    getFiles?.map((file) => ({
      ...file,
      isFavorited: !!getFavorites?.some(
        (favorite) => favorite.fileId === file._id
      ),
    })) ?? []
  const isLoading = getFiles === undefined

  return (
    <div className='w-full px-4 md:px-6'>
      <div className='flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8'>
        <h1 className='text-2xl md:text-4xl font-bold'>{title}</h1>

        <div className='flex flex-col sm:flex-row gap-4 w-full md:w-auto'>
          <div className='flex-1 md:w-64'>
            <SearchBar query={query} setQuery={setQuery} />
          </div>
          <div className='flex-shrink-0'>
            <UploadButton />
          </div>
        </div>
      </div>

      <Tabs defaultValue='grid'>
        <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4'>
          <TabsList className='mb-2'>
            <TabsTrigger value='grid' className='flex gap-2 items-center'>
              <GridIcon className='h-4 w-4' />
              <span className='hidden sm:inline'>Grid</span>
            </TabsTrigger>
            <TabsTrigger value='table' className='flex gap-2 items-center'>
              <RowsIcon className='h-4 w-4' />
              <span className='hidden sm:inline'>Table</span>
            </TabsTrigger>
          </TabsList>

          <div className='flex gap-2 items-center'>
            <Label className='text-sm hidden sm:block'>Type Filter</Label>
            <Select
              value={type}
              onValueChange={(newType) => {
                setType(newType as Doc<'files'>['type'])
              }}
            >
              <SelectTrigger
                id='type-select'
                className='w-[120px] sm:w-[180px]'
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>All</SelectItem>
                <SelectItem value='image'>Image</SelectItem>
                <SelectItem value='csv'>CSV</SelectItem>
                <SelectItem value='pdf'>PDF</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {isLoading && (
          <div className='flex flex-col gap-8 w-full items-center mt-24'>
            <Loader2 className='h-16 w-16 md:h-32 md:w-32 animate-spin text-gray-500' />
            <div className='text-xl md:text-2xl'>Loading your files...</div>
          </div>
        )}

        <TabsContent value='grid'>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
            {modifiedFiles?.map((file) => {
              return <FileCard key={file._id} file={file} />
            })}
          </div>
        </TabsContent>
        <TabsContent value='table' className='overflow-hidden'>
          <div className='w-full overflow-auto -mx-4 px-4 md:mx-0 md:px-0'>
            <DataTable columns={columns} data={modifiedFiles} />
          </div>
        </TabsContent>
      </Tabs>

      {getFiles?.length === 0 && <Placeholder />}
    </div>
  )
}

function Placeholder() {
  return (
    <div className='flex flex-col gap-8 w-full items-center mt-12 md:mt-24'>
      <Image
        alt='an image of a picture and directory icon'
        width='200'
        height='200'
        src='/empty.svg'
        className='w-48 h-48 md:w-72 md:h-72'
      />
      <div className='text-xl md:text-2xl text-center px-4'>
        You have no files, upload one now
      </div>
      <UploadButton />
    </div>
  )
}
