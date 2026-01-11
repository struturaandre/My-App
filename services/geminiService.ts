
import { GoogleGenAI } from "@google/genai";
import { Transaction, Goal } from "../types";

export const getFinancialAdvice = async (transactions: Transaction[], goals: Goal[]) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  const summary = {
    totalSpent: transactions.filter(t => t.type === 'despesa').reduce((acc, curr) => acc + curr.amount, 0),
    totalEarned: transactions.filter(t => t.type === 'receita').reduce((acc, curr) => acc + curr.amount, 0),
    topCategory: transactions
      .filter(t => t.type === 'despesa')
      .reduce((acc: any, curr) => {
        acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
        return acc;
      }, {})
  };

  const prompt = `
    Aja como um consultor financeiro brasileiro experiente. 
    Analise os seguintes dados financeiros do usuário:
    - Total de Ganhos: R$ ${summary.totalEarned.toFixed(2)}
    - Total de Gastos: R$ ${summary.totalSpent.toFixed(2)}
    - Principais Categorias de Gasto: ${JSON.stringify(summary.topCategory)}
    - Metas Ativas: ${goals.map(g => `${g.title} (Alvo: R$ ${g.targetAmount})`).join(', ')}

    Forneça 3 dicas práticas e motivadoras em português do Brasil para melhorar a saúde financeira deste usuário.
    Seja conciso, direto e amigável.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        temperature: 0.7,
      }
    });
    return response.text;
  } catch (error) {
    console.error("Erro ao obter conselho da IA:", error);
    return "Não foi possível carregar as dicas da IA no momento. Continue economizando!";
  }
};
