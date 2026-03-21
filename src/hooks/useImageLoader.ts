import { useState, useCallback } from 'react';
import type { ImageInfo } from '@/types';
import { ACCEPTED_FORMATS } from '@/types';

export function useImageLoader() {
  const [imageInfo, setImageInfo] = useState<ImageInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadImage = useCallback((file: File) => {
    if (!ACCEPTED_FORMATS.includes(file.type)) {
      setError('Unsupported format. Please use JPG, PNG, or WebP.');
      return;
    }

    setIsLoading(true);
    setError(null);

    const url = URL.createObjectURL(file);
    const img = new Image();

    img.onload = () => {
      setImageInfo({
        name: file.name,
        size: file.size,
        type: file.type,
        width: img.naturalWidth,
        height: img.naturalHeight,
        url,
        file,
      });
      setIsLoading(false);
    };

    img.onerror = () => {
      setError('Failed to load image. The file may be corrupted.');
      setIsLoading(false);
      URL.revokeObjectURL(url);
    };

    img.src = url;
  }, []);

  const clearImage = useCallback(() => {
    if (imageInfo) {
      URL.revokeObjectURL(imageInfo.url);
    }
    setImageInfo(null);
    setError(null);
  }, [imageInfo]);

  return { imageInfo, isLoading, error, loadImage, clearImage };
}
