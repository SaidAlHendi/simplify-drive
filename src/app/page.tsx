'use client'
import { Button } from '@/components/ui/button'
import {
  SignedOut,
  SignInButton,
  useSession,
  SignedIn,
  SignOutButton,
} from '@clerk/nextjs'
import { useMutation, useQuery } from 'convex/react'
import { api } from '../../convex/_generated/api'

export default function Home() {
  const createFile = useMutation(api.files.createFile)
  const getFiles = useQuery(api.files.getFiles)
  return (
    <div className='grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]'>
      <SignedIn>
        {' '}
        <SignOutButton>
          <Button>Sign Out </Button>
        </SignOutButton>
      </SignedIn>
      <SignedOut>
        <SignInButton mode='modal'>
          <Button>Sign In</Button>
        </SignInButton>
      </SignedOut>
      {getFiles?.map((file) => {
        return <div key={file._id}>{file.name}</div>
      })}
      <Button
        onClick={() => {
          createFile({
            name: 'HELLO SAID',
          })
        }}
      >
        Click me
      </Button>
    </div>
  )
}
