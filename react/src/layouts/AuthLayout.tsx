import React from 'react';
import { Logo } from '../components/Logo';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-krooa-green/10 to-white flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {/* Logo Container */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md mb-8">
        <div className="flex justify-center">
          <Logo size="lg" />
        </div>
      </div>

      {/* Content */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {children}
      </div>

      {/* Footer */}
      <div className="mt-8 text-center">
        <p className="text-sm text-gray-600">
          © {new Date().getFullYear()} Krooa. Todos os direitos reservados.
        </p>
      </div>
    </div>
  );
}
