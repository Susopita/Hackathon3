'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/Button';

export default function Header() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/auth/login');
  };

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white shadow">
      <h1 className="text-2xl font-semibold">Gestor de Gastos</h1>
      <Button variant="ghost" onClick={handleLogout}>Cerrar sesión</Button>
    </header>
  );
}
