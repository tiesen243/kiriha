'use client'

import { useTheme } from '@kiriha/ui'
import { Button } from '@kiriha/ui/button'
import { MoonIcon, SunIcon } from '@kiriha/ui/icons'

export const ThemeToggle: React.FC = () => {
  const { theme, setTheme } = useTheme()

  return (
    <Button
      variant='ghost'
      size='icon'
      onClick={() => {
        setTheme(theme === 'light' ? 'dark' : 'light')
      }}
    >
      {theme === 'light' ? <MoonIcon /> : <SunIcon />}
    </Button>
  )
}
