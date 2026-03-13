import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { updateBudget } from '../store/financeSlice';
import { Plus, Target } from 'lucide-react';

export default function BudgetManager() {
  const { budgets } = useSelector((state: RootState) => state.finance);
  const dispatch = useDispatch<AppDispatch>();
  const [category, setCategory] = useState('Food');
  const [amount, setAmount] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount) return;
    dispatch(updateBudget({ category, amount: parseFloat(amount) }));
    setAmount('');
  };

  const categories = ['Food', 'Transport', 'Rent', 'Utilities', 'Entertainment', 'Shopping', 'Health', 'Other'];

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="flex-1 bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-500 transition-all appearance-none cursor-pointer"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        <div className="relative w-24">
          <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs">$</span>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Limit"
            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 pl-5 text-sm outline-none focus:ring-2 focus:ring-brand-500 transition-all"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-brand-600 text-white p-2.5 rounded-xl hover:bg-brand-700 transition-all shadow-md shadow-brand-500/10"
        >
          <Plus className="w-5 h-5" />
        </button>
      </form>

      <div className="space-y-3">
        {budgets.map((b) => (
          <div key={b.category} className="flex justify-between items-center p-3 bg-slate-50 rounded-xl border border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-brand-500" />
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">{b.category}</span>
            </div>
            <span className="text-sm font-bold text-slate-900 font-display">${b.amount.toLocaleString()}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
