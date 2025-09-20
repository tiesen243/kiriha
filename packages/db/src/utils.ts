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
