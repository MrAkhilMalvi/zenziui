import React, { useEffect, useState, useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

const CursorFollow: React.FC = () => {
  const [isHovering, setIsHovering] = useState(false);
  const [cursorVariant, setCursorVariant] = useState('default');
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const trailX = useMotionValue(-100);
  const trailY = useMotionValue(-100);

  // More accurate spring configs
  const springConfig = { damping: 30, stiffness: 800, mass: 0.1 };
  const trailSpringConfig = { damping: 25, stiffness: 150, mass: 0.2 };

  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);
  const trailXSpring = useSpring(trailX, trailSpringConfig);
  const trailYSpring = useSpring(trailY, trailSpringConfig);

  const lastUpdateRef = useRef(0);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      const now = Date.now();
      if (now - lastUpdateRef.current > 8) { // Throttle to ~120fps
        const centerX = e.clientX - 8; // Half of cursor size (16px)
        const centerY = e.clientY - 8;

        cursorX.set(centerX);
        cursorY.set(centerY);
        trailX.set(centerX);
        trailY.set(centerY);

        lastUpdateRef.current = now;
      }
    };

    const handleMouseEnter = (e: Event) => {
      const target = e.target as HTMLElement;
      setIsHovering(true);

      // Different cursor styles for different elements
      if (target.tagName === 'BUTTON' || target.classList.contains('hover-target')) {
        setCursorVariant('button');
      } else if (target.tagName === 'A') {
        setCursorVariant('link');
      } else {
        setCursorVariant('hover');
      }
    };

    const handleMouseLeave = () => {
      setIsHovering(false);
      setCursorVariant('default');
    };

    // Track mouse movement with higher precision
    window.addEventListener('mousemove', moveCursor, { passive: true });

    // Dynamic hover element tracking
    const observer = new MutationObserver(() => {
      updateHoverElements();
    });

    const updateHoverElements = () => {
      // Remove old listeners
      document.querySelectorAll('[data-cursor-listener]').forEach(el => {
        el.removeAttribute('data-cursor-listener');
      });

      // Add new listeners
      const hoverElements = document.querySelectorAll('button, a, [role="button"], .hover-target, input, textarea, select');
      hoverElements.forEach(el => {
        el.setAttribute('data-cursor-listener', 'true');
        el.addEventListener('mouseenter', handleMouseEnter);
        el.addEventListener('mouseleave', handleMouseLeave);
      });
    };

    updateHoverElements();
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      observer.disconnect();
      document.querySelectorAll('[data-cursor-listener]').forEach(el => {
        el.removeEventListener('mouseenter', handleMouseEnter);
        el.removeEventListener('mouseleave', handleMouseLeave);
      });
    };
  }, [cursorX, cursorY, trailX, trailY]);

  const cursorVariants = {
    default: {
      scale: 1,
      backgroundColor: '#ffffff',
      mixBlendMode: 'difference' as const,
    },
    hover: {
      scale: 1.5,
      backgroundColor: '#ffffff',
      mixBlendMode: 'difference' as const,
    },
    button: {
      scale: 2,
      backgroundColor: 'transparent',
      mixBlendMode: 'normal' as const,
    },
    link: {
      scale: 1.8,
      backgroundColor: '#6366f1',
      mixBlendMode: 'normal' as const,
    },
  };

  return (
    <>
      {/* Main cursor */}
      <motion.div
        className="fixed top-0 left-0 w-4 h-4 pointer-events-none z-50 rounded-full"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
        }}
        variants={cursorVariants}
        animate={cursorVariant}
        transition={{
          type: 'spring',
          stiffness: 500,
          damping: 30,
          mass: 0.1
        }}
      />

      {/* Outer ring for buttons */}
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 pointer-events-none z-49 border-2 border-white/30 rounded-full"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          marginLeft: '-6px',
          marginTop: '-6px',
        }}
        animate={{
          scale: cursorVariant === 'button' ? 1.5 : 0,
          opacity: cursorVariant === 'button' ? 1 : 0,
        }}
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      />

      {/* Trailing cursor */}
      <motion.div
        className="fixed top-0 left-0 w-2 h-2 pointer-events-none z-48 rounded-full"
        style={{
          x: trailXSpring,
          y: trailYSpring,
          marginLeft: '1px',
          marginTop: '1px',
        }}
      >
        <motion.div
          className="w-full h-full rounded-full"
          animate={{
            scale: isHovering ? 1.5 : 1,
            opacity: isHovering ? 0.8 : 0.4,
            background: cursorVariant === 'link'
              ? 'linear-gradient(45deg, #6366f1, #8b5cf6)'
              : 'linear-gradient(45deg, #3b82f6, #8b5cf6)',
          }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        />
      </motion.div>

      {/* Click ripple effect */}
      <motion.div
        className="fixed top-0 left-0 w-12 h-12 pointer-events-none z-47 border border-white/20 rounded-full"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          marginLeft: '-22px',
          marginTop: '-22px',
        }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{
          scale: cursorVariant === 'button' ? [0, 1.2, 0] : 0,
          opacity: cursorVariant === 'button' ? [0, 0.6, 0] : 0,
        }}
        transition={{
          duration: 0.6,
          repeat: cursorVariant === 'button' ? Infinity : 0,
          repeatDelay: 1
        }}
      />
    </>
  );
};

export default CursorFollow;
