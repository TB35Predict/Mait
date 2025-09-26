
import React, { useState } from 'react';
import { Task } from '../../types';
import { Card } from '../Card';
import { Button } from '../Button';
import { Modal } from '../Modal';
import * as api from '../../services/api';

interface AdminTasksProps {
  tasks: Task[];
  refreshData: () => void;
}

const emptyTask: Omit<Task, 'id'> = { title: '', description: '', points: 0, link: '' };

export const AdminTasks: React.FC<AdminTasksProps> = ({ tasks, refreshData }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | Omit<Task, 'id'>>({ ...emptyTask });

  const openModal = (task?: Task) => {
    setEditingTask(task ? { ...task } : { ...emptyTask });
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if ('id' in editingTask) {
      await api.updateTask(editingTask);
    } else {
      await api.addTask(editingTask);
    }
    refreshData();
    setIsModalOpen(false);
  };
  
  const handleDelete = async (taskId: number) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette tâche ?')) {
      await api.deleteTask(taskId);
      refreshData();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditingTask(prev => ({ ...prev, [name]: name === 'points' ? parseInt(value, 10) : value }));
  };

  return (
    <Card>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Gestion des Tâches ({tasks.length})</h2>
        <Button onClick={() => openModal()}>Ajouter Tâche</Button>
      </div>
      <div className="space-y-3">
        {tasks.map(task => (
          <div key={task.id} className="p-3 bg-gray-900 rounded-lg flex justify-between items-center">
            <div>
              <p className="font-semibold">{task.title} ({task.points} pts)</p>
              <p className="text-sm text-dark-text-secondary">{task.description}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="secondary" onClick={() => openModal(task)}>Modifier</Button>
              <Button variant="danger" onClick={() => handleDelete(task.id)}>Supprimer</Button>
            </div>
          </div>
        ))}
      </div>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={'id' in editingTask ? 'Modifier Tâche' : 'Ajouter Tâche'}>
        <div className="space-y-4">
          <div>
            <label>Titre</label>
            <input name="title" value={editingTask.title} onChange={handleChange} className="w-full mt-1 px-3 py-2 bg-dark-bg border border-dark-border rounded-md" />
          </div>
          <div>
            <label>Description</label>
            <input name="description" value={editingTask.description} onChange={handleChange} className="w-full mt-1 px-3 py-2 bg-dark-bg border border-dark-border rounded-md" />
          </div>
           <div>
            <label>Lien (optionnel)</label>
            <input name="link" value={editingTask.link} onChange={handleChange} className="w-full mt-1 px-3 py-2 bg-dark-bg border border-dark-border rounded-md" />
          </div>
          <div>
            <label>Points</label>
            <input name="points" type="number" value={editingTask.points} onChange={handleChange} className="w-full mt-1 px-3 py-2 bg-dark-bg border border-dark-border rounded-md" />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Annuler</Button>
            <Button onClick={handleSave}>Enregistrer</Button>
          </div>
        </div>
      </Modal>
    </Card>
  );
};
