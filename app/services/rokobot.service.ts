import { OpenAI } from 'openai';
import { TransactionService } from './transaction.service';
import { Transaction } from '../models/types';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export class RokoBotService {
  private static instance: RokoBotService;
  private openai: OpenAI;
  private transactionService: TransactionService;
  private context: string = `You are RokoBot, a financial assistant for CV Cakra Mas Jaya. 
    You help analyze financial data and provide insights in Bahasa Indonesia.`;

  private constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
    this.transactionService = TransactionService.getInstance();
  }

  static getInstance(): RokoBotService {
    if (!RokoBotService.instance) {
      RokoBotService.instance = new RokoBotService();
    }
    return RokoBotService.instance;
  }

  async chat(message: string, financialData?: any): Promise<string> {
    try {
      const enhancedPrompt = this.enhancePromptWithData(message, financialData);
      
      const completion = await this.openai.chat.completions.create({
        messages: [
          { role: 'system', content: this.context },
          { role: 'user', content: enhancedPrompt }
        ],
        model: 'gpt-4',
        temperature: 0.7,
        max_tokens: 500
      });

      return completion.choices[0].message.content;
    } catch (error) {
      console.error('RokoBot chat error:', error);
      return 'Maaf, saya mengalami kendala teknis. Silakan coba lagi nanti.';
    }
  }

  private enhancePromptWithData(message: string, financialData: any): string {
    if (!financialData) return message;

    return `
      Context Data Keuangan:
      ${JSON.stringify(financialData, null, 2)}
      
      User Question: ${message}
    `;
  }

  async generateFinancialInsights(transactions: Transaction[]): Promise<string> {
    const summary = this.calculateFinancialSummary(transactions);
    
    const prompt = `
      Berdasarkan data keuangan berikut:
      ${JSON.stringify(summary, null, 2)}
      
      Berikan analisis dan rekomendasi dalam Bahasa Indonesia tentang:
      1. Tren keuangan
      2. Area yang perlu perhatian
      3. Peluang optimisasi
    `;

    return this.chat(prompt, summary);
  }

  private calculateFinancialSummary(transactions: Transaction[]) {
    const summary = {
      totalIncome: 0,
      totalExpense: 0,
      categoryBreakdown: {},
      monthlyTrend: {}
    };

    transactions.forEach(transaction => {
      // Calculate summaries...
    });

    return summary;
  }
}