import { motion } from 'framer-motion';

interface ZoomControlsProps {
  scale: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
}

export function ZoomControls({ scale, onZoomIn, onZoomOut, onReset }: ZoomControlsProps) {
  const percentage = Math.round(scale * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.4 }}
      className="flex items-center gap-1 px-1.5 py-1.5 rounded-2xl 
                 bg-white/40 dark:bg-black/40 backdrop-blur-xl border border-slate-200 dark:border-white/[0.08]
                 shadow-2xl shadow-black/5 dark:shadow-black/20"
    >
      <ControlButton onClick={onZoomOut} label="Zoom out (−)" shortcut="−">
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      </ControlButton>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onReset}
        className="px-3 py-1.5 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-300 
                   hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-white/[0.08] transition-colors
                   min-w-[52px] tabular-nums"
        title="Reset zoom (0)"
      >
        {percentage}%
      </motion.button>

      <ControlButton onClick={onZoomIn} label="Zoom in (+)" shortcut="+">
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      </ControlButton>
    </motion.div>
  );
}

function ControlButton({
  onClick,
  label,
  children,
  shortcut: _shortcut,
}: {
  onClick: () => void;
  label: string;
  children: React.ReactNode;
  shortcut: string;
}) {
  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      aria-label={label}
      className="w-9 h-9 flex items-center justify-center rounded-xl
                 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white 
                 hover:bg-slate-200/50 dark:hover:bg-white/[0.1] 
                 transition-colors"
    >
      {children}
    </motion.button>
  );
}
