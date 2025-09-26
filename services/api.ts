
import type { User, Task, AdminSettings, Transaction, UserTask } from '../types';

// --- MOCK DATABASE ---
let tasks: Task[] = [
  { id: 1, title: "S'inscrire sur Melbet", description: "Utilisez le code promo 'MAIT' lors de l'inscription.", points: 500, link: '#' },
  { id: 2, title: "Premier Dépôt", description: "Faites un premier dépôt d'au moins 300 HTG.", points: 1000, link: '#' },
  { id: 3, title: "Pari Hebdomadaire", description: "Placez des paris d'une valeur de 250 HTG ou plus chaque semaine.", points: 250, link: '#' },
  { id: 4, title: "Canal Telegram", description: "Abonnez-vous à notre canal de pronostics.", points: 200, link: 'https://t.me/example' },
  { id: 5, title: "Inviter des Amis", description: "Recevez des points pour chaque ami qui s'inscrit.", points: 300, link: '#' },
  { id: 6, title: "Partage Social", description: "Partagez le projet sur vos réseaux sociaux (X, Facebook).", points: 150, link: '#' },
];

let users: User[] = [
  {
    id: 'user001',
    username: 'mait_fan_7',
    points: 700,
    tasks: [
      { taskId: 1, completed: true, completedAt: new Date().toISOString() },
      { taskId: 4, completed: true, completedAt: new Date().toISOString() },
      { taskId: 2, completed: false },
      { taskId: 3, completed: false },
      { taskId: 5, completed: false },
      { taskId: 6, completed: false },
    ],
    melbetId: '12345678'
  },
];

let settings: AdminSettings = {
  listingDate: '2024-12-01',
  withdrawalStartDate: '2024-12-15',
};

let transactions: Transaction[] = [
    { id: 1, userId: 'user001', type: 'credit', amount: 500, reason: "S'inscrire sur Melbet", timestamp: new Date().toISOString()},
    { id: 2, userId: 'user001', type: 'credit', amount: 200, reason: "Canal Telegram", timestamp: new Date().toISOString()},
];

const MOCK_API_DELAY = 500;

const delay = <T,>(data: T): Promise<T> => new Promise(resolve => setTimeout(() => resolve(data), MOCK_API_DELAY));

// --- USER API ---
export const getUserData = (userId: string): Promise<User | undefined> => delay(users.find(u => u.id === userId));
export const getTasks = (): Promise<Task[]> => delay(tasks);

export const completeTask = async (userId: string, taskId: number): Promise<User | null> => {
    const user = users.find(u => u.id === userId);
    const task = tasks.find(t => t.id === taskId);
    if (!user || !task) return null;

    const userTask = user.tasks.find(ut => ut.taskId === taskId);
    if (userTask && !userTask.completed) {
        userTask.completed = true;
        userTask.completedAt = new Date().toISOString();
        user.points += task.points;

        transactions.push({
            id: transactions.length + 1,
            userId,
            type: 'credit',
            amount: task.points,
            reason: task.title,
            timestamp: new Date().toISOString()
        });
    }
    return delay(user);
};

export const updateUserWallet = async (userId: string, ids: { walletId?: string; natcashId?: string; melbetId?: string }): Promise<User | null> => {
    const user = users.find(u => u.id === userId);
    if (!user) return null;
    user.walletId = ids.walletId || user.walletId;
    user.natcashId = ids.natcashId || user.natcashId;
    user.melbetId = ids.melbetId || user.melbetId;
    return delay(user);
}

// --- ADMIN API ---
export const adminLogin = (password: string): Promise<boolean> => {
    return delay(password === 'Scott'); // Simulating .env ADMIN_PASSWORD
};

export const getAdminData = (): Promise<{ users: User[], tasks: Task[], settings: AdminSettings, transactions: Transaction[] }> => {
    return delay({ users, tasks, settings, transactions });
};

export const addTask = (task: Omit<Task, 'id'>): Promise<Task> => {
    const newTask = { ...task, id: Math.max(...tasks.map(t => t.id), 0) + 1 };
    tasks.push(newTask);
    users.forEach(u => u.tasks.push({ taskId: newTask.id, completed: false }));
    return delay(newTask);
};

export const updateTask = (updatedTask: Task): Promise<Task | null> => {
    const index = tasks.findIndex(t => t.id === updatedTask.id);
    if (index === -1) return delay(null);
    tasks[index] = updatedTask;
    return delay(updatedTask);
};

export const deleteTask = (taskId: number): Promise<boolean> => {
    const initialLength = tasks.length;
    tasks = tasks.filter(t => t.id !== taskId);
    // Also remove from user tasks
    users.forEach(user => {
        user.tasks = user.tasks.filter(ut => ut.taskId !== taskId);
    });
    return delay(tasks.length < initialLength);
};

export const updateSettings = (newSettings: AdminSettings): Promise<AdminSettings> => {
    settings = newSettings;
    return delay(settings);
};

export const adjustUserPoints = (userId: string, amount: number, reason: string): Promise<User | null> => {
    const user = users.find(u => u.id === userId);
    if (!user) return delay(null);

    user.points += amount;
    transactions.push({
        id: transactions.length + 1,
        userId,
        type: amount > 0 ? 'credit' : 'debit',
        amount: Math.abs(amount),
        reason: reason,
        timestamp: new Date().toISOString()
    });

    return delay(user);
};
