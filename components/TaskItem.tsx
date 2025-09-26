
import React from 'react';
import { Task, UserTask } from '../types';
import { Button } from './Button';
import { CheckCircleIcon } from './Icons';

interface TaskItemProps {
  task: Task;
  status?: UserTask;
  onComplete: (taskId: number) => void;
}

export const TaskItem: React.FC<TaskItemProps> = ({ task, status, onComplete }) => {
  const isCompleted = status?.completed ?? false;

  return (
    <div className="flex items-center justify-between p-4 bg-gray-900 rounded-lg border border-transparent hover:border-brand-primary transition-colors duration-300">
      <div className="flex-1 mr-4">
        <h4 className="font-bold text-lg">{task.title}</h4>
        <p className="text-sm text-dark-text-secondary">{task.description}</p>
      </div>
      <div className="flex items-center space-x-4">
        <span className="font-bold text-brand-primary text-lg">+{task.points}</span>
        {isCompleted ? (
          <div className="flex items-center text-green-400">
            <CheckCircleIcon className="w-6 h-6 mr-2" />
            <span>Complété</span>
          </div>
        ) : (
          task.link && task.link !== '#' ? (
            <a href={task.link} target="_blank" rel="noopener noreferrer" className="bg-brand-accent hover:bg-brand-secondary text-white font-bold py-2 px-4 rounded transition duration-300" onClick={() => onComplete(task.id)}>
              Valider
            </a>
          ) : (
            <Button onClick={() => onComplete(task.id)}>
              Valider
            </Button>
          )
        )}
      </div>
    </div>
  );
};
