'use client'
import { Button } from '@/components/ui/button'
import { SidebarTrigger } from '@/components/ui/sidebar'
import {
  OrganizationSwitcher,
  SignInButton,
  SignedOut,
  UserButton,
  useSession,
} from '@clerk/nextjs'
import { PackageOpen } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function Header() {
  const { isSignedIn } = useSession()
  const pathname = usePathname()

  return (
    <div className='relative z-10 border-b py-4 bg-gray-50 '>
      <div className='items-center container mx-auto justify-between flex'>
        {pathname !== '/' && <SidebarTrigger />}
        <Link
          href='/'
          className='flex gap-2 items-center text-xl text-primary font-semibold tracking-widest '
        >
          <PackageOpen className='w-7 h-7 sr-only md:not-sr-only' />
          Simplify Drive
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
