import React from 'react';
import { motion } from 'framer-motion';
import { BitoLabLogoIcon } from './icons';

interface WelcomeScreenProps {
  onStart: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart }) => {
  return (
    <motion.div
      key="welcome"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.7 }}
      className="min-h-screen flex flex-col items-center justify-center text-center p-4"
    >
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <BitoLabLogoIcon className="w-40 h-40 md:w-48 md:h-48" />
      </motion.div>
      
      <motion.h1 
        className="text-5xl md:text-7xl font-bold tracking-tight text-white mt-4"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-cyan-400">
          BitoLab
        </span>
      </motion.h1>

      <motion.p 
        className="mt-3 text-lg md:text-2xl text-gray-300"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        AI that understands your vision.
      </motion.p>
      
      <motion.button
        onClick={onStart}
        className="mt-12 px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold rounded-lg text-lg shadow-lg shadow-purple-900/40 hover:scale-105 transition-transform duration-300"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.98 }}
      >
        Commencer l'édition
      </motion.button>
    </motion.div>
  );
};

export default WelcomeScreen;
