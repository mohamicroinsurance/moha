'use client'

import { useSession, signOut } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Allow auth pages
    if (pathname.startsWith('/dashboard/auth')) {
      if (status === 'authenticated') {
        router.push('/dashboard');
      }
      return;
    }

    // Protect other dashboard pages
    if (status === 'unauthenticated') {
      router.push(`/dashboard/auth/sign-in?from=${encodeURIComponent(pathname)}`);
      return;
    }

    // Block deactivated users from dashboard
    if (status === 'authenticated' && session?.user && (session.user as any).isActive === false) {
      // Sign out to clear JWT and redirect to sign-in with message
      signOut({ callbackUrl: '/dashboard/auth/sign-in?error=AccountDisabled' });
      return;
    }
  }, [status, pathname, router, session]);

  // Show loading for protected pages
  if (pathname.startsWith('/dashboard/auth')) {
    return <>{children}</>;
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Redirecting to sign in...</p>
        </div>
      </div>
    );
  }

  // Show a message for deactivated users (briefly until signOut completes)
  if (status === 'authenticated' && session?.user && (session.user as any).isActive === false) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-700 font-medium">Your account has been deactivated.</p>
          <p className="text-gray-500 mt-2">Signing you out...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
