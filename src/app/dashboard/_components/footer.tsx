import Link from 'next/link'

export function Footer() {
  return (
    <div className='h-40 bg-gray-100 flex items-center'>
      <div className='container mx-auto flex justify-between items-center'>
        <Link
          href='/'
          className='flex gap-2 items-center text-xl text-primary font-semibold tracking-widest '
        >
          Simplify Drive
        </Link>

        <Link
          className='hover:text-primary text-secondary-foreground'
          href='/privacy'
        >
          Privacy Policy
        </Link>
        <Link
          className='hover:text-primary text-secondary-foreground'
          href='/terms-of-service'
        >
          Terms of Service
        </Link>
        <Link
          className='hover:text-primary text-secondary-foreground'
          href='/about'
        >
          About
        </Link>
      </div>
    </div>
  )
}
