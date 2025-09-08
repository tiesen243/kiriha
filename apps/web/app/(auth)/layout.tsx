import { Card } from '@attendify/ui/card'
import { Toaster } from '@attendify/ui/sonner'

export default function AuthLayout({ children }: LayoutProps<'/'>) {
  return (
    <>
      <main className='container grid min-h-dvh place-items-center'>
        <Card className='min-w-1/2'>{children}</Card>
      </main>

      <Toaster />
    </>
  )
}
