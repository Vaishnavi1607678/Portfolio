import { CONTACT } from "@/lib/content";
import SectionHead from "@/components/ui/SectionHead";

export default function Contact() {
  return (
    <section className="section contact" id="contact" aria-labelledby="contact-title">
      <div className="wrap">
        <SectionHead index="06" label="Contact" />
        <h2 id="contact-title" className="display" data-reveal>
          Have something ambitious in mind? Let&rsquo;s <em>build</em>.
        </h2>
        <ul className="contact-list" data-reveal>
          {CONTACT.map((c) => (
            <li key={c.label}>
              <a href={c.url} target="_blank" rel="noopener noreferrer">
                <span className="meta-label">{c.label}</span>
                <span className="contact-text">{c.text}</span>
                <span className="contact-arrow" aria-hidden="true">
                  ↗
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
