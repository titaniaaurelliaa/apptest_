import { Observable } from '@nativescript/core';
import { TransactionService } from '../../services/transaction.service';
import { AuthService } from '../../services/auth.service';
import { RokoBotService } from '../../services/rokobot.service';
import { Transaction } from '../../models/types';
import { format } from 'date-fns';
import { navigate } from '@nativescript/core/ui/frame';

export class DashboardViewModel extends Observable {
  private transactionService = TransactionService.getInstance();
  private authService = AuthService.getInstance();
  private rokoBotService = RokoBotService.getInstance();

  transactions: Transaction[] = [];
  recentTransactions: Transaction[] = [];
  selectedTabIndex: number = 0;
  aiInsights: string = '';

  // Financial summaries
  totalIncome: number = 0;
  totalExpense: number = 0;
  totalAssets: number = 0;
  totalLiabilities: number = 0;
  revenue: number = 0;
  expenses: number = 0;
  netIncome: number = 0;
  operatingCashFlow: number = 0;

  constructor() {
    super();
    this.loadData();
  }

  async loadData() {
    try {
      await this.loadTransactions();
      this.calculateFinancialSummaries();
      this.generateAiInsights();
    } catch (error) {
      console.error('Error loading data:', error);
      alert('Failed to load data');
    }
  }

  private async loadTransactions() {
    // Implementation to load transactions from Firebase
    // Update this.transactions and this.recentTransactions
  }

  private calculateFinancialSummaries() {
    this.totalIncome = this.transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    this.totalExpense = this.transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    this.netIncome = this.totalIncome - this.totalExpense;
    
    this.notifyPropertyChange('totalIncome', this.totalIncome);
    this.notifyPropertyChange('totalExpense', this.totalExpense);
    this.notifyPropertyChange('netIncome', this.netIncome);
  }

  private async generateAiInsights() {
    try {
      this.aiInsights = await this.rokoBotService.generateFinancialInsights(this.transactions);
      this.notifyPropertyChange('aiInsights', this.aiInsights);
    } catch (error) {
      console.error('Error generating AI insights:', error);
    }
  }

  onOpenRokoBot() {
    navigate({
      moduleName: 'views/chat/chat-page',
      transition: {
        name: 'slideLeft'
      }
    });
  }

  async onViewAiInsights() {
    // Show AI insights in a modal or navigate to insights page
    const insights = await this.rokoBotService.generateFinancialInsights(this.transactions);
    // Implementation to display insights
  }

  async onNewTransaction() {
    // Navigate to new transaction page
  }

  onLogout() {
    this.authService.logout();
    navigate({
      moduleName: 'views/login/login-page',
      clearHistory: true
    });
  }
}