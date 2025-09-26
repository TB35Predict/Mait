
import React, { useState, useEffect } from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import { User } from '../types';

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (ids: { walletId?: string; natcashId?: string; melbetId?: string }) => void;
  currentUser: User | null;
}

export const WalletModal: React.FC<WalletModalProps> = ({ isOpen, onClose, onSave, currentUser }) => {
  const [melbetId, setMelbetId] = useState('');
  const [natcashId, setNatcashId] = useState('');
  const [walletId, setWalletId] = useState('');

  useEffect(() => {
    if (currentUser) {
      setMelbetId(currentUser.melbetId || '');
      setNatcashId(currentUser.natcashId || '');
      setWalletId(currentUser.walletId || '');
    }
  }, [currentUser, isOpen]);

  const handleSave = () => {
    onSave({ melbetId, natcashId, walletId });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Connecter votre Compte">
      <div className="space-y-4">
        <div>
          <label htmlFor="melbetId" className="block text-sm font-medium text-dark-text-secondary mb-1">ID Melbet</label>
          <input
            id="melbetId"
            type="text"
            value={melbetId}
            onChange={(e) => setMelbetId(e.target.value)}
            className="w-full px-3 py-2 bg-dark-bg border border-dark-border rounded-md focus:outline-none focus:ring-1 focus:ring-brand-accent"
            placeholder="Votre ID Melbet"
          />
        </div>
        <div>
          <label htmlFor="natcashId" className="block text-sm font-medium text-dark-text-secondary mb-1">ID Natcash</label>
          <input
            id="natcashId"
            type="text"
            value={natcashId}
            onChange={(e) => setNatcashId(e.target.value)}
            className="w-full px-3 py-2 bg-dark-bg border border-dark-border rounded-md focus:outline-none focus:ring-1 focus:ring-brand-accent"
            placeholder="Votre numéro Natcash"
          />
        </div>
        <div>
          <label htmlFor="walletId" className="block text-sm font-medium text-dark-text-secondary mb-1">Adresse Crypto (USDT TRC20)</label>
          <input
            id="walletId"
            type="text"
            value={walletId}
            onChange={(e) => setWalletId(e.target.value)}
            className="w-full px-3 py-2 bg-dark-bg border border-dark-border rounded-md focus:outline-none focus:ring-1 focus:ring-brand-accent"
            placeholder="Votre adresse de portefeuille"
          />
        </div>
        <div className="flex justify-end gap-4 pt-4">
          <Button variant="secondary" onClick={onClose}>Annuler</Button>
          <Button onClick={handleSave}>Enregistrer</Button>
        </div>
      </div>
    </Modal>
  );
};
