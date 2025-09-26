
import React, { useState, useEffect, useCallback } from 'react';
import { User, Task, UserTask } from '../types';
import * as api from '../services/api';
import { Header } from '../components/Header';
import { Card } from '../components/Card';
import { TaskItem } from '../components/TaskItem';
import { WalletModal } from '../components/WalletModal';
import { InfoIcon, TrophyIcon, WalletIcon, ClockIcon, AlertTriangleIcon } from '../components/Icons';

const UserDashboard: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const MOCKED_USER_ID = 'user001';
  const WITHDRAWAL_THRESHOLD = 2000; // Example points threshold
  const isEligible = user ? user.points >= WITHDRAWAL_THRESHOLD : false;

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [userData, tasksData] = await Promise.all([
        api.getUserData(MOCKED_USER_ID),
        api.getTasks()
      ]);
      if (userData) setUser(userData);
      setTasks(tasksData);
    } catch (error) {
      console.error("Failed to fetch data", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleCompleteTask = async (taskId: number) => {
    const updatedUser = await api.completeTask(MOCKED_USER_ID, taskId);
    if (updatedUser) {
      setUser(updatedUser);
    }
  };
  
  const handleSaveWallet = async (ids: { walletId?: string; natcashId?: string; melbetId?: string }) => {
    if(!user) return;
    const updatedUser = await api.updateUserWallet(user.id, ids);
    if(updatedUser) {
      setUser(updatedUser);
    }
    setIsModalOpen(false);
  }

  const getTaskStatus = (taskId: number): UserTask | undefined => {
    return user?.tasks.find(t => t.taskId === taskId);
  };
  
  const completedTasks = tasks.filter(task => getTaskStatus(task.id)?.completed);

  if (loading) {
    return <div className="flex justify-center items-center h-screen"><div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-brand-accent"></div></div>;
  }
  
  if (!user) {
    return <div className="text-center mt-10">Utilisateur non trouvé.</div>;
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <Header title={`Bienvenue, ${user.username}`} subtitle="Complétez des tâches pour gagner des points et être éligible à l'airdrop MAIT." />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <TrophyIcon className="w-8 h-8 text-brand-primary mb-2"/>
          <h3 className="text-lg font-semibold text-dark-text-secondary">Points Gagnés</h3>
          <p className="text-3xl font-bold text-dark-text">{user.points.toLocaleString()}</p>
        </Card>
        <Card>
          <InfoIcon className="w-8 h-8 text-brand-primary mb-2"/>
          <h3 className="text-lg font-semibold text-dark-text-secondary">Statut de Retrait</h3>
          <p className={`text-3xl font-bold ${isEligible ? 'text-green-400' : 'text-red-400'}`}>
            {isEligible ? 'Éligible' : 'Non Éligible'}
          </p>
        </Card>
        <Card>
          <WalletIcon className="w-8 h-8 text-brand-primary mb-2"/>
          <h3 className="text-lg font-semibold text-dark-text-secondary">Portefeuille</h3>
          <button onClick={() => setIsModalOpen(true)} className="mt-2 bg-brand-accent hover:bg-brand-secondary text-white font-bold py-2 px-4 rounded transition duration-300">
            {user.melbetId || user.natcashId || user.walletId ? 'Voir / Modifier' : 'Connecter'}
          </button>
        </Card>
        <Card>
          <ClockIcon className="w-8 h-8 text-brand-primary mb-2"/>
          <h3 className="text-lg font-semibold text-dark-text-secondary">Tâches Complétées</h3>
          <p className="text-3xl font-bold text-dark-text">{completedTasks.length} / {tasks.length}</p>
        </Card>
      </div>

      <div className="bg-yellow-900/50 border border-yellow-700 text-yellow-200 px-4 py-3 rounded-lg relative mb-8 flex items-start gap-3">
        <AlertTriangleIcon className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-1"/>
        <div>
          <strong className="font-bold">Information importante : </strong>
          <span className="block sm:inline">Des frais de gaz de 200 HTG sont requis avant de pouvoir effectuer un retrait. Vous devez être éligible pour procéder.</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card title="Liste des Tâches">
          <div className="space-y-4">
            {tasks.map(task => (
              <TaskItem key={task.id} task={task} status={getTaskStatus(task.id)} onComplete={handleCompleteTask} />
            ))}
          </div>
        </Card>
        <Card title="Historique des Tâches Complétées">
          <div className="space-y-3">
            {completedTasks.length > 0 ? (
                completedTasks.map(task => {
                    const userTask = getTaskStatus(task.id);
                    return (
                        <div key={task.id} className="p-3 bg-gray-900 rounded-lg flex justify-between items-center">
                            <div>
                                <p className="font-semibold">{task.title}</p>
                                <p className="text-sm text-dark-text-secondary">
                                    Complétée le {userTask?.completedAt ? new Date(userTask.completedAt).toLocaleDateString() : 'N/A'}
                                </p>
                            </div>
                            <span className="font-bold text-green-400">+{task.points} pts</span>
                        </div>
                    );
                })
            ) : (
                <p className="text-dark-text-secondary">Aucune tâche complétée pour le moment.</p>
            )}
          </div>
        </Card>
      </div>
      <WalletModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={handleSaveWallet}
        currentUser={user}
      />
    </div>
  );
};

export default UserDashboard;
