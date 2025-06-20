'use client';

import React, { useEffect, useState } from 'react';
import { gastosAPI } from '@/services/api';
import { ExpenseSummaryItemResponse } from '@/interfaces/Expense/ExpenseSummaryResponse';
import { ExpenseCategoryResponse } from '@/interfaces/Expense/ExpenseCategoryResponse';
import { ExpenseDetailItemResponse } from '@/interfaces/Expense/ExpenseDetailsItemResponse';
import { ExpenseDetailsRequest } from '@/interfaces/Expense/ExpenseDetailsRequest';
import ExpenseCard from '@/components/GastoSummary';

const MainPage = () => {
    const [summaryData, setSummaryData] = useState<ExpenseSummaryItemResponse[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<ExpenseCategoryResponse | null>(null);
    const [detailData, setDetailData] = useState<ExpenseDetailItemResponse[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    // Cargar el resumen de gastos cuando el componente se monta
    useEffect(() => {
        const fetchSummary = async () => {
            try {
                const response = await gastosAPI.getSummary();
                console.log(response.data);
                setSummaryData(response.data);
            } catch (error) {
                console.error("Error fetching summary data:", error);
            }
        };

        fetchSummary();
    }, []);

    // Cargar los detalles cuando el usuario haga clic en una categoría
    const handleCategoryClick = async (category: ExpenseCategoryResponse) => {
        if (!category) return;

        setIsLoading(true);
        const expenseDetailsRequest: ExpenseDetailsRequest = {
            year: 2025, // Cambia esto según lo que necesites
            month: 5, // Cambia esto según lo que necesites
            categoryId: category.id
        };

        try {
            const response = await gastosAPI.getDetails(expenseDetailsRequest);
            console.log(response.data);
            setDetailData(response.data);
            setSelectedCategory(category); // Guardar la categoría seleccionada
        } catch (error) {
            console.error("Error fetching category details:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
  <main className="min-h-screen bg-gray-100 p-6 flex justify-center">
    <div className="w-full max-w-6xl">
      <h1 className="text-2xl font-bold text-blue-600 mb-6 text-center">
        Resumen de Gastos
      </h1>

      {/* Tarjetas del resumen */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {summaryData.map((item) => (
          <ExpenseCard
            key={item.id}
            expenseCategory={item.expenseCategory}
            year={item.year}
            month={item.month}
            amount={item.amount}
            onClick={() => handleCategoryClick(item.expenseCategory)}
          />
        ))}
      </div>

      {/* Detalles de categoría seleccionada */}
      {selectedCategory && (
        <div className="bg-white p-6 rounded shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-blue-600 text-center">
            Detalles de {selectedCategory.name}
          </h2>

          {isLoading ? (
            <p className="text-gray-600 text-center">Cargando detalles...</p>
          ) : (
            <ul className="space-y-4">
              {detailData.map((detail) => (
                <li
                  key={detail.id}
                  className="border-b pb-3 text-gray-700"
                >
                  <p>
                    <strong>Fecha:</strong> {detail.date}
                  </p>
                  <p>
                    <strong>Categoría:</strong> {detail.category.name}
                  </p>
                  <p>
                    <strong>Monto:</strong> ${detail.amount.toFixed(2)}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  </main>
);
};

export default MainPage;
