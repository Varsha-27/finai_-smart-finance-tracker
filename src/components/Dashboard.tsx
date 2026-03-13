import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell, AreaChart, Area } from 'recharts';
import { TrendingUp, TrendingDown, CreditCard, Target } from 'lucide-react';
import { motion } from 'motion/react';

export default function Dashboard() {
  const { transactions, budgets } = useSelector((state: RootState) => state.finance);

  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((acc, t) => acc + t.amount, 0);

  const totalExpenses = transactions
    .filter((t) => t.type === 'expense')
    .reduce((acc, t) => acc + t.amount, 0);

  const balance = totalIncome - totalExpenses;

  const categoryData = transactions
    .filter((t) => t.type === 'expense')
    .reduce((acc: any[], t) => {
      const existing = acc.find((item) => item.name === t.category);
      if (existing) {
        existing.value += t.amount;
      } else {
        acc.push({ name: t.category, value: t.amount });
      }
      return acc;
    }, []);

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

  return (
    <div className="space-y-8">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Net Balance', value: balance, icon: CreditCard, color: 'text-slate-900' },
          { label: 'Total Income', value: totalIncome, icon: TrendingUp, color: 'text-emerald-600' },
          { label: 'Total Expenses', value: totalExpenses, icon: TrendingDown, color: 'text-rose-600' },
          { label: 'Active Budgets', value: budgets.length, icon: Target, color: 'text-brand-600', isCount: true },
        ].map((stat, i) => (
          <motion.div 
            key={stat.label}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="bento-card p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-2 rounded-lg bg-slate-50 ${stat.color}`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Monthly</span>
            </div>
            <p className="text-sm font-medium text-slate-500 mb-1">{stat.label}</p>
            <p className={`text-2xl font-bold font-display ${stat.color}`}>
              {stat.isCount ? stat.value : `$${stat.value.toLocaleString()}`}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bento-card p-6 h-[400px] flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-lg font-bold font-display">Spending Breakdown</h3>
              <p className="text-xs text-slate-500">Distribution of expenses by category</p>
            </div>
          </div>
          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <XAxis 
                  dataKey="name" 
                  fontSize={10} 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94a3b8', fontWeight: 500 }}
                />
                <YAxis 
                  fontSize={10} 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94a3b8', fontWeight: 500 }}
                />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                />
                <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={40}>
                  {categoryData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bento-card p-6 flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-lg font-bold font-display">Budget Utilization</h3>
              <p className="text-xs text-slate-500">How much you've spent vs your goals</p>
            </div>
          </div>
          <div className="flex-1 space-y-6 overflow-y-auto pr-2">
            {budgets.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-slate-400 space-y-2">
                <Target className="w-10 h-10 opacity-20" />
                <p className="text-sm italic">Set your first budget goal to track progress.</p>
              </div>
            )}
            {budgets.map((budget) => {
              const spent = transactions
                .filter((t) => t.category === budget.category && t.type === 'expense')
                .reduce((acc, t) => acc + t.amount, 0);
              const percentage = Math.min((spent / budget.amount) * 100, 100);
              
              return (
                <div key={budget.category} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-semibold text-slate-700">{budget.category}</span>
                    <span className="text-slate-500 font-medium">
                      <span className="text-slate-900">${spent}</span> / ${budget.amount}
                    </span>
                  </div>
                  <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-50">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className={`h-full rounded-full ${percentage > 90 ? 'bg-rose-500' : 'bg-brand-600'}`}
                    />
                  </div>
                  <div className="flex justify-end">
                    <span className={`text-[10px] font-bold uppercase ${percentage > 90 ? 'text-rose-600' : 'text-slate-400'}`}>
                      {percentage.toFixed(0)}% Used
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
