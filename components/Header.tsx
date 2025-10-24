import React from 'react';
import { BitoLabLogoIcon } from './icons';

const Header: React.FC = () => {
  return (
    <header className="py-4 px-4 md:px-8 border-b border-white/10 bg-black/20 backdrop-blur-sm sticky top-0 z-10">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center gap-3">
          <BitoLabLogoIcon className="w-8 h-8 text-purple-400" />
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white">
            Éditeur Photo IA BitoLab
          </h1>
        </div>
      </div>
    </header>
  );
};

export default Header;