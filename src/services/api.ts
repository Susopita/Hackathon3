import { LoginResponse } from '@/interfaces/Auth/LoginResponse';
import { LoginRequest } from '@/interfaces/Auth/LoginRequest';
import { RegisterRequest } from '@/interfaces/Auth/RegisterRequest';
import { ExpenseDetailItemResponse } from '@/interfaces/Expense/ExpenseDetailsItemResponse';
import { ExpenseSummaryItemResponse } from '@/interfaces/Expense/ExpenseSummaryResponse';
import axios, { AxiosResponse } from 'axios';
import { ExpenseDetailsRequest } from '@/interfaces/Expense/ExpenseDetailsRequest';
import { ExpenseRequest } from '@/interfaces/Expense/ExpenseRequest';
import { ExpenseCategoryResponse } from '@/interfaces/Expense/ExpenseCategoryResponse';

const API_URL = `http://${process.env.NEXT_PUBLIC_BASE_URL}:8080`;

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor para agregar token automáticamente 
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('authToken');
    if (token) { config.headers.Authorization = `Bearer ${token}`; }
    return config;
});

// Manejo de errores global 
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('authToken'); window.location.reload();
        }
        return Promise.reject(error);
    });

export const setAuthToken = (token: string) => {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};

export const authAPI = {
    login: async (loginRequest: LoginRequest) => {
        const response = await api.post<LoginResponse>('/authentication/login', loginRequest);
        return response;
    },
    register: async (registerRequest: RegisterRequest) => {
        const response = await api.post<string>('/authentication/register', registerRequest);
        return response; // Esto -> "OK"
    }
};

export const gastosAPI = {
    getSummary: async () => {
        const response = await api.get<ExpenseSummaryItemResponse[]>('/expenses_summary');
        return response;
    },

    getDetails: async (expenseDetailsRequest: ExpenseDetailsRequest) => {
        const response = await api.get<ExpenseDetailItemResponse[]>('/expenses/detail', {
            params: {
                year: expenseDetailsRequest.year,
                month: expenseDetailsRequest.month,
                categoryId: expenseDetailsRequest.categoryId
            }
        });
        return response;
    },
    postExpense: async (expenseRequest: ExpenseRequest) => {
        const response = await api.post<void>('/expenses', expenseRequest);
        return response;
    },
    deleteExpense: async (id: number) => {
        const response = await api.delete<void>(`/expenses/${id}`);
        return response;
    },
    getExpenseCategories: async () => {
        const response = await api.get<ExpenseCategoryResponse[]>('/expenses_category');
        return response;
    }
};