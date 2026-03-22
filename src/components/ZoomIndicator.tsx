import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';

interface ZoomIndicatorProps {
  scale: number;
}

export function ZoomIndicator({ scale }: ZoomIndicatorProps) {
  const [visible, setVisible] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const prevScale = useRef(scale);

  useEffect(() => {
    if (scale !== prevScale.current) {
      setVisible(true);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => setVisible(false), 1200);
      prevScale.current = scale;
    }
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [scale]);

  const percentage = Math.round(scale * 100);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 10 }}
          transition={{ duration: 0.2 }}
          className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50
                     px-5 py-2.5 rounded-2xl bg-white/80 dark:bg-black/60 backdrop-blur-xl 
                     border border-slate-200 dark:border-white/[0.1] shadow-2xl shadow-black/5"
        >
          <span className="text-lg font-semibold text-slate-900 dark:text-white tabular-nums">
            {percentage}%
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
