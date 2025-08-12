import { motion } from 'framer-motion';

interface FloatingShapesProps {
  count?: number;
  className?: string;
}

const FloatingShapes: React.FC<FloatingShapesProps> = ({ count = 6, className = "" }) => {
  const shapes = Array.from({ length: count }, (_, i) => i);

  const shapeVariants = {
    initial: {
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      scale: 0,
      rotate: 0,
    },
    animate: {
      x: [
        Math.random() * window.innerWidth,
        Math.random() * window.innerWidth,
        Math.random() * window.innerWidth,
      ],
      y: [
        Math.random() * window.innerHeight,
        Math.random() * window.innerHeight,
        Math.random() * window.innerHeight,
      ],
      scale: [0, 1, 0.8, 1],
      rotate: [0, 180, 360],
      transition: {
        duration: 20 + Math.random() * 10,
        repeat: Infinity,
        ease: "linear"as const ,
      },
    },
  };

  return (
    <div className={`fixed inset-0 pointer-events-none overflow-hidden z-0 ${className}`}>
      {shapes.map((index) => (
        <motion.div
          key={index}
          variants={shapeVariants}
          initial="initial"
          animate="animate"
          className="absolute"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
        >
          <div
            className={`
              ${index % 4 === 0 ? 'w-4 h-4 bg-blue-500/20 rounded-full' : ''}
              ${index % 4 === 1 ? 'w-6 h-6 bg-purple-500/20 rotate-45' : ''}
              ${index % 4 === 2 ? 'w-3 h-3 bg-pink-500/20 rounded-sm' : ''}
              ${index % 4 === 3 ? 'w-5 h-5 bg-green-500/20 rounded-full' : ''}
              backdrop-blur-sm
            `}
          />
        </motion.div>
      ))}
    </div>
  );
};

export default FloatingShapes;
