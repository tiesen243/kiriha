export function generateId(): string {
  const prefix = 'c'
  const ts = Date.now().toString(36)
  const rand = Array.from(crypto.getRandomValues(new Uint8Array(16)))
    .map((b) => b.toString(36).padStart(2, '0'))
    .join('')
    .slice(0, 24 - prefix.length - ts.length)

  return `${prefix}${ts}${rand}`
}

export function generateUserCode(): string {
  const enrollYear = new Date().getFullYear()
  const yy = String(enrollYear).slice(-2)
  const randomNum = Math.floor(Math.random() * 1_000_000)
    .toString()
    .padStart(6, '0')
  return yy + randomNum
}
