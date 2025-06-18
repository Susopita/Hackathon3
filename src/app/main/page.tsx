// src/app/main/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { gastosAPI } from '@/services/api';
import { ExpenseSummaryItemResponse } from '@/interfaces/Expense/ExpenseSummaryResponse';
import { ExpenseCategoryResponse } from '@/interfaces/Expense/ExpenseCategoryResponse';
import { ExpenseDetailItemResponse } from '@/interfaces/Expense/ExpenseDetailsItemResponse';
import { ExpenseDetailsRequest } from '@/interfaces/Expense/ExpenseDetailsRequest';

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
            setDetailData(response.data);
            setSelectedCategory(category); // Guardar la categoría seleccionada
        } catch (error) {
            console.error("Error fetching category details:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Resumen de Gastos</h1>

            {/* Mostrar el resumen de gastos */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {summaryData.map((item) => (
                    <div key={item.id} className="border p-4 rounded-lg bg-white shadow-md">
                        <h2 className="text-xl font-semibold">{item.expenseCategory.name}</h2>
                        <p>Año: {item.year}</p>
                        <p>Mes: {item.month}</p>
                        <p>Total: ${item.amount}</p>
                        <button
                            onClick={() => handleCategoryClick(item.expenseCategory)}
                            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg"
                        >
                            Ver detalles
                        </button>
                    </div>
                ))}
            </div>

            {/* Mostrar los detalles solo si una categoría ha sido seleccionada */}
            {selectedCategory && (
                <div className="mt-8">
                    <h2 className="text-xl font-semibold mb-4">
                        Detalles de {selectedCategory.name}
                    </h2>
                    {isLoading ? (
                        <p>Cargando detalles...</p>
                    ) : (
                        <ul>
                            {detailData.map((detail) => (
                                <li key={detail.id} className="border-b py-2">
                                    <p><strong>Fecha:</strong> {detail.date}</p>
                                    <p><strong>Categoría:</strong> {detail.category.name}</p>
                                    <p><strong>Monto:</strong> ${detail.amount}</p>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}
        </div>
    );
};

export default MainPage;
