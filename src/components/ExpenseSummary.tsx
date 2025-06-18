'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ExpenseSummaryItemResponse } from '../interfaces/Expense/ExpenseSummaryResponse';

interface ExpenseSummaryProps {
    onCategoryClick?: (categoryId: number, categoryName: string) => void;
}

export default function ExpenseSummary({ onCategoryClick }: ExpenseSummaryProps) {
    const [summary, setSummary] = useState<ExpenseSummaryItemResponse[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchSummary = async () => {
            setLoading(true);
            setError('');
            try {
                const res = await axios.get<ExpenseSummaryItemResponse[]>(
                    'http://198.211.105.95:8080/expenses_summary',
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('token')}`,
                        },
                    }
                );
                setSummary(res.data);
            } catch (err) {
                console.error(err);
                setError('Error al cargar el resumen');
            } finally {
                setLoading(false);
            }
        };

        fetchSummary();
    }, []);

    if (loading) return <p>Cargando resumen...</p>;
    if (error) return <p className="text-red-500">{error}</p>;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {summary.map(item => (
                <div
                    key={item.id}
                    onClick={() =>
                        onCategoryClick &&
                        onCategoryClick(item.expenseCategory.id, item.expenseCategory.name)
                    }
                    className="border rounded p-4 cursor-pointer hover:bg-gray-100 transition"
                >
                    <h3 className="font-bold text-lg">{item.expenseCategory.name}</h3>
                    <p className="text-gray-500">
                        {item.month}/{item.year}
                    </p>
                    <p className="text-xl text-blue-600 font-semibold mt-2">
                        S/ {item.amount.toFixed(2)}
                    </p>
                </div>
            ))}
        </div>
    );
}
