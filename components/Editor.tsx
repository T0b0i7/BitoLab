import React from 'react';
import ImageComparator from './ImageComparator';
import PromptSuggestions from './PromptSuggestions';
import { DownloadIcon, GenerateIcon, ResetIcon, WandIcon } from './icons';
import { motion, AnimatePresence } from 'framer-motion';

interface EditorProps {
  originalImage: string;
  editedImage: string | null;
  onGenerate: () => void;
  onRestore: () => void;
  onReset: () => void;
  prompt: string;
  setPrompt: (prompt: string) => void;
  isLoading: boolean;
}

const Editor: React.FC<EditorProps> = ({
  originalImage,
  editedImage,
  onGenerate,
  onRestore,
  onReset,
  prompt,
  setPrompt,
  isLoading,
}) => {

    const handleDownload = () => {
        if (!editedImage) return;
        const link = document.createElement('a');
        link.href = editedImage;
        link.download = `editee-${Date.now()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      <div className="flex-grow lg:w-2/3">
        <ImageComparator original={originalImage} edited={editedImage} />
      </div>
      <div className="lg:w-1/3 flex flex-col gap-6">
        <div className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-lg">
          <h2 className="text-lg font-semibold mb-3 text-purple-300">Saisissez votre invite créative</h2>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="ex: Rendre le ciel semblable à une galaxie"
            className="w-full h-24 p-3 bg-gray-900/50 border border-white/20 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 resize-none"
            disabled={isLoading}
          />
        </div>
        
        <div className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-lg">
          <h2 className="text-lg font-semibold mb-4 text-purple-300">Outils Pro+</h2>
          <motion.button
            onClick={onRestore}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-amber-500/20 text-amber-300 border border-amber-500/30 font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-amber-500/30 hover:text-amber-200 transition-all duration-300"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <WandIcon className="w-5 h-5"/>
            Restaurer & Améliorer
          </motion.button>
        </div>

        <PromptSuggestions onSelectPrompt={setPrompt} disabled={isLoading} />
        
        <div className="flex flex-col gap-4 mt-auto">
          <motion.button
            onClick={onGenerate}
            disabled={isLoading || !prompt}
            className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 text-lg shadow-lg shadow-purple-900/30"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            >
            <GenerateIcon className="w-6 h-6"/>
            {isLoading ? 'Génération...' : 'Générer'}
          </motion.button>

          <AnimatePresence>
            {editedImage && (
                <motion.div 
                    className="grid grid-cols-2 gap-4"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                >
                    <motion.button
                        onClick={handleDownload}
                        className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <DownloadIcon className="w-5 h-5"/>
                        Télécharger
                    </motion.button>
                     <motion.button
                        onClick={onReset}
                        className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-red-800/50 text-red-200 font-semibold rounded-lg hover:bg-red-800/80 transition-colors"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        >
                        <ResetIcon className="w-5 h-5"/>
                        Recommencer
                    </motion.button>
                </motion.div>
            )}
          </AnimatePresence>
           
           {!editedImage && (
                <motion.button
                    onClick={onReset}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gray-700/50 text-gray-300 font-semibold rounded-lg hover:bg-gray-700/80 transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    <ResetIcon className="w-5 h-5"/>
                    Changer d'image
                </motion.button>
           )}

        </div>
      </div>
    </div>
  );
};

export default Editor;