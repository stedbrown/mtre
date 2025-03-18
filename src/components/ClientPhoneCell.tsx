'use client';

interface ClientPhoneCellProps {
  telefono?: string;
  className?: string;
}

export default function ClientPhoneCell({ telefono, className = '' }: ClientPhoneCellProps) {
  return (
    <td className={`px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden md:table-cell ${className}`}>
      {telefono ? (
        <a href={`tel:${telefono}`} className="text-indigo-600 hover:text-indigo-900" onClick={(e) => e.stopPropagation()}>
          {telefono}
        </a>
      ) : (
        <span className="text-gray-400">-</span>
      )}
    </td>
  );
} 