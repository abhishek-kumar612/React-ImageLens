export interface ImageInfo {
  name: string;
  size: number;
  type: string;
  width: number;
  height: number;
  url: string;
  file?: File;
}

export interface ZoomState {
  scale: number;
  translateX: number;
  translateY: number;
}

export const ACCEPTED_FORMATS = ['image/jpeg', 'image/png', 'image/webp'];
export const ACCEPTED_EXTENSIONS = '.jpg,.jpeg,.png,.webp';
export const MIN_ZOOM = 0.25;
export const MAX_ZOOM = 8;
export const ZOOM_STEP = 0.25;
