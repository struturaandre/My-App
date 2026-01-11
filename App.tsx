
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import ExpenseTable from './components/ExpenseTable';
import GoalTracker from './components/GoalTracker';
import Reminders from './components/Reminders';
import { Transaction, Goal, Reminder } from './types';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Local state persistence logic
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('finanza_transactions');
    return saved ? JSON.parse(saved) : [
      { id: '1', description: 'Salário Mensal', amount: 5000, date: '2024-05-01', category: 'Salário', type: 'receita' },
      { id: '2', description: 'Aluguel', amount: 1500, date: '2024-05-05', category: 'Moradia', type: 'despesa' },
      { id: '3', description: 'Supermercado', amount: 600, date: '2024-05-10', category: 'Alimentação', type: 'despesa' }
    ];
  });

  const [goals, setGoals] = useState<Goal[]>(() => {
    const saved = localStorage.getItem('finanza_goals');
    return saved ? JSON.parse(saved) : [
      { id: '1', title: 'Reserva de Emergência', targetAmount: 10000, currentAmount: 2500, deadline: '2024-12-31' },
      { id: '2', title: 'Viagem Natal', targetAmount: 3000, currentAmount: 1200, deadline: '2024-12-20' }
    ];
  });

  const [reminders, setReminders] = useState<Reminder[]>(() => {
    const saved = localStorage.getItem('finanza_reminders');
    return saved ? JSON.parse(saved) : [
      { id: '1', title: 'Energia Elétrica', dueDate: '2024-05-25', amount: 180, isPaid: false },
      { id: '2', title: 'Cartão de Crédito', dueDate: '2024-05-15', amount: 1200, isPaid: true }
    ];
  });

  useEffect(() => {
    localStorage.setItem('finanza_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('finanza_goals', JSON.stringify(goals));
  }, [goals]);

  useEffect(() => {
    localStorage.setItem('finanza_reminders', JSON.stringify(reminders));
  }, [reminders]);

  // Actions
  const addTransaction = (t: Transaction) => setTransactions(prev => [...prev, t]);
  const deleteTransaction = (id: string) => setTransactions(prev => prev.filter(t => t.id !== id));
  
  const addGoal = (g: Goal) => setGoals(prev => [...prev, g]);
  const updateGoal = (id: string, amount: number) => setGoals(prev => prev.map(g => g.id === id ? {...g, currentAmount: g.currentAmount + amount} : g));
  const deleteGoal = (id: string) => setGoals(prev => prev.filter(g => g.id !== id));

  const addReminder = (r: Reminder) => setReminders(prev => [...prev, r]);
  const toggleReminderPaid = (id: string) => setReminders(prev => prev.map(r => r.id === id ? {...r, isPaid: !r.isPaid} : r));
  const deleteReminder = (id: string) => setReminders(prev => prev.filter(r => r.id !== id));

  const renderContent = () => {
    switch(activeTab) {
      case 'dashboard': return <Dashboard transactions={transactions} goals={goals} />;
      case 'gastos': return <ExpenseTable transactions={transactions} onAddTransaction={addTransaction} onDeleteTransaction={deleteTransaction} />;
      case 'metas': return <GoalTracker goals={goals} onAddGoal={addGoal} onUpdateGoal={updateGoal} onDeleteGoal={deleteGoal} />;
      case 'lembretes': return <Reminders reminders={reminders} onAddReminder={addReminder} onTogglePaid={toggleReminderPaid} onDeleteReminder={deleteReminder} />;
      default: return <Dashboard transactions={transactions} goals={goals} />;
    }
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      {renderContent()}
    </Layout>
  );
};

export default App;
