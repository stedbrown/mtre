'use client';

import React from 'react';

interface RemoveLogoButtonProps {
  removeLogo: () => Promise<void>;
}

export default function RemoveLogoButton({ removeLogo }: RemoveLogoButtonProps) {
  return (
    <button
      type="button"
      className="ml-3 inline-flex justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      onClick={() => removeLogo()}
    >
      Rimuovi logo
    </button>
  );
} 