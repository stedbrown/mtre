'use client';

interface ClientEmailCellProps {
  email?: string;
  className?: string;
}

export default function ClientEmailCell({ email, className = '' }: ClientEmailCellProps) {
  return (
    <td className={`px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden md:table-cell ${className}`}>
      {email ? (
        <a href={`mailto:${email}`} className="text-indigo-600 hover:text-indigo-900" onClick={(e) => e.stopPropagation()}>
          {email}
        </a>
      ) : (
        <span className="text-gray-400">-</span>
      )}
    </td>
  );
} 