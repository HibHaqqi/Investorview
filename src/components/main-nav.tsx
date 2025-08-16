'use client';

import { usePathname } from 'next/navigation';
import {
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarContent,
  SidebarFooter,
} from '@/components/ui/sidebar';
import {
  LayoutDashboard,
  TrendingUp,
  Layers,
  FileText,
  Gem,
  ArrowRightLeft,
  Settings,
  CircleHelp,
  User,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

const links = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/stocks', label: 'Stocks', icon: TrendingUp },
  { href: '/mutual-funds', label: 'Mutual Funds', icon: Layers },
  { href: '/bonds', label: 'Bonds', icon: FileText },
  { href: '/gold', label: 'Gold', icon: Gem },
  { href: '/transactions', label: 'Transactions', icon: ArrowRightLeft },
];

export function MainNav() {
  const pathname = usePathname();

  return (
    <>
      <SidebarHeader>
        <div className="flex items-center gap-3 p-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" className="h-8 w-8 text-primary-foreground"><rect width="256" height="256" fill="none"/><path d="M32,80V64a8,8,0,0,1,8-8H216a8,8,0,0,1,8,8V80" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/><path d="M224,176v16a8,8,0,0,1-8,8H40a8,8,0,0,1-8-8V176" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/><line x1="16" y1="128" x2="240" y2="128" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/></svg>
            <div className="group-data-[collapsible=icon]:hidden">
                <h1 className="text-xl font-bold text-sidebar-foreground">InvestorView</h1>
            </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="p-2">
        <SidebarMenu>
          {links.map((link) => (
            <SidebarMenuItem key={link.href}>
              <SidebarMenuButton
                asChild
                isActive={pathname === link.href}
                tooltip={link.label}
              >
                <a href={link.href}>
                  <link.icon />
                  <span>{link.label}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-2">
         <SidebarMenu>
            <SidebarMenuItem>
                <SidebarMenuButton tooltip="Profile">
                    <Avatar className="h-8 w-8">
                        <AvatarImage src="https://placehold.co/40x40" alt="User" />
                        <AvatarFallback>AV</AvatarFallback>
                    </Avatar>
                    <span className="flex flex-col text-left">
                        <span className="font-semibold">Adam V.</span>
                        <span className="text-xs text-muted-foreground">adam@investor.com</span>
                    </span>
                </SidebarMenuButton>
            </SidebarMenuItem>
         </SidebarMenu>
      </SidebarFooter>
    </>
  );
}
