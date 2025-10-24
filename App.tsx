import React, { useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { editImageWithPrompt, restoreAndEnhanceImage } from './services/geminiService';
import Header from './components/Header';
import ImageUploader from './components/ImageUploader';
import Editor from './components/Editor';
import Loader from './components/Loader';
import WelcomeScreen from './components/WelcomeScreen';
import Footer from './components/Footer';

const App: React.FC = () => {
  const [appState, setAppState] = useState<'welcome' | 'main'>('welcome');
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [editedImage, setEditedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<string>('');

  const handleStart = () => {
    setAppState('main');
  };

  const handleImageUpload = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setOriginalImage(reader.result as string);
      setEditedImage(null);
      setError(null);
      setPrompt('');
    };
    reader.onerror = () => {
        setError("La lecture du fichier image a échoué.");
    }
    reader.readAsDataURL(file);
  };

  const handleGenerate = useCallback(async () => {
    if (!originalImage || !prompt) {
      setError("Veuillez fournir une image et une invite.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const newImage = await editImageWithPrompt(originalImage, prompt);
      setEditedImage(newImage);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur inconnue est survenue.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [originalImage, prompt]);

  const handleRestore = useCallback(async () => {
    if (!originalImage) {
      setError("Veuillez d'abord téléverser une image.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setPrompt("Restauration et amélioration de l'image");

    try {
      const newImage = await restoreAndEnhanceImage(originalImage);
      setEditedImage(newImage);
    } catch (err) {
      setError(err instanceof Error ? err.message : "La restauration a échoué.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [originalImage]);
  
  const handleReset = () => {
    setOriginalImage(null);
    setEditedImage(null);
    setError(null);
    setPrompt('');
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/40 to-gray-900 text-gray-200 font-sans flex flex-col">
      {isLoading && <Loader />}
      <AnimatePresence mode="wait">
        {appState === 'welcome' ? (
          <WelcomeScreen key="welcome" onStart={handleStart} />
        ) : (
          <motion.div 
            key="main-app"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col flex-grow"
          >
            <Header />
            <main className="container mx-auto px-4 py-8 md:py-12 flex-grow">
              <AnimatePresence mode="wait">
                {!originalImage ? (
                  <motion.div
                    key="uploader"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                  >
                    <ImageUploader onImageUpload={handleImageUpload} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="editor"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Editor
                      originalImage={originalImage}
                      editedImage={editedImage}
                      onGenerate={handleGenerate}
                      onRestore={handleRestore}
                      onReset={handleReset}
                      prompt={prompt}
                      setPrompt={setPrompt}
                      isLoading={isLoading}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
              {error && (
                  <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-4 text-center text-red-400 bg-red-900/30 p-3 rounded-lg max-w-md mx-auto"
                  >
                      {error}
                  </motion.div>
              )}
            </main>
            <Footer />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;