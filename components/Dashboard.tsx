
import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { Transaction, Goal } from '../types';
import { getFinancialAdvice } from '../services/geminiService';

interface DashboardProps {
  transactions: Transaction[];
  goals: Goal[];
}

const Dashboard: React.FC<DashboardProps> = ({ transactions, goals }) => {
  const [advice, setAdvice] = useState<string>('Carregando dicas financeiras...');
  const [isLoadingAdvice, setIsLoadingAdvice] = useState(false);

  useEffect(() => {
    const fetchAdvice = async () => {
      if (transactions.length > 0) {
        setIsLoadingAdvice(true);
        const res = await getFinancialAdvice(transactions, goals);
        setAdvice(res || '');
        setIsLoadingAdvice(false);
      } else {
        setAdvice('Adicione alguns gastos para receber conselhos da nossa IA!');
      }
    };
    fetchAdvice();
  }, [transactions.length, goals.length]);

  const totalIncome = transactions
    .filter(t => t.type === 'receita')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalExpense = transactions
    .filter(t => t.type === 'despesa')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const balance = totalIncome - totalExpense;

  const categoryData = transactions
    .filter(t => t.type === 'despesa')
    .reduce((acc: any[], curr) => {
      const existing = acc.find(item => item.name === curr.category);
      if (existing) {
        existing.value += curr.amount;
      } else {
        acc.push({ name: curr.category, value: curr.amount });
      }
      return acc;
    }, []);

  const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

  return (
    <div className="space-y-8 animate-fadeIn">
      <header>
        <h2 className="text-2xl font-bold text-slate-800">Olá, bem-vindo de volta!</h2>
        <p className="text-slate-500">Aqui está o resumo das suas finanças este mês.</p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Saldo Atual</p>
          <p className={`text-3xl font-bold mt-2 ${balance >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
            R$ {balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Receitas</p>
          <p className="text-3xl font-bold text-indigo-600 mt-2">
            R$ {totalIncome.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Despesas</p>
          <p className="text-3xl font-bold text-rose-500 mt-2">
            R$ {totalExpense.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Category Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-[400px]">
          <h3 className="font-bold text-slate-800 mb-4">Gastos por Categoria</h3>
          <ResponsiveContainer width="100%" height="90%">
            <PieChart>
              <Pie
                data={categoryData}
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => `R$ ${value.toFixed(2)}`} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* AI Advice Card */}
        <div className="bg-indigo-600 p-8 rounded-2xl shadow-lg text-white relative overflow-hidden flex flex-col justify-center">
          <div className="absolute top-[-20px] right-[-20px] w-40 h-40 bg-white opacity-10 rounded-full blur-3xl"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">✨</span>
              <h3 className="font-bold text-xl">Insights da IA Finanza</h3>
            </div>
            {isLoadingAdvice ? (
              <div className="space-y-3">
                <div className="h-4 bg-white/20 rounded w-3/4 animate-pulse"></div>
                <div className="h-4 bg-white/20 rounded w-full animate-pulse"></div>
                <div className="h-4 bg-white/20 rounded w-2/3 animate-pulse"></div>
              </div>
            ) : (
              <p className="text-indigo-50 leading-relaxed italic">
                "{advice}"
              </p>
            )}
            <button 
              onClick={() => window.location.reload()}
              className="mt-6 px-4 py-2 bg-white text-indigo-600 rounded-lg text-sm font-semibold hover:bg-indigo-50 transition-colors"
            >
              Atualizar Dicas
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
