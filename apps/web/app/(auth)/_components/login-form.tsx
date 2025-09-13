'use client'

import { useRouter } from 'next/navigation'

import { useSession } from '@kiriha/auth/react'
import { Button } from '@kiriha/ui/button'
import {
  FormControl,
  FormField,
  FormLabel,
  FormMessage,
  useForm,
} from '@kiriha/ui/form'
import { Input } from '@kiriha/ui/input'
import { PasswordInput } from '@kiriha/ui/password-input'
import { toast } from '@kiriha/ui/sonner'
import { loginSchema } from '@kiriha/validators/auth'

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
