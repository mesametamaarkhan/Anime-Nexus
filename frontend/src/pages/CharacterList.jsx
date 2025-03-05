import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, X } from 'lucide-react';
import { searchCharacters } from '../api/animeApi.js';
import { Loader, CharacterCard } from '../components/index.js';

const CharacterList = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const queryParams = new URLSearchParams(location.search);
    const initialQuery = queryParams.get('query') || '';

    const [query, setQuery] = useState(initialQuery);
    const [characters, setCharacters] = useState([]);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [totalResults, setTotalResults] = useState(0);

    const observer = useRef(null);
    const lastCharacterElementRef = useCallback((node) => {
        if(isLoading) return;
        if(observer.current) observer.current.disconnect();

        observer.current = new IntersectionObserver(entries => {
            if(entries[0].isIntersecting && hasMore) {
                setPage(prevPage => prevPage + 1);
            }
        });

        if(node) observer.current.observe(node);
    }, [isLoading, hasMore]);
    
    const fetchCharacters = async (searchQuery, pageNum, isNewSearch) => {
        setIsLoading(true);
        setError(null);

        try {
            const res = await searchCharacters(searchQuery, pageNum, 20);
            if(isNewSearch) {
                setCharacters(res.data);
            }
            else {
                setCharacters(prev => [...prev, ...res.data]);
            }

            setTotalResults(res.pagination.items.total);
            setHasMore(res.pagination.has_next_page);
        }
        catch(err) {
            console.err('Error while fetching data: ', err);
            setError('Failed to load characters. Please try again later.');
        }
        finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        setCharacters([]);
        setPage(1);
        setHasMore(true);
        if(initialQuery) {
            fetchCharacters(initialQuery, 1, true);
        }
    }, [initialQuery]);

    useEffect(() => {
        if(page > 1 && initialQuery) {
            fetchCharacters(initialQuery, page);
        }
    }, [page, initialQuery]);

    const handleSearch = (e) => {
        e.preventDefault();
        if(query.trim()) {
            navigate(`/characters?query=${encodeURIComponent(query.trim())}`);
        }
    };

    const clearSearch = () => {
        setQuery('');
        navigate('/characters');
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.05
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.3
            }
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className='min-h-screen bg-cyberpunk-dark text-white py-8 px-4 sm:px-6 lg:px-8'
        >
            <div className='max-w-7xl mx-auto'>
                <div className='mb-8'>
                    <h1 className='text-3xl font-bold font-orbitron mb-6 text-white'>
                        {initialQuery ? `Search results: "${initialQuery}"` : 'All Characters'}
                    </h1>

                    <form onSubmit={handleSearch} className='relative max-w-2xl'>
                        <div className='relative'>
                            <input
                                type='text'
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder='Search for anime characters...'
                                className='w-full py-2 pl-10 pr-10 rounded-lg bg-cyberpunk-light text-white border border-neon-pink/50 focus:border-neon-pink focus:ring-1 focus:ring-neon-pink transition-all duration-300'
                            />
                            <Search className='absolute left-3 top-2.5 h-5 w-5 text-gray-400' />
                            {query && (
                                <button
                                    type='button'
                                    onClick={clearSearch}
                                    className='absolute top-2.5 right-3'
                                >
                                    <X className='h-5 w-5 text-gray-400' />
                                </button>
                            )}
                        </div>
                        <button
                            type='submit'
                            className='mt-2 px-4 py-2 bg-neon-pink/20 border border-neon-pink text-white rounded-md font-medium hover:border-neon-pink/30 transition-all duration-300'
                        >
                            Search
                        </button>
                    </form>
                </div>

                {/**Error message here */}

                {initialQuery && totalResults > 0 && (
                    <p className='mb-4 text-gray-300'>
                        Found {totalResults} characters matching "{initialQuery}"
                    </p>
                )}

                {initialQuery && characters.length === 0 && !isLoading && !error && (
                    <div className='text-center py-12'>
                        <p className='text-xl text-gray-300 mb-4'>No characters found matching "${initialQuery}"</p>
                        <button
                            onClick={clearSearch}
                            className='px-4 py-2 bg-neon-pink/20 border border-neon-pink text-white rounded-md font-medium hover:border-neon-pink/30 transition-all duration-300'
                        >
                            Clear Search
                        </button>
                    </div>
                )}

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6"
                >
                    {characters.map((character, index) => {
                        if (characters.length === index + 1) {
                            return (
                                <div ref={lastCharacterElementRef} key={`${character.mal_id}-${index}`}>
                                    <motion.div variants={itemVariants}>
                                        <CharacterCard
                                            id={character.mal_id}
                                            name={character.name}
                                            imageUrl={character.images?.jpg?.image_url}
                                            favorites={character.favorites}
                                            darkMode={true}
                                        />
                                    </motion.div>
                                </div>
                            );
                        } 
                        else {
                            return (
                                <motion.div key={`${character.mal_id}-${index}`} variants={itemVariants}>
                                    <CharacterCard
                                        id={character.mal_id}
                                        name={character.name}
                                        imageUrl={character.images?.jpg?.image_url}
                                        favorites={character.favorites}
                                        darkMode={true}
                                    />
                                </motion.div>
                            );
                        }
                    })}
                </motion.div>
                
                {isLoading && <Loader />}

                {!hasMore && characters.length > 0 && (
                    <p className='text-center mt-8  text-gray-400'>
                        No more characters to load
                    </p>
                )}
            </div>
        </motion.div>    
    );
}; 

export default CharacterList