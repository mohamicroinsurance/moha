import Link from 'next/link';
import { Button } from "@/components/ui/button";

export default function RootPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-md w-full mx-auto text-center p-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Moha Insurance
          </h1>
          <p className="text-lg text-gray-600">
            Protecting what matters most
          </p>
        </div>
        
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Choose Your Language
          </h2>
          
          <div className="grid gap-3">
            <Link href="/en">
              <Button className="w-full" size="lg">
                English
              </Button>
            </Link>
            
            <Link href="/sw">
              <Button variant="outline" className="w-full" size="lg">
                Kiswahili
              </Button>
            </Link>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-gray-200">
          <Link href="/dashboard">
            <Button variant="ghost" className="text-sm">
              Admin Dashboard →
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}