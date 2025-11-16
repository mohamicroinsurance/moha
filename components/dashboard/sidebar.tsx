'use client'

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  FileText, 
  FileCheck, 
  Shield, 
  Briefcase, 
  Users, 
  LogOut,
  Menu,
  X,
  Newspaper,
  FolderOpen,
  User
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { useState } from "react";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Claims", href: "/dashboard/claims", icon: FileText },
  { name: "Quotes", href: "/dashboard/quotes", icon: FileCheck },
  { name: "Whistleblowing", href: "/dashboard/whistleblowing", icon: Shield },
  { name: "Applications", href: "/dashboard/applications", icon: Briefcase },
  { name: "News", href: "/dashboard/news", icon: Newspaper },
  { name: "Documents", href: "/dashboard/documents", icon: FolderOpen },
  { name: "Admin", href: "/dashboard/admin", icon: Users },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/dashboard/auth/sign-in' });
  };

  const userInitials = session?.user?.name
    ? session.user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'AD';

  return (
    <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 bg-gradient-to-br from-blue-950 via-blue-900 to-blue-800 text-white shadow-2xl">
      <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
        {/* Logo */}
        <div className="flex items-center flex-shrink-0 px-4 mb-8">
          <Image 
            src="/moha-logo.png" 
            alt="Moha Micro-Insurance" 
            width={45} 
            height={45} 
            className="mr-3 object-contain" 
          />
          <div>
            <h1 className="text-lg font-bold leading-tight">Moha</h1>
            <p className="text-xs text-orange-300 font-semibold leading-tight">Micro-Insurance</p>
            <p className="text-[10px] text-blue-200 mt-0.5">Admin Portal</p>
          </div>
        </div>
        <nav className="mt-5 flex-1 px-2 space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "group flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-colors",
                  isActive
                    ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg"
                    : "text-blue-100 hover:bg-blue-700/50 hover:text-white"
                )}
              >
                <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
                {item.name}
              </Link>
            );
          })}
        </nav>
        {/* User Profile */}
        <div className="px-3 py-4 border-t border-blue-700/50 bg-blue-900/30">
          <Link href="/dashboard/profile">
            <div className="flex items-center mb-3 p-2 rounded-lg bg-blue-800/50 hover:bg-blue-800 transition-colors cursor-pointer">
              <Avatar className="h-10 w-10 ring-2 ring-orange-400">
                <AvatarFallback className="bg-gradient-to-br from-orange-500 to-orange-600 text-white font-bold">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
              <div className="ml-3 flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">
                  {session?.user?.name || 'Admin User'}
                </p>
                <p className="text-xs text-blue-200 truncate">
                  {session?.user?.email || 'admin@moha.co.tz'}
                </p>
              </div>
              
            </div>
          </Link>
          <div className="grid grid-cols-2 gap-2">
            <Link href="/dashboard/profile">
              <Button
                variant="ghost"
                size="sm"
                className="w-full text-xs text-blue-100 hover:bg-blue-700 hover:text-white justify-start"
              >
                <User className="mr-1.5 h-3.5 w-3.5" />
                Profile
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSignOut}
              className="text-xs text-blue-100 hover:bg-red-600 hover:text-white justify-start"
            >
              <LogOut className="mr-1.5 h-3.5 w-3.5" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function MobileSidebar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  
  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/dashboard/auth/sign-in' });
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-64 p-0 bg-gradient-to-b from-blue-900 to-blue-800 text-white">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b border-blue-700">
            <div className="flex items-center">
              <Image src="/moha-logo.png" alt="Moha Insurance" width={32} height={32} className="mr-2" />
              <div>
                <h1 className="text-lg font-bold">MOHA Dashboard</h1>
                <p className="text-xs text-blue-200">Admin Portal</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setOpen(false)}
              className="text-blue-100 hover:bg-blue-700 hover:text-white"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          <nav className="flex-1 px-2 py-4 space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "group flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-colors",
                    isActive
                      ? "bg-blue-700 text-white"
                      : "text-blue-100 hover:bg-blue-700/50 hover:text-white"
                  )}
                >
                  <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
          <div className="px-4 py-4 border-t border-blue-700">
            <Link href="/dashboard/profile" onClick={() => setOpen(false)}>
              <div className="flex items-center mb-4 p-2 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer">
                <Avatar>
                  <AvatarFallback className="bg-blue-600 text-white">AD</AvatarFallback>
                </Avatar>
                <div className="ml-3 flex-1">
                  <p className="text-sm font-medium text-white">Admin User</p>
                  <p className="text-xs text-blue-200">admin@moha.co.tz</p>
                </div>
                <User className="h-4 w-4 text-blue-300 flex-shrink-0" />
              </div>
            </Link>
            <Button
              variant="ghost"
              onClick={handleSignOut}
              className="w-full text-blue-100 hover:bg-blue-700 hover:text-white"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

