import { firebase } from '@nativescript/firebase-core';
import '@nativescript/firebase-firestore';
import { Transaction, AuditLog } from '../models/types';
import { AuthService } from './auth.service';

export class TransactionService {
  private static instance: TransactionService;
  private authService = AuthService.getInstance();

  static getInstance(): TransactionService {
    if (!TransactionService.instance) {
      TransactionService.instance = new TransactionService();
    }
    return TransactionService.instance;
  }

  async createTransaction(transaction: Partial<Transaction>): Promise<string> {
    const user = this.authService.getCurrentUser();
    if (!user) throw new Error('Unauthorized');

    const db = firebase().firestore();
    const now = new Date();

    const newTransaction: Transaction = {
      ...transaction,
      id: '',
      createdBy: user.id,
      createdAt: now,
      modifiedBy: user.id,
      modifiedAt: now
    } as Transaction;

    const docRef = await db.collection('transactions').add(newTransaction);
    await this.createAuditLog('create', 'transaction', docRef.id, newTransaction);

    return docRef.id;
  }

  private async createAuditLog(
    action: 'create' | 'update' | 'delete',
    entityType: string,
    entityId: string,
    changes: any
  ): Promise<void> {
    const user = this.authService.getCurrentUser();
    const db = firebase().firestore();

    const auditLog: AuditLog = {
      id: '',
      action,
      entityType,
      entityId,
      changes,
      performedBy: user.id,
      timestamp: new Date(),
      ipAddress: 'mobile-app'
    };

    await db.collection('auditLogs').add(auditLog);
  }
}