'use client';

import React, { useEffect, useState } from 'react';
import Button from '@/components/Button';
import Header from '@/components/Header';
import { ExpenseCategoryResponse } from '@/interfaces/Expense/ExpenseCategoryResponse';
import { ExpenseDetailItemResponse } from '@/interfaces/Expense/ExpenseDetailsItemResponse';
import { gastosAPI } from '@/services/api';

export default function MainPage() {
  const [categories, setCategories] = useState<ExpenseCategoryResponse[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [expensesMap, setExpensesMap] = useState<Record<number, ExpenseDetailItemResponse[]>>({});
  const [expenses, setExpenses] = useState<ExpenseDetailItemResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [amount, setAmount] = useState<string>('');
  const [date, setDate] = useState<string>('');
  const [error, setError] = useState<string>('');

  // Carga categorías al montar
  useEffect(() => {
    gastosAPI.getExpenseCategories()
      .then(res => setCategories(res.data))
      .catch(() => console.error('No se pudieron cargar las categorías'));
  }, []);

  // Carga gastos de la categoría seleccionada (cache + loading indicator)
  const loadExpenses = async (catId: number) => {
    setSelectedCategoryId(catId);
    setLoading(true);

    if (expensesMap[catId]) {
      setExpenses(expensesMap[catId]);
      setLoading(false);
      return;
    }

    try {
      const now = new Date();
      const res = await gastosAPI.getDetails({
        year: now.getFullYear(),
        month: now.getMonth() + 1,
        categoryId: catId,
      });
      const list = res.data;
      setExpenses(list);
      setExpensesMap(prev => ({ ...prev, [catId]: list }));
    } catch {
      console.error(`Error al cargar gastos para categoría ${catId}`);
    } finally {
      setLoading(false);
    }
  };

  // Añade un nuevo gasto y actualiza dinámicamente
  const handleAdd = async () => {
    if (selectedCategoryId === null) {
      setError('Selecciona una categoría primero');
      return;
    }
    if (!amount || !date) {
      setError('Completa monto y fecha');
      return;
    }

    try {
      await gastosAPI.postExpense({ category: { id: selectedCategoryId }, amount: parseFloat(amount), date });
      setError('');
      // Actualizar lista desde API sin usar cache
      setLoading(true);
      const now = new Date();
      const res = await gastosAPI.getDetails({
        year: now.getFullYear(),
        month: now.getMonth() + 1,
        categoryId: selectedCategoryId,
      });
      const newList = res.data;
      setExpenses(newList);
      setExpensesMap(prev => ({ ...prev, [selectedCategoryId]: newList }));
      setAmount('');
      setDate('');
    } catch {
      setError('Error al agregar gasto');
    } finally {
      setLoading(false);
    }
  };

  // Elimina un gasto y actualiza dinámicamente
  const handleDelete = async (id: number) => {
    if (selectedCategoryId === null) return;
    try {
      await gastosAPI.deleteExpense(id);
      // Actualizar lista desde API
      setLoading(true);
      const now = new Date();
      const res = await gastosAPI.getDetails({
        year: now.getFullYear(),
        month: now.getMonth() + 1,
        categoryId: selectedCategoryId,
      });
      const newList = res.data;
      setExpenses(newList);
      setExpensesMap(prev => ({ ...prev, [selectedCategoryId]: newList }));
    } catch {
      console.error('Error al eliminar gasto');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar: categorías clicables */}
        <aside className="w-1/4 p-4 bg-gray-50 overflow-auto">
          <h2 className="text-lg font-semibold mb-4">Categorías</h2>
          <ul className="space-y-2">
            {categories.map(cat => (
              <li key={cat.id}>
                <Button
                  variant={cat.id === selectedCategoryId ? 'primary' : 'ghost'}
                  size="md"
                  onClick={() => loadExpenses(cat.id)}
                >
                  {cat.name}
                </Button>
              </li>
            ))}
          </ul>
        </aside>

        {/* Contenido: formulario y lista de gastos */}
        <main className="flex-1 p-6 bg-white overflow-auto">
          {selectedCategoryId !== null ? (
            <>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">
                  Gastos: {categories.find(c => c.id === selectedCategoryId)?.name}
                </h2>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    placeholder="Monto S/"
                    className="p-2 border rounded"
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                  />
                  <input
                    type="date"
                    className="p-2 border rounded"
                    value={date}
                    onChange={e => setDate(e.target.value)}
                  />
                  <Button onClick={handleAdd}>Agregar</Button>
                </div>
              </div>

              {error && <p className="text-red-600 mb-4">{error}</p>}

              {/* Indicador de carga */}
              {loading ? (
                <p className="text-center text-gray-600">Cargando gastos...</p>
              ) : (
                <ul className="space-y-3">
                  {expenses.length > 0 ? (
                    expenses.map(exp => (
                      <li
                        key={exp.id}
                        className="flex justify-between items-center p-4 border rounded"
                      >
                        <div>
                          <p className="font-medium">S/ {exp.amount.toFixed(2)}</p>
                          <p className="text-sm text-gray-600">{exp.date}</p>
                        </div>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(exp.id)}
                        >
                          Borrar
                        </Button>
                      </li>
                    ))
                  ) : (
                    <p className="text-gray-500">No hay gastos para esta categoría.</p>
                  )}
                </ul>
              )}
            </>
          ) : (
            <p className="text-gray-500">Selecciona una categoría.</p>
          )}
        </main>
      </div>
    </div>
  );
}
