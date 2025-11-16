'use client';

import Link from "next/link";
import { Shield, MapPin, Phone, Mail } from "lucide-react";
import { useTranslations } from 'next-intl';

export default function Footer() {
  const t = useTranslations();

  const footerProducts = [
    "Auto Insurance",
    "Home Insurance", 
    "Health Insurance",
    "Business Insurance",
    "Travel Insurance",
  ];

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <Shield className="h-8 w-8 text-blue-400" />
              <span className="ml-2 text-xl font-bold text-white">Moha Insurance</span>
            </div>
            <p className="mb-4 text-sm">Kenya&apos;s trusted insurance partner. We provide comprehensive coverage for individuals and businesses across the country.</p>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4">Company</h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="/about" className="hover:text-blue-400 transition-colors">{t('nav.about')}</Link></li>
              <li><Link href="/resources" className="hover:text-blue-400 transition-colors">{t('nav.resources')}</Link></li>
              <li><Link href="/whistleblowing" className="hover:text-blue-400 transition-colors">{t('nav.whistleblowing')}</Link></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Terms of Service</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4">{t('nav.products')}</h3>
            <ul className="space-y-3 text-sm">
              {footerProducts.map((product) => (
                <li key={product}>
                  <a href="#" className="hover:text-blue-400 transition-colors">{product}</a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start">
                <MapPin className="w-5 h-5 mr-2 text-blue-400 flex-shrink-0 mt-0.5" />
                <span>123 Insurance Plaza, Nairobi, Kenya</span>
              </li>
              <li className="flex items-center">
                <Phone className="w-5 h-5 mr-2 text-blue-400 flex-shrink-0" />
                <span>+254 123 456 789</span>
              </li>
              <li className="flex items-center">
                <Mail className="w-5 h-5 mr-2 text-blue-400 flex-shrink-0" />
                <span>info@mohainsurance.co.ke</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-12 pt-8 text-sm text-center">
          <p>&copy; {new Date().getFullYear()} Moha Micro Insurance Kenya. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}