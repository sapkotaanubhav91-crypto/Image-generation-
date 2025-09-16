
import React from 'react';

const SparkleIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path
      fillRule="evenodd"
      d="M9 4.5a.75.75 0 01.721.544l.813 2.846a3.75 3.75 0 002.84 2.84l2.846.813a.75.75 0 010 1.442l-2.846.813a3.75 3.75 0 00-2.84 2.84l-.813 2.846a.75.75 0 01-1.442 0l-.813-2.846a3.75 3.75 0 00-2.84-2.84l-2.846-.813a.75.75 0 010-1.442l2.846-.813a3.75 3.75 0 002.84-2.84l.813-2.846A.75.75 0 019 4.5zM15.991 15.06a.75.75 0 01.53.53l.636 2.226a.75.75 0 001.442 0l.636-2.226a.75.75 0 01.53-.53l2.226-.636a.75.75 0 000-1.442l-2.226-.636a.75.75 0 01-.53-.53l-.636-2.226a.75.75 0 00-1.442 0l-.636 2.226a.75.75 0 01-.53.53l-2.226.636a.75.75 0 000 1.442l2.226.636z"
      clipRule="evenodd"
    />
  </svg>
);


export const Header: React.FC = () => {
  return (
    <header className="text-center lg:text-left">
      <div className="flex items-center justify-center lg:justify-start gap-3">
        <SparkleIcon className="w-8 h-8 text-cyan-400" />
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
          AI Image Studio
        </h1>
      </div>
      <p className="mt-2 text-md text-slate-400">
        Turn your ideas into stunning visuals. Describe anything you can imagine.
      </p>
    </header>
  );
};
