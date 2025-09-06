import type { UrlObject } from 'node:url'
import Image from 'next/image'
import Link from 'next/link'

import type { User } from '@attendify/auth'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@attendify/ui/collapsible'
import {
  BookOpenIcon,
  Building2Icon,
  ChevronRightIcon,
  GraduationCapIcon,
  HomeIcon,
  MonitorIcon,
  SettingsIcon,
  UserCheckIcon,
  UserCogIcon,
  UsersIcon,
} from '@attendify/ui/icons'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@attendify/ui/sidebar'

interface AdminSidebarProps extends React.ComponentProps<typeof Sidebar> {
  user: User
}

export function AdminSidebar(props: AdminSidebarProps) {
  return (
    <Sidebar collapsible='offcanvas' {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className='hover:bg-transparent data-[slot=sidebar-menu-button]:!p-1.5'
            >
              <Link href='/admin'>
                <Image
                  src='/assets/logo.svg'
                  alt='Attendify'
                  width={20}
                  height={20}
                  className='size-5 dark:invert'
                />
                <span className='text-base font-semibold'>Attendify</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent className='flex flex-col gap-2'>
            <SidebarMenu>
              {sidebarItems.map((item) =>
                item.children ? (
                  <Collapsible key={item.id} asChild>
                    <SidebarMenuItem>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton tooltip={item.label}>
                          <item.icon />
                          <span>{item.label}</span>
                          <ChevronRightIcon className='ml-auto transition-transform duration-200 group-data-[state=open]/menu-item:rotate-90' />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>

                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {item.children.map((subItem) => (
                            <SidebarMenuSubItem key={subItem.id}>
                              <SidebarMenuSubButton asChild>
                                <Link
                                  href={subItem.href as unknown as UrlObject}
                                >
                                  <subItem.icon />
                                  <span>{subItem.label}</span>
                                </Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </SidebarMenuItem>
                  </Collapsible>
                ) : (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton asChild tooltip={item.label}>
                      <Link href={item.href as unknown as UrlObject}>
                        <item.icon />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ),
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter></SidebarFooter>
    </Sidebar>
  )
}

interface SidebarItem {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  children?: SidebarItem[]
  href?: string
}

const sidebarItems: SidebarItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: HomeIcon,
    href: '/admin',
  },
  {
    id: 'users',
    label: 'User Management',
    icon: UsersIcon,
    children: [
      {
        id: 'admins',
        label: 'Administrators',
        icon: UserCogIcon,
        href: '/admin/users/admins',
      },
      {
        id: 'teachers',
        label: 'Teachers',
        icon: UserCheckIcon,
        href: '/admin/users/teachers',
      },
      {
        id: 'students',
        label: 'Students',
        icon: GraduationCapIcon,
        href: '/admin/users/students',
      },
    ],
  },
  {
    id: 'academic',
    label: 'Academic Management',
    icon: BookOpenIcon,
    children: [
      {
        id: 'subjects',
        label: 'Subjects',
        icon: BookOpenIcon,
        href: '/admin/subjects',
      },
      {
        id: 'classes',
        label: 'Classes',
        icon: GraduationCapIcon,
        href: '/admin/classes',
      },
    ],
  },
  {
    id: 'facilities',
    label: 'Facilities',
    icon: Building2Icon,
    children: [
      {
        id: 'rooms',
        label: 'Rooms',
        icon: Building2Icon,
        href: '/admin/rooms',
      },
    ],
  },
  {
    id: 'it',
    label: 'IT Management',
    icon: MonitorIcon,
    href: '/admin/it',
  },
  {
    id: 'settings',
    label: 'System Settings',
    icon: SettingsIcon,
    href: '/admin/settings',
  },
]
