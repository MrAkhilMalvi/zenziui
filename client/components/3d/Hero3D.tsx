import React, { Suspense } from 'react';
import { motion } from 'framer-motion';
import Spline from '@splinetool/react-spline';
import Simple3DScene from './Simple3DScene';

interface Hero3DProps {
  splineUrl?: string;
  fallbackContent?: React.ReactNode;
}

const Hero3D: React.FC<Hero3DProps> = ({ 
  splineUrl = "https://prod.spline.design/6Wq1Q7YGyM-iab9i/scene.splinecode",
  fallbackContent 
}) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 1,
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut" as const,
      },
    },
  };

  const FloatingGeometry = () => (
    <div className="absolute inset-0 overflow-hidden">
      {Array.from({ length: 8 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute"
          initial={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            scale: 0,
          }}
          animate={{
            x: [
              Math.random() * window.innerWidth,
              Math.random() * window.innerWidth,
            ],
            y: [
              Math.random() * window.innerHeight,
              Math.random() * window.innerHeight,
            ],
            scale: [0, 1, 0],
            rotate: [0, 360],
          }}
          transition={{
            duration: 15 + Math.random() * 10,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          <div
            className={`
              ${i % 3 === 0 ? 'w-12 h-12 bg-gradient-to-r from-blue-500/30 to-cyan-500/30' : ''}
              ${i % 3 === 1 ? 'w-8 h-8 bg-gradient-to-r from-purple-500/30 to-pink-500/30' : ''}
              ${i % 3 === 2 ? 'w-16 h-16 bg-gradient-to-r from-green-500/30 to-teal-500/30' : ''}
              rounded-lg backdrop-blur-sm border border-white/20
            `}
          />
        </motion.div>
      ))}
    </div>
  );

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="relative min-h-[60vh] flex items-center justify-center overflow-hidden"
    >
      {/* 3D Background */}
      <div className="absolute inset-0 z-0">
        <Suspense fallback={
          <div className="w-full h-full bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-pink-900/20">
            <Simple3DScene />
          </div>
        }>
          <div className="w-full h-full">
            <Spline 
              scene={splineUrl}
              style={{ width: '100%', height: '100%' }}
            />
          </div>
        </Suspense>
      </div>

      {/* Fallback animated background */}
      <div className="absolute inset-0 z-0">
        <FloatingGeometry />
      </div>

      {/* Content overlay */}
      <div className="relative z-10 text-center px-4">
        <motion.div 
        variants={itemVariants}
        >
          {fallbackContent || (
            <div className="space-y-6">
              <motion.h1 
                className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                ZenZiUI
              </motion.h1>
              <motion.p 
                className="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto"
                variants={itemVariants}
              >
                Beautiful Components in 3D Space
              </motion.p>
              <motion.div 
                variants={itemVariants}
                className="flex gap-4 justify-center"
              >
                <motion.button
                  className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-semibold hover-target"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Explore Components
                </motion.button>
                <motion.button
                  className="px-8 py-3 border border-white/20 text-white rounded-lg font-semibold backdrop-blur-sm hover-target"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  View Gallery
                </motion.button>
              </motion.div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Gradient overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-gray-900/50 via-transparent to-gray-900/30 z-5" />
    </motion.div>
  );
};

export default Hero3D;
