import { Provider, useSelector } from 'react-redux';
import { RootState, store } from './store';
import Dashboard from './components/Dashboard';
import TransactionForm from './components/TransactionForm';
import TransactionList from './components/TransactionList';
import BudgetManager from './components/BudgetManager';
import { Wallet, LayoutDashboard, History, PieChart, PlusCircle, Settings, Download } from 'lucide-react';
import { motion } from 'motion/react';

function AppContent() {
  const { transactions } = useSelector((state: RootState) => state.finance);

  const handleExportCSV = () => {
    console.log("Export CSV clicked", transactions);
    if (transactions.length === 0) {
      console.log("No transactions to export");
      alert("No transactions to export.");
      return;
    }

    const headers = ["Date", "Description", "Category", "Type", "Amount"];
    const rows = transactions.map(t => [
      new Date(t.date).toLocaleDateString(),
      t.description,
      t.category,
      t.type,
      t.amount
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `finai_transactions_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleNewEntry = () => {
    console.log("New Entry clicked");
    const quickAddSection = document.getElementById('quick-add');
    if (quickAddSection) {
      console.log("Scrolling to quick-add");
      quickAddSection.scrollIntoView({ behavior: 'smooth' });
      
      // Visual feedback: highlight the form briefly
      quickAddSection.classList.add('ring-4', 'ring-brand-500/50');
      setTimeout(() => {
        quickAddSection.classList.remove('ring-4', 'ring-brand-500/50');
      }, 2000);

      // Focus the first input if possible
      const input = quickAddSection.querySelector('input');
      if (input) input.focus();
    } else {
      console.error("quick-add section not found");
    }
  };

  return (
    <div className="min-h-screen flex bg-[#F8FAFC]">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-slate-200 p-6 sticky top-0 h-screen">
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="w-10 h-10 bg-brand-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-brand-500/20">
            <Wallet className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold font-display tracking-tight">FinAI</h1>
        </div>

        <nav className="flex-1 space-y-1">
          <a href="#" className="flex items-center gap-3 px-3 py-2.5 bg-brand-50 text-brand-700 rounded-xl font-medium transition-colors">
            <LayoutDashboard className="w-5 h-5" /> Dashboard
          </a>
          <a href="#transactions" className="flex items-center gap-3 px-3 py-2.5 text-slate-500 hover:bg-slate-50 hover:text-slate-900 rounded-xl font-medium transition-colors">
            <History className="w-5 h-5" /> Transactions
          </a>
          <a href="#budgets" className="flex items-center gap-3 px-3 py-2.5 text-slate-500 hover:bg-slate-50 hover:text-slate-900 rounded-xl font-medium transition-colors">
            <PieChart className="w-5 h-5" /> Budgets
          </a>
        </nav>

        <div className="pt-6 border-t border-slate-100">
          <button className="flex items-center gap-3 px-3 py-2.5 w-full text-slate-500 hover:bg-slate-50 hover:text-slate-900 rounded-xl font-medium transition-colors">
            <Settings className="w-5 h-5" /> Settings
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-10 px-6 flex items-center justify-between lg:hidden">
          <div className="flex items-center gap-2">
            <Wallet className="w-6 h-6 text-brand-600" />
            <span className="font-bold font-display">FinAI</span>
          </div>
          <button className="p-2 text-slate-500">
            <LayoutDashboard className="w-6 h-6" />
          </button>
        </header>

        <main className="flex-1 p-4 md:p-8 lg:p-10 max-w-6xl mx-auto w-full space-y-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
              <div>
                <h2 className="text-3xl font-bold font-display text-slate-900">Financial Overview</h2>
                <p className="text-slate-500 mt-1">Track, analyze and optimize your spending with AI.</p>
              </div>
              <div className="flex items-center gap-3">
                <button 
                  onClick={handleExportCSV}
                  className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl font-medium text-sm hover:bg-slate-50 transition-colors shadow-sm flex items-center gap-2"
                >
                  <Download className="w-4 h-4" /> Export CSV
                </button>
                <button 
                  onClick={handleNewEntry}
                  className="px-4 py-2 bg-brand-600 text-white rounded-xl font-medium text-sm hover:bg-brand-700 transition-colors shadow-md shadow-brand-500/20 flex items-center gap-2"
                >
                  <PlusCircle className="w-4 h-4" /> New Entry
                </button>
              </div>
            </div>

            <Dashboard />
          </motion.div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            <div className="xl:col-span-2 space-y-6">
              <div id="transactions" className="bento-card p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold font-display">Recent Activity</h3>
                  <button className="text-sm text-brand-600 font-semibold hover:underline">View All</button>
                </div>
                <TransactionList />
              </div>
            </div>

            <div className="space-y-8">
              <div id="quick-add" className="bento-card p-6 bg-slate-900 text-white border-none">
                <h3 className="text-lg font-bold font-display mb-4 flex items-center gap-2">
                  <PlusCircle className="w-5 h-5 text-brand-500" />
                  Quick Add
                </h3>
                <TransactionForm />
              </div>

              <div id="budgets" className="bento-card p-6">
                <h3 className="text-lg font-bold font-display mb-4 flex items-center gap-2">
                  <PieChart className="w-5 h-5 text-brand-600" />
                  Budget Goals
                </h3>
                <BudgetManager />
              </div>
            </div>
          </div>
        </main>

        <footer className="p-10 text-center border-t border-slate-200 bg-white">
          <p className="text-slate-400 text-sm font-medium">
            &copy; 2026 FinAI Systems &bull; Intelligent Financial Management
          </p>
        </footer>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}
