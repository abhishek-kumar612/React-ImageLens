import { useState, useCallback, useRef, useEffect } from 'react';
import type { ZoomState } from '@/types';
import { MIN_ZOOM, MAX_ZOOM, ZOOM_STEP } from '@/types';

export function useZoomPan(containerRef: React.RefObject<HTMLDivElement | null>) {
  const [zoom, setZoom] = useState<ZoomState>({
    scale: 1,
    translateX: 0,
    translateY: 0,
  });

  const isPanning = useRef(false);
  const panStart = useRef({ x: 0, y: 0 });
  const lastTranslate = useRef({ x: 0, y: 0 });

  const clampScale = useCallback((s: number) => Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, s)), []);

  const zoomAtPoint = useCallback(
    (clientX: number, clientY: number, newScale: number) => {
      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;

      setZoom((prev) => {
        const clamped = clampScale(newScale);
        const ratio = clamped / prev.scale;
        const newTx = x - ratio * (x - prev.translateX);
        const newTy = y - ratio * (y - prev.translateY);
        return { scale: clamped, translateX: newTx, translateY: newTy };
      });
    },
    [containerRef, clampScale]
  );

  const handleWheel = useCallback(
    (e: WheelEvent) => {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -ZOOM_STEP : ZOOM_STEP;
      setZoom((prev) => {
        const newScale = clampScale(prev.scale + delta * (prev.scale / 2));
        const container = containerRef.current;
        if (!container) return prev;
        const rect = container.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const ratio = newScale / prev.scale;
        return {
          scale: newScale,
          translateX: x - ratio * (x - prev.translateX),
          translateY: y - ratio * (y - prev.translateY),
        };
      });
    },
    [containerRef, clampScale]
  );

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (zoom.scale <= 1) return;
      isPanning.current = true;
      panStart.current = { x: e.clientX, y: e.clientY };
      lastTranslate.current = { x: zoom.translateX, y: zoom.translateY };
      e.preventDefault();
    },
    [zoom]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isPanning.current) return;
      const dx = e.clientX - panStart.current.x;
      const dy = e.clientY - panStart.current.y;
      setZoom((prev) => ({
        ...prev,
        translateX: lastTranslate.current.x + dx,
        translateY: lastTranslate.current.y + dy,
      }));
    },
    []
  );

  const handleMouseUp = useCallback(() => {
    isPanning.current = false;
  }, []);

  const zoomIn = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    zoomAtPoint(rect.left + cx, rect.top + cy, zoom.scale + ZOOM_STEP * (zoom.scale / 2));
  }, [containerRef, zoom.scale, zoomAtPoint]);

  const zoomOut = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    zoomAtPoint(rect.left + cx, rect.top + cy, zoom.scale - ZOOM_STEP * (zoom.scale / 2));
  }, [containerRef, zoom.scale, zoomAtPoint]);

  const resetZoom = useCallback(() => {
    setZoom({ scale: 1, translateX: 0, translateY: 0 });
  }, []);

  // Attach wheel listener with passive: false
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => container.removeEventListener('wheel', handleWheel);
  }, [containerRef, handleWheel]);

  // Global mouseup to stop panning even if mouse leaves container
  useEffect(() => {
    const up = () => {
      isPanning.current = false;
    };
    window.addEventListener('mouseup', up);
    return () => window.removeEventListener('mouseup', up);
  }, []);

  return {
    zoom,
    isPanning: isPanning.current,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    zoomIn,
    zoomOut,
    resetZoom,
  };
}
