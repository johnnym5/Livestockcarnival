'use client';

import Image, { ImageProps } from 'next/image';
import { motion } from 'framer-motion';

export interface SlowZoomImageProps extends Omit<ImageProps, 'className'> {
  containerClassName?: string;
  imageClassName?: string;
  overlayClassName?: string;
  zoomDuration?: number;
  maxScale?: number;
  showOverlay?: boolean;
}

export function SlowZoomImage({
  src,
  alt,
  containerClassName = '',
  imageClassName = '',
  overlayClassName = '',
  zoomDuration = 18,
  maxScale = 1.08,
  showOverlay = true,
  fill = true,
  sizes = '(max-width: 768px) 100vw, 50vw',
  ...imageProps
}: SlowZoomImageProps) {
  return (
    <div className={`relative overflow-hidden ${containerClassName}`}>
      <motion.div
        className="relative w-full h-full"
        initial={{ scale: 1 }}
        animate={{ scale: maxScale }}
        transition={{
          duration: zoomDuration,
          ease: 'easeInOut',
          repeat: Infinity,
          repeatType: 'reverse',
        }}
        style={{ willChange: 'transform' }}
      >
        <Image
          src={src}
          alt={alt}
          fill={fill}
          sizes={sizes}
          className={`object-cover ${imageClassName}`}
          {...imageProps}
        />
      </motion.div>
      {showOverlay && (
        <div
          className={`absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none ${overlayClassName}`}
        />
      )}
    </div>
  );
}
