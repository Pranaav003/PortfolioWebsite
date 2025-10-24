import { useState, useCallback } from 'react';
import { Footer, Hero, About, Contact } from "./sections";
import Nav from "./components/Nav";
import AboutContents from "./components/AboutContents";
import Projects from "./components/Projects";
import ContactBoxes from "./components/ContactBoxes";
import AnimatedCursor from "react-animated-cursor";

// Cursor Component with visibility limited to sm screens and larger
const newLocal = (
  <AnimatedCursor
    innerSize={8}
    outerSize={35}
    innerScale={1}
    outerScale={1.5} // Reduced the outer scale
    outerAlpha={0}
    hasBlendMode={true}
    innerStyle={{
      backgroundColor: "rgba(0,0,0,0.5)",
    }}
    outerStyle={{
      border: "3px solid rgb(255,255,255)",
    }}
    clickables={[
      'a',
      'input[type="text"]',
      'input[type="email"]',
      'input[type="number"]',
      'input[type="submit"]',
      'input[type="image"]',
      'label[for]',
      'select',
      'textarea',
      'button',
      '.link'
    ]}
    showSystemCursor={false}
    trailingSpeed={1}
    className="hidden sm:block" // Ensure cursor is hidden on screens smaller than sm
  />
);

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
