import React, { useState, useEffect, useCallback } from 'react';
import { User, Task, AdminSettings, Transaction } from '../types';
import * as api from '../services/api';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { UsersIcon, TasksIcon, SettingsIcon, LogoutIcon } from '../components/Icons';
import { AdminUsers } from '../components/admin/AdminUsers';
import { AdminTasks } from '../components/admin/AdminTasks';
import { AdminSettingsComponent } from '../components/admin/AdminSettings';

type AdminTab = 'users' | 'tasks' | 'settings';

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AdminTab>('users');
  const [users, setUsers] = useState<User[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [settings, setSettings] = useState<AdminSettings>({ listingDate: '', withdrawalStartDate: '' });
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  const { logout } = useAuth();
  const navigate = useNavigate();

  const fetchData = useCallback(async () => {
    setLoading(true);
    const data = await api.getAdminData();
    setUsers(data.users);
    setTasks(data.tasks);
    setSettings(data.settings);
    setTransactions(data.transactions);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'users':
        return <AdminUsers users={users} refreshData={fetchData} />;
      case 'tasks':
        return <AdminTasks tasks={tasks} refreshData={fetchData} />;
      case 'settings':
        return <AdminSettingsComponent settings={settings} refreshData={fetchData} />;
      default:
        return null;
    }
  };

  const TabButton = ({ tab, icon, label }: { tab: AdminTab; icon: React.ReactNode; label: string }) => (
    <button
      onClick={() => setActiveTab(tab)}
      className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors duration-200 ${
        activeTab === tab ? 'bg-brand-accent text-white' : 'hover:bg-dark-card'
      }`}
    >
      {icon}
      <span className="hidden md:inline">{label}</span>
    </button>
  );

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="flex justify-between items-center">
        <Header title="Tableau de Bord Administrateur" subtitle="Gérez l'airdrop MAIT" />
        <Button onClick={handleLogout} variant="secondary">
          <LogoutIcon className="w-5 h-5"/>
          <span className="hidden md:inline ml-2">Déconnexion</span>
        </Button>
      </div>
      
      <Card className="mb-8">
        <div className="flex justify-center md:justify-start space-x-2 md:space-x-4">
          <TabButton tab="users" icon={<UsersIcon className="w-5 h-5" />} label="Utilisateurs" />
          <TabButton tab="tasks" icon={<TasksIcon className="w-5 h-5" />} label="Tâches" />
          <TabButton tab="settings" icon={<SettingsIcon className="w-5 h-5" />} label="Paramètres" />
        </div>
      </Card>

      <div>
        {loading ? (
          <div className="text-center py-10">Chargement des données...</div>
        ) : (
          renderContent()
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;