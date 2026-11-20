import Cursor from "@/components/ui/Cursor";
import Header from "@/components/ui/Header";
import Hero from "@/components/sections/Hero";
import Work from "@/components/sections/Work";
import FieldNotes from "@/components/sections/FieldNotes";
import GrowthLab from "@/components/sections/GrowthLab";
import About from "@/components/sections/About";
import Approach from "@/components/sections/Approach";
import Fredrin from "@/components/sections/Fredrin";
import Contact from "@/components/sections/Contact";

export default function Home() {
  return (
    <>
      <Header />
      <Cursor />
      <main>
        <Hero />
        <Work />
        <FieldNotes />
        <GrowthLab />
        <About />
        <Approach />
        <Fredrin />
        <Contact />
      </main>
    </>
  );
}
