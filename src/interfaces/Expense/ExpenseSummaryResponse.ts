import { ExpenseCategoryResponse } from './ExpenseCategoryResponse';

export interface ExpenseSummaryItemResponse {
    id: number;
    expenseCategory: ExpenseCategoryResponse;
    year: number;
    month: number;
    amount: number;
}