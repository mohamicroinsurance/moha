'use client'

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Phone, Menu, MapPin, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import LanguageToggle from "@/components/LanguageToggle";
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const t = useTranslations();
  const params = useParams();
  const locale = (params?.locale as string) || 'en';

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const products = [
    { name: "Life Insurance", description: "Protect your family for affordable rates" },
  ];

  return (
    <>
      {/* Top Bar */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-800 py-2 text-sm hidden md:block">
        <div className="container mx-auto px-4 flex justify-between items-center text-white">
          <div className="flex items-center space-x-6">
            <div className="flex items-center hover:text-orange-300 transition-colors">
              <MapPin className="w-4 h-4 mr-1" />
              <Link href={`/${locale}/branch-locator`}>
-                Branch Locator
+                {t('nav.branchLocator')}
              </Link>
            </div>
            <div className="flex items-center hover:text-orange-300 transition-colors">
              <Mail className="w-4 h-4 mr-1" />
              <a href="mailto:info@mohainsurance.co.tz">
                info@mohainsurance.co.tz
              </a>
            </div>
            <div className="flex items-center hover:text-orange-300 transition-colors">
              <Phone className="w-4 h-4 mr-1" />
              <a href="tel:+255123456789">
                +255 123 456 789
              </a>
            </div>
          </div>
          <div>
            <LanguageToggle />
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <header className={`sticky top-0 z-50 bg-white ${scrolled ? "shadow-md" : ""} transition-shadow duration-300`}>
        <div className="container mx-auto px-2 py-1">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link href={`/${locale}`} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <Image 
                src="/moha-logo.png" 
                alt="Moha Micro-Insurance" 
                width={60} 
                height={60} 
                className="object-contain"
                priority
              />
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-blue-900 leading-tight">Moha</span>
                <span className="text-sm font-semibold text-orange-600 leading-tight">Micro-Insurance</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-6">
              <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <NavigationMenuLink asChild>
                      <Link href={`/${locale}`} className="text-gray-700 hover:text-blue-600 transition-colors">
                        {t('nav.home')}
                      </Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger className="text-gray-700 hover:text-blue-600 transition-colors">{t('nav.products')}</NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="grid w-[360px] gap-3 p-4 md:w-[480px] md:grid-cols-2 lg:w-[560px]">
                        {products.map((product) => (
                          <li key={product.name} className="row-span-1">
                            <NavigationMenuLink asChild>
                              <Link
                                className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                                href={`/${locale}/products/life`}
                              >
                                <div className="text-sm font-medium leading-none">{product.name}</div>
                                <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                  {product.description}
                                </p>
                              </Link>
                            </NavigationMenuLink>
                          </li>
                        ))}
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <NavigationMenuLink asChild>
                      <Link href={`/${locale}/claims`} className="text-gray-700 hover:text-blue-600 transition-colors">
                        {t('nav.claims')}
                      </Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <NavigationMenuLink asChild>
                      <Link href={`/${locale}/support`} className="text-gray-700 hover:text-blue-600 transition-colors">
                        {t('nav.support')}
                      </Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <NavigationMenuLink asChild>
                      <Link href={`/${locale}/about`} className="text-gray-700 hover:text-blue-600 transition-colors">
                        {t('nav.about')}
                      </Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <NavigationMenuLink asChild>
                      <Link href={`/${locale}/resources`} className="text-gray-700 hover:text-blue-600 transition-colors">
                        {t('nav.resources')}
                      </Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
            </div>

            {/* Action Buttons */}
            <div className="hidden md:flex items-center space-x-3">
              <Link href={`/${locale}/support`}>
                <Button className="bg-orange-500 hover:bg-orange-600 text-white shadow-lg hover:shadow-xl transition-all">
                  {t('products.getQuote')}
                </Button>
              </Link>
              <Link href={`/${locale}/claims`}>
                <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50">
                  {t('nav.claims')}
                </Button>
              </Link>
            </div>

            {/* Mobile Menu Button with Language Toggle */}
            <div className="lg:hidden flex items-center gap-2">
              {/* Language Toggle for Mobile - Always visible */}
              <div className="md:hidden">
                <LanguageToggle />
              </div>
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" aria-label="Open menu">
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[85vw] sm:w-[400px] p-0 flex flex-col">
                  <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                  <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="flex justify-between items-center px-6 py-5 border-b">
                      <div className="flex items-center gap-3">
                        <Image 
                          src="/moha-logo.png" 
                          alt="Moha Micro-Insurance" 
                          width={50} 
                          height={50} 
                          className="object-contain" 
                          unoptimized 
                        />
                        <div className="flex flex-col">
                          <span className="text-xl font-bold text-blue-900 leading-tight">Moha</span>
                          <span className="text-xs font-semibold text-orange-600 leading-tight">Micro-Insurance</span>
                        </div>
                      </div>
                      {/* Language Toggle inside mobile menu */}
                      <LanguageToggle />
                    </div>
                    
                    {/* Navigation */}
                    <nav className="flex-1 overflow-y-auto px-6">
                      <ul className="space-y-1 py-4">
                        <li>
                          <Link 
                            href={`/${locale}`}
                            className="block py-3 px-4 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors" 
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            {t('nav.home')}
                          </Link>
                        </li>
                        <li>
                          <div className="py-3 px-4">
                            <div className="flex items-center mb-2">
                              <span className="text-base font-medium text-gray-700">{t('nav.products')}</span>
                            </div>
                            <ul className="pl-2 space-y-1 border-l-2 border-gray-200 ml-2">
                              {products.map((product) => (
                                <li key={product.name}>
                                  <Link 
                                    href={`/${locale}/products/life`}
                                    className="block py-2 px-3 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors" 
                                    onClick={() => setMobileMenuOpen(false)}
                                  >
                                    {product.name}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </li>
                        <li>
                          <Link 
                            href={`/${locale}/claims`}
                            className="block py-3 px-4 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors" 
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            {t('nav.claims')}
                          </Link>
                        </li>
                        <li>
                          <Link 
                            href={`/${locale}/support`}
                            className="block py-3 px-4 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors" 
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            {t('nav.support')}
                          </Link>
                        </li>
                        <li>
                          <Link 
                            href={`/${locale}/about`}
                            className="block py-3 px-4 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors" 
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            {t('nav.about')}
                          </Link>
                        </li>
                        <li>
                          <Link 
                            href={`/${locale}/resources`}
                            className="block py-3 px-4 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors" 
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            {t('nav.resources')}
                          </Link>
                        </li>
                      </ul>
                    </nav>
                    
                    {/* Footer Actions */}
                    <div className="px-6 py-4 space-y-3 border-t bg-gray-50">
                      <Link href={`/${locale}/support`} onClick={() => setMobileMenuOpen(false)}>
                        <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white">
                          {t('products.getQuote')}
                        </Button>
                      </Link>
                      <Link href={`/${locale}/support`} onClick={() => setMobileMenuOpen(false)}>
                        <Button variant="outline" className="w-full border-blue-600 text-blue-600 hover:bg-blue-50">
                          <Phone className="w-4 h-4 mr-2" />
                          {t('common.contact')}
                        </Button>
                      </Link>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}