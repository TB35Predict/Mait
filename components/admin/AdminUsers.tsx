
import React, { useState } from 'react';
import { User, WithdrawalRequest } from '../../types';
import { Card } from '../Card';
import { Button } from '../Button';
import { Modal } from '../Modal';
import * as api from '../../services/api';

interface AdminUsersProps {
  users: User[];
  withdrawalRequests: WithdrawalRequest[];
  refreshData: () => void;
}

type SubTab = 'list' | 'withdrawals';

export const AdminUsers: React.FC<AdminUsersProps> = ({ users, withdrawalRequests, refreshData }) => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [amount, setAmount] = useState(0);
  const [reason, setReason] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<SubTab>('list');
  const [processingId, setProcessingId] = useState<number | null>(null);
  
  const WITHDRAWAL_THRESHOLD = 2000;

  const openModal = (user: User) => {
    setSelectedUser(user);
    setAmount(0);
    setReason('');
    setIsModalOpen(true);
  };

  const handleAdjustPoints = async () => {
    if (!selectedUser || !amount || !reason) return;
    await api.adjustUserPoints(selectedUser.id, amount, reason);
    refreshData();
    setIsModalOpen(false);
  };
  
  const handleProcessWithdrawal = async (requestId: number, status: 'approved' | 'rejected') => {
    setProcessingId(requestId);
    await api.processWithdrawalRequest(requestId, status);
    await refreshData();
    setProcessingId(null);
  }

  const exportToCSV = () => {
    const headers = "Username,Points,Statut,Montant Airdrop,Melbet ID,Natcash ID,Wallet ID";
    const csvContent = users.map(u => {
      const status = u.points >= WITHDRAWAL_THRESHOLD ? "Éligible" : "Non Éligible";
      const airdropAmount = status === 'Éligible' ? (u.points * 0.01).toFixed(2) + ' USD' : '0 USD';
      return [u.username, u.points, status, airdropAmount, u.melbetId || 'N/A', u.natcashId || 'N/A', u.walletId || 'N/A'].join(',');
    }).join('\n');

    const blob = new Blob([headers + '\n' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'mait_airdrop_users.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };
  
  const TabButton = ({ tab, label, count }: { tab: SubTab; label: string, count: number }) => (
    <button
      onClick={() => setActiveSubTab(tab)}
      className={`px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
        activeSubTab === tab
          ? 'bg-brand-accent text-white'
          : 'bg-dark-border text-dark-text-secondary hover:bg-gray-600'
      }`}
    >
      {label} <span className="bg-gray-700 text-xs px-2 py-1 rounded-full">{count}</span>
    </button>
  );

  const getStatusChip = (status: WithdrawalRequest['status']) => {
    const baseClasses = 'px-2 py-1 text-xs font-semibold rounded-full';
    const statusClasses = {
        pending: 'bg-yellow-500/20 text-yellow-400',
        approved: 'bg-green-500/20 text-green-400',
        rejected: 'bg-red-500/20 text-red-400'
    };
    return `${baseClasses} ${statusClasses[status]}`;
  }


  return (
    <Card>
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
           <TabButton tab="list" label="Liste des Utilisateurs" count={users.length} />
           <TabButton tab="withdrawals" label="Demandes de Retrait" count={withdrawalRequests.length} />
        </div>
        {activeSubTab === 'list' && <Button onClick={exportToCSV}>Exporter en CSV</Button>}
      </div>
      
      {activeSubTab === 'list' ? (
         <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-dark-border">
                  <th className="p-2">Username</th>
                  <th className="p-2">Points</th>
                  <th className="p-2">Statut</th>
                  <th className="p-2">Airdrop (est.)</th>
                  <th className="p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id} className="border-b border-dark-border hover:bg-gray-900">
                    <td className="p-2">{user.username}</td>
                    <td className="p-2">{user.points}</td>
                    <td className={`p-2 font-semibold ${user.points >= WITHDRAWAL_THRESHOLD ? 'text-green-400' : 'text-red-400'}`}>
                      {user.points >= WITHDRAWAL_THRESHOLD ? 'Éligible' : 'Non Éligible'}
                    </td>
                    <td className="p-2">{user.points >= WITHDRAWAL_THRESHOLD ? `${(user.points * 0.01).toFixed(2)} USD` : 'N/A'}</td>
                    <td className="p-2">
                      <Button variant="secondary" onClick={() => openModal(user)}>Ajuster</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
        </div>
      ) : (
        <div className="overflow-x-auto">
            <table className="w-full text-left">
                <thead>
                    <tr className="border-b border-dark-border">
                        <th className="p-2">Utilisateur</th>
                        <th className="p-2">Points Demandés</th>
                        <th className="p-2">Date</th>
                        <th className="p-2">Statut</th>
                        <th className="p-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {withdrawalRequests.map(req => (
                        <tr key={req.id} className="border-b border-dark-border hover:bg-gray-900">
                            <td className="p-2">{req.username}</td>
                            <td className="p-2">{req.points.toLocaleString()}</td>
                            <td className="p-2">{new Date(req.timestamp).toLocaleString()}</td>
                            <td className="p-2"><span className={getStatusChip(req.status)}>{req.status}</span></td>
                            <td className="p-2">
                                {req.status === 'pending' ? (
                                    <div className="flex gap-2">
                                        <Button
                                            className="!bg-green-600 hover:!bg-green-700"
                                            onClick={() => handleProcessWithdrawal(req.id, 'approved')}
                                            disabled={processingId === req.id}
                                        >
                                            {processingId === req.id ? '...' : 'Approuver'}
                                        </Button>
                                        <Button
                                            variant="danger"
                                            onClick={() => handleProcessWithdrawal(req.id, 'rejected')}
                                            disabled={processingId === req.id}
                                        >
                                            {processingId === req.id ? '...' : 'Rejeter'}
                                        </Button>
                                    </div>
                                ) : 'N/A'}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      )}
      
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={`Ajuster le solde de ${selectedUser?.username}`}>
        <div className="space-y-4">
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-dark-text-secondary mb-1">Montant (négatif pour débiter)</label>
            <input
              id="amount" type="number" value={amount} onChange={(e) => setAmount(parseInt(e.target.value, 10))}
              className="w-full px-3 py-2 bg-dark-bg border border-dark-border rounded-md"
            />
          </div>
          <div>
            <label htmlFor="reason" className="block text-sm font-medium text-dark-text-secondary mb-1">Raison</label>
            <input
              id="reason" type="text" value={reason} onChange={(e) => setReason(e.target.value)}
              className="w-full px-3 py-2 bg-dark-bg border border-dark-border rounded-md"
              placeholder="Ex: Bonus spécial"
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Annuler</Button>
            <Button onClick={handleAdjustPoints}>Confirmer</Button>
          </div>
        </div>
      </Modal>
    </Card>
  );
};
