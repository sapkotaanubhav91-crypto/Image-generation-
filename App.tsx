
import React, { useState, useCallback } from 'react';
import { ImagePromptForm } from './components/ImagePromptForm';
import { ImageDisplay } from './components/ImageDisplay';
import { Header } from './components/Header';
import { generateImage } from './services/geminiService';
import { AspectRatio } from './types';

const App: React.FC = () => {
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateImage = useCallback(async (prompt: string, aspectRatio: AspectRatio) => {
    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);

    if (!prompt) {
      setError("Please enter a prompt to generate an image.");
      setIsLoading(false);
      return;
    }

    try {
      const imageUrl = await generateImage(prompt, aspectRatio);
      setGeneratedImage(imageUrl);
    } catch (err) {
      console.error(err);
      setError("Failed to generate image. Please check the console for details.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center p-4 sm:p-6 lg:p-8 font-sans">
      <div className="w-full max-w-5xl flex flex-col lg:flex-row gap-8">
        <aside className="lg:w-1/3 w-full flex flex-col gap-6">
          <Header />
          <ImagePromptForm onSubmit={handleGenerateImage} isLoading={isLoading} />
        </aside>
        <main className="lg:w-2/3 w-full flex-grow">
          <ImageDisplay imageUrl={generatedImage} isLoading={isLoading} error={error} />
        </main>
      </div>
       <footer className="w-full max-w-5xl mt-8 text-center text-slate-500 text-sm">
        <p>Powered by Gemini. All generated images are created by AI.</p>
      </footer>
    </div>
  );
};

export default App;
