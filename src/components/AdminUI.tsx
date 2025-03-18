'use client';

import React, { ReactNode } from 'react';
import Link from 'next/link';

// Tipi condivisi
interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  href?: string;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  disabled?: boolean;
  icon?: ReactNode;
  fullWidth?: boolean;
  locale?: string;
}

// Componente Header per le pagine admin
interface AdminHeaderProps {
  title: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
  locale: string;
  icon?: ReactNode;
  backButton?: {
    href: string;
    label: string;
  };
}

export function AdminHeader({ 
  title, 
  description, 
  actionLabel, 
  actionHref, 
  locale,
  icon,
  backButton
}: AdminHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <div>
        {backButton && (
          <div className="mb-2">
            <Link
              href={`/${locale}${backButton.href}`}
              className="inline-flex items-center text-sm text-indigo-600 hover:text-indigo-800"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              {backButton.label}
            </Link>
          </div>
        )}
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        {description && (
          <p className="text-sm text-gray-500 mt-1">{description}</p>
        )}
      </div>
      {actionLabel && actionHref && (
        <AdminButton 
          href={`/${locale}${actionHref}`} 
          variant="primary"
          icon={
            icon || (
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
            )
          }
        >
          {actionLabel}
        </AdminButton>
      )}
    </div>
  );
}

// Componente pulsante standardizzato
export function AdminButton({
  children,
  onClick,
  href,
  type = 'button',
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  icon,
  fullWidth = false,
  locale,
}: ButtonProps) {
  // Definizioni di base per gli stili
  const baseStyle = "inline-flex items-center justify-center font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors";
  
  // Stili per varianti
  const variantStyles = {
    primary: "border border-transparent shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500",
    secondary: "border border-transparent text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:ring-indigo-500",
    outline: "border border-gray-300 shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:ring-indigo-500",
    danger: "border border-transparent shadow-sm text-white bg-red-600 hover:bg-red-700 focus:ring-red-500",
    success: "border border-transparent shadow-sm text-white bg-green-600 hover:bg-green-700 focus:ring-green-500"
  };
  
  // Stili per dimensioni
  const sizeStyles = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-5 py-2.5 text-base"
  };
  
  // Composizione degli stili
  const buttonStyle = `
    ${baseStyle} 
    ${variantStyles[variant]} 
    ${sizeStyles[size]}
    ${fullWidth ? 'w-full' : ''} 
    ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
    ${className}
  `;
  
  // Se c'è un link, renderizza un Link invece di un button
  if (href) {
    return (
      <Link 
        href={href} 
        className={buttonStyle}
      >
        {icon}
        {children}
      </Link>
    );
  }
  
  // Altrimenti renderizza un button
  return (
    <button
      type={type}
      onClick={onClick}
      className={buttonStyle}
      disabled={disabled}
    >
      {icon}
      {children}
    </button>
  );
}

// Componente per contenitore di filtri
interface AdminFilterContainerProps {
  children: ReactNode;
  onSubmit?: (e: React.FormEvent) => void;
  action?: any;
}

export function AdminFilterContainer({ 
  children, 
  onSubmit,
  action
}: AdminFilterContainerProps) {
  if (action) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 mb-6">
        <form action={action} className="flex flex-wrap gap-4">
          {children}
        </form>
      </div>
    );
  }
  
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 mb-6">
      <form onSubmit={onSubmit} className="flex flex-wrap gap-4">
        {children}
      </form>
    </div>
  );
}

// Componente per campo di ricerca
interface AdminSearchFieldProps {
  id: string;
  name: string;
  placeholder: string;
  defaultValue?: string;
  label?: string;
}

export function AdminSearchField({
  id,
  name,
  placeholder,
  defaultValue = '',
  label
}: AdminSearchFieldProps) {
  return (
    <div className="w-full md:w-auto md:flex-1">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      )}
      <div className="relative rounded-md shadow-sm">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="text"
          id={id}
          name={name}
          defaultValue={defaultValue}
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          placeholder={placeholder}
        />
      </div>
    </div>
  );
}

// Componente per select filtro
interface AdminSelectFieldProps {
  id: string;
  name: string;
  options: { value: string; label: string }[];
  defaultValue?: string;
  label?: string;
}

export function AdminSelectField({
  id,
  name,
  options,
  defaultValue = '',
  label
}: AdminSelectFieldProps) {
  return (
    <div className="w-full md:w-auto">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      )}
      <select
        id={id}
        name={name}
        defaultValue={defaultValue}
        className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

// Componente per badge di stato
interface AdminBadgeProps {
  children: ReactNode;
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'default';
  className?: string;
}

export function AdminBadge({
  children,
  variant = 'default',
  className = ''
}: AdminBadgeProps) {
  const variantStyles = {
    success: 'bg-green-100 text-green-800 border border-green-200',
    warning: 'bg-yellow-100 text-yellow-800 border border-yellow-200',
    danger: 'bg-red-100 text-red-800 border border-red-200',
    info: 'bg-blue-100 text-blue-800 border border-blue-200',
    default: 'bg-gray-100 text-gray-800 border border-gray-200'
  };
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variantStyles[variant]} ${className}`}>
      {children}
    </span>
  );
}

// Componente per azioni della tabella
interface AdminActionButtonProps {
  label: string;
  href?: string;
  onClick?: () => void;
  icon: ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'info';
}

export function AdminActionButton({
  label,
  href,
  onClick,
  icon,
  variant = 'primary'
}: AdminActionButtonProps) {
  const variantStyles = {
    primary: 'p-1.5 text-indigo-600 hover:text-indigo-900 hover:bg-indigo-50',
    secondary: 'p-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-50',
    danger: 'p-1.5 text-red-600 hover:text-red-900 hover:bg-red-50',
    success: 'p-1.5 text-green-600 hover:text-green-900 hover:bg-green-50',
    info: 'p-1.5 text-blue-600 hover:text-blue-900 hover:bg-blue-50'
  };
  
  const buttonClass = `rounded-md transition-colors ${variantStyles[variant]}`;
  
  if (href) {
    return (
      <Link href={href} className={buttonClass} title={label}>
        <span className="sr-only">{label}</span>
        {icon}
      </Link>
    );
  }
  
  return (
    <button type="button" onClick={onClick} className={buttonClass} title={label}>
      <span className="sr-only">{label}</span>
      {icon}
    </button>
  );
}

// Componente contenitore per tabella
interface AdminTableContainerProps {
  children: ReactNode;
}

export function AdminTableContainer({ children }: AdminTableContainerProps) {
  return (
    <div className="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-100">
      <div className="overflow-x-auto">
        {children}
      </div>
    </div>
  );
}

// Componente per card (usato nei servizi)
interface AdminCardProps {
  children: ReactNode;
  active?: boolean;
  className?: string;
}

export function AdminCard({ 
  children, 
  active = true,
  className = ''
}: AdminCardProps) {
  return (
    <div 
      className={`
        bg-white rounded-lg shadow-sm border overflow-hidden transition-all duration-200 hover:shadow-md
        ${active ? 'border-gray-100' : 'border-gray-200 bg-gray-50'}
        ${className}
      `}
    >
      {children}
    </div>
  );
}

// Componente per le azioni in linea (visualizzate nelle tabelle e card)
interface AdminInlineActionsProps {
  children: ReactNode;
}

export function AdminInlineActions({ children }: AdminInlineActionsProps) {
  return (
    <div className="flex justify-end items-center space-x-2">
      {children}
    </div>
  );
}

// Icone predefinite
export const AdminIcons = {
  view: (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  ),
  edit: (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>
  ),
  pdf: (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
    </svg>
  ),
  add: (
    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
    </svg>
  ),
  filter: (
    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path>
    </svg>
  )
} 