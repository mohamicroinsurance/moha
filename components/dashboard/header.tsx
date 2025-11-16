'use client'

import Link from "next/link";
import { Bell, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { MobileSidebar } from "./sidebar";
import { Badge } from "@/components/ui/badge";
import { useSession, signOut } from "next-auth/react";

export function DashboardHeader() {
  const { data: session } = useSession();

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/dashboard/auth/sign-in' });
  };

  const userInitials = session?.user?.name
    ? session.user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'AD';

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-4">
          <MobileSidebar />
          <div className="hidden md:block">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-900 to-blue-700 bg-clip-text text-transparent">
              Dashboard
            </h2>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative hover:bg-orange-50">
            <Bell className="h-5 w-5 text-gray-600" />
            <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs bg-orange-500 border-2 border-white">
              3
            </Badge>
          </Button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 rounded-full hover:bg-orange-50 px-2">
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8 ring-2 ring-orange-400">
                    <AvatarFallback className="bg-gradient-to-br from-orange-500 to-orange-600 text-white text-sm font-bold">
                      {userInitials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden md:flex flex-col items-start">
                    <p className="text-sm font-semibold text-gray-900 leading-tight">
                      {session?.user?.name || 'Admin User'}
                    </p>
                    <p className="text-xs text-gray-500 leading-tight">
                      {session?.user?.role || 'Administrator'}
                    </p>
                  </div>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
              <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-blue-50 to-orange-50">
                <Avatar className="h-12 w-12 ring-2 ring-orange-400">
                  <AvatarFallback className="bg-gradient-to-br from-orange-500 to-orange-600 text-white font-bold">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col space-y-1 leading-none">
                  <p className="font-semibold text-gray-900">{session?.user?.name || 'Admin User'}</p>
                  <p className="text-sm text-gray-600">{session?.user?.email || 'admin@moha.co.tz'}</p>
                  <p className="text-xs text-gray-500">{session?.user?.role || 'Administrator'}</p>
                </div>
              </div>
              <DropdownMenuSeparator />
              <Link href="/dashboard/profile">
                <DropdownMenuItem className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
              </Link>
             
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-red-600 focus:text-red-600">
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}

