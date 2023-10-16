import { Footer, Hero, About, Portfolio, Contact } from './sections'; 
import Nav from './components/Nav';
import AboutContents from './components/AboutContents';
import Projects from './components/Projects'
import ContactBoxes from './components/ContactBoxes'

const App = () => (
  <main className = "relative dark:bg-black dark:text-white dark:bg-none">
      <Nav />
    <section className = "xl:padding-1 wide:padding-r padding-b">
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
    </section>
    <section className="padding">
      <Projects />
    </section>
    <section className="padding">
      <Contact />
    </section>
    <section className="padding">
      <ContactBoxes />
    </section>
    <section className="">
      <Footer />
    </section>
  </main>
)
export default App;