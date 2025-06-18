import { ExpenseCategoryResponse } from './ExpenseCategoryResponse';

export interface ExpenseDetailItemResponse {
    id: number;
    date: string; // formato ISO, se puede usar string o Date
    category: ExpenseCategoryResponse;
    amount: number;
}