import { Observable } from '@nativescript/core';
import { RokoBotService, ChatMessage } from '../../services/rokobot.service';
import { TransactionService } from '../../services/transaction.service';
import { format } from 'date-fns';

export class ChatViewModel extends Observable {
  private rokoBotService = RokoBotService.getInstance();
  private transactionService = TransactionService.getInstance();

  messages: ChatMessage[] = [];
  messageText: string = '';
  isProcessing: boolean = false;

  constructor() {
    super();
    this.addWelcomeMessage();
  }

  private addWelcomeMessage() {
    const welcomeMessage: ChatMessage = {
      role: 'assistant',
      content: 'Halo! Saya RokoBot, asisten keuangan Anda. Apa yang ingin Anda ketahui tentang data keuangan CV Cakra Mas Jaya?',
      timestamp: new Date()
    };
    this.messages.unshift(welcomeMessage);
    this.notifyPropertyChange('messages', this.messages);
  }

  async sendMessage() {
    if (!this.messageText.trim() || this.isProcessing) return;

    const userMessage: ChatMessage = {
      role: 'user',
      content: this.messageText.trim(),
      timestamp: new Date()
    };

    this.messages.unshift(userMessage);
    this.set('isProcessing', true);
    this.set('messageText', '');

    try {
      // Get relevant financial data for context
      const recentTransactions = await this.transactionService.getRecentTransactions();
      const financialSummary = await this.transactionService.getFinancialSummary();

      // Get AI response
      const response = await this.rokoBotService.chat(
        userMessage.content,
        { recentTransactions, financialSummary }
      );

      const botMessage: ChatMessage = {
        role: 'assistant',
        content: response,
        timestamp: new Date()
      };

      this.messages.unshift(botMessage);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: ChatMessage = {
        role: 'assistant',
        content: 'Maaf, terjadi kesalahan. Silakan coba lagi nanti.',
        timestamp: new Date()
      };
      this.messages.unshift(errorMessage);
    } finally {
      this.set('isProcessing', false);
      this.notifyPropertyChange('messages', this.messages);
    }
  }
}