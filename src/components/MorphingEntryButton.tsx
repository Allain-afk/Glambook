import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Sparkles, ArrowRight, Zap, Star, Rocket } from 'lucide-react';

interface MorphingEntryButtonProps {
  onClick: () => void;
  size?: 'default' | 'large';
  children?: React.ReactNode;
}

export default function MorphingEntryButton({ 
  onClick, 
  size = 'default',
  children = 'Enter Dashboard'
}: MorphingEntryButtonProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number; timestamp: number }>>([]);

  const handleClick = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    const newRipple = {
      id: Date.now(),
      x,
      y,
      timestamp: Date.now()
    };
    
    setRipples(prev => [...prev, newRipple]);
    
    // Remove ripple after animation
    setTimeout(() => {
      setRipples(prev => prev.filter(ripple => ripple.id !== newRipple.id));
    }, 1000);
    
    onClick();
  };

  const buttonSizeClasses = size === 'large' 
    ? 'px-16 py-6 text-lg' 
    : 'px-10 py-4 text-base';

  return (
    <motion.div
      className="relative group cursor-pointer"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={handleClick}
    >
      {/* Outer morphing container */}
      <div className="relative">
        {/* Morphing blob background */}
        <motion.div
          className="absolute inset-0 opacity-70"
          animate={isHovered ? {
            borderRadius: ['32px', '28px 36px 24px 40px', '40px 20px 36px 28px', '32px'],
          } : {
            borderRadius: '32px'
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="w-full h-full bg-gradient-to-r from-pink-500 via-purple-600 to-blue-500 relative overflow-hidden">
            {/* Liquid animation layer */}
            <motion.div
              className="absolute inset-0 opacity-60"
              style={{
                background: 'radial-gradient(circle at 30% 40%, rgba(255,255,255,0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,182,193,0.4) 0%, transparent 50%), radial-gradient(circle at 40% 80%, rgba(138,43,226,0.3) 0%, transparent 50%)'
              }}
              animate={{
                background: [
                  'radial-gradient(circle at 30% 40%, rgba(255,255,255,0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,182,193,0.4) 0%, transparent 50%), radial-gradient(circle at 40% 80%, rgba(138,43,226,0.3) 0%, transparent 50%)',
                  'radial-gradient(circle at 60% 20%, rgba(255,255,255,0.3) 0%, transparent 50%), radial-gradient(circle at 20% 60%, rgba(255,182,193,0.4) 0%, transparent 50%), radial-gradient(circle at 80% 40%, rgba(138,43,226,0.3) 0%, transparent 50%)',
                  'radial-gradient(circle at 80% 60%, rgba(255,255,255,0.3) 0%, transparent 50%), radial-gradient(circle at 40% 10%, rgba(255,182,193,0.4) 0%, transparent 50%), radial-gradient(circle at 20% 90%, rgba(138,43,226,0.3) 0%, transparent 50%)',
                  'radial-gradient(circle at 30% 40%, rgba(255,255,255,0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,182,193,0.4) 0%, transparent 50%), radial-gradient(circle at 40% 80%, rgba(138,43,226,0.3) 0%, transparent 50%)'
                ]
              }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
        </motion.div>

        {/* Glassy overlay */}
        <motion.div
          className="absolute inset-0 bg-white/10 backdrop-blur-sm border border-white/20"
          animate={isHovered ? {
            borderRadius: ['32px', '28px 36px 24px 40px', '40px 20px 36px 28px', '32px'],
          } : {
            borderRadius: '32px'
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Click ripples */}
        {ripples.map((ripple) => (
          <motion.div
            key={ripple.id}
            className="absolute bg-white/30 rounded-full pointer-events-none"
            style={{
              left: `${ripple.x}%`,
              top: `${ripple.y}%`,
              transform: 'translate(-50%, -50%)'
            }}
            initial={{ width: 0, height: 0, opacity: 1 }}
            animate={{ width: 300, height: 300, opacity: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        ))}

        {/* Floating orbs */}
        {isHovered && Array.from({ length: 6 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white/60 rounded-full"
            style={{
              left: `${20 + i * 10}%`,
              top: `${30 + (i % 2) * 40}%`
            }}
            animate={{
              y: [0, -20, 0],
              x: [0, Math.sin(i) * 10, 0],
              opacity: [0, 1, 0],
              scale: [0, 1, 0]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: i * 0.2,
              ease: "easeInOut"
            }}
          />
        ))}

        {/* Main content */}
        <div className={`relative z-10 flex items-center justify-center space-x-4 ${buttonSizeClasses}`}>
          {/* Left animated icon */}
          <motion.div
            animate={isHovered ? { 
              rotate: [0, 15, -15, 0],
              scale: [1, 1.2, 1]
            } : {}}
            transition={{ duration: 1.5, repeat: isHovered ? Infinity : 0 }}
          >
            <Rocket className="w-6 h-6 text-white" />
          </motion.div>

          {/* Text with wave effect */}
          <motion.div className="relative">
            <motion.span 
              className="font-bold text-white text-shadow-sm relative z-10"
              animate={isHovered ? {
                textShadow: [
                  '0 0 5px rgba(255,255,255,0.5)',
                  '0 0 20px rgba(255,255,255,0.8)',
                  '0 0 5px rgba(255,255,255,0.5)'
                ]
              } : {}}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              {typeof children === 'string' ? children.split('').map((char, index) => (
                <motion.span
                  key={index}
                  className="inline-block"
                  animate={isHovered ? {
                    y: [0, -3, 0],
                  } : {}}
                  transition={{
                    duration: 0.6,
                    repeat: Infinity,
                    delay: index * 0.1,
                    ease: "easeInOut"
                  }}
                >
                  {char === ' ' ? '\u00A0' : char}
                </motion.span>
              )) : children}
            </motion.span>
          </motion.div>

          {/* Right icon with trail effect */}
          <motion.div className="relative">
            <motion.div
              animate={isHovered ? { x: [0, 8, 0] } : {}}
              transition={{ duration: 1, repeat: isHovered ? Infinity : 0 }}
            >
              <ArrowRight className="w-6 h-6 text-white" />
            </motion.div>
            
            {/* Trail effect */}
            {isHovered && Array.from({ length: 3 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute top-0 left-0"
                animate={{
                  x: [0, 8, 0],
                  opacity: [0.8, 0.3, 0]
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: i * 0.1
                }}
              >
                <ArrowRight className="w-6 h-6 text-white" />
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Corner sparkles */}
        {[
          { position: 'top-left', icon: Star, rotation: 0 },
          { position: 'top-right', icon: Sparkles, rotation: 90 },
          { position: 'bottom-left', icon: Zap, rotation: 180 },
          { position: 'bottom-right', icon: Star, rotation: 270 }
        ].map(({ position, icon: Icon, rotation }) => (
          <motion.div
            key={position}
            className={`absolute w-6 h-6 opacity-0 group-hover:opacity-100 ${
              position === 'top-left' ? '-top-2 -left-2' :
              position === 'top-right' ? '-top-2 -right-2' :
              position === 'bottom-left' ? '-bottom-2 -left-2' :
              '-bottom-2 -right-2'
            }`}
            animate={isHovered ? {
              rotate: [rotation, rotation + 360],
              scale: [1, 1.3, 1],
              opacity: [0, 1, 0.7]
            } : {}}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <Icon className="w-6 h-6 text-yellow-300 fill-current" />
          </motion.div>
        ))}

        {/* Pulsing ring */}
        <motion.div
          className="absolute inset-0 border-2 border-white/30 pointer-events-none"
          animate={isHovered ? {
            borderRadius: ['32px', '28px 36px 24px 40px', '40px 20px 36px 28px', '32px'],
            scale: [1, 1.05, 1],
            opacity: [0.3, 0.6, 0.3]
          } : {
            borderRadius: '32px'
          }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </div>
    </motion.div>
  );
}