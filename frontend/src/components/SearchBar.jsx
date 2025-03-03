import React, { useRef, useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { searchCharacters, searchAnime } from '../api/animeApi';

const SearchBar = ({ onSearch, darkMode }) => {
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const searchRef = useRef(null);

    useEffect(() => {
        const fetchSuggestions = async () => {
            if(query.length < 2) {
                setSuggestions([]);
                return;
            }

            try {
                const [charactersResponse, animeResponse] = await Promise.all([
                    searchCharacters(query, 1, 5),
                    searchAnime(query, 1, 5)
                ]);

                const characterSuggestions = charactersResponse.data.map((character) => ({
                    id: character.mal_id,
                    name: character.name,
                    type: 'character',
                    image_url: character.images?.jpg?.image_url
                }));

                const animeSuggestions = animeResponse.data.map((anime) => ({
                    id: anime.mal_id,
                    name: anime.title,
                    type: 'anime',
                    image_url: anime.images?.jpg?.image_url
                }));

                setSuggestions([...characterSuggestions, ...animeSuggestions]);
            }
            catch(err) {
                console.error('Error while fetching suggestions: ', err);
            }
            finally {
                setLoading(false);
            }
        };

        fetchSuggestions();
    }, [query])

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        };
    
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);


    const handleSubmit = () => {
        e.preventDefault();
        if(query.trim()) {
            onSearch(query);
            setShowSuggestions(false);
        }
    };

    const clearSearch = () => {
        setQuery('');
        setSuggestions([]);
    }

    return (
        <div ref={searchRef} className='relative w-full'>
            <form onSubmit={handleSubmit} className='relative'>
                <div className='relative'>
                    <input 
                        type='text'
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onFocus={() => setShowSuggestions(true)}
                        placeholder='Search for anime character or series...'
                        className={`w-full py-2 pl-10 pr-10 rounded-lg ${darkMode ? 'bg-cyberpunk-light text-white border border-neon-pink/50 focus:border-neon-pink focus:ring-1 focus:ring-neon-pink': 'bg-gray-100 text-gray-900 border border-gray-300 focus:border-purple-500 focus:ring-1 focus:ring-purple-500'} transition-all duration-300`}
                    />
                    <Search className={`absolute left-3 top-2.5 h-5 w-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                    {query && (
                        <button
                            type='button'
                            onClick={clearSearch}
                            className='absolute top-2.5 right-3'
                        >   
                            <X className={`h-5 w-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                        </button>
                    )}
                </div>
            </form> 


            {loading && (
                <div className='absolute right-3 top-2.5'>
                    <div className={`w-5 h-5 border-2 rounded-full animate-spin ${ darkMode ? 'border-neon-pink border-t-transparent' : 'border-purple-500 border-t-transparent'}`}>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SearchBar;