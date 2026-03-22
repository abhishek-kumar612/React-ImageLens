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

  const loadFromUrl = useCallback(async (url: string) => {
    // Basic URL validation
    try {
      new URL(url);
    } catch {
      setError('Please enter a valid URL.');
      return;
    }

    setIsLoading(true);
    setError(null);

    const img = new Image();
    
    // Attempt to infer name and type from URL
    let fileName = 'external-image';
    let type = 'image/unknown';
    
    try {
      const pathname = new URL(url).pathname;
      fileName = pathname.split('/').pop() || 'external-image';
      const extension = fileName.split('.').pop()?.toLowerCase();
      if (extension) type = `image/${extension}`;
    } catch {
      // Fallback if URL parsing fails for some reason
    }

    img.onload = () => {
      setImageInfo({
        name: fileName,
        size: 0,
        type: type,
        width: img.naturalWidth,
        height: img.naturalHeight,
        url,
      });
      setIsLoading(false);
    };

    img.onerror = () => {
      setError('Failed to load image. The URL may be invalid or blocked by CORS.');
      setIsLoading(false);
    };

    img.crossOrigin = 'anonymous';
    img.src = url;
  }, []);

  const clearImage = useCallback(() => {
    if (imageInfo?.file) {
      URL.revokeObjectURL(imageInfo.url);
    }
    setImageInfo(null);
    setError(null);
  }, [imageInfo]);

  return { imageInfo, isLoading, error, loadImage, loadFromUrl, clearImage };
}
