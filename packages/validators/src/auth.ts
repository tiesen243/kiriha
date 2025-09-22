import * as z from 'zod'

export const loginSchema = z.object({
  indentifier: z.union([z.email(), z.string().length(10)]),
  password: z
    .string()
    .regex(
      /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/,
      { message: 'Password not strong enough' },
    ),
})
export type LoginInput = z.infer<typeof loginSchema>
