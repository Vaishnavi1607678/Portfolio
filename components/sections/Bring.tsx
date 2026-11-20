import { BRING } from "@/lib/content";
import SectionHead from "@/components/ui/SectionHead";

export default function Bring() {
  return (
    <section className="section" id="bring" aria-labelledby="bring-title">
      <div className="wrap">
        <SectionHead index="05" label="What I bring" />
        <h2 id="bring-title" className="sr-only">
          What I bring
        </h2>
        <ol className="bring" data-reveal>
          {BRING.map((b, i) => (
            <li key={b.name} tabIndex={0}>
              <span className="bring-n">0{i + 1}</span>
              <span className="bring-name">{b.name}</span>
              <span className="bring-line">{b.line}</span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
