
export interface Task {
  id: number;
  title: string;
  description: string;
  points: number;
  link?: string;
}

export interface UserTask {
  taskId: number;
  completed: boolean;
  completedAt?: string;
}

export interface User {
  id: string;
  username: string;
  points: number;
  tasks: UserTask[];
  walletId?: string;
  natcashId?: string;
  melbetId?: string;
}

export interface AdminSettings {
    listingDate: string;
    withdrawalStartDate: string;
}

export interface Transaction {
  id: number;
  userId: string;
  type: 'credit' | 'debit';
  amount: number;
  reason: string;
  timestamp: string;
}
