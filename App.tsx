
import React, { useState, useCallback } from 'react';
import { ImagePromptForm, Mode } from './components/ImagePromptForm';
import { ImageDisplay } from './components/ImageDisplay';
import { Header } from './components/Header';
import { generateImage, editImage } from './services/geminiService';
import { AspectRatio } from './types';

// Utility to convert a file to a data URL and extract base64 data
const fileToDataUrl = (file: File): Promise<{ base64: string; mimeType: string; dataUrl: string; }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const dataUrl = reader.result as string;
      const base64 = dataUrl.split(',')[1];
      resolve({ base64, mimeType: file.type, dataUrl });
    };
    reader.onerror = error => reject(error);
  });
};


const App: React.FC = () => {
  const [mode, setMode] = useState<Mode>('generate');
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [sourceImage, setSourceImage] = useState<{ base64: string; mimeType: string; dataUrl: string; } | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleModeChange = useCallback((newMode: Mode) => {
    setMode(newMode);
    setResultImage(null);
    setSourceImage(null);
    setError(null);
  }, []);

  const handleImageUpload = useCallback(async (file: File) => {
    setIsLoading(true);
    setError(null);
    try {
      const imageData = await fileToDataUrl(file);
      setSourceImage(imageData);
      setResultImage(imageData.dataUrl); // Display uploaded image immediately
    } catch (err) {
      console.error(err);
      setError("Failed to load image. Please try another file.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleClearImage = useCallback(() => {
    setSourceImage(null);
    setResultImage(null);
  }, []);

  const handleSubmit = useCallback(async (prompt: string, aspectRatio: AspectRatio) => {
    setIsLoading(true);
    setError(null);
    
    // In edit mode, we don't clear the result image so the loader shows over the source.
    if (mode === 'generate') {
      setResultImage(null);
    }

    if (!prompt) {
      setError("Please enter a prompt.");
      setIsLoading(false);
      return;
    }

    try {
      let imageUrl: string;
      if (mode === 'generate') {
        imageUrl = await generateImage(prompt, aspectRatio);
      } else {
        if (!sourceImage) {
          setError("Please upload an image to edit.");
          setIsLoading(false);
          return;
        }
        imageUrl = await editImage(prompt, sourceImage.base64, sourceImage.mimeType);
      }
      setResultImage(imageUrl);
    } catch (err) {
      console.error(err);
      setError("An error occurred. Please check the console for details.");
    } finally {
      setIsLoading(false);
    }
  }, [mode, sourceImage]);

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center p-4 sm:p-6 lg:p-8 font-sans">
      <div className="w-full max-w-5xl flex flex-col lg:flex-row gap-8">
        <aside className="lg:w-1/3 w-full flex flex-col gap-6">
          <Header />
          <ImagePromptForm
            mode={mode}
            onModeChange={handleModeChange}
            onSubmit={handleSubmit}
            isLoading={isLoading}
            sourceImageUrl={sourceImage?.dataUrl ?? null}
            onImageUpload={handleImageUpload}
            onClearImage={handleClearImage}
          />
        </aside>
        <main className="lg:w-2/3 w-full flex-grow">
          <ImageDisplay imageUrl={resultImage} isLoading={isLoading} error={error} />
        </main>
      </div>
       <footer className="w-full max-w-5xl mt-8 text-center text-slate-500 text-sm">
        <p>Powered by Gemini. All generated images are created by AI.</p>
      </footer>
    </div>
  );
};

export default App;
