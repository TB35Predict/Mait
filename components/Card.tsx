
import React, { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  title?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = '', title }) => {
  return (
    <div className={`bg-dark-card border border-dark-border rounded-lg p-6 shadow-lg ${className}`}>
      {title && <h2 className="text-xl font-bold mb-4 text-brand-primary">{title}</h2>}
      {children}
    </div>
  );
};
