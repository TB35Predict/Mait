
import React, { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
}

export const Button: React.FC<ButtonProps> = ({ children, className = '', variant = 'primary', ...props }) => {
  const baseClasses = 'px-4 py-2 font-bold rounded-md transition duration-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variantClasses = {
    primary: 'bg-brand-accent hover:bg-brand-secondary text-white',
    secondary: 'bg-dark-border hover:bg-gray-600 text-dark-text',
    danger: 'bg-red-600 hover:bg-red-700 text-white',
  };
  
  return (
    <button className={`${baseClasses} ${variantClasses[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};
