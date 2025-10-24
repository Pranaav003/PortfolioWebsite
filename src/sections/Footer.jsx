const Footer = ({ currentSection, setCurrentSection }) => {
    const handleSectionChange = (section) => {
        setCurrentSection(section);
    };

    return (
      <div className="text-center flex flex-col items-center py-6 sm:py-8 px-4">
        <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-6 md:space-x-8">
          <button 
            onClick={() => handleSectionChange('home')} 
            className={`px-2 py-1 text-sm sm:text-base transition-opacity duration-200 ease-in-out hover:opacity-100 ${currentSection === 'home' ? 'opacity-100 font-semibold' : 'opacity-50'}`}
          >
            Home
          </button>
          <button 
            onClick={() => handleSectionChange('about')} 
            className={`px-2 py-1 text-sm sm:text-base transition-opacity duration-200 ease-in-out hover:opacity-100 ${currentSection === 'about' ? 'opacity-100 font-semibold' : 'opacity-50'}`}
          >
            Skillset
          </button>
          <button 
            onClick={() => handleSectionChange('portfolio')} 
            className={`px-2 py-1 text-sm sm:text-base transition-opacity duration-200 ease-in-out hover:opacity-100 ${currentSection === 'portfolio' ? 'opacity-100 font-semibold' : 'opacity-50'}`}
          >
            Portfolio
          </button>
          <button 
            onClick={() => handleSectionChange('contact')} 
            className={`px-2 py-1 text-sm sm:text-base transition-opacity duration-200 ease-in-out hover:opacity-100 ${currentSection === 'contact' ? 'opacity-100 font-semibold' : 'opacity-50'}`}
          >
            Contact
          </button>
        </div>
      </div>
    )
  }
  
  export default Footer