import { motion } from 'framer-motion';

export function SkeletonLoader() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex items-center justify-center w-full h-full"
    >
      <div className="relative w-full max-w-lg aspect-video mx-auto">
        {/* Skeleton shape */}
        <div className="w-full h-full rounded-2xl bg-white/[0.04] overflow-hidden">
          <motion.div
            animate={{
              backgroundPosition: ['200% 0%', '-200% 0%'],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'linear',
            }}
            className="w-full h-full"
            style={{
              background:
                'linear-gradient(90deg, transparent 25%, rgba(139, 92, 246, 0.06) 50%, transparent 75%)',
              backgroundSize: '200% 100%',
            }}
          />
        </div>

        {/* Center spinner */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
              className="w-10 h-10 rounded-full border-2 border-violet-500/20 border-t-violet-400"
            />
            <motion.p
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="text-sm text-slate-400"
            >
              Loading image...
            </motion.p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
