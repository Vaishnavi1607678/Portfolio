import { CONTRIBUTION, WORK } from "@/lib/content";
import SectionHead from "@/components/ui/SectionHead";

export default function Work() {
  return (
    <section className="section work" id="work" aria-labelledby="work-title">
      <div className="wrap">
        <SectionHead index="02" label="Selected work" />
        <h2 id="work-title" className="display" data-reveal>
          Work that <em>speaks</em> for itself.
        </h2>
        <p className="lede" data-reveal>
          Verified creator examples: original launch posts, with the views each earned on X.
        </p>
      </div>
      <ol className="work-list">
        {WORK.map((w, i) => (
          <li key={w.n} className={`entry e${i + 1}`} data-reveal>
            <article aria-labelledby={`w${w.n}`}>
              <span className="numeral" aria-hidden="true">
                {w.n}
              </span>
              <div className="entry-main">
                <p className="meta-label">Project {w.n}</p>
                <h3 id={`w${w.n}`}>{w.name}</h3>
                <p className="entry-text">{w.text}</p>
                <p className="contrib">
                  <span className="meta-label">My contribution</span>
                  {CONTRIBUTION}
                </p>
              </div>
              <div className="metric">
                <b>{w.views}</b>
                <small>views on X</small>
                <a className="textlink" href={w.url} target="_blank" rel="noopener noreferrer">
                  <span className="sr-only">{w.name}: </span>View original post <span aria-hidden="true">↗</span>
                </a>
              </div>
            </article>
          </li>
        ))}
      </ol>
    </section>
  );
}
