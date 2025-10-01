import React from 'react';
import { Logo } from '../components/Logo';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <>
      {children}
    </>
  );
}
