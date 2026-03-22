import { motion } from 'framer-motion';
import type { ImageInfo } from '@/types';

interface ImageInfoPanelProps {
  imageInfo: ImageInfo;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function formatType(type: string): string {
  return type.replace('image/', '').toUpperCase();
}

export function ImageInfoPanel({ imageInfo }: ImageInfoPanelProps) {
  const items = [
    { label: 'Resolution', value: `${imageInfo.width} × ${imageInfo.height}` },
    { label: 'Size', value: formatFileSize(imageInfo.size) },
    { label: 'Format', value: formatType(imageInfo.type) },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.4 }}
      className="flex items-center gap-1 sm:gap-2 flex-wrap justify-center"
    >
      {items.map((item, i) => (
        <motion.div
          key={item.label}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 + i * 0.1 }}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full 
                     bg-slate-200/50 dark:bg-white/[0.06] backdrop-blur-md border border-slate-300 dark:border-white/[0.08]
                     text-xs text-slate-600 dark:text-slate-300"
        >
          <span className="text-slate-400 dark:text-slate-500">{item.label}</span>
          <span className="font-medium text-slate-800 dark:text-slate-200">{item.value}</span>
        </motion.div>
      ))}
    </motion.div>
  );
}
