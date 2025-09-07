import { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { Sparkles, ArrowRight, Zap, Crown } from 'lucide-react';

interface HolographicEntryButtonProps {
  onClick: () => void;
  size?: 'default' | 'large';
  children?: React.ReactNode;
}

export default function HolographicEntryButton({ 
  onClick, 
  size = 'default',
  children = 'Enter Dashboard'
}: HolographicEntryButtonProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const buttonRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!buttonRef.current) return;
    
    const rect = buttonRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    
    setMousePosition({ x, y });
  };

  const buttonSizeClasses = size === 'large' 
    ? 'px-14 py-6 text-lg' 
    : 'px-10 py-4 text-base';

  return (
    <motion.div
      ref={buttonRef}
      className="relative group cursor-pointer perspective-1000"
      style={{ perspective: '1000px' }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.95 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
      onClick={onClick}
    >
      {/* 3D Container */}
      <motion.div
        className="relative preserve-3d"
        animate={isHovered ? {
          rotateY: mousePosition.x * 15,
          rotateX: -mousePosition.y * 15,
        } : {
          rotateY: 0,
          rotateX: 0,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        {/* Holographic base layer */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 opacity-80">
          <motion.div
            className="w-full h-full rounded-2xl"
            style={{
              background: `
                linear-gradient(45deg, 
                  hsl(${180 + mousePosition.x * 30}, 70%, 60%) 0%,
                  hsl(${270 + mousePosition.y * 30}, 80%, 70%) 25%,
                  hsl(${300 + mousePosition.x * 20}, 90%, 80%) 50%,
                  hsl(${240 + mousePosition.y * 20}, 85%, 65%) 75%,
                  hsl(${320 + mousePosition.x * 25}, 75%, 70%) 100%
                )
              `
            }}
            animate={{
              background: [
                'linear-gradient(45deg, hsl(180, 70%, 60%) 0%, hsl(270, 80%, 70%) 25%, hsl(300, 90%, 80%) 50%, hsl(240, 85%, 65%) 75%, hsl(320, 75%, 70%) 100%)',
                'linear-gradient(90deg, hsl(200, 70%, 60%) 0%, hsl(290, 80%, 70%) 25%, hsl(320, 90%, 80%) 50%, hsl(260, 85%, 65%) 75%, hsl(340, 75%, 70%) 100%)',
                'linear-gradient(135deg, hsl(220, 70%, 60%) 0%, hsl(310, 80%, 70%) 25%, hsl(340, 90%, 80%) 50%, hsl(280, 85%, 65%) 75%, hsl(360, 75%, 70%) 100%)',
                'linear-gradient(45deg, hsl(180, 70%, 60%) 0%, hsl(270, 80%, 70%) 25%, hsl(300, 90%, 80%) 50%, hsl(240, 85%, 65%) 75%, hsl(320, 75%, 70%) 100%)'
              ]
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        {/* Iridescent overlay */}
        <motion.div
          className="absolute inset-0 rounded-2xl opacity-60"
          style={{
            background: `
              radial-gradient(circle at ${50 + mousePosition.x * 20}% ${50 + mousePosition.y * 20}%, 
                rgba(255,255,255,0.8) 0%, 
                rgba(255,255,255,0.2) 30%, 
                transparent 70%
              )
            `
          }}
          animate={isHovered ? {
            opacity: [0.6, 0.9, 0.6]
          } : {}}
          transition={{ duration: 2, repeat: Infinity }}
        />

        {/* Glass reflection */}
        <motion.div
          className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/30 to-transparent"
          animate={isHovered ? {
            background: [
              'linear-gradient(135deg, rgba(255,255,255,0.3) 0%, transparent 50%)',
              'linear-gradient(225deg, rgba(255,255,255,0.4) 0%, transparent 60%)',
              'linear-gradient(315deg, rgba(255,255,255,0.3) 0%, transparent 50%)',
              'linear-gradient(135deg, rgba(255,255,255,0.3) 0%, transparent 50%)'
            ]
          } : {}}
          transition={{ duration: 3, repeat: Infinity }}
        />

        {/* Edge glow */}
        <div className="absolute inset-0 rounded-2xl border border-white/40 shadow-2xl shadow-purple-500/30" />

        {/* Holographic scanlines */}
        <motion.div
          className="absolute inset-0 rounded-2xl overflow-hidden opacity-30"
          style={{
            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.1) 2px, rgba(255,255,255,0.1) 4px)'
          }}
          animate={isHovered ? {
            backgroundPosition: ['0px 0px', '0px 20px']
          } : {}}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />

        {/* Content layer */}
        <div className={`relative z-10 flex items-center justify-center space-x-4 ${buttonSizeClasses} backdrop-blur-sm`}>
          {/* Left icon with orbit */}
          <motion.div className="relative">
            <motion.div
              animate={isHovered ? { rotate: 360 } : {}}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <Crown className="w-6 h-6 text-white filter drop-shadow-lg" />
            </motion.div>
            
            {/* Orbiting particles */}
            {isHovered && Array.from({ length: 3 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-white rounded-full"
                style={{
                  left: '50%',
                  top: '50%',
                  transform: 'translate(-50%, -50%)'
                }}
                animate={{
                  rotate: 360,
                  scale: [0, 1, 0]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.3,
                  ease: "linear"
                }}
              >
                <div 
                  className="w-1 h-1 bg-white rounded-full"
                  style={{
                    transform: `translateX(${15 + i * 5}px)`
                  }}
                />
              </motion.div>
            ))}
          </motion.div>

          {/* Text with chromatic aberration effect */}
          <motion.div className="relative">
            <motion.span 
              className="font-bold text-white relative z-10 filter drop-shadow-lg"
              animate={isHovered ? {
                textShadow: [
                  '2px 0 #ff00ff, -2px 0 #00ffff',
                  '0 2px #ff00ff, 0 -2px #00ffff',
                  '-2px 0 #ff00ff, 2px 0 #00ffff',
                  '2px 0 #ff00ff, -2px 0 #00ffff'
                ]
              } : {
                textShadow: '0 0 10px rgba(255,255,255,0.5)'
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {children}
            </motion.span>
            
            {/* Text ghost layers for chromatic effect */}
            {isHovered && (
              <>
                <motion.span 
                  className="absolute inset-0 font-bold text-cyan-300 opacity-30"
                  animate={{
                    x: [0, 2, -2, 0],
                    y: [0, -1, 1, 0]
                  }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                >
                  {children}
                </motion.span>
                <motion.span 
                  className="absolute inset-0 font-bold text-pink-300 opacity-30"
                  animate={{
                    x: [0, -2, 2, 0],
                    y: [0, 1, -1, 0]
                  }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                >
                  {children}
                </motion.span>
              </>
            )}
          </motion.div>

          {/* Right icon with magnetic effect */}
          <motion.div className="relative">
            <motion.div
              animate={isHovered ? {
                x: [0, 3, -3, 0],
                filter: ['brightness(1)', 'brightness(1.5)', 'brightness(1)']
              } : {}}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <ArrowRight className="w-6 h-6 text-white filter drop-shadow-lg" />
            </motion.div>

            {/* Energy trails */}
            {isHovered && Array.from({ length: 4 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute top-1/2 left-1/2 w-0.5 h-6 bg-gradient-to-b from-transparent via-white to-transparent"
                style={{
                  transformOrigin: 'center',
                  transform: 'translate(-50%, -50%)'
                }}
                animate={{
                  rotate: [0, 360],
                  opacity: [0, 1, 0],
                  scale: [0.5, 1, 0.5]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: "easeInOut"
                }}
              />
            ))}
          </motion.div>
        </div>

        {/* Floating energy orbs */}
        {isHovered && Array.from({ length: 8 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white/80 rounded-full pointer-events-none"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`
            }}
            animate={{
              scale: [0, 1, 0],
              opacity: [0, 1, 0],
              x: [0, (Math.random() - 0.5) * 40],
              y: [0, (Math.random() - 0.5) * 40]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: i * 0.3,
              ease: "easeOut"
            }}
          />
        ))}

        {/* Depth shadow */}
        <div 
          className="absolute inset-0 bg-black/30 rounded-2xl blur-xl transform translate-z-[-10px] opacity-50"
          style={{
            transform: `translateZ(-10px) translateX(${mousePosition.x * 5}px) translateY(${mousePosition.y * 5}px)`
          }}
        />
      </motion.div>

      {/* Outer glow ring */}
      <motion.div
        className="absolute inset-0 rounded-2xl border-2 border-transparent pointer-events-none"
        style={{
          background: `linear-gradient(45deg, 
            hsl(${180 + mousePosition.x * 30}, 70%, 60%), 
            hsl(${270 + mousePosition.y * 30}, 80%, 70%), 
            hsl(${300 + mousePosition.x * 20}, 90%, 80%)
          ) border-box`,
          WebkitMask: 'linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude'
        }}
        animate={isHovered ? {
          scale: [1, 1.1, 1],
          opacity: [0.5, 1, 0.5]
        } : {}}
        transition={{ duration: 2, repeat: Infinity }}
      />
    </motion.div>
  );
}