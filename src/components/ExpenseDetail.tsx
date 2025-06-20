'use client';

import React from 'react';
import { ExpenseDetailItemResponse } from '@/interfaces/Expense/ExpenseDetailsItemResponse';
import Button from '@/components/Button';

interface Props {
  items: ExpenseDetailItemResponse[];
  onDelete: (id: number) => void;
}

export default function ExpenseDetail({ items, onDelete }: Props) {
  if (items.length === 0) {
    return <p>No hay gastos en esta categoría.</p>;
  }

  return (
    <ul className="space-y-2">
      {items.map(exp => (
        <li
          key={exp.id}
          className="flex justify-between items-center p-3 border rounded"
        >
          <div>
            <p><strong>Fecha:</strong> {exp.date}</p>
            <p><strong>Monto:</strong> S/ {exp.amount.toFixed(2)}</p>
          </div>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => onDelete(exp.id)}
          >
            Eliminar
          </Button>
        </li>
      ))}
    </ul>
  );
}
