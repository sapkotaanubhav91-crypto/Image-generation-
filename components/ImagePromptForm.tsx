
import React, { useState } from 'react';
import { AspectRatio } from '../types';

interface ImagePromptFormProps {
  onSubmit: (prompt: string, aspectRatio: AspectRatio) => void;
  isLoading: boolean;
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

export const ImagePromptForm: React.FC<ImagePromptFormProps> = ({ onSubmit, isLoading }) => {
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

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-slate-800 p-6 rounded-2xl shadow-xl">
      <div>
        <label htmlFor="prompt" className="block text-sm font-medium text-slate-300 mb-2">
          Your Prompt
        </label>
        <textarea
          id="prompt"
          name="prompt"
          rows={5}
          className="w-full bg-slate-700 border border-slate-600 rounded-lg p-3 text-white placeholder-slate-400 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition duration-200"
          placeholder="e.g., A majestic lion wearing a crown, cinematic lighting, hyperrealistic"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          disabled={isLoading}
        />
      </div>
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
      <button
        type="submit"
        disabled={isLoading || !prompt}
        className="w-full flex justify-center items-center gap-2 bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:scale-100 shadow-lg"
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Generating...
          </>
        ) : (
          'Generate Image'
        )}
      </button>
    </form>
  );
};
