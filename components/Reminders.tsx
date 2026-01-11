
import React, { useState } from 'react';
import { Reminder } from '../types';

interface RemindersProps {
  reminders: Reminder[];
  onAddReminder: (reminder: Reminder) => void;
  onTogglePaid: (id: string) => void;
  onDeleteReminder: (id: string) => void;
}

const Reminders: React.FC<RemindersProps> = ({ reminders, onAddReminder, onTogglePaid, onDeleteReminder }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ title: '', amount: '', date: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.amount || !formData.date) return;
    onAddReminder({
      id: Math.random().toString(36).substr(2, 9),
      title: formData.title,
      amount: parseFloat(formData.amount),
      dueDate: formData.date,
      isPaid: false
    });
    setFormData({ title: '', amount: '', date: '' });
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Lembretes de Pagamento</h2>
          <p className="text-slate-500">Nunca mais esqueça uma conta a pagar.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-2 rounded-xl font-semibold transition-colors"
        >
          Novo Lembrete
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {reminders.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()).map(reminder => (
          <div 
            key={reminder.id} 
            className={`p-5 rounded-2xl border transition-all ${reminder.isPaid ? 'bg-slate-50 border-slate-200 grayscale' : 'bg-white border-amber-100 shadow-sm'}`}
          >
            <div className="flex justify-between items-start mb-4">
              <span className={`text-xs font-bold uppercase tracking-wider px-2 py-1 rounded ${reminder.isPaid ? 'bg-slate-200 text-slate-500' : 'bg-amber-100 text-amber-700'}`}>
                {reminder.isPaid ? 'Pago' : 'Pendente'}
              </span>
              <button onClick={() => onDeleteReminder(reminder.id)} className="text-slate-300 hover:text-rose-500">✕</button>
            </div>
            <h4 className="font-bold text-slate-800 mb-1">{reminder.title}</h4>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-sm text-slate-500">Vencimento: {new Date(reminder.dueDate).toLocaleDateString('pt-BR')}</p>
                <p className="text-lg font-black text-slate-700">R$ {reminder.amount.toLocaleString('pt-BR')}</p>
              </div>
              <button
                onClick={() => onTogglePaid(reminder.id)}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${reminder.isPaid ? 'bg-emerald-500 text-white shadow-emerald-200 shadow-lg' : 'bg-slate-100 text-slate-400'}`}
              >
                {reminder.isPaid ? '✓' : ''}
              </button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md p-8 animate-slideUp">
            <h3 className="text-xl font-bold text-slate-800 mb-6">Agendar Conta</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Título da Conta</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="Ex: Aluguel, Internet"
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Valor (R$)</label>
                  <input
                    type="number"
                    required
                    value={formData.amount}
                    onChange={(e) => setFormData({...formData, amount: e.target.value})}
                    placeholder="0,00"
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Vencimento</label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full bg-amber-500 hover:bg-amber-600 text-white py-3 rounded-xl font-bold transition-all shadow-lg shadow-amber-100"
              >
                Salvar Lembrete
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reminders;
