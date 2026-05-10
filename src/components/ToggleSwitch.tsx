'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function ToggleSwitch<T extends string>({
  options,
  current,
  onChange,
  buttonLabel,
}: {
  options: { value: T; label: string }[];
  current: T;
  onChange: (value: T) => void;
  buttonLabel?: string;
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

  return (
    <div className="relative inline-flex" ref={containerRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 font-semibold text-text/75 transition-all hover:text-primary px-4 py-2 rounded-xl hover:bg-primary/10"
      >
        {buttonLabel || currentOption?.label}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute left-[-15%] -translate-x-1/2 top-full mt-2 min-w-[120px] rounded-2xl border border-border/60 bg-white/95 backdrop-blur-xl shadow-xl z-50"
          >
            {options.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`w-full px-4 py-3 text-center font-semibold transition-colors whitespace-nowrap ${
                  option.value === current
                    ? 'text-primary bg-primary/10'
                    : 'text-text/75 hover:text-primary hover:bg-primary/5'
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
