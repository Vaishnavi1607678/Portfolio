import Header from "@/components/sections/Header";
import Hero from "@/components/sections/Hero";
import Work from "@/components/sections/Work";
import Experience from "@/components/sections/Experience";
import About from "@/components/sections/About";
import Bring from "@/components/sections/Bring";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/sections/Footer";
import Reveal from "@/components/ui/Reveal";

export default function Home() {
  return (
    <>
      <Header />
      <main id="main">
        <Hero />
        <Work />
        <Experience />
        <About />
        <Bring />
        <Contact />
      </main>
      <Footer />
      <Reveal />
    </>
  );
}
