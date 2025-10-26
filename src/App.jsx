import { useState, useCallback } from 'react';
import { Footer, Hero, About, Contact } from "./sections";
import Nav from "./components/Nav";
import AboutContents from "./components/AboutContents";
import Projects from "./components/Projects";
import ContactBoxes from "./components/ContactBoxes";
import AnimatedCursor from "react-animated-cursor";

const App = () => {
  const [currentSection, setCurrentSection] = useState('home');
  const [isMobile, setIsMobile] = useState(false);

const App = () => {
  const [currentSection, setCurrentSection] = useState('home');

  const handleSectionChange = useCallback((section) => {
    setCurrentSection(section);
  }, []);

  const renderSection = () => {
    switch (currentSection) {
      case 'home':
        return (
          <section key="home" className="xl:padding-1 wide:padding-r padding-b">
            <Hero />
          </section>
        );
      case 'about':
        return (
          <div key="about">
            <section className="padding">
              <About />
            </section>
            <section>
              <AboutContents />
            </section>
          </div>
        );
      case 'portfolio':
        return (
          <section key="portfolio" className="padding">
            <Projects />
          </section>
        );
      case 'contact':
        return (
          <div key="contact">
            <section className="padding">
              <Contact />
            </section>
            <section>
              <ContactBoxes />
            </section>
          </div>
        );
      default:
        return (
          <section key="home" className="xl:padding-1 wide:padding-r padding-b">
            <Hero />
          </section>
        );
    }
  };

  return (
    <main className="relative dark:bg-black dark:text-white dark:bg-none min-h-screen flex flex-col">
      {newLocal}
      <Nav currentSection={currentSection} setCurrentSection={handleSectionChange} />
      <div className="flex-1 flex flex-col transition-all duration-300 ease-in-out">
        {renderSection()}
      </div>
      <section className="padding">
        <Footer currentSection={currentSection} setCurrentSection={handleSectionChange} />
      </section>
    </main>
  );
};

export default App;
