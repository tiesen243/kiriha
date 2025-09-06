'use client'

import { useRouter } from 'next/navigation'

import { useSession } from '@attendify/auth/react'
import { Button } from '@attendify/ui/button'
import {
  FormControl,
  FormField,
  FormLabel,
  FormMessage,
  useForm,
} from '@attendify/ui/form'
import { Input } from '@attendify/ui/input'
import { PasswordInput } from '@attendify/ui/password-input'
import { toast } from '@attendify/ui/sonner'
import { loginSchema } from '@attendify/validators/auth'

export const LoginForm: React.FC = () => {
  const { signIn } = useSession()
  const router = useRouter()

  const form = useForm({
    defaultValues: { indentifier: '', password: '' },
    validator: loginSchema,
    onSubmit: async (values) => signIn('credentials', values),
    onSuccess: () => {
      toast.success('Logged in successfully')
      router.push('/')
    },
    onError: (error) => void toast.error(error.message),
  })

  return (
    <form className='grid gap-4' onSubmit={form.handleSubmit}>
      <FormField
        control={form.control}
        name='indentifier'
        render={({ field }) => (
          <div className='grid gap-2'>
            <FormLabel>Email or Student / Teacher ID</FormLabel>
            <FormControl {...field}>
              <Input placeholder='Enter your email or ID' />
            </FormControl>
            <FormMessage />
          </div>
        )}
      />

      <FormField
        control={form.control}
        name='password'
        render={({ field }) => (
          <div className='grid gap-2'>
            <FormLabel>Password</FormLabel>
            <FormControl {...field}>
              <PasswordInput placeholder='Enter your password' />
            </FormControl>
            <FormMessage />
          </div>
        )}
      />

      <Button type='submit' disabled={form.state.isPending}>
        {form.state.isPending ? 'Logging in...' : 'Login'}
      </Button>
    </form>
  )
}
