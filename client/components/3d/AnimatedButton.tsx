import React from 'react';
import { motion } from 'framer-motion';

interface AnimatedButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
}

const AnimatedButton: React.FC<AnimatedButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  className = "",
  onClick,
  disabled = false,
}) => {
  const baseClasses = "relative font-semibold rounded-lg transition-all duration-200 hover-target overflow-hidden";
  
  const variants = {
    primary: "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg",
    secondary: "bg-white/10 backdrop-blur-sm text-white border border-white/20",
    ghost: "text-white/80 hover:text-white hover:bg-white/5",
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  const buttonVariants = {
    initial: { scale: 1 },
    hover: { 
      scale: 1.05,
      y: -2,
      transition: { type: 'spring', stiffness: 300, damping: 20 }
    },
    tap: { 
      scale: 0.95,
      y: 0,
      transition: { type: 'spring', stiffness: 400, damping: 30 }
    },
  };

  const shimmerVariants = {
    initial: { x: '-100%' },
    hover: { 
      x: '100%',
      transition: { duration: 0.6, ease: 'easeInOut' }
    },
  };

  return (
    <motion.button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className} ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      }`}
      // variants={buttonVariants}
      initial="initial"
      whileHover={!disabled ? "hover" : "initial"}
      whileTap={!disabled ? "tap" : "initial"}
      onClick={onClick}
      disabled={disabled}
    >
      {/* Background shimmer effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
        // variants={shimmerVariants}
        initial="initial"
        whileHover="hover"
      />
      
      {/* Floating particles effect */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 3 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white/40 rounded-full"
            initial={{
              x: `${20 + i * 30}%`,
              y: '50%',
              opacity: 0,
            }}
            whileHover={{
              y: [null, '20%', '80%'],
              opacity: [0, 1, 0],
              transition: {
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.2,
              },
            }}
          />
        ))}
      </div>
      
      {/* Content */}
      <span className="relative z-10">{children}</span>
      
      {/* Glow effect for primary variant */}
      {variant === 'primary' && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg blur-lg opacity-0"
          whileHover={{ opacity: 0.3 }}
          transition={{ duration: 0.3 }}
        />
      )}
    </motion.button>
  );
};

export default AnimatedButton;
