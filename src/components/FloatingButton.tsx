import React from 'react';
import { Icons } from '@/components/icons';

const FloatingButton: React.FC<{ onClick: () => void }> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-4 right-4 bg-[#76b0d8] text-white rounded-md shadow-md w-12 h-12 flex items-center justify-center hover:bg-[#a8d4f0]"
    >
      <Icons.edit size={20} />
    </button>
  );
};

export default FloatingButton;
