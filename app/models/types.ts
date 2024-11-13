export interface User {
  id: string;
  username: string;
  role: 'admin' | 'accountant' | 'manager' | 'viewer';
  department: string;
}

export interface Transaction {
  id: string;
  date: Date;
  type: 'income' | 'expense';
  category: string;
  amount: number;
  description: string;
  createdBy: string;
  createdAt: Date;
  modifiedBy: string;
  modifiedAt: Date;
  attachments?: string[];
}

export interface AuditLog {
  id: string;
  action: 'create' | 'update' | 'delete';
  entityType: 'transaction' | 'user';
  entityId: string;
  changes: any;
  performedBy: string;
  timestamp: Date;
  ipAddress: string;
}