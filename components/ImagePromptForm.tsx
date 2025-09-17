
import React, { useState, useCallback, useRef } from 'react';
import { AspectRatio } from '../types';

export type Mode = 'generate' | 'edit';

interface ImagePromptFormProps {
  mode: Mode;
  onModeChange: (mode: Mode) => void;
  onSubmit: (prompt: string, aspectRatio: AspectRatio) => void;
  isLoading: boolean;
  sourceImageUrl: string | null;
  onImageUpload: (file: File) => void;
  onClearImage: () => void;
}

const AspectRatioButton: React.FC<{
  value: AspectRatio;
  label: string;
  icon: JSX.Element;
  currentValue: AspectRatio;
  onClick: (value: AspectRatio) => void;
}> = ({ value, label, icon, currentValue, onClick }) => (
  <button
    type="button"
    onClick={() => onClick(value)}
    className={`flex-1 p-2 rounded-lg flex flex-col items-center justify-center transition-all duration-200 ${
      currentValue === value
        ? 'bg-cyan-500 text-white shadow-lg'
        : 'bg-slate-700 hover:bg-slate-600 text-slate-300'
    }`}
    aria-label={`Set aspect ratio to ${label}`}
  >
    {React.cloneElement(icon, { className: "w-6 h-6 mb-1" })}
    <span className="text-xs font-medium">{label}</span>
  </button>
);

const ModeSwitcher: React.FC<{ mode: Mode, onModeChange: (mode: Mode) => void }> = ({ mode, onModeChange }) => (
    <div className="flex bg-slate-700 p-1 rounded-full w-full">
        <button
            onClick={() => onModeChange('generate')}
            className={`w-1/2 py-2 text-sm font-bold rounded-full transition-colors duration-300 ${mode === 'generate' ? 'bg-cyan-600 text-white' : 'text-slate-300 hover:bg-slate-600'}`}
            aria-pressed={mode === 'generate'}
        >
            Generate
        </button>
        <button
            onClick={() => onModeChange('edit')}
            className={`w-1/2 py-2 text-sm font-bold rounded-full transition-colors duration-300 ${mode === 'edit' ? 'bg-cyan-600 text-white' : 'text-slate-300 hover:bg-slate-600'}`}
            aria-pressed={mode === 'edit'}
        >
            Edit
        </button>
    </div>
);

const ImageUploader: React.FC<{
    sourceImageUrl: string | null;
    onImageUpload: (file: File) => void;
    onClearImage: () => void;
    isLoading: boolean;
}> = ({ sourceImageUrl, onImageUpload, onClearImage, isLoading }) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [isDragging, setIsDragging] = useState(false);

    const handleFileChange = (files: FileList | null) => {
        if (files && files.length > 0) {
            onImageUpload(files[0]);
        }
    };

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setIsDragging(true);
        } else if (e.type === "dragleave") {
            setIsDragging(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        handleFileChange(e.dataTransfer.files);
    };

    if (sourceImageUrl) {
        return (
             <div className="relative">
                <img src={sourceImageUrl} alt="Uploaded for editing" className="rounded-lg w-full h-auto" />
                <button
                    type="button"
                    onClick={onClearImage}
                    disabled={isLoading}
                    className="absolute top-2 right-2 bg-slate-900/50 hover:bg-slate-900/80 rounded-full p-1.5 transition-colors disabled:opacity-50"
                    aria-label="Remove image"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
            </div>
        )
    }

    return (
        <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
            className={`flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                isDragging ? 'border-cyan-400 bg-slate-700/50' : 'border-slate-600 hover:border-cyan-500 hover:bg-slate-700/30'
            }`}
        >
            <input
                ref={inputRef}
                type="file"
                className="hidden"
                accept="image/png, image/jpeg, image/webp"
                onChange={(e) => handleFileChange(e.target.files)}
                disabled={isLoading}
            />
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-slate-500 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1"><path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-4-4V6a2 2 0 012-2h10a2 2 0 012 2v6a4 4 0 01-4 4H7z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 15l-2 2 2 2" /></svg>
            <p className="text-sm text-slate-400 text-center">
                <span className="font-semibold text-cyan-400">Click to upload</span> or drag and drop
            </p>
        </div>
    );
}

export const ImagePromptForm: React.FC<ImagePromptFormProps> = ({ mode, onModeChange, onSubmit, isLoading, sourceImageUrl, onImageUpload, onClearImage }) => {
  const [prompt, setPrompt] = useState<string>('');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>(AspectRatio.SQUARE);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(prompt, aspectRatio);
  };
  
  const aspectRatios = [
      { value: AspectRatio.SQUARE, label: 'Square', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect></svg> },
      { value: AspectRatio.PORTRAIT, label: 'Portrait', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="6" y="3" width="12" height="18" rx="2" ry="2"></rect></svg> },
      { value: AspectRatio.LANDSCAPE, label: 'Landscape', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="6" width="18" height="12" rx="2" ry="2"></rect></svg> },
  ];

  const canSubmit = (mode === 'generate' && !!prompt) || (mode === 'edit' && !!prompt && !!sourceImageUrl);

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-slate-800 p-6 rounded-2xl shadow-xl">
      <ModeSwitcher mode={mode} onModeChange={onModeChange} />
      {mode === 'edit' && (
        <div>
           <label className="block text-sm font-medium text-slate-300 mb-2">
            Your Image
           </label>
           <ImageUploader 
            sourceImageUrl={sourceImageUrl}
            onImageUpload={onImageUpload}
            onClearImage={onClearImage}
            isLoading={isLoading}
           />
        </div>
      )}
      <div>
        <label htmlFor="prompt" className="block text-sm font-medium text-slate-300 mb-2">
          {mode === 'generate' ? 'Your Prompt' : 'Describe Your Edit'}
        </label>
        <textarea
          id="prompt"
          name="prompt"
          rows={mode === 'generate' ? 5 : 3}
          className="w-full bg-slate-700 border border-slate-600 rounded-lg p-3 text-white placeholder-slate-400 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition duration-200"
          placeholder={mode === 'generate' ? "e.g., A majestic lion wearing a crown, cinematic lighting" : "e.g., Turn this person into an anime character"}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          disabled={isLoading}
        />
      </div>
      {mode === 'generate' && (
        <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
            Aspect Ratio
            </label>
            <div className="flex gap-2">
                {aspectRatios.map(ar => (
                    <AspectRatioButton key={ar.value} {...ar} currentValue={aspectRatio} onClick={setAspectRatio} />
                ))}
            </div>
        </div>
      )}
      <button
        type="submit"
        disabled={isLoading || !canSubmit}
        className="w-full flex justify-center items-center gap-2 bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:scale-100 shadow-lg"
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {mode === 'generate' ? 'Generating...' : 'Editing...'}
          </>
        ) : (
          mode === 'generate' ? 'Generate Image' : 'Edit Image'
        )}
      </button>
    </form>
  );
};
