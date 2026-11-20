export default function Hero() {
  return (
    <section className="hero" id="top" aria-labelledby="hero-title">
      <p className="hero-idx">(01) Index — Technical creator · FDE · Growth</p>
      <p className="hero-meta">
        Developer GTM
        <br />
        AI Growth
        <br />
        Forward Deployed Engineering
      </p>
      <h1 id="hero-title" className="hero-name">
        <span className="clip">
          <span className="line a">Vaishnavi</span>
        </span>{" "}
        <span className="clip">
          <span className="line b">Tikke</span>
        </span>
      </h1>
      <div className="hero-body">
        <h2>
          I build, understand and <em>distribute</em> technology.
        </h2>
        <p>
          I work at the intersection of AI, developer tools, product engineering, and growth. I&rsquo;m an FDE and
          technical creator who turns complex technology into products, stories, and experiences people care about.
        </p>
        <div className="btns">
          <a className="btn primary" href="#work">
            View my work <span aria-hidden="true">↓</span>
          </a>
          <a className="btn" href="#contact">
            Let&rsquo;s connect <span aria-hidden="true">↗</span>
          </a>
        </div>
      </div>
      <ul className="proof" aria-label="Proof points">
        <li>
          <b>22K+</b>
          <small>X audience</small>
        </li>
        <li>
          <b>1M+</b>
          <small>Highest post views</small>
        </li>
        <li>
          <b className="t">AI × Developer Tools × GTM</b>
        </li>
      </ul>
    </section>
  );
}
