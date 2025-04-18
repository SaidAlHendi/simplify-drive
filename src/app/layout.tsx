import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ConvexClientProvider } from './ConvexClientProvider'
import { Toaster } from 'sonner'
import { Header } from './dashboard/_components/header'
import { Footer } from './dashboard/_components/footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
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
          <Header />
          {children}
          <Footer />
        </ConvexClientProvider>
      </body>
    </html>
  )
}
