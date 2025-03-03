import React from 'react';
import { motion } from 'framer-motion';

const Loader = ({ darkMode = true}) => {
  return (
    <div className='flex flex-col items-center py-12'>
        <motion.div
            animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, 180, 360]
            }}
            transition={{
                duration: 2,
                loop: Infinity,
                ease: 'easeInOut'
            }}
            className={`w-16 h-16 rounded-full border-4 border-t-transparent ${ darkMode ? 'border-neon-pink shadow-[0_0_15px_rgba(255,0,255,0.7)]' : 'border-purple-600'}`}
        />
        <motion.p
            animate={{
                opacity: [0.5, 1, 0.5]
            }}
            transition={{
                duration:1.5,
                repeat: Infinity,
                ease: 'easeInOut'
            }}
            className={`mt-4  font-orbitron text-lg ${ darkMode ? 'text-neon-pink' : 'text-purple-600'}`}
        >
            Loading...
        </motion.p>
    </div>
  )
}

export default Loader;