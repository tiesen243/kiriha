'use client'

import { useTheme } from '@attendify/ui'
import { Button } from '@attendify/ui/button'
import { MoonIcon, SunIcon } from '@attendify/ui/icons'

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
