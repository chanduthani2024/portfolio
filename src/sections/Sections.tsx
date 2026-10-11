import { motion, useScroll, useTransform } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import {
  CountUp,
  Magnetic,
  Marquee,
  Reveal,
  SectionLabel,
  SplitText,
  Tilt,
  ease,
} from '../components/ui'
import {
  experience,
  heroStats,
  life,
  profile,
  projects,
  roles,
  runStats,
  skillGroups,
} from '../data/content'
import { scrollToId } from '../hooks/store'

/* ================= HERO ================= */
function Letters({ text, start, className }: { text: string; start: boolean; className?: string }) {
  return (
    <span className={`letters ${className ?? ''}`} aria-label={text}>
      {text.split('').map((c, i) => (
        <span className="mask" key={i} aria-hidden>
          <motion.span
            style={{ display: 'inline-block', transformOrigin: '50% 100%' }}
            initial={{ y: '115%', rotateX: -80, opacity: 0 }}
            animate={start ? { y: 0, rotateX: 0, opacity: 1 } : {}}
            transition={{ duration: 1.2, delay: i * 0.055, ease }}
          >
            {c}
          </motion.span>
        </span>
      ))}
    </span>
  )
}

export function Hero({ start }: { start: boolean }) {
  const [role, setRole] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setRole((r) => (r + 1) % roles.length), 2400)
    return () => clearInterval(id)
  }, [])

  return (
    <section id="hero" className="hero">
      <div className="hero__top">
        <motion.span
          className="mono hero__tag"
          initial={{ opacity: 0, y: 12 }}
          animate={start ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2, duration: 1, ease }}
        >
          <i className="live" /> Available for new work · {profile.location}
        </motion.span>
      </div>

      <h1 className="hero__title">
        <Letters text="CHANDU" start={start} />
        <br />
        <Letters text="THANI" start={start} className="outline" />
      </h1>

      <div className="hero__bottom">
        <motion.div
          className="hero__role"
          initial={{ opacity: 0 }}
          animate={start ? { opacity: 1 } : {}}
          transition={{ delay: 1, duration: 1 }}
        >
          <span className="serif">I’m a</span>
          <span className="hero__roles">
            {roles.map((r, i) => (
              <motion.em
                key={r}
                className="serif"
                animate={{ y: role === i ? '0%' : role === (i + 1) % roles.length ? '-110%' : '110%', opacity: role === i ? 1 : 0 }}
                transition={{ duration: 0.8, ease }}
              >
                {r}
              </motion.em>
            ))}
          </span>
        </motion.div>

        <motion.p
          className="hero__lede"
          initial={{ opacity: 0, y: 20 }}
          animate={start ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1.2, duration: 1, ease }}
        >
          I build data-heavy platforms end to end — from PLC sensors and PostgreSQL to the dashboards people actually
          open every morning.
        </motion.p>

        <motion.div
          className="hero__cta"
          initial={{ opacity: 0, y: 20 }}
          animate={start ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1.4, duration: 1, ease }}
        >
          <Magnetic>
            <button className="pill pill--solid pill--lg" onClick={() => scrollToId('projects')}>
              See my work <span>↘</span>
            </button>
          </Magnetic>
          <Magnetic>
            <a className="pill pill--lg" href={profile.linkedin} target="_blank" rel="noreferrer">
              LinkedIn <span>↗</span>
            </a>
          </Magnetic>
        </motion.div>
      </div>

      <motion.div
        className="hero__stats"
        initial={{ opacity: 0 }}
        animate={start ? { opacity: 1 } : {}}
        transition={{ delay: 1.7, duration: 1 }}
      >
        {heroStats.map((s) => (
          <div key={s.label}>
            <strong>{start ? <CountUp to={s.value} suffix={s.suffix} /> : `0${s.suffix}`}</strong>
            <span className="mono">{s.label}</span>
          </div>
        ))}
      </motion.div>

      <div className="hero__scroll mono">
        <i /> Scroll
      </div>
    </section>
  )
}

export function Strip() {
  return (
    <div className="strip">
      <Marquee items={['React', 'NestJS', 'PostgreSQL', 'TypeScript', 'Python', 'AWS', 'Angular', 'Django', 'Node.js']} />
    </div>
  )
}

/* ================= ABOUT ================= */
export function About() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['-8%', '8%'])

  return (
    <section id="about" className="section about">
      <div className="wrap about__grid">
        <div ref={ref} className="about__photo">
          <Tilt max={10} glare={false} className="bubblewrap">
            <div className="bubble">
              <motion.img src="/photos/avatar.jpg" alt="Illustrated portrait of Chandu Thani" style={{ y, scale: 1.12 }} loading="lazy" />
              <span className="bubble__shine" />
              <span className="bubble__iris" />
            </div>
            <i className="mini mini--a" />
            <i className="mini mini--b" />
            <i className="mini mini--c" />
          </Tilt>
          <span className="bubble__tag mono">Hyderabad · IN</span>
          <div className="about__badge" aria-hidden>
            <svg viewBox="0 0 120 120">
              <defs>
                <path id="circ" d="M60,60 m-46,0 a46,46 0 1,1 92,0 a46,46 0 1,1 -92,0" />
              </defs>
              <text>
                <textPath href="#circ">FULL-STACK • FLIPS • RUNS • CLIMBS •</textPath>
              </text>
            </svg>
            <b>✦</b>
          </div>
        </div>

        <div className="about__copy">
          <SectionLabel n="01">About</SectionLabel>
          <SplitText text="Hi, I’m Chandu — I build web apps and the data behind them." />
          <Reveal delay={0.1}>
            <p className="about__lead">
              I’m a full-stack engineer with 3+ years of experience building web apps, APIs and dashboards.
            </p>
            <p>
              At Divami, I look after a manufacturing analytics platform — from the NestJS APIs and PostgreSQL queries
              to the Angular screens people use every day.
            </p>
            <p>
              Outside work, I enjoy the gym, gymnastics, running and travelling.
            </p>
          </Reveal>
          <Reveal delay={0.2} className="about__facts">
            <div>
              <span className="mono">Based in</span>
              <strong>Hyderabad, India</strong>
            </div>
            <div>
              <span className="mono">Education</span>
              <strong>B.Tech, CMR Engineering College</strong>
            </div>
            <div>
              <span className="mono">Focus</span>
              <strong>APIs · Data · Dashboards</strong>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

/* ================= SKILLS ================= */
export function Skills() {
  return (
    <section id="skills" className="section skills">
      <div className="wrap">
        <SectionLabel n="02">Toolkit</SectionLabel>
        <SplitText text="A stack that spins in every direction." />
        <Reveal delay={0.1}>
          <p className="skills__hint mono">↻ Move your mouse — the sphere follows</p>
        </Reveal>
      </div>
      <div className="skills__spacer" aria-hidden />
      <div className="wrap skills__groups">
        {skillGroups.map((g, i) => (
          <Reveal key={g.title} delay={i * 0.06} className="chipgroup">
            <h3 className="mono">{g.title}</h3>
            <div>
              {g.items.map((s) => (
                <span key={s} className="chip">
                  {s}
                </span>
              ))}
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

/* ================= EXPERIENCE ================= */
export function Experience() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 70%', 'end 60%'] })
  const h = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])

  return (
    <section id="experience" className="section experience">
      <div className="wrap">
        <SectionLabel n="03">Experience</SectionLabel>
        <SplitText text="Production systems, owned end to end." />

        <div className="timeline" ref={ref}>
          <div className="timeline__rail">
            <motion.i style={{ height: h }} />
          </div>
          {experience.map((job) => (
            <Reveal key={job.title} className="job">
              <div className="job__meta">
                <span className="mono">{job.period}</span>
              </div>
              <div className="job__body">
                <h3>{job.title}</h3>
                <p className="job__org">{job.org}</p>
                <p className="job__blurb">{job.blurb}</p>
                <div className="job__projects">
                  {job.projects.map((p) => (
                    <Tilt key={p.name} max={4} className="jp">
                      <h4>{p.name}</h4>
                      <span className="mono">{p.stack}</span>
                      <ul>
                        {p.points.map((pt) => (
                          <li key={pt}>{pt}</li>
                        ))}
                      </ul>
                    </Tilt>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ================= PROJECTS ================= */
export function Projects() {
  return (
    <section id="projects" className="section projects">
      <div className="wrap">
        <SectionLabel n="04">Selected work</SectionLabel>
        <SplitText text="Things I’ve built, shipped and kept alive." />
        <div className="pgrid">
          {projects.map((p, i) => {
            const Card = (
              <Tilt className="pcard" max={8}>
                <div className="pcard__glow" style={{ background: p.hue }} />
                <div className="pcard__head">
                  <span className="pcard__idx" style={{ color: p.hue }}>
                    {p.index}
                  </span>
                  <span className="mono">{p.kind}</span>
                </div>
                <h3>{p.name}</h3>
                <p>{p.desc}</p>
                <ul className="pcard__metrics">
                  {p.metrics.map((m) => (
                    <li key={m} className="mono" style={{ borderColor: p.hue }}>
                      {m}
                    </li>
                  ))}
                </ul>
                <div className="pcard__tags">
                  {p.tags.map((t) => (
                    <span key={t}>{t}</span>
                  ))}
                </div>
                {p.href && (
                  <span className="pcard__go" style={{ background: p.hue }}>
                    Visit live <b>↗</b>
                  </span>
                )}
              </Tilt>
            )
            return (
              <Reveal key={p.name} delay={(i % 2) * 0.1} className={`pitem ${i === 0 ? 'pitem--wide' : ''}`}>
                {p.href ? (
                  <a href={p.href} target="_blank" rel="noreferrer" data-cursor="Open">
                    {Card}
                  </a>
                ) : (
                  Card
                )}
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}

/* ================= LIFE ================= */
function RunCard({ note }: { note: string }) {
  return (
    <div className="runcard">
      <span className="lcard__tag mono">Running</span>
      <svg className="runcard__route" viewBox="0 0 300 140" aria-hidden>
        <defs>
          <linearGradient id="rg" x1="0" x2="1">
            <stop offset="0" stopColor="#d6ff3f" />
            <stop offset="1" stopColor="#ff5a36" />
          </linearGradient>
        </defs>
        <path d="M10 120 C 50 110, 60 60, 105 70 S 160 130, 195 80 S 250 20, 290 30" fill="none" stroke="rgba(255,255,255,.1)" strokeWidth="10" strokeLinecap="round" />
        <motion.path
          d="M10 120 C 50 110, 60 60, 105 70 S 160 130, 195 80 S 250 20, 290 30"
          fill="none"
          stroke="url(#rg)"
          strokeWidth="4"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 2.2, ease }}
        />
        <circle cx="290" cy="30" r="6" fill="#ff5a36" />
      </svg>
      <div className="runcard__stats">
        {runStats.map((s) => (
          <div key={s.label}>
            <strong>
              {s.value}
              <small>{s.unit}</small>
            </strong>
            <span className="mono">{s.label}</span>
          </div>
        ))}
      </div>
      <p className="runcard__note">{note}</p>
    </div>
  )
}

export function Life() {
  return (
    <section id="life" className="section life">
      <div className="wrap">
        <SectionLabel n="05">Beyond the code</SectionLabel>
        <SplitText text="Gym. Gymnastics. Running. Mountains." />
        <Reveal delay={0.1}>
          <p className="life__lede">
            Debugging is a sport too — but these are the things that keep me sharp. Follow along on{' '}
            <a href={profile.instagram} target="_blank" rel="noreferrer" data-cursor="IG">
              Instagram ↗
            </a>
            .
          </p>
        </Reveal>

        <div className="lgrid">
          {life.map((l, i) => (
            <Reveal key={l.key} delay={(i % 4) * 0.08} className="litem">
              <Tilt max={6} className="lcard">
                {l.key === 'run' ? (
                  <RunCard note={l.note} />
                ) : l.key === 'ig' ? (
                  <a className="igcard" href={profile.instagram} target="_blank" rel="noreferrer" data-cursor="Follow">
                    <span className="lcard__tag mono">{l.tag}</span>
                    <b>↗</b>
                    <h3>{l.title}</h3>
                    <p>{l.note}</p>
                  </a>
                ) : (
                  <>
                    <img src={l.img} alt={`${l.tag}: ${l.title}`} loading="lazy" style={{ objectPosition: l.pos }} />
                    <div className="lcard__shade" />
                    <span className="lcard__tag mono">{l.tag}</span>
                    <div className="lcard__txt">
                      <h3>{l.title}</h3>
                      <p>{l.note}</p>
                    </div>
                  </>
                )}
              </Tilt>
            </Reveal>
          ))}
        </div>
      </div>
      <Marquee items={['Lift', 'Flip', 'Run', 'Climb', 'Travel', 'Repeat']} reverse />
    </section>
  )
}

/* ================= CONTACT ================= */
export function Contact() {
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      window.location.href = `mailto:${profile.email}`
    }
  }
  return (
    <section id="contact" className="section contact">
      <div className="wrap">
        <SectionLabel n="06">Contact</SectionLabel>
        <SplitText as="h2" className="contact__title" text="Let’s build something wild." />
        <Reveal delay={0.15} className="contact__row">
          <Magnetic>
            <button className="pill pill--solid pill--xl" onClick={copy} data-cursor="Copy">
              {copied ? 'Copied ✓' : profile.email}
            </button>
          </Magnetic>
          <div className="contact__links">
            <Magnetic>
              <a className="pill pill--lg" href={profile.linkedin} target="_blank" rel="noreferrer">
                LinkedIn ↗
              </a>
            </Magnetic>
            <Magnetic>
              <a className="pill pill--lg" href={profile.instagram} target="_blank" rel="noreferrer">
                Instagram ↗
              </a>
            </Magnetic>
            <Magnetic>
              <a className="pill pill--lg" href={profile.financeApp} target="_blank" rel="noreferrer">
                Finance app ↗
              </a>
            </Magnetic>
          </div>
        </Reveal>
      </div>
      <footer className="footer mono">
        <span>© {new Date().getFullYear()} Chandu Thani</span>
        <span>Designed &amp; built with React · Three.js · Framer Motion</span>
        <button onClick={() => scrollToId('hero')}>Back to top ↑</button>
      </footer>
    </section>
  )
}
