import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ConvexClientProvider } from './ConvexClientProvider'
import { Toaster } from 'sonner'

const inter = Inter({ subsets: ['latin'] })
export const metadata: Metadata = {
  title: 'Simplify Drive – Smart File Management for Individuals & Teams',
  description:
    'Simplify Drive lets you upload, organize, favorite, and manage files of all types. Work individually or collaborate within an organization. All in one secure, easy-to-use platform.',
  keywords: [
    'file upload',
    'file manager',
    'Simplify Drive',
    'cloud storage',
    'Next.js app',
    'DaisyUI',
    'document organization',
    'team collaboration',
    'personal cloud',
    'file sharing',
  ],
  authors: [{ name: 'Simplify Drive Team' }],
  creator: 'Simplify Drive',
  openGraph: {
    title: 'Simplify Drive – Smart File Management for Everyone',
    description:
      'Upload and manage PDFs, images, and documents. Favorite important files and collaborate within personal or organizational accounts.',
    url: 'https://your-app-url.com',
    siteName: 'Simplify Drive',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Simplify Drive',
    description:
      'Smart, secure file management. Upload, favorite, organize and collaborate—all in one app.',
    creator: 'Said Al Hendi',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en'>
      <body className={inter.className}>
        <ConvexClientProvider>
          <Toaster />
          <div className=''>{children}</div>
        </ConvexClientProvider>
      </body>
    </html>
  )
}
