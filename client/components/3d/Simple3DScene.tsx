import React from 'react';
import { motion } from 'framer-motion';

interface Simple3DSceneProps {
  className?: string;
}

const Simple3DScene: React.FC<Simple3DSceneProps> = ({ className = "" }) => {
  return (
    <div className={`relative w-full h-full ${className}`}>
      {/* Animated 3D cubes */}
      <div className="absolute inset-0 flex items-center justify-center">
        {Array.from({ length: 5 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            initial={{
              x: Math.random() * 400 - 200,
              y: Math.random() * 400 - 200,
              z: Math.random() * 200 - 100,
            }}
            animate={{
              rotateX: [0, 360],
              rotateY: [0, 360],
              x: [
                Math.random() * 400 - 200,
                Math.random() * 400 - 200,
                Math.random() * 400 - 200,
              ],
              y: [
                Math.random() * 400 - 200,
                Math.random() * 400 - 200,
                Math.random() * 400 - 200,
              ],
            }}
            transition={{
              duration: 15 + Math.random() * 10,
              repeat: Infinity,
              ease: "linear",
            }}
            style={{
              transformStyle: 'preserve-3d',
            }}
          >
            <div
              className={`
                w-8 h-8 
                ${i % 3 === 0 ? 'bg-gradient-to-r from-blue-500/60 to-cyan-500/60' : ''}
                ${i % 3 === 1 ? 'bg-gradient-to-r from-purple-500/60 to-pink-500/60' : ''}
                ${i % 3 === 2 ? 'bg-gradient-to-r from-green-500/60 to-teal-500/60' : ''}
                rounded-lg backdrop-blur-sm border border-white/20 shadow-lg
              `}
              style={{
                transform: 'translateZ(50px)',
              }}
            />
            <div
              className={`
                absolute top-0 left-0 w-8 h-8
                ${i % 3 === 0 ? 'bg-gradient-to-r from-blue-600/40 to-cyan-600/40' : ''}
                ${i % 3 === 1 ? 'bg-gradient-to-r from-purple-600/40 to-pink-600/40' : ''}
                ${i % 3 === 2 ? 'bg-gradient-to-r from-green-600/40 to-teal-600/40' : ''}
                rounded-lg backdrop-blur-sm border border-white/10
              `}
              style={{
                transform: 'translateZ(-50px)',
              }}
            />
          </motion.div>
        ))}
      </div>

      {/* Particle effects */}
      <div className="absolute inset-0">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={`particle-${i}`}
            className="absolute w-1 h-1 bg-white/40 rounded-full"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              opacity: 0,
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
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 8 + Math.random() * 4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 5,
            }}
          />
        ))}
      </div>

      {/* Gradient orbs */}
      <div className="absolute inset-0">
        {Array.from({ length: 3 }).map((_, i) => (
          <motion.div
            key={`orb-${i}`}
            className={`
              absolute rounded-full blur-xl
              ${i === 0 ? 'w-32 h-32 bg-gradient-to-r from-blue-500/30 to-purple-500/30' : ''}
              ${i === 1 ? 'w-24 h-24 bg-gradient-to-r from-pink-500/30 to-red-500/30' : ''}
              ${i === 2 ? 'w-40 h-40 bg-gradient-to-r from-green-500/30 to-cyan-500/30' : ''}
            `}
            animate={{
              x: [0, 100, -100, 0],
              y: [0, -100, 100, 0],
              scale: [1, 1.2, 0.8, 1],
            }}
            transition={{
              duration: 20 + i * 5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            style={{
              left: `${20 + i * 30}%`,
              top: `${20 + i * 20}%`,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default Simple3DScene;
