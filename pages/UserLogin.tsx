import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as api from '../services/api';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { TrophyIcon } from '../components/Icons';

const UserLogin: React.FC = () => {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;

    setLoading(true);
    try {
      const user = await api.loginOrRegisterUser(username);
      if (user) {
        navigate(`/dashboard/${user.id}`);
      }
    } catch (error) {
      console.error("Login/Registration failed", error);
      // Optionally display an error to the user
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <Card className="max-w-md w-full">
        <div className="text-center mb-6">
            <TrophyIcon className="w-12 h-12 mx-auto text-brand-primary mb-4"/>
            <h1 className="text-2xl font-bold">Bienvenue à l'Airdrop MAIT</h1>
            <p className="text-dark-text-secondary">Entrez un nom d'utilisateur pour commencer.</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="username" className="sr-only">Nom d'utilisateur</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-md focus:outline-none focus:ring-2 focus:ring-brand-accent"
              placeholder="Nom d'utilisateur"
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Chargement...' : "S'inscrire / Se connecter"}
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default UserLogin;
