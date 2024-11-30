import { Footer, Hero, About, Portfolio, Contact } from "./sections";
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

const App = () => (
  <main className="relative dark:bg-black dark:text-white dark:bg-none">
    {newLocal}
    <Nav />
    <section className="xl:padding-1 wide:padding-r padding-b">
      <Hero />
    </section>
    <section className="padding">
      <About />
    </section>
    <section className="padding">
      <AboutContents />
    </section>
    <section className="padding">
      <Portfolio />
      <Projects />
    </section>
    <section className="padding md:mt-[50px]">
      <Contact />
    </section>
    <section className="padding mt-[100px] md:mt-[250px]">
      <ContactBoxes />
    </section>
    <section className="padding">
      <Footer />
    </section>
  </main>
);

export default App;
