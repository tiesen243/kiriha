import EventEmitter, { on } from 'node:events'

import { scanSchema } from '@kiriha/validators/nfc'

import { createTRPCRouter, publicProcedure } from '../trpc'

type EventMap<T> = Record<keyof T, unknown[]>
class NFCEventEmitter<T extends EventMap<T>> extends EventEmitter<T> {
  toIterable<TEventName extends keyof T>(
    eventName: TEventName,
    opts?: Parameters<typeof on>[2],
  ): AsyncIterable<T[TEventName]> {
    return on(this as never, eventName as string, opts) as AsyncIterable<
      T[TEventName]
    >
  }
}

const ee = new NFCEventEmitter<{
  scan: [cardId: string, roomId: string | undefined]
}>()

export const nfcRouter = createTRPCRouter({
  onScan: publicProcedure.subscription(async function* (otps) {
    for await (const [cardId, roomId] of ee.toIterable('scan', otps)) {
      yield { cardId, roomId }
    }
  }),

  scan: publicProcedure.input(scanSchema).mutation(({ input }) => {
    ee.emit('scan', input.cardId, input.roomId)
    return { success: true }
  }),
})
