import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Tv, Sun, Moon, X, Menu } from 'lucide-react';

const Navbar = ({ darkMode, toggleDarkMode}) => {

    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <nav className={`sticky top-0 z-50 ${darkMode ? 'bg-cyberpunk-dark neon-border border-b border-neon-pink/30': 'bg-white shadow-md'}`}>
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                <div className='flex justify-between h-16'>
                    <div className='flex items-center'>
                        <Link to='/' className='flex items-center'>
                            <Tv className={`h-8 w-8 ${darkMode ? 'text-neon-pink' : 'text-purple-600'}`} />
                            <span className={`ml-2 text-xl font-bold font-orbitron ${darkMode ? 'text-white neon-glow' : 'text-gray-800'}`}>
                                Anime Nexus
                            </span>
                        </Link>
                    </div>

                    <div className='hidden md:flex items-center space-x-4'>
                        <button 
                            className={`p-2 rounded-full ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
                            onClick={toggleDarkMode}
                        >
                            {darkMode ? (
                                <Sun className='text-yellow-300' />
                            ) : (
                                <Moon className='text-gray-600' />
                            )}
                        </button>
                    </div>

                    <div className='flex md:hidden items-center'>
                        <button 
                            className={`p-2 rounded-full ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
                            onClick={toggleMenu}
                        >
                            {isMenuOpen ? (
                                <X className={darkMode ? 'text-white' : 'text-gray-600'} />
                            ) : (
                                <Menu className={darkMode ? 'text-white' : 'text-gray-600'} />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {isMenuOpen && (
                <div className={`md:hidden ${darkMode ? 'bg-cyberpunk-dark border-t border-neon-pink/30' : 'bg-white border-t border-gray-200'}`}>
                    <div className='px-2 pt-2 pb-3 space-y-1 sm-px-3'>
                        <button 
                            className={`flex items-center w-full px-3 py-2 rounded-md ${darkMode ? 'text-white hover:bg-gray-800' : 'text-gray-600 hover:bg-gray-100'}`}
                            onClick={toggleDarkMode}
                        >
                            {darkMode ? (
                                <>
                                    <Sun className='mr-2 text-yellow-300' />
                                    <span>Light Mode</span>
                                </>
                            ): (
                                <>
                                  <Moon className='mr-2' />
                                  <span>Dark Mode</span>  
                                </>
                            )}
                        </button>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;