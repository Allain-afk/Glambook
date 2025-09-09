import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Sparkles, ArrowRight, Zap, Star } from 'lucide-react';

interface CreativeEntryButtonProps {
  onClick: () => void;
  size?: 'default' | 'large';
  variant?: 'primary' | 'secondary';
  children?: React.ReactNode;
}

export default function CreativeEntryButton({ 
  onClick, 
  size = 'default', 
  variant = 'primary',
  children = 'Enter Dashboard'
}: CreativeEntryButtonProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; delay: number }>>([]);

  useEffect(() => {
    // Generate random particles
    const newParticles = Array.from({ length: 8 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 2
    }));
    setParticles(newParticles);
  }, []);

  const buttonSizeClasses = size === 'large' 
    ? 'px-12 py-6 text-lg' 
    : 'px-8 py-4 text-base';

  return (
    <motion.div
      className="relative group cursor-pointer"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={onClick}
    >
      {/* Outer glow effect */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-indigo-500/40 to-purple-600/40 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
      
      {/* Main button container */}
      <div className="relative">
        {/* Animated background layers */}
        <div className="absolute inset-0 rounded-2xl overflow-hidden">
          {/* Base glassmorphism background */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/95 to-white/90 backdrop-blur-xl border border-gray-200/60 shadow-lg"></div>
          
          {/* Animated gradient overlay */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-indigo-600/90 to-purple-600/90"
            animate={{
              background: isHovered 
                ? ['linear-gradient(45deg, #4f46e5, #7c3aed, #2563eb, #4f46e5)', 
                   'linear-gradient(90deg, #2563eb, #4f46e5, #7c3aed, #2563eb)',
                   'linear-gradient(135deg, #7c3aed, #2563eb, #4f46e5, #7c3aed)']
                : 'linear-gradient(90deg, #4f46e5, #7c3aed)'
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          />
          
          {/* Shimmer effect */}
          <motion.div
            className="absolute inset-0 opacity-0 group-hover:opacity-100"
            style={{
              background: 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.4) 50%, transparent 70%)'
            }}
            animate={isHovered ? {
              x: ['-100%', '200%']
            } : {}}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        {/* Floating particles */}
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute w-1 h-1 bg-white rounded-full opacity-0 group-hover:opacity-100"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`
            }}
            animate={isHovered ? {
              y: [0, -20, 0],
              opacity: [0, 1, 0],
              scale: [0, 1, 0]
            } : {}}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: particle.delay,
              ease: "easeInOut"
            }}
          />
        ))}

        {/* Button content */}
        <div className={`relative z-10 flex items-center justify-center space-x-3 ${buttonSizeClasses} rounded-2xl`}>
          {/* Left icon with rotation */}
          <motion.div
            animate={isHovered ? { rotate: 360 } : { rotate: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          >
            <Sparkles className="w-5 h-5 text-white" />
          </motion.div>

          {/* Button text with typing effect */}
          <motion.span 
            className="font-semibold text-white relative overflow-hidden"
            whileHover={{ letterSpacing: '0.05em' }}
            transition={{ duration: 0.3 }}
          >
            {children}
            
            {/* Underline animation */}
            <motion.div
              className="absolute bottom-0 left-0 h-0.5 bg-white/60"
              initial={{ width: 0 }}
              animate={isHovered ? { width: '100%' } : { width: 0 }}
              transition={{ duration: 0.4 }}
            />
          </motion.span>

          {/* Right icon with bounce */}
          <motion.div
            animate={isHovered ? { x: [0, 5, 0] } : { x: 0 }}
            transition={{ duration: 0.6, repeat: isHovered ? Infinity : 0 }}
          >
            <ArrowRight className="w-5 h-5 text-white" />
          </motion.div>
        </div>

        {/* Corner decorations */}
        <motion.div
          className="absolute -top-1 -left-1 w-4 h-4 opacity-0 group-hover:opacity-100"
          animate={isHovered ? { 
            rotate: 360,
            scale: [1, 1.2, 1]
          } : {}}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Star className="w-4 h-4 text-amber-400 fill-current" />
        </motion.div>

        <motion.div
          className="absolute -top-1 -right-1 w-4 h-4 opacity-0 group-hover:opacity-100"
          animate={isHovered ? { 
            rotate: -360,
            scale: [1, 1.2, 1]
          } : {}}
          transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
        >
          <Zap className="w-4 h-4 text-blue-400 fill-current" />
        </motion.div>

        <motion.div
          className="absolute -bottom-1 -left-1 w-4 h-4 opacity-0 group-hover:opacity-100"
          animate={isHovered ? { 
            rotate: 360,
            scale: [1, 1.2, 1]
          } : {}}
          transition={{ duration: 2, repeat: Infinity, delay: 1 }}
        >
          <Star className="w-4 h-4 text-emerald-400 fill-current" />
        </motion.div>

        <motion.div
          className="absolute -bottom-1 -right-1 w-4 h-4 opacity-0 group-hover:opacity-100"
          animate={isHovered ? { 
            rotate: -360,
            scale: [1, 1.2, 1]
          } : {}}
          transition={{ duration: 2, repeat: Infinity, delay: 1.5 }}
        >
          <Sparkles className="w-4 h-4 text-rose-400 fill-current" />
        </motion.div>
      </div>

      {/* Pulsing ring effect */}
      <motion.div
        className="absolute inset-0 rounded-2xl border-2 border-indigo-400/50 opacity-0"
        animate={isHovered ? {
          scale: [1, 1.1, 1.2],
          opacity: [0, 0.6, 0]
        } : {}}
        transition={{ duration: 1.5, repeat: Infinity }}
      />
    </motion.div>
  );
}