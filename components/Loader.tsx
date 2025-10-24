import React from 'react';
import { motion } from 'framer-motion';

const Loader: React.FC = () => {
  return (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/70 backdrop-blur-sm flex flex-col items-center justify-center z-50"
    >
      <div className="w-16 h-16 border-4 border-t-4 border-gray-600 border-t-purple-500 rounded-full animate-spin"></div>
      <p className="mt-4 text-lg font-semibold text-white">L'IA réfléchit...</p>
      <p className="mt-1 text-sm text-gray-400">Cela peut prendre un instant.</p>
    </motion.div>
  );
};

export default Loader;