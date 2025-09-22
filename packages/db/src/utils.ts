export function createId(): string {
  const prefix = 'c'
  const ts = Date.now().toString(36).padStart(10, '0')
  const rand = Array.from({ length: 13 }, () =>
    Math.floor(Math.random() * 36).toString(36),
  ).join('')
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

export function generateSubjectCode(): string {
  return String(Math.floor(Math.random() * 9000000) + 1000000)
}
