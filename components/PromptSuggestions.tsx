import React from 'react';
import { PROMPT_SUGGESTIONS } from '../constants';
import { motion } from 'framer-motion';

interface PromptSuggestionsProps {
  onSelectPrompt: (prompt: string) => void;
  disabled?: boolean;
}

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
}

const itemVariants = {
    hidden: { y: 10, opacity: 0 },
    visible: { y: 0, opacity: 1 }
}

const PromptSuggestions: React.FC<PromptSuggestionsProps> = ({ onSelectPrompt, disabled }) => {
  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-lg">
      <h2 className="text-lg font-semibold mb-4 text-purple-300">Idées d'invites</h2>
      <motion.div 
        className="space-y-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        >
        {PROMPT_SUGGESTIONS.map((category) => (
          <motion.div key={category.name} variants={itemVariants}>
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-2">{category.name}</h3>
            <div className="flex flex-wrap gap-2">
              {category.prompts.map((prompt) => (
                <motion.button
                  key={prompt}
                  onClick={() => onSelectPrompt(prompt)}
                  disabled={disabled}
                  className="px-3 py-1.5 text-sm bg-gray-700/50 text-gray-200 rounded-full hover:bg-purple-600/50 hover:text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {prompt}
                </motion.button>
              ))}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default PromptSuggestions;