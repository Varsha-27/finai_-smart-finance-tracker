import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../store';
import { addTransaction } from '../store/financeSlice';
import { categorizeTransaction } from '../services/gemini';
import { Sparkles, Loader2, Plus } from 'lucide-react';

export default function TransactionForm() {
  const dispatch = useDispatch<AppDispatch>();
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Other');
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [isCategorizing, setIsCategorizing] = useState(false);

  const handleAutoCategorize = async () => {
    if (!description) return;
    setIsCategorizing(true);
    try {
      const suggestedCategory = await categorizeTransaction(description);
      setCategory(suggestedCategory);
    } catch (error) {
      console.error("Categorization error in component:", error);
      // Fallback is already handled in the service, but we could show a toast here
    } finally {
      setIsCategorizing(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !amount) return;

    dispatch(addTransaction({
      description,
      amount: parseFloat(amount),
      category,
      type,
      date: new Date().toISOString(),
    }));

    setDescription('');
    setAmount('');
    setCategory('Other');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-1.5">
        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Description</label>
        <div className="relative group">
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-sm text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all placeholder:text-slate-500"
            placeholder="What did you spend on?"
            required
          />
          <button
            type="button"
            onClick={handleAutoCategorize}
            disabled={isCategorizing || !description}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-500 hover:text-brand-400 disabled:opacity-30 transition-colors"
            title="Auto-categorize with AI"
          >
            {isCategorizing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Amount</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">$</span>
            <input
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 pl-7 text-sm text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all"
              placeholder="0.00"
              required
            />
          </div>
        </div>
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Type</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as 'income' | 'expense')}
            className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-sm text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all appearance-none cursor-pointer"
          >
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Category</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-sm text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all appearance-none cursor-pointer"
        >
          {['Food', 'Transport', 'Rent', 'Utilities', 'Entertainment', 'Shopping', 'Health', 'Income', 'Other'].map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        className="w-full bg-brand-600 text-white py-3 rounded-xl text-sm font-bold uppercase tracking-[0.15em] hover:bg-brand-700 transition-all shadow-lg shadow-brand-500/20 active:scale-[0.98] flex items-center justify-center gap-2"
      >
        <Plus className="w-4 h-4" /> Add Transaction
      </button>
    </form>
  );
}
