import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Badge } from './ui/badge';
import { Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showBeta?: boolean;
  animated?: boolean;
}

const Logo: React.FC<LogoProps> = ({ 
  size = 'md', 
  showBeta = true, 
  animated = true 
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const sizes = {
    sm: {
      container: 'w-8 h-8',
      text: 'text-base',
      badge: 'text-xs px-1 py-0 h-3',
      icon: 'h-1.5 w-1.5',
    },
    md: {
      container: 'w-10 h-10',
      text: 'text-xl',
      badge: 'text-xs px-1 py-0 h-4',
      icon: 'h-2 w-2',
    },
    lg: {
      container: 'w-12 h-12',
      text: 'text-2xl',
      badge: 'text-sm px-2 py-0 h-5',
      icon: 'h-2.5 w-2.5',
    },
  };

  const currentSize = sizes[size];

  return (
    <Link 
      to="/" 
      className="flex items-center space-x-3 group hover-target"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative">
        {/* Main logo container */}
        <motion.div 
          className={`${currentSize.container} relative rounded-xl flex items-center justify-center shadow-lg transition-all duration-300`}
          animate={animated ? {
            background: isHovered 
              ? 'linear-gradient(135deg, #8b5cf6 0%, #3b82f6 25%, #06b6d4 50%, #10b981 75%, #f59e0b 100%)'
              : 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 50%, #06b6d4 100%)',
            scale: isHovered ? 1.1 : 1,
            rotate: isHovered ? [0, -2, 2, 0] : 0,
          } : {}}
          transition={{ 
            duration: 0.3,
            rotate: { duration: 0.6, ease: "easeInOut" }
          }}
        >
          {/* Animated Z letter */}
          <motion.div
            className="relative"
            animate={animated ? {
              scale: isHovered ? 1.1 : 1,
            } : {}}
            transition={{ duration: 0.2 }}
          >
            {/* Main Z */}
            <motion.span 
              className={`text-white font-bold ${currentSize.text} relative z-10`}
              animate={animated ? {
                textShadow: isHovered 
                  ? '0 0 20px rgba(255,255,255,0.8), 0 0 40px rgba(99,102,241,0.6)'
                  : '0 0 10px rgba(255,255,255,0.3)',
              } : {}}
            >
              Z
            </motion.span>
            
            {/* Glowing underline */}
            <motion.div
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-yellow-400 to-orange-500"
              initial={{ scaleX: 0 }}
              animate={animated ? {
                scaleX: isHovered ? 1 : 0,
                opacity: isHovered ? 1 : 0,
              } : {}}
              transition={{ duration: 0.3 }}
            />
          </motion.div>

          {/* Orbiting particles */}
          {animated && (
            <>
              {Array.from({ length: 3 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-white/60 rounded-full"
                  animate={{
                    rotate: 360,
                    scale: isHovered ? [1, 1.5, 1] : 1,
                  }}
                  transition={{
                    rotate: {
                      duration: 3 + i,
                      repeat: Infinity,
                      ease: "linear",
                    },
                    scale: {
                      duration: 0.5,
                      repeat: isHovered ? Infinity : 0,
                      repeatType: "reverse",
                    },
                  }}
                  style={{
                    transformOrigin: `${15 + i * 3}px center`,
                  }}
                />
              ))}
            </>
          )}
        </motion.div>

        {/* Status indicator */}
        <motion.div 
          className="absolute -top-1 -right-1 w-3 h-3 rounded-full"
          animate={animated ? {
            background: isHovered
              ? 'linear-gradient(45deg, #f59e0b, #ef4444)'
              : 'linear-gradient(45deg, #10b981, #06b6d4)',
            scale: isHovered ? [1, 1.2, 1] : [1, 1.1, 1],
            boxShadow: isHovered
              ? '0 0 15px rgba(245, 158, 11, 0.8)'
              : '0 0 10px rgba(16, 185, 129, 0.6)',
          } : {}}
          transition={{
            scale: { duration: 1, repeat: Infinity },
            background: { duration: 0.3 },
            boxShadow: { duration: 0.3 },
          }}
        />

        {/* Floating sparkles */}
        {animated && isHovered && (
          <>
            {Array.from({ length: 4 }).map((_, i) => (
              <motion.div
                key={`sparkle-${i}`}
                className="absolute w-1 h-1 bg-yellow-400 rounded-full"
                initial={{ 
                  scale: 0, 
                  x: 0, 
                  y: 0,
                  opacity: 0 
                }}
                animate={{
                  scale: [0, 1, 0],
                  x: [0, (i % 2 ? 1 : -1) * (20 + i * 10)],
                  y: [0, (i > 1 ? 1 : -1) * (15 + i * 5)],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 1.5,
                  delay: i * 0.2,
                  repeat: Infinity,
                  repeatDelay: 2,
                }}
              />
            ))}
          </>
        )}
      </div>

      {/* Text and badge */}
      <div className="flex flex-col">
        <motion.span 
          className={`font-bold ${currentSize.text} bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 bg-clip-text text-transparent`}
          animate={animated ? {
            backgroundImage: isHovered
              ? 'linear-gradient(45deg, #8b5cf6, #6366f1, #06b6d4, #10b981)'
              : 'linear-gradient(90deg, #8b5cf6, #6366f1, #06b6d4)',
          } : {}}
          transition={{ duration: 0.4 }}
        >
          ZenZiUI
        </motion.span>
        
        {showBeta && (
          <motion.div
            animate={animated ? {
              scale: isHovered ? 1.05 : 1,
            } : {}}
            transition={{ duration: 0.2 }}
          >
            <Badge
              variant="secondary"
              className={`${currentSize.badge} w-fit bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-700 border-purple-200`}
            >
              <motion.div
                animate={animated ? {
                  rotate: isHovered ? 360 : 0,
                } : {}}
                transition={{ duration: 0.6 }}
              >
                <Sparkles className={`${currentSize.icon} mr-1`} />
              </motion.div>
              Beta
            </Badge>
          </motion.div>
        )}
      </div>
    </Link>
  );
};

export default Logo;
