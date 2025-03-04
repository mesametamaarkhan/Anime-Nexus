import React, { useState, useRef, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Calendar, ExternalLink, Heart, Mic, User, Tv } from 'lucide-react';
import { getCharacterById, getCharacterAnime, getCharacterVoiceActors } from '../api/animeApi.js';
import Loader from '../components/Loader.jsx';
import { motion, transform } from 'framer-motion';

const CharacterDetail = () => {
    const { id } = useParams();
    const [character, setCharacter] = useState(null);
    const [voiceActors, setVoiceActors] = useState([]);
    const [animeAppearences, setAnimeAppearences] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [dominantColor, setDominantColor] = useState('#0f0f1a');
    const [scrollY, setScrollY] = useState(0);
    const parallaxRef = useRef(null);

    useEffect(() => {
        const fetchCharacterData = async () => {
            if(!id) return;

            setIsLoading(true);
            setError(null);

            try {
                const [characterResponse, voiceActorResponse, animeResponse] = await Promise.all([
                    getCharacterById(id),
                    getCharacterVoiceActors(id),
                    getCharacterAnime(id)
                ]);

                setCharacter(characterResponse.data);
                setAnimeAppearences(animeResponse.data);
                setVoiceActors(voiceActorResponse.data);

                if(characterResponse.data.images?.jpg?.image_url) {
                    extractDominantColor(characterResponse.data.images.jpg.image_url);
                }
            }
            catch(err) {
                console.error('Error while fetching data; ', err);
                setError('Failed to load character data. Please try again later.');
            }
            finally {
                setIsLoading(false);
            }
        }

        fetchCharacterData();
    }, [id]);

    useEffect(() => {
        const handleScroll = () => {
            setScrollY(window.scrollY);
        }

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);    

    const extractDominantColor = (imageUrl) => {
        try {
            const colors = [
                '#ff00ff',
                '#00ffff',
                '#9900ff',
                '#0066ff',
                '#ff3300',
                '#00cc99',
            ];

            const randomColor = colors[Math.floor(Math.random() * colors.length)];
            setDominantColor(randomColor);
        }
        catch(err) {
            console.error('Error extracting color: ', err);
            setDominantColor('#0f0f1a');
        }
    };

    if(isLoading) {
        return <Loader />
    };

    if(error) {
        return (
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
                <h2 className='font-bold font-orbitron text-black'>${error}</h2>
                <div className='mt-6'>
                    <Link
                        to='/'
                        className='inline-flex items-center px-4 py-2 bg-neon-pink/20 border border-neon-pink text-white rounded-md font-medium hover:border-neon-pink/30 transition-all duration-300'>
                            <ArrowLeft className='mr-2 h-4 w-4' />
                            Back To Home
                        </Link>
                </div>
            </div>
        )
    };

    if(!character) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <h2 className='font-bold font-orbitron text-black'>Character Not Found</h2>
                <div className="mt-6">
                <Link 
                    to="/" 
                    className="inline-flex items-center px-4 py-2 bg-neon-pink/20 border border-neon-pink text-white rounded-md font-medium hover:bg-neon-pink/30 transition-all duration-300"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Home
                </Link>
                </div>
            </div> 
        )
    }

    const backgroundStyle = {
        background: `linear-gradient(to bottom, rgba(15, 15, 26, 0.9), rgba(15, 15,26, 1)), linear-gradient(to right, ${dominantColor}33, rgba(15, 15, 26, 1))`
    };

    const parallaxStyle = {
        transform: `translateY(${scrollY * 0.2}px)`,
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className='min-h-screen bg-cyberpunk-dark text-white'
            style={backgroundStyle}
        >
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
                <div className='mb-6'>
                    <Link 
                        to='/'
                        className='inline-flex items-center text-white hover:text-neon-pink transition-colors'
                    >
                        <ArrowLeft className='mr-1 h-4 w-4' />
                        Back to Home
                    </Link>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
                    <div className='md:col-span-1'>
                        <div className='parallax-container'>
                            <motion.div
                                ref={parallaxRef}
                                className='relative rounded-lg overflow-hidden border-2'
                                style={{
                                    borderColor: `${dominantColor}80`,
                                    boxShadow: `0 0 20px ${dominantColor}40, 0 0 40px ${dominantColor}20`
                                }}
                                whileHover={{ scale: 1.02 }}
                            >
                                <div className='parallax-element' style={parallaxStyle}>
                                    <img 
                                        src={character.images?.jpg?.image_url || 'https://via.placeholder.com/350x500?text=No+Image'}
                                        alt={character.name}
                                        style={{ minHeight: '400px' }}
                                        onError={(e) => {
                                            e.target.src = 'https://via.placeholder.com/350x500?text=No+Image';
                                        }}
                                    />

                                </div>
                                {character.favorites > 0 && (
                                    <div className='absolute top-3 right-3 px-3 py-1 rounded-full bg-neon-pink/80 text-white flex items-center'>
                                        <Heart className='h-4 w-4 mr-1 fill-current' />
                                        {character.favorites.toLocaleString()}
                                    </div>
                                )}
                            </motion.div>
                        </div>
                    </div>

                    <div className='md:col-span-2'>
                        <motion.h1
                            className='text-3xl md:text-4xl font-bold font-orbitron mb-2 neon-glow'
                            style={{ '--neon-primary': dominantColor }}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5}}
                        >
                            {character.name}
                        </motion.h1>

                        {character.name_kanji && (
                            <motion.p
                                className='text-xl text-gray-300 mb-4'
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.5, delay: 0.1 }}
                            >
                                {character.name_kanji}
                            </motion.p>
                        )}

                        <motion.div
                            className='grid grid-cols-1 sm:grid-cols-2 mb-6 gap-4'
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0}}
                            transition={{ duration: 0.5, delay: 0.2 }}
                        >
                            {character.gender && (
                                <div className='flex items-center'>
                                    <User className='h-5 w-5 mr-2 text-gray-400' />
                                    <span className='text-gray-300'>Gender:</span>
                                    <span className='ml-2'>{character.gender}</span>
                                </div>
                            )}

                            {character.birthday && (
                                <div className='flex items-center'>
                                    <Calendar className='h-5 w-5 mr-2 text-gray-400' />
                                    <span className='text-gray-300'>Birthday:</span>
                                    <span className='ml-2'>{character.birthday}</span>
                                </div>
                            )}
                        </motion.div>

                        {character.about && (
                            <motion.div
                                className='mb-6'
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.3 }}
                            >
                                <h2 className='text-xl font-bold mb-2'>About</h2>
                                <div
                                    className='text-gray-300 prose prose-invert max-w-none'
                                    style={{ whiteSpace: 'pre-line'}}
                                >
                                    {character.about}
                                </div>
                            </motion.div>
                        )}

                        {animeAppearences.length > 0 && (
                            <motion.div
                                className='mb-6'
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.4 }}
                            >
                                <h2 className='text-xl font-bold mb-3 flex items-center'>
                                    <Tv className='h-5 w-5 mr-2' style={{ color: dominantColor }} />
                                    Anime Appearences
                                </h2>
                                <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                                    {animeAppearences.slice(0, 6).map((anime) => {
                                        <motion.div
                                            key={anime.anime.mal_id}
                                            className='flex items-start p-3 rounded-lg bg-cyberpunk-light/50 border border-gray-700 hover:border-gray-500 transition-all'
                                            whileHover={{
                                                y: -2,
                                                boxShadow: `0 0 10px ${dominantColor}30`
                                            }}
                                        >
                                            <img
                                                src={anime.anime.images?.jpg?.image_url}
                                                alt={anime.anime.title}
                                                className='w-12 h-16 object-cover rounded mr-3'
                                                onError={(e) => {
                                                    e.target.src = 'https://via.placeholder.com/50x70?text=?';
                                                }}
                                            />
                                            <div>
                                                <h3 className='font-medium text-white'>{anime.anime.title}</h3>
                                                <p className='text-sm text-gray-400'>
                                                    { anime.role || 'Unknown role' }
                                                </p>
                                            </div>
                                        </motion.div>
                                    })}
                                </div>
                                {animeAppearences.length > 6 && (
                                    <p className='mt-2 text-sm text-gray-400'>
                                        +{animeAppearences.length - 6 } more Appearences
                                    </p>
                                )}
                            </motion.div>
                        )}

                        {voiceActors.length > 0 && (
                            <motion.div
                                className='mb-6'
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0}}
                                duration={{ duration: 0.5, delay: 0.5}}
                            >
                                <h2 className='text-xl font-bold mb-3 flex items-center'>
                                    <Mic className='h-5 w-5 mr-2' style={{ color: dominantColor }} />
                                    Voice Actors
                                </h2>
                                <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                                    {voiceActors.slice(0, 6).map((voiceActor) => (
                                        <motion.div
                                            key={`${voiceActor.person.mal_id}-${voiceActor.language}`}
                                            className='flex items-start p-3 rounded-lg bg-cyberpunk-light/50 border border-gray-700 hover:border-gray-500 transition-all'
                                            whileHover={{
                                                y: -2,
                                                boxShadow: `0 0 10px ${dominantColor}30`
                                            }}
                                        >
                                            <img 
                                                src={voiceActor.person.images?.jpg?.image_url}
                                                alt={voiceActor.person.name}
                                                className='w-12 h-16 object-cover rounded mr-3'
                                                onError={(e) => {
                                                    e.target.src = 'https://via.placeholder.com/50x70?text=?';
                                                }}
                                            />
                                            <div>
                                                <h3 className='font-medium text-white'>{voiceActor.person.name}</h3>
                                                <p className='text-gray-400 text-sm'>
                                                    {voiceActor.language}
                                                </p>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                                {voiceActors.length > 6 && (
                                    <p className='mt-2 text-sm text-gray-400'>
                                        +{voiceActors.length - 6} more voice actors
                                    </p>
                                )}      
                            </motion.div>
                        )}
                        
                        <motion.div 
                            className='mt-8'
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.6 }}
                        >
                            {character.url && (
                                <a
                                    href={character.url}
                                    target='_blank'
                                    rel='noopener noreferrer'
                                    className='inline-flex items-center px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white hover:bg-gray-700 transition-colors mr-3' 
                                >
                                    <ExternalLink className='h-4 w-4 mr-2' />
                                    MyAnimeList
                                </a>
                            )}
                        </motion.div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default CharacterDetail;