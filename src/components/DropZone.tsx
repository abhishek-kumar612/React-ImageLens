import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ACCEPTED_EXTENSIONS } from '@/types';

interface DropZoneProps {
  onFileSelect: (file: File) => void;
  onUrlSelect: (url: string) => void;
  error: string | null;
}

export function DropZone({ onFileSelect, onUrlSelect, error }: DropZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragCounter = useRef(0);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current++;
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current--;
    if (dragCounter.current === 0) {
      setIsDragging(false);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      dragCounter.current = 0;

      const files = e.dataTransfer.files;
      if (files.length > 0) {
        onFileSelect(files[0]);
      }
    },
    [onFileSelect]
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        onFileSelect(files[0]);
      }
    },
    [onFileSelect]
  );

  const handleClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleUrlSubmit = useCallback(() => {
    if (urlInput.trim()) {
      onUrlSelect(urlInput.trim());
    }
  }, [urlInput, onUrlSelect]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="w-full max-w-2xl mx-auto px-4"
    >
      <motion.div
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={handleClick}
        animate={{
          scale: isDragging ? 1.02 : 1,
          borderColor: isDragging ? 'rgba(139, 92, 246, 0.8)' : 'rgba(148, 163, 184, 0.3)',
        }}
        whileHover={{ scale: 1.01, borderColor: 'rgba(139, 92, 246, 0.5)' }}
        transition={{ duration: 0.2 }}
        className="relative cursor-pointer rounded-3xl border-2 border-dashed p-12 md:p-16 
                   backdrop-blur-xl bg-white/40 dark:bg-white/[0.06] overflow-hidden group"
      >
        {/* Animated gradient background on drag */}
        <AnimatePresence>
          {isDragging && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 bg-gradient-to-br from-violet-500/10 via-purple-500/10 to-fuchsia-500/10"
            />
          )}
        </AnimatePresence>

        {/* Subtle background glow */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-violet-500/5 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 flex flex-col items-center gap-6">
          {/* Icon */}
          <motion.div
            animate={{
              y: isDragging ? -8 : 0,
              scale: isDragging ? 1.1 : 1,
            }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="relative"
          >
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-500/20 to-purple-600/20 
                          backdrop-blur-sm flex items-center justify-center border border-violet-400/20">
              <motion.svg
                animate={{ rotate: isDragging ? 180 : 0 }}
                transition={{ duration: 0.4 }}
                className="w-9 h-9 text-violet-400"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </motion.svg>
            </div>

            {/* Pulse ring */}
            <AnimatePresence>
              {isDragging && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: [0.5, 0], scale: 1.5 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="absolute inset-0 rounded-2xl border-2 border-violet-400/40"
                />
              )}
            </AnimatePresence>
          </motion.div>

          {/* Text */}
          <div className="text-center space-y-2">
            <AnimatePresence mode="wait">
              {isDragging ? (
                <motion.p
                  key="drop"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="text-lg font-medium text-violet-300"
                >
                  Drop your image here
                </motion.p>
              ) : (
                <motion.div
                  key="default"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="space-y-2"
                >
                  <p className="text-lg font-medium text-slate-700 dark:text-slate-200">
                    Drag & drop an image here
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    or{' '}
                    <span className="text-violet-400 font-medium hover:text-violet-300 transition-colors">
                      browse files
                    </span>
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            <p className="text-xs text-slate-500 pt-1">
              Supports JPG, PNG, WebP
            </p>
          </div>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept={ACCEPTED_EXTENSIONS}
          onChange={handleFileChange}
          className="hidden"
        />
      </motion.div>

      {/* URL Input */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mt-8 flex flex-col items-center gap-4 w-full"
      >
        <div className="flex items-center gap-3 text-slate-400 dark:text-slate-600 text-[10px] uppercase tracking-[0.2em] font-medium">
          <div className="h-px w-10 bg-slate-200 dark:bg-slate-800" />
          <span>Or paste a URL</span>
          <div className="h-px w-10 bg-slate-200 dark:bg-slate-800" />
        </div>
        
        <div className="flex w-full gap-2 max-w-lg">
          <input
            type="text"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleUrlSubmit()}
            placeholder="https://images.unsplash.com/photo-..."
            className="flex-1 px-4 py-3 rounded-2xl bg-white/40 dark:bg-white/[0.04] 
                       backdrop-blur-md border border-slate-200 dark:border-white/[0.08]
                       text-sm text-slate-800 dark:text-slate-200 
                       focus:outline-none focus:ring-2 focus:ring-violet-500/20
                       placeholder:text-slate-400 dark:placeholder:text-slate-600 transition-all"
          />
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleUrlSubmit}
            className="px-6 py-3 rounded-2xl bg-violet-600 hover:bg-violet-500 
                       text-white text-sm font-semibold shadow-lg shadow-violet-600/20 
                       transition-colors cursor-pointer"
          >
            Load
          </motion.button>
        </div>
      </motion.div>

      {/* Error message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-4 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 backdrop-blur-sm"
          >
            <p className="text-sm text-red-400 text-center">{error}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
