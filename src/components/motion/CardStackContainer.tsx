'use client';

import { useRef, useState, useEffect, ReactNode, Children } from 'react';
import { motion, useScroll, useTransform, MotionValue } from 'framer-motion';

export interface CardStackContainerProps {
  children: ReactNode;
  className?: string;
  topOffsetStart?: number;
  topOffsetIncrement?: number;
}

interface CardStackItemProps {
  children: ReactNode;
  index: number;
  totalCards: number;
  scrollYProgress: MotionValue<number>;
  topOffsetStart: number;
  topOffsetIncrement: number;
  isMobile: boolean;
}

function CardStackItem({
  children,
  index,
  totalCards,
  scrollYProgress,
  topOffsetStart,
  topOffsetIncrement,
  isMobile,
}: CardStackItemProps) {
  // Staggered top offset calculation: top: calc(100px + index * 25px)
  const topPosition = topOffsetStart + index * topOffsetIncrement;

  // Normalized scroll range for scaling and dimming
  const startRange = index / totalCards;
  const endRange = Math.min(1, (index + 1) / totalCards);

  // Card scales from 1.0 down to 0.93 as the next card scrolls over it
  const scale = useTransform(
    scrollYProgress,
    [startRange, endRange],
    [1.0, index === totalCards - 1 ? 1.0 : 0.93]
  );

  // Subtle dark dimming overlay (rgba(17, 24, 39, 0.15)) applied to the card beneath as new card covers it
  const dimOpacity = useTransform(
    scrollYProgress,
    [startRange, endRange],
    [0, index === totalCards - 1 ? 0 : 0.18]
  );

  if (isMobile) {
    return (
      <div className="w-full mb-6 rounded-2xl bg-white border border-slate-200/80 shadow-card overflow-hidden">
        {children}
      </div>
    );
  }

  return (
    <div
      style={{
        position: 'sticky',
        top: `${topPosition}px`,
      }}
      className="w-full z-10 my-4"
    >
      <motion.div
        style={{
          scale,
          transformOrigin: 'top center',
        }}
        className="w-full rounded-3xl bg-white border border-slate-200/80 shadow-card-hover overflow-hidden relative transition-shadow duration-300"
      >
        {children}

        {/* Dimming overlay applied as next card scrolls over */}
        <motion.div
          style={{ opacity: dimOpacity }}
          className="absolute inset-0 bg-[#111827] pointer-events-none z-30 transition-opacity"
        />
      </motion.div>
    </div>
  );
}

export default function CardStackContainer({
  children,
  className = '',
  topOffsetStart = 100,
  topOffsetIncrement = 25,
}: CardStackContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Responsive check for screens smaller than 768px
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const cardsList = Children.toArray(children);

  return (
    <div
      ref={containerRef}
      className={`w-full relative ${className}`}
      style={{
        minHeight: isMobile ? 'auto' : `${cardsList.length * 85}vh`,
      }}
    >
      <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
        {cardsList.map((card, idx) => (
          <CardStackItem
            key={idx}
            index={idx}
            totalCards={cardsList.length}
            scrollYProgress={scrollYProgress}
            topOffsetStart={topOffsetStart}
            topOffsetIncrement={topOffsetIncrement}
            isMobile={isMobile}
          >
            {card}
          </CardStackItem>
        ))}
      </div>
    </div>
  );
}
