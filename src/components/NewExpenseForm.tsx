'use client';

import React, { useState, useEffect } from 'react';
import Dialog from '@/components/Dialog';
import Button from '@/components/Button';
import CategorySelect from '@/components/CategorySelect';
import { ExpenseCategoryResponse } from '@/interfaces/Expense/ExpenseCategoryResponse';
import { ExpenseRequest } from '@/interfaces/Expense/ExpenseRequest';
import { gastosAPI } from '@/services/api';

interface Props {
  onClose: () => void;
  onSuccess: () => void;
}

export default function NewExpenseForm({ onClose, onSuccess }: Props) {
  const [category, setCategory] = useState<ExpenseCategoryResponse | null>(null);
  const [amount, setAmount] = useState<number>(0);
  const [date, setDate] = useState<string>('');
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!category || !date || amount <= 0) {
      setError('Completa todos los campos correctamente.');
      return;
    }

    const payload: ExpenseRequest = {
      category: { id: category.id },
      amount,
      date
    };

    try {
      await gastosAPI.postExpense(payload);
      onSuccess();   // dispara recarga de resumen
      onClose();
    } catch (err) {
      setError('Error al guardar el gasto.');
      console.error(err);
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <Dialog.Title>Nuevo Gasto</Dialog.Title>
      <div className="space-y-4">
        <CategorySelect
          selectedCategory={category}
          onCategoryChange={cat => setCategory(cat)}
        />
        <input
          type="number"
          placeholder="Monto (S/)"
          className="w-full p-2 border rounded"
          value={amount}
          onChange={e => setAmount(parseFloat(e.target.value))}
        />
        <input
          type="date"
          className="w-full p-2 border rounded"
          value={date}
          onChange={e => setDate(e.target.value)}
        />
        {error && <p className="text-red-600">{error}</p>}
      </div>
      <Dialog.Footer>
        <Button variant="secondary" onClick={onClose}>Cancelar</Button>
        <Button onClick={handleSubmit}>Guardar</Button>
      </Dialog.Footer>
    </Dialog>
  );
}
