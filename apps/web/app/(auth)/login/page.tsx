import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@attendify/ui/card'

import { LoginForm } from '@/app/(auth)/_components/login-form'

export default function LoginPage(_: PageProps<'/login'>) {
  return (
    <main className='container grid min-h-dvh place-items-center'>
      <Card className='min-w-1/2'>
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>Login to your account to continue.</CardDescription>
        </CardHeader>

        <CardContent>
          <LoginForm />
        </CardContent>
      </Card>
    </main>
  )
}
