'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Force dynamic rendering to avoid conflicts with the route handler
export const dynamic = 'force-dynamic';

export default function LoginPageRedirect() {
  const router = useRouter();
  
  useEffect(() => {
    console.log('Redirecting from React page component to route handler');
    // Force a hard reload to ensure we get the HTML version from the route handler
    window.location.reload();
  }, []);

  // This component doesn't render anything meaningful
  return (
    <div className="min-h-screen flex flex-col justify-center items-center">
      <p className="text-gray-600">Reindirizzamento al login...</p>
    </div>
  );
} 