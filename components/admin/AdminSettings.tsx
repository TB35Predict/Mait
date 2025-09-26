
import React, { useState, useEffect } from 'react';
import { AdminSettings } from '../../types';
import { Card } from '../Card';
import { Button } from '../Button';
import * as api from '../../services/api';

interface AdminSettingsProps {
  settings: AdminSettings;
  refreshData: () => void;
}

export const AdminSettingsComponent: React.FC<AdminSettingsProps> = ({ settings, refreshData }) => {
  const [currentSettings, setCurrentSettings] = useState<AdminSettings>({ ...settings });

  useEffect(() => {
    setCurrentSettings(settings);
  }, [settings]);

  const handleSave = async () => {
    await api.updateSettings(currentSettings);
    refreshData();
    alert('Paramètres sauvegardés !');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentSettings(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <Card>
      <h2 className="text-xl font-bold mb-4">Paramètres Généraux</h2>
      <div className="space-y-4 max-w-md">
        <div>
          <label htmlFor="listingDate" className="block text-sm font-medium text-dark-text-secondary mb-1">Date du Listing</label>
          <input
            id="listingDate"
            name="listingDate"
            type="date"
            value={currentSettings.listingDate}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-dark-bg border border-dark-border rounded-md"
          />
        </div>
        <div>
          <label htmlFor="withdrawalStartDate" className="block text-sm font-medium text-dark-text-secondary mb-1">Date de début des Retraits</label>
          <input
            id="withdrawalStartDate"
            name="withdrawalStartDate"
            type="date"
            value={currentSettings.withdrawalStartDate}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-dark-bg border border-dark-border rounded-md"
          />
        </div>
        <div className="pt-2">
          <Button onClick={handleSave}>Enregistrer les Paramètres</Button>
        </div>
      </div>
    </Card>
  );
};
