"use client";

import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { useEffect, useRef, useState } from "react";

// ─── Replace with your actual Google Form URL ────────────────────────────────
const GOOGLE_FORM_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLSdHwOqVmV0394UdKBF7h2VU2wGvcVHoe1A5MzIpaz7Ik4u9og/viewform?usp=publish-editor";

// ─── Replace with your actual event image path ───────────────────────────────
const EVENT_IMAGE =
  "https://osefawvokdseqiosdivb.supabase.co/storage/v1/object/public/images/Screenshot%202026-04-28%20113252.png";

const SPONSORS = ["Vittoria", "4Endurance", "ventro", "GOBIK"];

const STATS = [
  { value: "330", unit: "km", label: "Total Distance" },
  { value: "2700", unit: "hm", label: "Elevation Gain" },
  { value: "10+", unit: "hrs", label: "Time in Saddle" },
  { value: "28", unit: "km/h", label: "Avg Speed" },
];

export default function NduranceDay2026Page() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Mono:wght@400;500&family=Barlow:wght@300;400;600;700&display=swap');

        .nd-root {
          font-family: 'Barlow', sans-serif;
          background: #ffffff;
          color: #111111;
          overflow-x: hidden;
        }

        .nd-hero {
          position: relative;
          min-height: 92vh;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          overflow: hidden;
        }

        .nd-hero-img {
          position: absolute;
          inset: 0;
          background-image: url(${EVENT_IMAGE});
          background-size: cover;
          background-position: center 30%;
          filter: brightness(0.52) contrast(1.08);
        }

        .nd-hero-img::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(to bottom, transparent 25%, rgba(0,0,0,0.35) 60%, rgba(0,0,0,0.82) 100%);
        }

        .nd-date-pill {
          font-family: 'DM Mono', monospace;
          font-size: 0.72rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          background: #6B21E8;
          color: #fff;
          padding: 6px 14px;
          border-radius: 2px;
          display: inline-block;
        }

        .nd-hero-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(5rem, 16vw, 13rem);
          line-height: 0.9;
          color: #ffffff;
        }

        .nd-hero-title em { font-style: normal; color: #9B5CF6; }

        .nd-hero-sub {
          font-family: 'DM Mono', monospace;
          font-size: clamp(0.7rem, 1.4vw, 0.9rem);
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.6);
        }

        .nd-scroll-hint {
          position: absolute;
          bottom: 2rem;
          right: 2.5rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          opacity: 0.35;
        }

        .nd-scroll-hint span {
          font-family: 'DM Mono', monospace;
          font-size: 0.6rem;
          letter-spacing: 0.2em;
          writing-mode: vertical-rl;
          text-transform: uppercase;
          color: #fff;
        }

        .nd-scroll-line {
          width: 1px;
          height: 60px;
          background: linear-gradient(to bottom, #fff, transparent);
          animation: scrollDrop 1.8s ease-in-out infinite;
        }

        @keyframes scrollDrop {
          0%   { transform: scaleY(0); transform-origin: top; opacity: 1; }
          60%  { transform: scaleY(1); transform-origin: top; opacity: 1; }
          100% { transform: scaleY(1); transform-origin: bottom; opacity: 0; }
        }

        /* Stats bar — dark stripe */
        .nd-stats {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          background: #111111;
        }

        @media (max-width: 640px) {
          .nd-stats { grid-template-columns: repeat(2, 1fr); }
        }

        .nd-stat {
          padding: 2.2rem 1.5rem;
          border-right: 1px solid rgba(255,255,255,0.1);
        }

        .nd-stat:last-child { border-right: none; }

        .nd-stat-value {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(2.6rem, 5vw, 4rem);
          line-height: 1;
          color: #ffffff;
        }

        .nd-stat-unit {
          font-family: 'DM Mono', monospace;
          font-size: 0.7rem;
          color: #9B5CF6;
          margin-left: 4px;
        }

        .nd-stat-label {
          font-size: 0.72rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.38);
          margin-top: 0.2rem;
        }

        /* Light sections */
        .nd-section { padding: 5.5rem 0; }

        .nd-container {
          max-width: 1120px;
          margin: 0 auto;
          padding: 0 2rem;
        }

        .nd-section-label {
          font-family: 'DM Mono', monospace;
          font-size: 0.68rem;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          color: #6B21E8;
          margin-bottom: 0.75rem;
        }

        .nd-section-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(2.4rem, 6vw, 4.5rem);
          line-height: 1;
          color: #111111;
          margin-bottom: 1.25rem;
        }

        .nd-body {
          font-size: 1rem;
          line-height: 1.78;
          color: #5A5550;
          max-width: 52ch;
        }

        /* Timeline */
        .nd-timeline {
          display: flex;
          flex-direction: column;
          padding-left: 1.25rem;
          border-left: 2px solid #EAE6F0;
        }

        .nd-tl-item {
          padding: 1.1rem 0 1.1rem 1.5rem;
          position: relative;
        }

        .nd-tl-item::before {
          content: '';
          position: absolute;
          left: -6px;
          top: calc(1.1rem + 4px);
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: #fff;
          border: 2px solid #6B21E8;
        }

        .nd-tl-item.highlight::before {
          background: #6B21E8;
          box-shadow: 0 0 0 4px rgba(107,33,232,0.12);
        }

        .nd-tl-time {
          font-family: 'DM Mono', monospace;
          font-size: 0.68rem;
          letter-spacing: 0.15em;
          color: #6B21E8;
          margin-bottom: 3px;
        }

        .nd-tl-place {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 1.5rem;
          line-height: 1.1;
          color: #111111;
        }

        .nd-tl-desc {
          font-size: 0.8rem;
          color: #8A8480;
          margin-top: 2px;
        }

        .nd-tl-leg {
          padding: 0.3rem 0 0.3rem 1.5rem;
        }

        .nd-tl-leg .nd-tl-desc {
          font-style: italic;
          margin-top: 0;
        }

        /* Provide grid */
        .nd-provide-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1px;
          background: #E8E4E0;
          border: 1px solid #E8E4E0;
          margin-top: 2.5rem;
        }

        @media (max-width: 640px) {
          .nd-provide-grid { grid-template-columns: 1fr; }
        }

        .nd-provide-item {
          background: #ffffff;
          padding: 2rem 1.75rem;
          transition: background 0.2s;
        }

        .nd-provide-item:hover { background: #FAF8FF; }

        .nd-provide-icon { font-size: 1.4rem; margin-bottom: 0.7rem; }

        .nd-provide-name {
          font-weight: 700;
          font-size: 0.88rem;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: #111111;
          margin-bottom: 0.35rem;
        }

        .nd-provide-desc { font-size: 0.82rem; color: #8A8480; line-height: 1.55; }

        /* CTA — dark block */
        .nd-cta-block {
          background: #111111;
          position: relative;
          overflow: hidden;
          padding: 5rem 3.5rem;
        }

        .nd-cta-block::before {
          content: '';
          position: absolute;
          top: -100px; right: -100px;
          width: 400px; height: 400px;
          background: radial-gradient(circle, rgba(107,33,232,0.22) 0%, transparent 70%);
          pointer-events: none;
        }

        .nd-cta-distance {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(8rem, 20vw, 18rem);
          line-height: 0.85;
          color: rgba(255,255,255,0.04);
          position: absolute;
          bottom: -1.5rem; right: 1rem;
          pointer-events: none;
          user-select: none;
        }

        .nd-cta-block .nd-section-label { color: #9B5CF6; }
        .nd-cta-block .nd-section-title { color: #ffffff; }
        .nd-cta-block .nd-body { color: rgba(255,255,255,0.48); }

        /* Button */
        .nd-btn {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background: #6B21E8;
          color: #fff;
          font-family: 'Barlow', sans-serif;
          font-weight: 700;
          font-size: 0.88rem;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          padding: 1rem 2rem;
          border: none;
          cursor: pointer;
          text-decoration: none;
          transition: background 0.2s, transform 0.15s;
          border-radius: 2px;
        }

        .nd-btn:hover { background: #7C3AED; transform: translateY(-1px); }
        .nd-btn-arrow { transition: transform 0.2s; }
        .nd-btn:hover .nd-btn-arrow { transform: translateX(4px); }

        .nd-deadline {
          font-family: 'DM Mono', monospace;
          font-size: 0.7rem;
          letter-spacing: 0.14em;
          color: rgba(255,255,255,0.32);
          margin-top: 1rem;
        }

        .nd-deadline span { color: #9B5CF6; }

        /* Sponsors */
        .nd-sponsors {
          border-top: 1px solid #ECEAE6;
          padding: 2.25rem 0;
          display: flex;
          align-items: center;
          gap: 3rem;
          flex-wrap: wrap;
        }

        .nd-sponsor-label {
          font-family: 'DM Mono', monospace;
          font-size: 0.62rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #C0BAB4;
        }

        .nd-sponsor-name {
          font-weight: 700;
          font-size: 0.82rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: #C8C4C0;
          transition: color 0.2s;
        }

        .nd-sponsor-name:hover { color: #111111; }

        .nd-divider { border: none; border-top: 1px solid #ECEAE6; }

        .nd-disclaimer {
          font-family: 'DM Mono', monospace;
          font-size: 0.68rem;
          line-height: 1.7;
          color: #C8C4C0;
          border-top: 1px solid #ECEAE6;
          padding: 2.5rem 0;
        }

        /* Fade in */
        .nd-fade {
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.6s ease, transform 0.6s ease;
        }
        .nd-fade.visible { opacity: 1; transform: none; }

        @media (max-width: 768px) {
          .nd-two-col { grid-template-columns: 1fr !important; gap: 3rem !important; }
          .nd-cta-block { padding: 3rem 2rem; }
        }
      `}</style>
      <Navbar />
      <div className="nd-root">
        {/* HERO */}
        <section className="nd-hero">
          <div className="nd-hero-img" />
          <div
            className="nd-container"
            style={{ position: "relative", zIndex: 1, paddingBottom: "5rem" }}
          >
            <FadeIn delay={0}>
              <span className="nd-date-pill">May 25, 2026</span>
            </FadeIn>
            <FadeIn delay={80}>
              <h1 className="nd-hero-title" style={{ marginTop: "1rem" }}>
                <em>N</em>DUR<em>ANCE</em>
                <br />
                DAY
              </h1>
            </FadeIn>
            <FadeIn delay={150}>
              <p className="nd-hero-sub" style={{ marginTop: "1.25rem" }}>
                Dresden → Prague → Dresden &nbsp;·&nbsp; One Day &nbsp;·&nbsp;
                No Excuses
              </p>
            </FadeIn>
            <FadeIn delay={200}>
              <a
                href={GOOGLE_FORM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="nd-btn"
                style={{ marginTop: "2rem" }}
              >
                Register Now <span className="nd-btn-arrow">→</span>
              </a>
            </FadeIn>
          </div>
          <div className="nd-scroll-hint">
            <span>Scroll</span>
            <div className="nd-scroll-line" />
          </div>
        </section>

        {/* STATS */}
        <div className="nd-stats">
          {STATS.map(({ value, unit, label }, i) => (
            <FadeIn key={label} delay={i * 50}>
              <div className="nd-stat flex flex-col items-center justify-center text-center">
                <div>
                  <span className="nd-stat-value">{value}</span>
                  <span className="nd-stat-unit">{unit}</span>
                </div>
                <div className="nd-stat-label">{label}</div>
              </div>
            </FadeIn>
          ))}
        </div>

        {/* ABOUT + TIMELINE */}
        <section className="nd-section">
          <div className="nd-container">
            <div
              className="nd-two-col"
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "5rem",
                alignItems: "start",
              }}
            >
              <FadeIn>
                <p className="nd-section-label">The Challenge</p>
                <h2 className="nd-section-title">
                  Have you ever thought about it?
                </h2>
                <p className="nd-body">
                  Over 300 km. 2,700 meters of elevation. More than 10 hours in
                  the saddle — countless energy gels, bars, and carbs. On May
                  25, we set off for Prague with anyone who&apos;s up for it. We
                  ride there. Coffee at Karls Bridge. We ride back.
                </p>
                <p className="nd-body" style={{ marginTop: "1rem" }}>
                  Supported throughout — backed by our nutrition partner{" "}
                  <strong style={{ color: "#111111" }}>4Endurance</strong> on
                  gels and bars.
                </p>
              </FadeIn>

              <FadeIn delay={100}>
                <p className="nd-section-label">Route & Schedule</p>
                <div className="nd-timeline">
                  <div className="nd-tl-item">
                    <div className="nd-tl-time">08:00</div>
                    <div className="nd-tl-place">Theaterplatz DD</div>
                    <div className="nd-tl-desc">Rollout from Dresden</div>
                  </div>
                  <div className="nd-tl-leg">
                    <div className="nd-tl-desc">
                      ~165 km into Czech Republic
                    </div>
                  </div>
                  <div className="nd-tl-item highlight">
                    <div className="nd-tl-time">Midpoint · Prague</div>
                    <div className="nd-tl-place">Coffee Stop</div>
                    <div className="nd-tl-desc">Karls Bridge, Praha</div>
                  </div>
                  <div className="nd-tl-leg">
                    <div className="nd-tl-desc">~165 km return to Germany</div>
                  </div>
                  <div className="nd-tl-item">
                    <div className="nd-tl-time">21:00</div>
                    <div className="nd-tl-place">Theaterplatz DD</div>
                    <div className="nd-tl-desc">Finish. Done. Legendary.</div>
                  </div>
                </div>
              </FadeIn>
            </div>
          </div>
        </section>

        <hr className="nd-divider" />

        {/* PROVIDE */}
        <section className="nd-section" style={{ paddingTop: "4rem" }}>
          <div className="nd-container">
            <FadeIn>
              <p className="nd-section-label">What We Provide</p>
              <h2 className="nd-section-title">
                You Ride.
                <br />
                We Handle the Rest.
              </h2>
            </FadeIn>
            <FadeIn delay={80}>
              <div className="nd-provide-grid">
                {[
                  {
                    icon: "🍌",
                    name: "Nutrition",
                    desc: "Gels, bars & drinks at regular feed zones, supplied by 4Endurance.",
                  },
                  {
                    icon: "🔧",
                    name: "Technical Support",
                    desc: "Rolling mechanical backup so a flat tyre doesn't end your day.",
                  },
                  {
                    icon: "📸",
                    name: "Photo & Video",
                    desc: "Full ride documentation — memories worth the suffering.",
                  },
                ].map(({ icon, name, desc }) => (
                  <div className="nd-provide-item" key={name}>
                    <div className="nd-provide-icon">{icon}</div>
                    <div className="nd-provide-name">{name}</div>
                    <div className="nd-provide-desc">{desc}</div>
                  </div>
                ))}
              </div>
            </FadeIn>
          </div>
        </section>

        {/* CTA */}
        <section style={{ paddingBottom: "5rem" }}>
          <div className="nd-container">
            <FadeIn>
              <div className="nd-cta-block">
                <div className="nd-cta-distance">330</div>
                <p className="nd-section-label">Are you in?</p>
                <h2 className="nd-section-title">
                  Secure Your
                  <br />
                  Spot Now
                </h2>
                <p className="nd-body" style={{ marginBottom: "2rem" }}>
                  Spaces are limited. Registration closes May 20. By registering
                  you consent to photo and video documentation.
                </p>
                <a
                  href={GOOGLE_FORM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="nd-btn"
                >
                  Register on Google Forms{" "}
                  <span className="nd-btn-arrow">→</span>
                </a>
              </div>
            </FadeIn>
          </div>
        </section>

        {/* FOOTER */}
        <div className="nd-container">
          <div className="nd-sponsors">
            <span className="nd-sponsor-label">Partners</span>
            {SPONSORS.map((s) => (
              <span key={s} className="nd-sponsor-name">
                {s}
              </span>
            ))}
          </div>
          <div className="nd-disclaimer">
            By registering, participants consent to photo and video
            documentation of the event. NRC is not liable for personal injury or
            property damage occurring during the ride on May 25. Participation
            requires a roadworthy bicycle compliant with traffic regulations.
            Helmets, lights, and appropriate clothing are mandatory.
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

function FadeIn({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`nd-fade${visible ? " visible" : ""}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}
