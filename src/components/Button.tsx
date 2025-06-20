'use client';

import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Variante de estilo del botón
   * - primary: fondo azul
   * - secondary: fondo gris
   * - destructive: fondo rojo
   * - ghost: transparente
   * - link: estilo enlace
   */
  variant?: 'primary' | 'secondary' | 'destructive' | 'ghost' | 'link';
  /** Tamaño del botón */
  size?: 'sm' | 'md' | 'lg';
  /** Clases adicionales */
  className?: string;
}

const variantClasses: Record<NonNullable<ButtonProps['variant']>, string> = {
  primary: 'bg-blue-600 hover:bg-blue-700 text-white',
  secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-800',
  destructive: 'bg-red-600 hover:bg-red-700 text-white',
  ghost: 'bg-transparent hover:bg-gray-100 text-gray-800',
  link: 'bg-transparent underline text-blue-600 hover:text-blue-700',
};

const sizeClasses: Record<NonNullable<ButtonProps['size']>, string> = {
  sm: 'px-3 py-1 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-5 py-3 text-lg',
};

export default function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...rest
}: ButtonProps) {
  const vClass = variantClasses[variant];
  const sClass = sizeClasses[size];

  return (
    <button
      className={['inline-flex items-center justify-center rounded-2xl shadow', vClass, sClass, className].join(' ')}
      {...rest}
    >
      {children}
    </button>
  );
}
