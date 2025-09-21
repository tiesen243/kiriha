import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'

import { env } from '@kiriha/validators/env'

import * as schema from './schema'

const createDrizzleClient = () => {
  const conn = postgres({
    user: env.POSTGRES_USER,
    password: env.POSTGRES_PASSWORD,
    host: env.POSTGRES_HOST,
    database: env.POSTGRES_DB,
    idle_timeout: 30,
  })
  return drizzle(conn, { schema, casing: 'snake_case' })
}
const globalForDrizzle = globalThis as unknown as {
  db: ReturnType<typeof createDrizzleClient> | undefined
}
export const db = globalForDrizzle.db ?? createDrizzleClient()
if (process.env.NODE_ENV !== 'production') globalForDrizzle.db = db

export * from 'drizzle-orm'
export * from './utils'
