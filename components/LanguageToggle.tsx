'use client'

import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function LanguageToggle() {
  const router = useRouter();
  const pathname = usePathname();
  
  // Extract current locale from pathname
  const currentLocale = pathname.startsWith('/en') ? 'en' : pathname.startsWith('/sw') ? 'sw' : 'en';

  const handleLanguageChange = (lang: 'en' | 'sw') => {
    // If we're on a locale page, switch to the same page in the new language
    if (pathname.startsWith('/en') || pathname.startsWith('/sw')) {
      // Remove the current locale prefix and add the new one
      const pathWithoutLocale = pathname.replace(/^\/(en|sw)/, '') || '';
      const newPath = `/${lang}${pathWithoutLocale}`;
      router.push(newPath);
    } else {
      // If we're on the home page, go to the selected language home
      router.push(`/${lang}`);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="gap-2 hover:bg-orange-50 hover:text-orange-600 transition-colors"
        >
          <Globe className="w-4 h-4" />
          <span className="font-medium">{currentLocale === 'en' ? 'English' : 'Swahili'}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuItem 
          onClick={() => handleLanguageChange('en')}
          className={`cursor-pointer ${currentLocale === 'en' ? 'bg-orange-50 text-orange-600' : ''}`}
        >
          <span className="mr-2">🇬🇧</span>
          English
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => handleLanguageChange('sw')}
          className={`cursor-pointer ${currentLocale === 'sw' ? 'bg-orange-50 text-orange-600' : ''}`}
        >
          <span className="mr-2">🇹🇿</span>
          Swahili
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
