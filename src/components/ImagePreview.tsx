import { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { ImageInfo } from '@/types';
import { useZoomPan } from '@/hooks/useZoomPan';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { ZoomControls } from './ZoomControls';
import { ZoomIndicator } from './ZoomIndicator';
import { ImageInfoPanel } from './ImageInfoPanel';
import { SkeletonLoader } from './SkeletonLoader';

interface ImagePreviewProps {
  imageInfo: ImageInfo;
  onClose: () => void;
}

export function ImagePreview({ imageInfo, onClose }: ImagePreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [imageLoaded, setImageLoaded] = useState(false);

  const {
    zoom,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    zoomIn,
    zoomOut,
    resetZoom,
  } = useZoomPan(containerRef);

  useKeyboardShortcuts({
    onZoomIn: zoomIn,
    onZoomOut: zoomOut,
    onReset: resetZoom,
    onEscape: onClose,
  });

  const cursorStyle = zoom.scale > 1 ? 'grab' : 'default';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-40 flex flex-col bg-slate-950/95 backdrop-blur-sm"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.3 }}
        className="relative z-50 flex items-center justify-between px-4 sm:px-6 py-3 
                   bg-black/30 backdrop-blur-xl border-b border-white/[0.05]"
      >
        <div className="flex items-center gap-3 min-w-0">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClose}
            className="w-9 h-9 cursor-pointer flex items-center justify-center rounded-xl
                       bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.08]
                       text-slate-400 hover:text-white transition-colors shrink-0"
            aria-label="Close preview"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </motion.button>

          <div className="min-w-0">
            <p className="text-sm font-medium text-slate-200 truncate max-w-[200px] sm:max-w-md">
              {imageInfo.name}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <ImageInfoPanel imageInfo={imageInfo} />
        </div>
      </motion.div>

      {/* Image viewport */}
      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        className="flex-1 overflow-hidden relative"
        style={{ cursor: cursorStyle }}
      >
        <AnimatePresence>
          {!imageLoaded && (
            <div className="absolute inset-0 z-10">
              <SkeletonLoader />
            </div>
          )}
        </AnimatePresence>

        <motion.div
          className="w-full h-full flex items-center justify-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{
            opacity: imageLoaded ? 1 : 0,
            scale: imageLoaded ? 1 : 0.9,
          }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        >
          <img
            src={imageInfo.url}
            alt={imageInfo.name}
            onLoad={() => setImageLoaded(true)}
            draggable={false}
            className="max-w-full max-h-full object-contain select-none"
            style={{
              transform: `translate(${zoom.translateX}px, ${zoom.translateY}px) scale(${zoom.scale})`,
              transformOrigin: '0 0',
              willChange: 'transform',
            }}
          />
        </motion.div>
      </div>

      {/* Bottom controls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="relative z-50 flex items-center justify-center px-4 py-3
                   bg-black/30 backdrop-blur-xl border-t border-white/[0.05]"
      >
        <ZoomControls
          scale={zoom.scale}
          onZoomIn={zoomIn}
          onZoomOut={zoomOut}
          onReset={resetZoom}
        />

        {/* Keyboard shortcut hints */}
        <div className="hidden sm:flex items-center gap-3 ml-6 text-[10px] text-slate-600">
          <span>
            <kbd className="px-1.5 py-0.5 rounded bg-white/[0.04] border border-white/[0.06] text-slate-500 font-mono">+</kbd>
            <kbd className="px-1.5 py-0.5 rounded bg-white/[0.04] border border-white/[0.06] text-slate-500 font-mono ml-0.5">−</kbd>
            {' '}zoom
          </span>
          <span>
            <kbd className="px-1.5 py-0.5 rounded bg-white/[0.04] border border-white/[0.06] text-slate-500 font-mono">0</kbd>
            {' '}reset
          </span>
          <span>
            <kbd className="px-1.5 py-0.5 rounded bg-white/[0.04] border border-white/[0.06] text-slate-500 font-mono">Esc</kbd>
            {' '}close
          </span>
        </div>
      </motion.div>

      {/* Zoom indicator overlay */}
      <ZoomIndicator scale={zoom.scale} />
    </motion.div>
  );
}
