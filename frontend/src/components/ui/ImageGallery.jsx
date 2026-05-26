import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

export default function ImageGallery({ images = [], className = '' }) {
  const [lightboxIndex, setLightboxIndex] = useState(null);

  if (!images.length) return null;

  const getGridClass = () => {
    switch (images.length) {
      case 1:
        return 'grid-cols-1';
      case 2:
        return 'grid-cols-2';
      case 3:
        return 'grid-cols-2 grid-rows-2';
      case 4:
        return 'grid-cols-2 grid-rows-2';
      default:
        return 'grid-cols-3 grid-rows-2';
    }
  };

  const getItemClass = (index, total) => {
    if (total === 1) return 'aspect-[16/9]';
    if (total === 2) return 'aspect-[3/4]';
    if (total === 3 && index === 0) return 'row-span-2 aspect-auto h-full';
    if (total === 3) return 'aspect-[4/3]';
    if (total === 4) return 'aspect-[4/3]';
    if (total >= 5 && index === 0) return 'col-span-2 row-span-2 aspect-auto h-full';
    return 'aspect-[4/3]';
  };

  const visibleImages = images.slice(0, 5);
  const remainingCount = images.length - 5;

  return (
    <>
      <div
        className={`grid ${getGridClass()} gap-1.5 rounded-2xl overflow-hidden ${className}`}
      >
        {visibleImages.map((img, i) => (
          <button
            key={i}
            onClick={() => setLightboxIndex(i)}
            className={`relative overflow-hidden group ${getItemClass(
              i,
              visibleImages.length
            )}`}
          >
            <img
              src={img}
              alt={`Photo ${i + 1}`}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />

            {/* Remaining count overlay on last visible image */}
            {i === visibleImages.length - 1 && remainingCount > 0 && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <span className="text-white text-2xl font-bold">
                  +{remainingCount}
                </span>
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <Lightbox
            images={images}
            currentIndex={lightboxIndex}
            onClose={() => setLightboxIndex(null)}
            onNavigate={setLightboxIndex}
          />
        )}
      </AnimatePresence>
    </>
  );
}

/* ─── Lightbox Overlay ─── */
function Lightbox({ images, currentIndex, onClose, onNavigate }) {
  const handlePrev = useCallback(
    (e) => {
      e.stopPropagation();
      onNavigate((currentIndex - 1 + images.length) % images.length);
    },
    [currentIndex, images.length, onNavigate]
  );

  const handleNext = useCallback(
    (e) => {
      e.stopPropagation();
      onNavigate((currentIndex + 1) % images.length);
    },
    [currentIndex, images.length, onNavigate]
  );

  // Keyboard navigation
  useState(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') handlePrev(e);
      if (e.key === 'ArrowRight') handleNext(e);
    };
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  });

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/95 z-[100]"
      />

      {/* Content */}
      <div className="fixed inset-0 z-[101] flex items-center justify-center p-4">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors z-10"
        >
          <XMarkIcon className="w-6 h-6" />
        </button>

        {/* Counter */}
        <div className="absolute top-4 left-4 text-white/60 text-sm font-medium z-10">
          {currentIndex + 1} / {images.length}
        </div>

        {/* Navigation */}
        {images.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute left-4 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-10"
            >
              <ChevronLeftIcon className="w-6 h-6" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-4 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-10"
            >
              <ChevronRightIcon className="w-6 h-6" />
            </button>
          </>
        )}

        {/* Image */}
        <AnimatePresence mode="wait">
          <motion.img
            key={currentIndex}
            src={images[currentIndex]}
            alt={`Photo ${currentIndex + 1}`}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="max-w-full max-h-[85vh] object-contain rounded-lg"
          />
        </AnimatePresence>
      </div>
    </>
  );
}
