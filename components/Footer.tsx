import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="mt-12 py-6 px-4 md:px-8 border-t border-white/10">
      <div className="container mx-auto text-center text-gray-500 text-sm">
        <p>&copy; {new Date().getFullYear()} BitoLab. Tous droits réservés.</p>
      </div>
    </footer>
  );
};

export default Footer;
