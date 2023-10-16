import {navLinks} from '../constants';
import React, { useState } from 'react';

const Nav = () => {
    const [isOpen, setIsOpen] = useState(false)

    return (
      <header id="home" className="relative inline-flex px-11 py-10 w-full font-inter font-bold text-lg" style={{ zIndex: 1 }}>  
        Made By Pranaav.


        <div className="relative flex-1 flex justify-end items-center left-2">
            <button onClick={() => setIsOpen((prev) => !prev)} class="bg-slate-200 absolute w-24 justify-start rounded-md px-3 py-2 text-sm font-bold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-300" id="menu-button" aria-expanded="true" aria-haspopup="true">
                <p style={{ paddingRight: '20px' }}>Menu</p>
                {!isOpen ? (
                    <img className="absolute h-5 w-5 left-16 bottom-[7.5px]" src="/openMenu.png" alt="openMenu"></img>
                ): (
                    <img className="absolute h-3 w-3 left-[67px] bottom-[11px]" src="/closeMenu.png" alt = "closeMenu"></img>
                )
            }
            </button>
    

            {isOpen && (
                <div className= "absolute -top-2 right-1 z-10 mt-12 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none" role="menu" aria-orientation="vertical" aria-labelledby="menu-button" tabIndex="-1">
                    <div className="py-1" role="none">
                        <a href="#home" className="text-gray-700 block px-4 py-2 text-sm hover:bg-slate-200 rounded-full" role="menuitem" tabIndex="-1" id="menu-item-0">Home</a>
                    </div>
                    <div className="py-1" role="none">
                        <a href="#about" className="text-gray-700 block px-4 py-2 text-sm hover:bg-slate-200 rounded-full" role="menuitem" tabIndex="-1" id="menu-item-1">About</a>
                    </div>
                    <div className="py-1" role="none">
                        <a href="#portfolio" className="text-gray-700 block px-4 py-2 text-sm hover:bg-slate-200 rounded-full" role="menuitem" tabIndex="-1" id="menu-item-2">Portfolio</a>
                    </div>
                    <div className="py-1" role="none">
                        <a href="#contact" className="text-gray-700 block px-4 py-2 text-sm hover:bg-slate-200 rounded-full" role="menuitem" tabIndex="-1" id="menu-item-4">Contact</a>
                    </div>
                </div>
            )}
        </div>
      </header>
    )
  }

export default Nav