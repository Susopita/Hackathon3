import React from 'react';

// Definir las propiedades del componente
interface ExpenseCardProps {
    expenseCategory: { name: string };
    year: number;
    month: number;
    amount: number;
    onClick: (category: { name: string }) => void;
}

// Componente funcional que recibe las props
const ExpenseCard: React.FC<ExpenseCardProps> = ({
    expenseCategory,
    year,
    month,
    amount,
    onClick,
}) => {
    return (
        <div className="bg-white rounded shadow p-4">
            <h2 className="text-xl font-semibold">{expenseCategory.name}</h2>
            <p className="mt-2">Año: {year}</p>
            <p>Mes: {month}</p>
            <p>Total: ${amount}</p>
            <button
                onClick={() => onClick(expenseCategory)} // Llama a la función onClick pasando la categoría
                className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-400 transition-colors duration-200"
            >
                Ver detalles
            </button>
        </div>
    );
};

export default ExpenseCard;