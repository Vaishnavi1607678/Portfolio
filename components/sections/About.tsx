import SectionHead from "@/components/ui/SectionHead";

export default function About() {
  return (
    <section className="section" id="about" aria-labelledby="about-title">
      <div className="wrap">
        <SectionHead index="04" label="About" />
        <h2 id="about-title" className="display about-lead" data-reveal>
          I enjoy being where <em>technology</em> meets people.
        </h2>
        <div className="about-cols" data-reveal>
          <p>
            I explore emerging AI tools, understand how products work, build practical solutions, and communicate
            technical ideas to developer communities.
          </p>
          <p>My work combines engineering curiosity, product thinking, storytelling, and distribution.</p>
        </div>
      </div>
    </section>
  );
}
