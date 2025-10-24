import React, { useState } from 'react';

const Nav = ({ currentSection, setCurrentSection }) => {
    const [isOpen, setIsOpen] = useState(false)

    const handleSectionChange = (section) => {
        setCurrentSection(section);
        setIsOpen(false);
    };

    return (
      <header className="relative flex justify-between items-center px-4 sm:px-6 md:px-8 lg:px-11 py-6 sm:py-8 md:py-10 w-full font-inter font-bold text-base sm:text-lg" style={{ zIndex: 1 }}>  
        <button 
            onClick={() => handleSectionChange('home')}
            className="hover:text-gray-600 transition-colors duration-200 text-sm sm:text-base md:text-lg"
        >
            Made By Pranaav.
        </button>

        <div className="relative flex items-center">
            <button onClick={() => setIsOpen((prev) => !prev)} className="bg-slate-200 dark:bg-gray-700 w-20 sm:w-24 justify-start rounded-md px-2 sm:px-3 py-2 text-xs sm:text-sm font-bold text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 hover:bg-gray-300 dark:hover:bg-gray-600" id="menu-button" aria-expanded="true" aria-haspopup="true">
                <p className="pr-3 sm:pr-5">Menu</p>
                {!isOpen ? (
                    <img className="absolute h-4 w-4 sm:h-5 sm:w-5 left-12 sm:left-16 bottom-1.5 sm:bottom-2" src="/openMenu.png" alt="openMenu"></img>
                ): (
                    <img className="absolute h-3 w-3 left-12 sm:left-16 bottom-2 sm:bottom-2.5" src="/closeMenu.png" alt = "closeMenu"></img>
                )
            }
            </button>
    

            {isOpen && (
                <div className= "absolute -top-2 right-0 z-10 mt-12 w-48 sm:w-56 origin-top-right divide-y divide-gray-100 dark:divide-gray-700 rounded-md bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 dark:ring-gray-600 focus:outline-none" role="menu" aria-orientation="vertical" aria-labelledby="menu-button" tabIndex="-1">
                    <div className="py-1" role="none">
                        <button 
                            onClick={() => handleSectionChange('home')} 
                            className={`text-gray-700 dark:text-gray-300 block px-4 py-2 text-sm hover:bg-slate-200 dark:hover:bg-gray-700 rounded-full w-full text-left ${currentSection === 'home' ? 'bg-slate-100 dark:bg-gray-700 font-semibold' : ''}`}
                            role="menuitem" 
                            tabIndex="-1" 
                            id="menu-item-0"
                        >
                            Home
                        </button>
                    </div>
                    <div className="py-1" role="none">
                        <button 
                            onClick={() => handleSectionChange('about')} 
                            className={`text-gray-700 dark:text-gray-300 block px-4 py-2 text-sm hover:bg-slate-200 dark:hover:bg-gray-700 rounded-full w-full text-left ${currentSection === 'about' ? 'bg-slate-100 dark:bg-gray-700 font-semibold' : ''}`}
                            role="menuitem" 
                            tabIndex="-1" 
                            id="menu-item-1"
                        >
                            Skillset
                        </button>
                    </div>
                    <div className="py-1" role="none">
                        <button 
                            onClick={() => handleSectionChange('portfolio')} 
                            className={`text-gray-700 dark:text-gray-300 block px-4 py-2 text-sm hover:bg-slate-200 dark:hover:bg-gray-700 rounded-full w-full text-left ${currentSection === 'portfolio' ? 'bg-slate-100 dark:bg-gray-700 font-semibold' : ''}`}
                            role="menuitem" 
                            tabIndex="-1" 
                            id="menu-item-2"
                        >
                            Portfolio
                        </button>
                    </div>
                    <div className="py-1" role="none">
                        <button 
                            onClick={() => handleSectionChange('contact')} 
                            className={`text-gray-700 dark:text-gray-300 block px-4 py-2 text-sm hover:bg-slate-200 dark:hover:bg-gray-700 rounded-full w-full text-left ${currentSection === 'contact' ? 'bg-slate-100 dark:bg-gray-700 font-semibold' : ''}`}
                            role="menuitem" 
                            tabIndex="-1" 
                            id="menu-item-4"
                        >
                            Contact
                        </button>
                    </div>
                </div>
            )}
        </div>
      </header>
    )
  }

export default Nav