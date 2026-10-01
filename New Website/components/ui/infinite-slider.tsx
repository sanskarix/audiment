'use client';
import React, { useState, useEffect, useRef } from 'react';
import { useMotionValue, animate, motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export type InfiniteSliderProps = {
  children: React.ReactNode;
  gap?: number;
  speed?: number;
  speedOnHover?: number;
  direction?: 'horizontal' | 'vertical';
  reverse?: boolean;
  className?: string;
};

export function InfiniteSlider({
  children,
  gap = 42,
  speed = 80,
  speedOnHover,
  direction = 'horizontal',
  reverse = false,
  className,
}: InfiniteSliderProps) {
  const [isHovering, setIsHovering] = useState(false);
  const currentSpeed = isHovering && speedOnHover ? speedOnHover : speed;
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentSize, setContentSize] = useState(0);
  const translation = useMotionValue(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [key, setKey] = useState(0);

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;

    const measure = () => {
      const firstSet = el.firstElementChild as HTMLElement | null;
      const size = firstSet
        ? (direction === 'horizontal' ? firstSet.scrollWidth : firstSet.scrollHeight)
        : (direction === 'horizontal' ? el.scrollWidth / 2 : el.scrollHeight / 2);
      if (size > 0) {
        setContentSize(size + gap);
      }
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [direction, gap, children]);

  useEffect(() => {
    if (contentSize <= 0) return;
    let controls: any;

    const from = reverse ? -contentSize : 0;
    const to = reverse ? 0 : -contentSize;

    const distanceToTravel = Math.abs(to - from);
    const duration = distanceToTravel / currentSpeed;

    if (isTransitioning) {
      const remainingDistance = Math.abs(translation.get() - to);
      const transitionDuration = remainingDistance / currentSpeed;

      controls = animate(translation, [translation.get(), to], {
        ease: 'linear',
        duration: transitionDuration,
        onComplete: () => {
          setIsTransitioning(false);
          setKey((prevKey) => prevKey + 1);
        },
      });
    } else {
      controls = animate(translation, [from, to], {
        ease: 'linear',
        duration: duration,
        repeat: Infinity,
        repeatType: 'loop',
        repeatDelay: 0,
        onRepeat: () => {
          translation.set(from);
        },
      });
    }

    return () => controls?.stop();
  }, [
    key,
    translation,
    currentSpeed,
    contentSize,
    isTransitioning,
    reverse,
  ]);

  const hoverProps = speedOnHover
    ? {
        onMouseEnter: () => {
          setIsTransitioning(true);
          setIsHovering(true);
        },
        onMouseLeave: () => {
          setIsTransitioning(true);
          setIsHovering(false);
        },
      }
    : {};

  return (
    <div
      className={cn('overflow-hidden w-full relative', className)}
      style={{ overflow: 'hidden' }}
      {...hoverProps}
    >
      <motion.div
        ref={contentRef}
        className="flex w-max"
        style={{
          display: 'flex',
          width: 'max-content',
          alignItems: 'center',
          gap: `${gap}px`,
          flexDirection: direction === 'horizontal' ? 'row' : 'column',
          ...(direction === 'horizontal'
            ? { x: translation }
            : { y: translation }),
        }}
      >
        <div
          className="flex items-center"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: `${gap}px`,
            flexShrink: 0,
          }}
        >
          {children}
        </div>
        <div
          className="flex items-center"
          aria-hidden="true"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: `${gap}px`,
            flexShrink: 0,
          }}
        >
          {children}
        </div>
      </motion.div>
    </div>
  );
}
