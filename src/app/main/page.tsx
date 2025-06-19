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
        <main className="p-4 w-full bg-amber-200">
            <h1 className="text-2xl font-bold mb-4">Resumen de Gastos</h1>

            {/* Mostrar el resumen de gastos */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {summaryData.map((item) => (

                    <ExpenseCard key={item.id} expenseCategory={item.expenseCategory} year={item.year} month={item.month} amount={item.amount} onClick={() => handleCategoryClick(item.expenseCategory)} />
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
                        <ul className="space-y-4">
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
        </main>
    );
};

export default MainPage;
