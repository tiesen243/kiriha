import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@attendify/ui/card'

import { LoginForm } from '@/app/(auth)/_components/login-form'

export default function LoginPage(_: PageProps<'/login'>) {
  return (
    <>
      <CardHeader>
        <CardTitle>Login</CardTitle>
        <CardDescription>Login to your account to continue.</CardDescription>
      </CardHeader>

      <CardContent>
        <LoginForm />
      </CardContent>
    </>
  )
}
