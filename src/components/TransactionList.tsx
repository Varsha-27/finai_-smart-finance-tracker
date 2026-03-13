import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { deleteTransaction } from '../store/financeSlice';
import { Trash2, ArrowUpCircle, ArrowDownCircle, Search } from 'lucide-react';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'motion/react';

export default function TransactionList() {
  const { transactions } = useSelector((state: RootState) => state.finance);
  const dispatch = useDispatch<AppDispatch>();

  if (transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-slate-400">
        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
          <Search className="w-8 h-8 opacity-20" />
        </div>
        <p className="text-sm font-medium">No transactions found.</p>
        <p className="text-xs">Start by adding your first expense or income.</p>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      <AnimatePresence initial={false}>
        {transactions.map((t, i) => (
          <motion.div 
            key={t.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ delay: i * 0.05 }}
            className="flex items-center justify-between p-4 hover:bg-slate-50 rounded-xl transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                t.type === 'income' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
              }`}>
                {t.type === 'income' ? <ArrowUpCircle className="w-6 h-6" /> : <ArrowDownCircle className="w-6 h-6" />}
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">{t.description}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-brand-600 bg-brand-50 px-1.5 py-0.5 rounded">
                    {t.category}
                  </span>
                  <span className="text-[10px] font-medium text-slate-400 uppercase">
                    {format(new Date(t.date), 'MMM dd, yyyy')}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-6">
              <div className="text-right">
                <p className={`text-sm font-bold font-display ${
                  t.type === 'income' ? 'text-emerald-600' : 'text-slate-900'
                }`}>
                  {t.type === 'income' ? '+' : '-'}${t.amount.toLocaleString()}
                </p>
                <p className="text-[10px] font-medium text-slate-400 uppercase">Completed</p>
              </div>
              
              <button
                onClick={() => t.id && dispatch(deleteTransaction(t.id))}
                className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
