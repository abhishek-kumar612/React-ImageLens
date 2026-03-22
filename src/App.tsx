import { AnimatePresence, motion } from 'framer-motion';
import { DropZone } from '@/components/DropZone';
import { ImagePreview } from '@/components/ImagePreview';
import { SkeletonLoader } from '@/components/SkeletonLoader';
import { useImageLoader } from '@/hooks/useImageLoader';
import { ThemeProvider } from '@/context/ThemeContext';
import { ThemeToggle } from '@/components/ThemeToggle';

export function App() {
  const { imageInfo, isLoading, error, loadImage, clearImage } = useImageLoader();

  return (
    <ThemeProvider>
      <div className="relative min-h-screen bg-slate-50 dark:bg-slate-950 overflow-hidden transition-colors duration-500">
        <ThemeToggle />
      {/* Animated gradient background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-violet-600/5 dark:bg-violet-600/8 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-600/4 dark:bg-purple-600/6 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-600/2 dark:bg-indigo-600/4 rounded-full blur-[150px]" />
        
        {/* Grid pattern overlay */}
        <div 
          className="absolute inset-0 opacity-[0.03] dark:opacity-[0.03] invert dark:invert-0"
          style={{
            backgroundImage: `linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px), 
                              linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      <AnimatePresence mode="wait">
        {imageInfo ? (
          <ImagePreview
            key="preview"
            imageInfo={imageInfo}
            onClose={clearImage}
          />
        ) : isLoading ? (
          <motion.div
            key="loading"
            className="relative z-10 min-h-screen flex items-center justify-center p-8"
          >
            <div className="w-full max-w-xl">
              <SkeletonLoader />
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="upload"
            className="relative z-10 min-h-screen flex flex-col items-center justify-center p-4"
          >
            {/* Logo / Branding */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-12 text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}
                className="inline-flex items-center justify-center w-16 h-16 rounded-2xl
                           bg-gradient-to-br from-violet-500 to-purple-600
                           shadow-lg shadow-violet-500/25 mb-5"
              >
                <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="3" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <path d="M21 15l-5-5L5 21" />
                </svg>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-5xl sm:text-6xl font-bold text-slate-900 dark:text-white tracking-tight"
              >
                Image
                <span className="bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
                  Lens
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="mt-3 text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto"
              >
                Drop an image to preview, zoom, and inspect with precision
              </motion.p>
            </motion.div>

            <DropZone onFileSelect={loadImage} error={error} />

            {/* Feature hints */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-10 flex flex-wrap items-center justify-center gap-4 text-[11px] text-slate-400 dark:text-slate-600"
            >
              {[
                { icon: '🔍', text: 'Zoom at cursor' },
                { icon: '🖱️', text: 'Pan when zoomed' },
                { icon: '⌨️', text: 'Keyboard shortcuts' },
              ].map((feature) => (
                <div key={feature.text} className="flex items-center gap-1.5">
                  <span>{feature.icon}</span>
                  <span>{feature.text}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      </div>
    </ThemeProvider>
  );
}
