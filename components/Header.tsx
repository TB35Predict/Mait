
import React from 'react';

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export const Header: React.FC<HeaderProps> = ({ title, subtitle }) => {
  return (
    <div className="mb-8">
      <h1 className="text-3xl md:text-4xl font-bold text-dark-text tracking-tight">{title}</h1>
      {subtitle && <p className="mt-2 text-lg text-dark-text-secondary">{subtitle}</p>}
    </div>
  );
};
