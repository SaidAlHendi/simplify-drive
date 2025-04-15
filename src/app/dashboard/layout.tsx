// export const metadata: Metadata = {
//   title: "Create Next App",
//   description: "Generated by create next app",
// };

import { SideNav } from './_components/side-nav'

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <main className='container mx-auto pt-12 min-h-screen'>
      <div className='flex gap-8'>
        <SideNav />

        <div className='w-full'>{children}</div>
      </div>
    </main>
  )
}
