import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Transaction, Budget, FinanceState } from '../types';

const loadState = () => {
  try {
    const serializedState = localStorage.getItem('finance_state');
    if (serializedState === null) {
      return {
        transactions: [],
        budgets: [],
        loading: false,
        error: null,
      };
    }
    return JSON.parse(serializedState);
  } catch (err) {
    return {
      transactions: [],
      budgets: [],
      loading: false,
      error: null,
    };
  }
};

const saveState = (state: FinanceState) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem('finance_state', serializedState);
  } catch {
    // Ignore write errors
  }
};

const initialState: FinanceState = loadState();

const financeSlice = createSlice({
  name: 'finance',
  initialState,
  reducers: {
    addTransaction: (state, action: PayloadAction<Transaction>) => {
      const newTransaction = { ...action.payload, id: Date.now() };
      state.transactions.unshift(newTransaction);
      saveState(state);
    },
    deleteTransaction: (state, action: PayloadAction<number>) => {
      state.transactions = state.transactions.filter((t) => t.id !== action.payload);
      saveState(state);
    },
    updateBudget: (state, action: PayloadAction<Budget>) => {
      const index = state.budgets.findIndex((b) => b.category === action.payload.category);
      if (index !== -1) {
        state.budgets[index] = action.payload;
      } else {
        state.budgets.push(action.payload);
      }
      saveState(state);
    },
  },
});

export const { addTransaction, deleteTransaction, updateBudget } = financeSlice.actions;
export default financeSlice.reducer;
