'use client';

import React, { createContext, useContext } from 'react';

interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

// Context para permitir componentes hijos cerrar el diálogo
const DialogContext = createContext<{ onOpenChange: (open: boolean) => void } | undefined>(undefined);

export default function Dialog({ open, onOpenChange, children }: DialogProps) {
  if (!open) return null;

  return (
    <DialogContext.Provider value={{ onOpenChange }}>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
        onClick={() => onOpenChange(false)}
      >
        <div
          className="bg-white rounded-2xl shadow-lg w-full max-w-md p-6 relative"
          onClick={e => e.stopPropagation()}
        >
          {children}
        </div>
      </div>
    </DialogContext.Provider>
  );
}

// Subcomponente para el título del diálogo
Dialog.Title = function DialogTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="text-xl font-semibold mb-4">{children}</h2>;
};

// Subcomponente para el pie de diálogo (botones)
Dialog.Footer = function DialogFooter({ children }: { children: React.ReactNode }) {
  return <div className="mt-6 flex justify-end space-x-2">{children}</div>;
};

// Subcomponente botón de cierre (equis)
Dialog.Close = function DialogClose() {
  const context = useContext(DialogContext);
  if (!context) {
    throw new Error('Dialog.Close debe usarse dentro de un Dialog');
  }

  return (
    <button
      className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
      onClick={() => context.onOpenChange(false)}
      aria-label="Cerrar"
    >
      ×
    </button>
  );
};
