"use client";

import React from 'react';
import { Link } from '@/i18n/navigation';

type ButtonVariant = 'primary' | 'secondary' | 'outline';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ActionButtonProps {
  href?: string;
  onClick?: () => void;
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  external?: boolean;
}

// Componente ActionButton riutilizzabile per CTA e azioni
const ActionButton: React.FC<ActionButtonProps> = ({
  href,
  onClick,
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  fullWidth = false,
  icon,
  iconPosition = 'right',
  external = false,
}) => {
  // Determina le classi in base alle props
  const baseClasses = 'font-medium transition-all duration-200 inline-flex items-center justify-center';
  
  const variantClasses = {
    primary: 'bg-green-600 hover:bg-green-700 text-white',
    secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-800',
    outline: 'border border-green-600 text-green-600 hover:bg-green-50',
  };
  
  const sizeClasses = {
    sm: 'text-sm py-1.5 px-3 rounded',
    md: 'py-2 px-4 rounded-md',
    lg: 'text-lg py-2.5 px-5 rounded-md',
  };
  
  const widthClass = fullWidth ? 'w-full' : '';
  
  const buttonClasses = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClass} ${className}`;
  
  // Rendering dell'icona
  const renderIcon = () => {
    if (!icon) return null;
    
    return (
      <span className={iconPosition === 'left' ? 'mr-2' : 'ml-2'}>
        {icon}
      </span>
    );
  };
  
  // Contenuto del bottone
  const buttonContent = (
    <>
      {iconPosition === 'left' && renderIcon()}
      {children}
      {iconPosition === 'right' && renderIcon()}
    </>
  );
  
  // Se c'è un href, renderizza come Link
  if (href) {
    if (external) {
      return (
        <a 
          href={href}
          className={buttonClasses}
          target="_blank"
          rel="noopener noreferrer"
          onClick={onClick}
        >
          {buttonContent}
        </a>
      );
    }
    
    return (
      <Link href={href} className={buttonClasses} onClick={onClick}>
        {buttonContent}
      </Link>
    );
  }
  
  // Altrimenti renderizza come button
  return (
    <button className={buttonClasses} onClick={onClick} type="button">
      {buttonContent}
    </button>
  );
};

export default ActionButton; 