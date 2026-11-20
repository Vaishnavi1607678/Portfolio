import { FOCUS } from "@/lib/content";
import SectionHead from "@/components/ui/SectionHead";

export default function Experience() {
  return (
    <section className="section" id="experience" aria-labelledby="exp-title">
      <div className="wrap">
        <SectionHead index="03" label="Experience" />
        <div className="exp" data-reveal>
          <p className="exp-date">
            August 2026 – Present
          </p>
          <div className="exp-body">
            <h2 id="exp-title" className="exp-role">
              Hajar AI <span>—</span> <em>Forward Deployed Engineer</em>
            </h2>
            <p className="exp-lede">
              Working between customer problems and engineering execution, translating fragmented workflows into
              production AI systems.
            </p>
            <p className="exp-tri" aria-label="FDE plus DevRel plus GTM">
              FDE <i>+</i> DevRel <i>+</i> GTM
            </p>
            <p className="meta-label">Focus areas</p>
            <ol className="focus">
              {FOCUS.map((f, i) => (
                <li key={f}>
                  <span>0{i + 1}</span>
                  {f}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
