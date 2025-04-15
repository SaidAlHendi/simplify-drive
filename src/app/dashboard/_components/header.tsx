'use client'
import { Button } from '@/components/ui/button'
import {
  OrganizationSwitcher,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
  useSession,
} from '@clerk/nextjs'
import { PackageOpen } from 'lucide-react'
import Link from 'next/link'

export function Header() {
  const { isSignedIn } = useSession()
  return (
    <div className='relative z-10 border-b py-4 bg-gray-50'>
      <div className='items-center container mx-auto justify-between flex'>
        <Link href='/' className='flex gap-2 items-center text-xl text-black'>
          <PackageOpen className='w-7 h-7' />
          FileDrive
        </Link>

        {/*      <SignedIn>
          <Button variant={'outline'}>
            <Link href='/dashboard/files'>Your Files</Link>
          </Button>
        </SignedIn> */}

        <div className='flex gap-2'>
          <OrganizationSwitcher />
          <UserButton />
          {!isSignedIn && (
            <SignedOut>
              <SignInButton mode='modal'>
                <Button>Sign In</Button>
              </SignInButton>
            </SignedOut>
          )}
        </div>
      </div>
    </div>
  )
}
