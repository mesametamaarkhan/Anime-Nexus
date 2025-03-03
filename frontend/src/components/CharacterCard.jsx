import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Factory } from 'lucide-react';

const CharacterCard = ({ id, name, imageUrl, animeName, favorites, darkMode = true }) => {
  return (
    <motion.div
        whileHover={{
            y: -5,
            scale: 1.02,
            boxShadow: darkMode ? '0 0 10px rgba(255, 0, 255, 0.5) 0 0 20px rgba(255, 0, 255, 0.3)' : '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={`overflow-hidden rounded-lg ${ darkMode ? 'bg-cyberpunk-light border border-neon-pink/30 hover:border-neon-pink/70' : 'bg-white shadow-lg hover:shadow-xl'} transition-all duration-300`}
    >
        <Link to={`/character/${id}`} className='block'>
            <div className='relative h-64 overflow-hidden'>
                <img 
                    src={imageUrl} 
                    alt={name} 
                    className='object-cover w-full h-full transition-transform duration-500 hover:scale-110'
                    onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/300x400?text=No+Image';
                    }}
                />
                {favorites && (
                    <div className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-semibold ${ darkMode ? 'bg-neon-pink/80 text-white' : 'bg-pink-500 text-white'}`}>
                        ♥ {favorites.toLocaleString()}
                    </div>
                )}
            </div>
            <div className='p-4'>
                <h3 className={`text-lg font-bold truncate ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                    {name}
                </h3>
                {animeName && (
                    <p className={`mt-1 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        {animeName}
                    </p>
                )}
            </div>
        </Link>
    </motion.div>
  )
}

export default CharacterCard;