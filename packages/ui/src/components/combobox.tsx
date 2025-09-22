'use client'

import * as React from 'react'
import { ChevronDownIcon } from 'lucide-react'

import { cn } from '@kiriha/ui'
import { Button } from '@kiriha/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@kiriha/ui/command'
import {
  Drawer,
  DrawerContent,
  DrawerTitle,
  DrawerTrigger,
} from '@kiriha/ui/drawer'
import { useMediaQuery } from '@kiriha/ui/hooks/use-media-query'
import { Popover, PopoverContent, PopoverTrigger } from '@kiriha/ui/popover'

interface ComboboxContextValue {
  isMobile: boolean
  open: boolean
  setOpen: (open: boolean) => void
  selected: string | undefined
  setSelected: (selected: string) => void
  value?: string
  setValue?: (value: string) => void
}

const ComboboxContext = React.createContext<ComboboxContextValue | undefined>(
  undefined,
)

interface ComboboxProps {
  value?: string
  onValueChange: (value: string) => void
  children: React.ReactNode
}

function useCombobox() {
  const context = React.use(ComboboxContext)
  if (!context) throw new Error('useCombobox must be used within a Combobox')
  return context
}

function Combobox({ value, onValueChange, children }: ComboboxProps) {
  const isMobile = useMediaQuery('(max-width: 767px)')
  const [open, setOpen] = React.useState(false)
  const [selected, setSelected] = React.useState<string>('')

  const val = React.useMemo(
    () => ({
      isMobile,
      open,
      setOpen,
      selected,
      setSelected,
      value,
      setValue: onValueChange,
    }),
    [isMobile, onValueChange, open, selected, value],
  )

  const Comp = isMobile ? Drawer : Popover

  return (
    <ComboboxContext value={val}>
      <Comp data-slot='combobox' open={open} onOpenChange={setOpen}>
        {isMobile && (
          <DrawerTitle className='sr-only'>Select an option</DrawerTitle>
        )}
        {children}
      </Comp>
    </ComboboxContext>
  )
}

interface ComboboxTriggerProps extends React.ComponentProps<typeof Button> {
  placeholder?: string
}

function ComboboxTrigger({
  className,
  placeholder,
  ...props
}: ComboboxTriggerProps) {
  const { isMobile, selected, open } = useCombobox()
  const Comp = isMobile ? DrawerTrigger : PopoverTrigger

  return (
    <Comp data-slot='combobox-trigger' asChild>
      <Button
        type='button'
        variant='outline'
        className={cn('justify-between', className)}
        {...props}
      >
        {selected === '' ? (
          <span className='text-muted-foreground'>
            {placeholder ?? 'Select an option'}
          </span>
        ) : (
          <span>{selected}</span>
        )}
        <ChevronDownIcon
          className={cn(
            'text-muted-foreground/50 transition-[rotate] ease-in-out',
            open && 'rotate-180',
          )}
        />
      </Button>
    </Comp>
  )
}

interface ComboboxContentProps
  extends React.ComponentProps<typeof CommandGroup> {
  placeholder?: string
}

function ComboboxContent({
  className,
  placeholder,
  ...props
}: ComboboxContentProps) {
  const { isMobile } = useCombobox()
  const Comp = isMobile ? DrawerContent : PopoverContent

  return (
    <Comp
      data-slot='combobox-content'
      className={cn(isMobile ? 'mt-4 border-t' : 'p-0', className)}
      align='start'
    >
      <Command>
        <CommandInput placeholder={placeholder ?? 'Type to search...'} />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup {...props} />
        </CommandList>
      </Command>
    </Comp>
  )
}

function ComboboxItem({ ...props }: React.ComponentProps<typeof CommandItem>) {
  const { setOpen, setSelected, setValue } = useCombobox()

  return (
    <CommandItem
      data-slot='combobox-item'
      onSelect={(value) => {
        setSelected(typeof props.children === 'string' ? props.children : value)
        setValue?.(value)
        setOpen(false)
      }}
      {...props}
    />
  )
}

export { Combobox, ComboboxTrigger, ComboboxContent, ComboboxItem, useCombobox }
