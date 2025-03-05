import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import Loader from '../components/Loader';
import CharacterCard from '../components/CharacterCard';
import { fetchTrendingCharacters, fetchTrendingAnime } from '../api/animeApi';

const Home = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [trendingCharacters, setTrendingCharacters] = useState([]);
    const [trendingAnime, setTrendingAnime] = useState([]);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const [charactersResponse, animeResponse] = await Promise.all([
                    fetchTrendingCharacters(1,20),
                    fetchTrendingAnime(1,6)
                ]);

                setTrendingCharacters(charactersResponse.data);
                setTrendingAnime(animeResponse.data);  
            }
            catch(err) {
                console.error('Error while fetching data: ', err);
            }
            finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);


    const onSearch= (query) => {
        navigate(`/characters?query=${encodeURIComponent(query)}`);
    }

    const containerVariants = {
        hidden: { opacity: 0},
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.5
            }
        }
    };

    if(isLoading) {
        return <Loader />;
    }

    return (
        <motion.div
            initial={{ opacity: 0}}
            animate={{ opacity: 1}}
            exit={{ opacity: 0}}
            className='min-h-screen bg-cyberpunk-dark text-white'
        >
            <div className='relative overflow-hidden bg-gradient-to-br from-cyberpunk-dark to-cyberpunk-light'>
                <div className='absolute inset-0 bg-grid-pattern opacity-10'></div>
                <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24'>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className='text-center'
                    >
                        <h1 
                            className='text-4xl md:text-6xl font-bold font-orbitron mb-4 text-white neon-glow' 
                            style={{ '--neon-primary': 'var(--neon-cyan)'}}
                        >
                                Anime Character Explorer
                        </h1>
                        <p className='text-xl md:text-2xl mb-8 text-gray-300'>
                            Discover your favorite anime characters
                        </p>
                    </motion.div>
                </div>
            </div>

            {/*error message goes here */}

            <section className='py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto'>
                <div className='flex items-center mb-8'>
                    <TrendingUp className='mr-2 text-neon-pink' />
                    <h2 className='text-2xl font-bold font-orbitron text-white'>Trending Characters</h2>
                </div>
                <motion.div
                    variants={containerVariants}
                    initial='hidden'
                    animate='visible'
                    className='grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'
                >
                    {trendingCharacters.map((character) => (
                        <motion.div key={character.mal_id} variants={itemVariants}>
                            <CharacterCard 
                                id={character.mal_id}
                                name={character.name}
                                imageUrl={character.images?.jpg?.image_url}
                                favorites={character.favorites}
                                darkMode={true}
                            />
                        </motion.div>
                    ))}
                </motion.div>
                <div className='mt-8 text-center'>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }} 
                        onClick={() => navigate('/characters')} 
                        className='px-6 py-2 bg-neon-pink/20 border border-neon-pink text-white rounded-full font-medium hover:bg-neon-pink/30 transition-all duration-300 neon-box'
                    >
                        View All Characters
                    </motion.button>
                </div>
            </section>

            <section>
                {/**Anime Section */}
            </section>
        </motion.div>
    )
}

export default Home