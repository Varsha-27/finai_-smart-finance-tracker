export interface Transaction {
  id?: number;
  description: string;
  amount: number;
  category: string;
  date: string;
  type: 'income' | 'expense';
}

export interface Budget {
  category: string;
  amount: number;
}

export interface FinanceState {
  transactions: Transaction[];
  budgets: Budget[];
  loading: boolean;
  error: string | null;
}
