'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function ToggleSwitch<T extends string>({
  options,
  current,
  onChange,
  buttonLabel,
  variant = 'default',
}: {
  options: { value: T; label: string }[];
  current: T;
  onChange: (value: T) => void;
  buttonLabel?: string;
  variant?: 'default' | 'homeDark';
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentOption = options.find((o) => o.value === current);
  const isHomeDark = variant === 'homeDark';

  return (
    <div className="relative inline-flex" ref={containerRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 rounded-xl px-4 py-2 font-semibold transition-all ${
          isHomeDark
            ? 'border border-white/10 bg-slate-950/45 text-slate-200 shadow-[0_12px_30px_rgba(2,6,23,0.24)] backdrop-blur-xl hover:border-sky-300/25 hover:bg-slate-900/60 hover:text-white'
            : 'text-text/75 hover:bg-primary/10 hover:text-primary'
        }`}
      >
        {buttonLabel || currentOption?.label}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`absolute left-[-15%] top-full z-50 mt-2 min-w-[120px] -translate-x-1/2 rounded-2xl border backdrop-blur-xl shadow-xl ${
              isHomeDark
                ? 'border-white/10 bg-slate-950/88 shadow-[0_20px_48px_rgba(2,6,23,0.45)]'
                : 'border-border/60 bg-white/95'
            }`}
          >
            {options.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`w-full whitespace-nowrap px-4 py-3 text-center font-semibold transition-colors ${
                  option.value === current
                    ? isHomeDark
                      ? 'bg-sky-400/12 text-sky-300'
                      : 'text-primary bg-primary/10'
                    : isHomeDark
                      ? 'text-slate-200 hover:bg-white/6 hover:text-white'
                      : 'text-text/75 hover:bg-primary/5 hover:text-primary'
                }`}
              >
                {option.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
