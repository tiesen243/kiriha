import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

import { auth } from '@kiriha/auth'
import { SidebarInset, SidebarProvider } from '@kiriha/ui/sidebar'
import { Toaster } from '@kiriha/ui/sonner'

import { AdminSidebar } from '@/app/(admin)/_components/admin-sidebar'
import { Header } from '@/app/(admin)/_components/header'
import { createMetadata } from '@/lib/metadata'

export default async function AdminLayout({ children }: LayoutProps<'/'>) {
  const session = await auth({ headers: await headers() })
  if (!session.user) redirect('/login')
  if (session.user.role !== 'admin') redirect('/')

  return (
    <SidebarProvider
      style={
        {
          '--sidebar-width': 'calc(var(--spacing) * 72)',
          '--header-height': 'calc(var(--spacing) * 12)',
        } as React.CSSProperties
      }
    >
      <AdminSidebar variant='inset' user={session.user} />

      <SidebarInset>
        <Header />
        {children}
      </SidebarInset>

      <Toaster />
    </SidebarProvider>
  )
}

export const metadata = createMetadata({
  title: 'Admin',
})
