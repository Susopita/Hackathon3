import React, { useState, useEffect, useRef } from 'react';
import { ExpenseCategoryResponse } from '@/interfaces/Expense/ExpenseCategoryResponse';

interface CategorySelectProps {
    selectedCategory: ExpenseCategoryResponse | null;
    onCategoryChange: (category: ExpenseCategoryResponse) => void;
    placeholder?: string;
}

export default function CategorySelect({
    selectedCategory,
    onCategoryChange,
    placeholder = 'Selecciona o escribe categoría...'
}: CategorySelectProps) {
    const [categories, setCategories] = useState<ExpenseCategoryResponse[]>([]);
    const [query, setQuery] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        fetch('http://198.211.105.95:8080/expenses_category')
            .then(res => res.json())
            .then((data: ExpenseCategoryResponse[]) => setCategories(data));
    }, []);

    // Mantiene el input sincronizado con la categoría seleccionada
    useEffect(() => {
        if (selectedCategory) setQuery(selectedCategory.name);
    }, [selectedCategory]);

    const filtered = query
        ? categories.filter(c =>
            c.name.toLowerCase().includes(query.toLowerCase())
        )
        : categories;

    // Cierra el dropdown al hacer clic fuera
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                wrapperRef.current &&
                !wrapperRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={wrapperRef}>
            <input
                type="text"
                placeholder={placeholder}
                value={query}
                onChange={e => {
                    setQuery(e.target.value);
                    setIsOpen(true);
                }}
                onClick={() => setIsOpen(prev => !prev)}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
            />

            {isOpen && (
                <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded mt-1 max-h-60 overflow-auto shadow-lg">
                    {filtered.length > 0 ? (
                        filtered.map(cat => (
                            <li
                                key={cat.id}
                                onClick={() => {
                                    onCategoryChange(cat);
                                    setIsOpen(false);
                                }}
                                className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                            >
                                {cat.name}
                            </li>
                        ))
                    ) : (
                        <li className="px-3 py-2 text-gray-500">No hay categorías</li>
                    )}
                </ul>
            )}
        </div>
    );
}
