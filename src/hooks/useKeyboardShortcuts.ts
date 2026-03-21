import { useEffect } from 'react';

interface ShortcutHandlers {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
  onEscape?: () => void;
}

export function useKeyboardShortcuts({ onZoomIn, onZoomOut, onReset, onEscape }: ShortcutHandlers) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      switch (e.key) {
        case '+':
        case '=':
          e.preventDefault();
          onZoomIn();
          break;
        case '-':
        case '_':
          e.preventDefault();
          onZoomOut();
          break;
        case '0':
          e.preventDefault();
          onReset();
          break;
        case 'Escape':
          if (onEscape) {
            e.preventDefault();
            onEscape();
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onZoomIn, onZoomOut, onReset, onEscape]);
}
