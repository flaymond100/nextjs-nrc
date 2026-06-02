import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { Loader } from "@/components/loader";
import { useAuth } from "@/contexts/auth-context";
import { supabase } from "@/utils/supabase";
import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const RACE_DATE = new Date("2026-06-07T09:00:00");


const RACE_STATS = [
  { value: "64.4", unit: "km", label: "Race Distance" },
  { value: "250", unit: "hm", label: "Elevation Gain" },
  { value: "~1:35", unit: "h", label: "Est. Duration" },
  { value: "60–80", unit: "g/h", label: "Carb Target" },
];

const OVERVIEW_ITEMS = [
  { key: "Race Distance", val: "64.4 km", note: "#nsc60 — Amateur race" },
  { key: "Start", val: "09:00", note: "Line-up from 08:45" },
  {
    key: "Location",
    val: "Neuseenland",
    note: "Störmthaler & Markkleberger See",
  },
  {
    key: "Elevation",
    val: "250 hm",
    note: "Flat profile — highest point 160 m",
  },
  { key: "Est. Duration", val: "~1:35 h", note: "At ~40 km/h race pace" },
  { key: "Nutrition", val: "60–80 g/h", note: "Carbs via gel + drink bottles" },
  { key: "Drink Bottles", val: "1–1.5 L", note: "Pre-fill with carb mix" },
  { key: "Weather", val: "18–22°C", note: "Light westerly wind, increasing" },
];

const TEAM_GOALS = [
  "Win the race — this is our home race",
  "At least 2 riders on the podium",
  "Win the team category",
  "Race without crashes — clean and controlled",
  "Deliver for our sponsors — next year's deals depend on it",
];

const RACE_GOALS = [
  "Attack from the gun with our 5 strongest",
  "Split the peloton and keep the gap open",
  "Organised work in the break until 20km to go",
  "Final 20km: attack 1 by 1 — force responses",
  "At least one NRC rider wins or podiums",
];

const ATTACK_SQUAD = ["Anton", "Kosta", "Christoph", "Kevin", "Simon"];
const SPRINTERS = ["Silvio", "Robert"];

const RACE_PHASES = [
  {
    phase: "01",
    title: "From the Gun",
    km: "0 – 10 km",
    detail:
      "Anton, Kosta, Christoph, Kevin, Simon attack immediately. The rest of the team sit in behind, protect position, and ensure we have numbers at the front. Goal: form a lead group fast.",
    critical: false,
  },
  {
    phase: "02",
    title: "Split the Peloton",
    km: "10 – 44 km",
    detail:
      "Keep the pressure high and hold the gap open. Riders in the break must NOT follow each other — if one NRC rider attacks, the others do NOT chase. Let it play out. Controlled, disciplined work.",
    critical: true,
  },
  {
    phase: "03",
    title: "Hold & Fuel",
    km: "Until 44 km to go",
    detail:
      "Once the break is established, take disciplined turns. Keep the gap growing. No wasted energy — save it for the finale. This is the window to eat your gel and stay sharp.",
    critical: false,
  },
  {
    phase: "04",
    title: "Final Attacks",
    km: "Last 20 km",
    detail:
      "Attack 1 by 1. Each attack forces the break to respond and chase — burning their matches. Eventually someone from NRC will be off the front alone. Don't look back. Don't wait.",
    critical: true,
  },
];

const STRATEGY_TIPS = [
  {
    icon: "🚫",
    title: "The Golden Rule",
    tip: "Do NOT attack AND do NOT follow each other. If one NRC rider goes, the others stay. No exceptions.",
  },
  {
    icon: "💨",
    title: "Wind Edge",
    tip: "Watch for crosswind splits near the finish — stay alert and don't get caught on the wrong side.",
  },
  {
    icon: "🍌",
    title: "Stay Fuelled",
    tip: "Gel every 40 min during the race. Don't let nutrition slip in the heat of racing.",
  },
];

const PACKLIST = [
  { id: "baselayer", text: "Baselayer", cat: "Kit" },
  { id: "jersey-ss", text: "Short Sleeve Jersey (NRC)", cat: "Kit" },
  { id: "bib", text: "Bib Shorts", cat: "Kit" },
  { id: "helmet", text: "Helmet", cat: "Kit" },
  { id: "jersey-ls", text: "Long Sleeve Jersey (warm-up)", cat: "Kit" },
  { id: "vest", text: "Vest (warm-up)", cat: "Kit" },
  { id: "shoes", text: "Cycling Shoes", cat: "Kit" },
  { id: "sunglasses", text: "Sunglasses", cat: "Kit" },
  { id: "sunscreen", text: "Sun Protection", cat: "Kit" },
  {
    id: "computer",
    text: "Cycling Computer (fully charged)",
    cat: "Electronics",
  },
  { id: "hr", text: "Chest Strap (heart rate)", cat: "Electronics" },
  { id: "lights", text: "Lights", cat: "Electronics" },
  { id: "pins", text: "Safety Pins (race number)", cat: "Race Day" },
  { id: "license", text: "Race License / ID", cat: "Race Day" },
  {
    id: "bottles",
    text: "Drink Bottles (filled with carbs)",
    cat: "Nutrition",
  },
  { id: "gels", text: "Energy Gels (min. 3)", cat: "Nutrition" },
  { id: "bars", text: "Energy Bars (backup)", cat: "Nutrition" },
  { id: "change", text: "Change of Clothes", cat: "After Race" },
  { id: "towel", text: "Towel", cat: "After Race" },
  { id: "cash", text: "Cash / Payment Card", cat: "After Race" },
];

const PACK_CATS = [
  "Kit",
  "Electronics",
  "Race Day",
  "Nutrition",
  "After Race",
] as const;

const NUTRITION_TIMELINE = [
  {
    time: "06:00",
    action: "Breakfast + Creatine + Beta-alanine",
    detail: "~135g carbs, 3h before start. Keep fat & fibre low.",
    type: "normal",
  },
  {
    time: "06:30",
    action: "Nitrates — 2× Beetroot Shots",
    detail:
      "~12–16 mmol. 2.5h before = peak plasma nitrite at the gun. No antibacterial mouthwash — regular toothpaste only.",
    type: "normal",
  },
  {
    time: "07:30",
    action: "Sodium Bicarbonate",
    detail:
      "0.2–0.3 g/kg (14–22g) + 500ml water + small snack. Peak buffering at ~09:00. Worth it — flat races are full of repeated surges and a sprint finish.",
    type: "key",
  },
  {
    time: "08:00",
    action: "Caffeine 200mg",
    detail:
      "60 min before. Peaks ~08:45–09:15, covering start and first half. Half-life of 3–5h covers the whole ~2h race.",
    type: "normal",
  },
  {
    time: "08:40",
    action: "Pre-Race Gel #1 — 25g carbs",
    detail: "CNS priming + tops off blood glucose for a fast start.",
    type: "key",
  },
  {
    time: "09:00",
    action: "RACE START",
    detail:
      "Flat & fast — expect a hard bunch from the gun. Stay fuelled, stay in the wheels.",
    type: "race",
  },
  {
    time: "~09:40 · km 30",
    action: "Gel #2 — 25g carbs",
    detail:
      "Take on a settled stretch — never during a surge or technical section.",
    type: "normal",
  },
  {
    time: "~10:20 · km 55",
    action: "Gel #3 — 25g carbs (optional)",
    detail:
      "Only if the race runs past ~90 min. Skip if you're already in the final run-in.",
    type: "optional",
  },
];

const SUPPLEMENTS = [
  {
    icon: "🌱",
    name: "Nitrates",
    detail: "2× beetroot shots (~12–16 mmol)",
    time: "06:30 — 2.5h before",
  },
  {
    icon: "💊",
    name: "Bicarb",
    detail: "0.2–0.3 g/kg + 500ml water + snack",
    time: "07:30 — 90 min before",
  },
  {
    icon: "☕",
    name: "Caffeine",
    detail: "200mg single dose",
    time: "08:00 — 60 min before",
  },
  {
    icon: "💊",
    name: "Creatine",
    detail: "Normal daily dose",
    time: "With breakfast",
  },
  {
    icon: "💊",
    name: "Beta-alanine",
    detail: "Normal daily dose",
    time: "With breakfast",
  },
];

const BREAKFAST_ITEMS = [
  { item: "80g granola", carbs: "~55g" },
  { item: "1 large banana", carbs: "~27g" },
  { item: "2 tbsp jam", carbs: "~28g" },
  { item: "150g skyr", carbs: "~8g" },
  { item: "200ml apple juice", carbs: "~20g" },
];

const TABS = [
  { id: "overview",  label: "Race Overview", icon: "🗺" },
  { id: "strategy",  label: "Strategy",      icon: "🎯" },
  { id: "weather",   label: "Weather",       icon: "🌤" },
  { id: "nutrition", label: "Nutrition",     icon: "🍌" },
  { id: "packlist",  label: "Pack List",     icon: "🎒" },
];

// ── Weather helpers ────────────────────────────────────────────
function wmoLabel(code: number): { text: string; emoji: string } {
  if (code === 0)  return { text: "Clear sky",     emoji: "☀️" };
  if (code <= 3)   return { text: "Partly cloudy", emoji: "⛅" };
  if (code <= 48)  return { text: "Foggy",         emoji: "🌫" };
  if (code <= 55)  return { text: "Light drizzle", emoji: "🌦" };
  if (code <= 65)  return { text: "Rain",          emoji: "🌧" };
  if (code <= 82)  return { text: "Showers",       emoji: "🌦" };
  return { text: "Thunderstorm", emoji: "⛈" };
}

function degToCompass(deg: number): string {
  const dirs = ["N","NNE","NE","ENE","E","ESE","SE","SSE","S","SSW","SW","WSW","W","WNW","NW","NNW"];
  return dirs[Math.round(deg / 22.5) % 16];
}

interface WeatherHour {
  time: string;
  temp: number;
  windSpeed: number;
  windDir: number;
  rainPct: number;
  code: number;
}

interface WeatherDaily {
  tempMax: number;
  tempMin: number;
  windMax: number;
  windDir: number;
  rainMax: number;
  code: number;
}

type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

function getTimeLeft(): TimeLeft {
  const diff = RACE_DATE.getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000) / 60000),
    seconds: Math.floor((diff % 60000) / 1000),
  };
}

export default function NSC2026Page() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [accessGranted, setAccessGranted] = useState(false);
  const [checkingAccess, setCheckingAccess] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(getTimeLeft);
  const [checked, setChecked] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem("nsc26-packlist");
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch {
      return new Set();
    }
  });

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      navigate("/login");
      setCheckingAccess(false);
      return;
    }
    supabase
      .schema("private")
      .from("riders")
      .select("isActivated")
      .eq("uuid", user.id)
      .single()
      .then(({ data, error }) => {
        if (error || !data?.isActivated) {
          navigate("/forbidden");
        } else {
          setAccessGranted(true);
        }
        setCheckingAccess(false);
      });
  }, [user, authLoading, navigate]);

  useEffect(() => {
    const id = setInterval(() => setTimeLeft(getTimeLeft()), 1000);
    return () => clearInterval(id);
  }, []);

  const toggleCheck = useCallback((id: string) => {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      try {
        localStorage.setItem("nsc26-packlist", JSON.stringify([...next]));
      } catch {
        // ignore
      }
      return next;
    });
  }, []);

  if (authLoading || checkingAccess) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (!accessGranted) return null;

  const doneCount = checked.size;
  const totalCount = PACKLIST.length;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Mono:wght@400;500&family=Barlow:wght@300;400;600;700&display=swap');

        .nsc-root {
          font-family: 'Barlow', sans-serif;
          background: #ffffff;
          color: #111111;
          overflow-x: hidden;
        }

        /* ── HERO ───────────────────────────────────────────────── */
        .nsc-hero {
          position: relative;
          min-height: 67vh;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          overflow: hidden;
          background:
            linear-gradient(140deg, rgba(13,0,32,0.82) 0%, rgba(28,0,72,0.75) 45%, rgba(66,0,135,0.68) 100%),
            url('/image/team-picture-white.webp') center center / cover no-repeat;
        }

        .nsc-hero-bg {
          position: absolute;
          inset: 0;
          background:
            radial-gradient(ellipse at 85% 10%, rgba(140, 80, 255, 0.15) 0%, transparent 55%),
            radial-gradient(ellipse at 15% 90%, rgba(66, 0, 135, 0.25) 0%, transparent 50%);
          pointer-events: none;
        }

        .nsc-hero::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px);
          background-size: 56px 56px;
          pointer-events: none;
        }

        .nsc-badge {
          font-family: 'DM Mono', monospace;
          font-size: 0.62rem;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.18);
          color: rgba(255,255,255,0.65);
          padding: 5px 12px;
          border-radius: 2px;
          display: inline-block;
        }

        .nsc-date-pill {
          font-family: 'DM Mono', monospace;
          font-size: 0.72rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          background: #420087;
          color: #fff;
          padding: 6px 14px;
          border-radius: 2px;
          display: inline-block;
          margin-left: 0.6rem;
        }

        .nsc-hero-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(4.5rem, 15vw, 12.5rem);
          line-height: 0.88;
          color: #ffffff;
          margin-top: 1.1rem;
          letter-spacing: 0.02em;
        }

        .nsc-hero-title em {
          font-style: normal;
          color: #b575ff;
        }

        .nsc-hero-sub {
          font-family: 'DM Mono', monospace;
          font-size: clamp(0.62rem, 1.2vw, 0.8rem);
          letter-spacing: 0.24em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.45);
          margin-top: 1.25rem;
        }

        /* Countdown */
        .nsc-countdown {
          display: flex;
          gap: 0.75rem;
          margin-top: 2.5rem;
          flex-wrap: wrap;
        }

        .nsc-countdown-block {
          display: flex;
          flex-direction: column;
          align-items: center;
          background: rgba(255,255,255,0.07);
          border: 1px solid rgba(255,255,255,0.12);
          padding: 1.1rem 1.4rem;
          min-width: 86px;
          backdrop-filter: blur(6px);
        }

        .nsc-countdown-value {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 3.2rem;
          line-height: 1;
          color: #ffffff;
          letter-spacing: 0.04em;
        }

        .nsc-countdown-label {
          font-family: 'DM Mono', monospace;
          font-size: 0.56rem;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.38);
          margin-top: 0.3rem;
        }

        /* Scroll hint */
        .nsc-scroll-hint {
          position: absolute;
          bottom: 2rem;
          right: 2.5rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          opacity: 0.3;
          pointer-events: none;
        }

        .nsc-scroll-hint span {
          font-family: 'DM Mono', monospace;
          font-size: 0.6rem;
          letter-spacing: 0.2em;
          writing-mode: vertical-rl;
          text-transform: uppercase;
          color: #fff;
        }

        .nsc-scroll-line {
          width: 1px;
          height: 60px;
          background: linear-gradient(to bottom, #fff, transparent);
          animation: nscScrollDrop 1.8s ease-in-out infinite;
        }

        @keyframes nscScrollDrop {
          0%   { transform: scaleY(0); transform-origin: top; opacity: 1; }
          60%  { transform: scaleY(1); transform-origin: top; opacity: 1; }
          100% { transform: scaleY(1); transform-origin: bottom; opacity: 0; }
        }

        /* ── STATS BAR ──────────────────────────────────────────── */
        .nsc-stats-bar {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          background: #0f0f0f;
        }

        @media (max-width: 640px) {
          .nsc-stats-bar { grid-template-columns: repeat(2, 1fr); }
        }

        .nsc-stat {
          padding: 2rem 1.5rem;
          border-right: 1px solid rgba(255,255,255,0.07);
          text-align: center;
        }

        .nsc-stat:last-child { border-right: none; }

        .nsc-stat-value {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(2.2rem, 4.5vw, 3.5rem);
          line-height: 1;
          color: #ffffff;
        }

        .nsc-stat-unit {
          font-family: 'DM Mono', monospace;
          font-size: 0.65rem;
          color: rgba(255,255,255,0.4);
          margin-left: 4px;
        }

        .nsc-stat-label {
          font-size: 0.66rem;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.3);
          margin-top: 0.25rem;
        }

        /* ── SECTION & CONTAINER ────────────────────────────────── */
        .nsc-section {
          padding: 4.5rem 0 6rem;
        }

        .nsc-container {
          max-width: 1100px;
          margin: 0 auto;
          padding: 0 2rem;
        }

        /* ── TABS ───────────────────────────────────────────────── */
        .nsc-tab-nav {
          display: flex;
          border-bottom: 2px solid #EAE6F0;
          margin-bottom: 3rem;
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none;
        }

        .nsc-tab-nav::-webkit-scrollbar { display: none; }

        .nsc-tab-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 1rem 1.5rem;
          font-family: 'Barlow', sans-serif;
          font-weight: 600;
          font-size: 0.85rem;
          letter-spacing: 0.07em;
          text-transform: uppercase;
          color: #aaa;
          background: none;
          border: none;
          border-bottom: 2px solid transparent;
          margin-bottom: -2px;
          cursor: pointer;
          white-space: nowrap;
          transition: color 0.2s;
        }

        .nsc-tab-btn:hover { color: #420087; }

        .nsc-tab-btn.active {
          color: #420087;
          border-bottom-color: #420087;
        }

        .nsc-tab-icon { font-size: 1rem; }

        .nsc-tab-panel {
          animation: nscFadeTab 0.22s ease;
        }

        @keyframes nscFadeTab {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: none; }
        }

        /* ── SHARED LABELS / TITLES ─────────────────────────────── */
        .nsc-section-label {
          font-family: 'DM Mono', monospace;
          font-size: 0.67rem;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          color: #420087;
          margin-bottom: 0.65rem;
        }

        .nsc-section-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(2.2rem, 5vw, 3.8rem);
          line-height: 1;
          color: #111111;
          margin-bottom: 1rem;
        }

        /* ── SCHEDULE TIMELINE ──────────────────────────────────── */
        .nsc-timeline {
          max-width: 680px;
          padding-left: 1.25rem;
          border-left: 2px solid #EAE6F0;
        }

        .nsc-tl-item {
          position: relative;
          padding: 0.9rem 0 0.9rem 1.5rem;
        }

        .nsc-tl-item::before {
          content: '';
          position: absolute;
          left: -7px;
          top: calc(0.9rem + 5px);
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: #fff;
          border: 2px solid #420087;
        }

        .nsc-tl-item.highlight::before {
          background: #420087;
          box-shadow: 0 0 0 5px rgba(66, 0, 135, 0.14);
          width: 14px;
          height: 14px;
          left: -8px;
        }

        .nsc-tl-time {
          font-family: 'DM Mono', monospace;
          font-size: 0.7rem;
          letter-spacing: 0.15em;
          color: #420087;
          margin-bottom: 2px;
        }

        .nsc-tl-label {
          font-weight: 700;
          font-size: 0.93rem;
          color: #111;
          line-height: 1.3;
        }

        .nsc-tl-item.highlight .nsc-tl-label {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 1.35rem;
          letter-spacing: 0.05em;
          font-weight: 400;
        }

        .nsc-tl-desc {
          font-size: 0.78rem;
          color: #8A8480;
          margin-top: 2px;
        }

        /* ── RACE OVERVIEW GRID ─────────────────────────────────── */
        .nsc-overview-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1px;
          background: #E8E4E0;
          border: 1px solid #E8E4E0;
          margin-top: 2rem;
        }

        @media (max-width: 580px) {
          .nsc-overview-grid { grid-template-columns: 1fr; }
        }

        .nsc-overview-row {
          background: #fff;
          padding: 1.5rem 2rem;
          transition: background 0.2s;
        }

        .nsc-overview-row:hover { background: #FAF8FF; }

        .nsc-overview-key {
          font-family: 'DM Mono', monospace;
          font-size: 0.62rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #aaa;
          margin-bottom: 0.35rem;
        }

        .nsc-overview-val {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 1.9rem;
          color: #111;
          line-height: 1;
        }

        .nsc-overview-note {
          font-size: 0.76rem;
          color: #8A8480;
          margin-top: 3px;
        }

        .nsc-wind-alert {
          margin-top: 2rem;
          padding: 1.4rem 1.75rem;
          background: #FAF8FF;
          border: 1px solid #E0D8F0;
          border-left: 4px solid #420087;
        }

        .nsc-wind-alert-title {
          font-family: 'DM Mono', monospace;
          font-size: 0.65rem;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: #420087;
          margin-bottom: 0.5rem;
        }

        .nsc-wind-alert-body {
          font-size: 0.88rem;
          color: #444;
          line-height: 1.65;
        }

        /* ── STRATEGY ───────────────────────────────────────────── */
        .nsc-strategy-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
          margin-top: 2rem;
        }

        @media (max-width: 640px) {
          .nsc-strategy-grid { grid-template-columns: 1fr; }
        }

        .nsc-strategy-card {
          border: 1px solid #EAE6F0;
          padding: 1.75rem 2rem;
          transition: box-shadow 0.2s;
        }

        .nsc-strategy-card:hover {
          box-shadow: 0 4px 24px rgba(66, 0, 135, 0.08);
        }

        .nsc-strategy-card-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 1.25rem;
          color: #420087;
          margin-bottom: 1.2rem;
          letter-spacing: 0.06em;
        }

        .nsc-strategy-item {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          padding: 0.6rem 0;
          border-bottom: 1px solid #F2EFF8;
          font-size: 0.87rem;
          color: #333;
          line-height: 1.45;
        }

        .nsc-strategy-item:last-child { border-bottom: none; }

        .nsc-strategy-bullet {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #420087;
          flex-shrink: 0;
          margin-top: 7px;
        }

        .nsc-tips-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1px;
          background: #E8E4E0;
          border: 1px solid #E8E4E0;
          margin-top: 1.75rem;
        }

        @media (max-width: 640px) {
          .nsc-tips-grid { grid-template-columns: 1fr; }
        }

        .nsc-tip-item {
          background: #fff;
          padding: 1.5rem 1.75rem;
          transition: background 0.2s;
        }

        .nsc-tip-item:hover { background: #FAF8FF; }

        .nsc-tip-icon { font-size: 1.5rem; margin-bottom: 0.6rem; }

        .nsc-tip-title {
          font-weight: 700;
          font-size: 0.82rem;
          letter-spacing: 0.07em;
          text-transform: uppercase;
          color: #111;
          margin-bottom: 0.35rem;
        }

        .nsc-tip-body { font-size: 0.8rem; color: #8A8480; line-height: 1.55; }

        /* ── STRATEGY — extended ────────────────────────────────── */
        .nsc-golden-rule {
          background: linear-gradient(135deg, #1a0040, #420087);
          padding: 1.75rem 2rem;
          margin-bottom: 2.5rem;
          display: flex;
          align-items: flex-start;
          gap: 1.25rem;
        }

        .nsc-golden-rule-icon {
          font-size: 2rem;
          line-height: 1;
          flex-shrink: 0;
        }

        .nsc-golden-rule-label {
          font-family: 'DM Mono', monospace;
          font-size: 0.62rem;
          letter-spacing: 0.24em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.5);
          margin-bottom: 0.3rem;
        }

        .nsc-golden-rule-text {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(1.3rem, 3vw, 2rem);
          color: #fff;
          line-height: 1.1;
          letter-spacing: 0.04em;
        }

        .nsc-golden-rule-sub {
          font-size: 0.82rem;
          color: rgba(255,255,255,0.55);
          margin-top: 0.4rem;
          line-height: 1.55;
        }

        /* Attack squad */
        .nsc-squad-row {
          display: flex;
          flex-wrap: wrap;
          gap: 0.6rem;
          margin: 1rem 0 2.5rem;
        }

        .nsc-squad-badge {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 1.1rem;
          letter-spacing: 0.08em;
          color: #fff;
          background: #420087;
          padding: 0.45rem 1.1rem;
          border-radius: 2px;
        }

        .nsc-squad-badge.support {
          background: transparent;
          border: 1px solid #D0C8E0;
          color: #888;
          font-family: 'Barlow', sans-serif;
          font-size: 0.82rem;
          font-weight: 600;
          letter-spacing: 0.06em;
          padding: 0.45rem 1rem;
        }

        /* Race phases */
        .nsc-phases {
          display: flex;
          flex-direction: column;
          gap: 1px;
          background: #E8E4E0;
          border: 1px solid #E8E4E0;
          margin-bottom: 2.5rem;
        }

        .nsc-phase {
          background: #fff;
          padding: 1.5rem 2rem;
          display: grid;
          grid-template-columns: 56px 1fr;
          gap: 1.25rem;
          align-items: start;
          transition: background 0.2s;
        }

        .nsc-phase:hover { background: #FAF8FF; }

        .nsc-phase.critical { border-left: 3px solid #420087; }

        .nsc-phase-num {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 2.2rem;
          color: #E8E4F0;
          line-height: 1;
        }

        .nsc-phase.critical .nsc-phase-num { color: #C4B0E0; }

        .nsc-phase-km {
          font-family: 'DM Mono', monospace;
          font-size: 0.62rem;
          letter-spacing: 0.18em;
          color: #420087;
          margin-bottom: 0.3rem;
        }

        .nsc-phase-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 1.35rem;
          color: #111;
          line-height: 1;
          margin-bottom: 0.5rem;
          letter-spacing: 0.04em;
        }

        .nsc-phase-detail {
          font-size: 0.86rem;
          color: #5A5550;
          line-height: 1.62;
        }

        /* Why it matters */
        .nsc-why-card {
          background: #0f0f0f;
          padding: 2rem;
          margin-bottom: 2rem;
          position: relative;
          overflow: hidden;
        }

        .nsc-why-card::before {
          content: '';
          position: absolute;
          top: -60px; right: -60px;
          width: 260px; height: 260px;
          background: radial-gradient(circle, rgba(66,0,135,0.28) 0%, transparent 70%);
          pointer-events: none;
        }

        .nsc-why-label {
          font-family: 'DM Mono', monospace;
          font-size: 0.62rem;
          letter-spacing: 0.24em;
          text-transform: uppercase;
          color: #420087;
          margin-bottom: 0.5rem;
        }

        .nsc-why-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(1.8rem, 4vw, 2.8rem);
          color: #fff;
          line-height: 1;
          margin-bottom: 0.85rem;
        }

        .nsc-why-body {
          font-size: 0.88rem;
          color: rgba(255,255,255,0.55);
          line-height: 1.7;
          max-width: 58ch;
          position: relative;
        }

        @media (max-width: 640px) {
          .nsc-phase { grid-template-columns: 1fr; gap: 0.5rem; }
          .nsc-phase-num { font-size: 1.4rem; }
          .nsc-golden-rule { flex-direction: column; gap: 0.75rem; }
        }

        /* ── WEATHER TAB ────────────────────────────────────────── */
        .nsc-wx-summary {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1px;
          background: #E8E4E0;
          border: 1px solid #E8E4E0;
          margin: 1.5rem 0 2rem;
        }

        @media (max-width: 580px) {
          .nsc-wx-summary { grid-template-columns: 1fr; }
        }

        .nsc-wx-cell {
          background: #fff;
          padding: 1.5rem 1.75rem;
          transition: background 0.2s;
        }

        .nsc-wx-cell:hover { background: #FAF8FF; }

        .nsc-wx-cell-label {
          font-family: 'DM Mono', monospace;
          font-size: 0.62rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #aaa;
          margin-bottom: 0.35rem;
        }

        .nsc-wx-cell-val {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 2rem;
          line-height: 1;
          color: #111;
        }

        .nsc-wx-cell-note {
          font-size: 0.76rem;
          color: #8A8480;
          margin-top: 3px;
        }

        /* Hourly strip */
        .nsc-wx-hourly {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(90px, 1fr));
          gap: 1px;
          background: #E8E4E0;
          border: 1px solid #E8E4E0;
          margin-bottom: 1.5rem;
        }

        .nsc-wx-hour {
          background: #fff;
          padding: 1rem 0.75rem;
          text-align: center;
          transition: background 0.2s;
        }

        .nsc-wx-hour:hover { background: #FAF8FF; }

        .nsc-wx-hour.race-time {
          background: #FAF8FF;
          border-top: 3px solid #420087;
        }

        .nsc-wx-hour-time {
          font-family: 'DM Mono', monospace;
          font-size: 0.62rem;
          letter-spacing: 0.14em;
          color: #420087;
          margin-bottom: 0.3rem;
        }

        .nsc-wx-hour.race-time .nsc-wx-hour-time { font-weight: 700; }

        .nsc-wx-hour-emoji { font-size: 1.3rem; margin-bottom: 0.25rem; }

        .nsc-wx-hour-temp {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 1.3rem;
          color: #111;
          line-height: 1;
        }

        .nsc-wx-hour-wind {
          font-size: 0.72rem;
          color: #8A8480;
          margin-top: 0.2rem;
        }

        .nsc-wx-hour-rain {
          font-family: 'DM Mono', monospace;
          font-size: 0.62rem;
          color: #3b82f6;
          margin-top: 0.15rem;
        }

        /* Wind compass */
        .nsc-wx-compass-wrap {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          padding: 1.5rem;
          background: #fff;
          border: 1px solid #EAE6F0;
          margin-bottom: 1.5rem;
          flex-wrap: wrap;
        }

        .nsc-wx-compass {
          width: 80px;
          height: 80px;
          position: relative;
          flex-shrink: 0;
        }

        .nsc-wx-compass-ring {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          border: 2px solid #EAE6F0;
          position: absolute;
          inset: 0;
        }

        .nsc-wx-compass-label {
          position: absolute;
          font-family: 'DM Mono', monospace;
          font-size: 0.55rem;
          font-weight: 700;
          color: #aaa;
        }

        .nsc-wx-compass-label.n { top: 2px; left: 50%; transform: translateX(-50%); }
        .nsc-wx-compass-label.s { bottom: 2px; left: 50%; transform: translateX(-50%); }
        .nsc-wx-compass-label.e { right: 3px; top: 50%; transform: translateY(-50%); }
        .nsc-wx-compass-label.w { left: 3px; top: 50%; transform: translateY(-50%); }

        .nsc-wx-loading {
          text-align: center;
          padding: 4rem 0;
          color: #aaa;
          font-family: 'DM Mono', monospace;
          font-size: 0.78rem;
          letter-spacing: 0.15em;
        }

        .nsc-wx-error {
          padding: 1.5rem;
          background: #fffbeb;
          border: 1px solid #fde68a;
          color: #92400e;
          font-size: 0.85rem;
          border-radius: 4px;
        }

        /* ── PACKLIST ───────────────────────────────────────────── */
        .nsc-pack-meta {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 0.45rem;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .nsc-pack-progress-label {
          font-family: 'DM Mono', monospace;
          font-size: 0.67rem;
          letter-spacing: 0.16em;
          color: #420087;
        }

        .nsc-pack-reset-btn {
          font-family: 'DM Mono', monospace;
          font-size: 0.62rem;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #bbb;
          background: none;
          border: none;
          cursor: pointer;
          padding: 0;
          transition: color 0.2s;
        }

        .nsc-pack-reset-btn:hover { color: #420087; }

        .nsc-pack-progress-bar {
          height: 4px;
          background: #EAE6F0;
          border-radius: 2px;
          margin-bottom: 2.5rem;
          overflow: hidden;
        }

        .nsc-pack-progress-fill {
          height: 100%;
          background: linear-gradient(to right, #420087, #7C3AED);
          border-radius: 2px;
          transition: width 0.4s ease;
        }

        .nsc-pack-cat-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 1.05rem;
          letter-spacing: 0.1em;
          color: #420087;
          margin: 1.75rem 0 0.6rem;
          padding-bottom: 0.4rem;
          border-bottom: 1px solid #EAE6F0;
        }

        .nsc-pack-cat-title:first-of-type { margin-top: 0; }

        .nsc-pack-item {
          display: flex;
          align-items: center;
          gap: 0.9rem;
          padding: 0.65rem 0;
          cursor: pointer;
          user-select: none;
          transition: opacity 0.2s;
        }

        .nsc-pack-item.done { opacity: 0.45; }

        .nsc-pack-checkbox {
          width: 22px;
          height: 22px;
          border: 2px solid #D0C8E0;
          border-radius: 4px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.18s, border-color 0.18s;
          background: #fff;
        }

        .nsc-pack-item.done .nsc-pack-checkbox {
          background: #420087;
          border-color: #420087;
        }

        .nsc-pack-checkmark {
          color: #fff;
          font-size: 12px;
          opacity: 0;
          transition: opacity 0.15s;
          line-height: 1;
        }

        .nsc-pack-item.done .nsc-pack-checkmark { opacity: 1; }

        .nsc-pack-text {
          font-size: 0.89rem;
          color: #222;
        }

        .nsc-pack-item.done .nsc-pack-text {
          text-decoration: line-through;
          color: #bbb;
        }

        .nsc-pack-complete {
          margin-top: 2rem;
          padding: 1.75rem 2rem;
          background: linear-gradient(135deg, #420087, #7C3AED);
          text-align: center;
        }

        .nsc-pack-complete-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 2.2rem;
          letter-spacing: 0.1em;
          color: #fff;
        }

        .nsc-pack-complete-sub {
          font-family: 'DM Mono', monospace;
          font-size: 0.68rem;
          letter-spacing: 0.22em;
          color: rgba(255,255,255,0.6);
          margin-top: 0.3rem;
        }

        /* ── FADE IN ────────────────────────────────────────────── */
        .nsc-fade {
          opacity: 0;
          transform: translateY(18px);
          transition: opacity 0.6s ease, transform 0.6s ease;
        }

        .nsc-fade.visible { opacity: 1; transform: none; }

        /* ── NUTRITION TAB ──────────────────────────────────────── */
        .nsc-ntl-item {
          position: relative;
          padding: 0 0 1.4rem 1.5rem;
        }

        .nsc-ntl-item:last-child { padding-bottom: 0; }

        .nsc-ntl-item::before {
          content: '';
          position: absolute;
          left: -7px;
          top: 5px;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: #fff;
          border: 2px solid #420087;
          z-index: 1;
        }

        .nsc-ntl-item.key::before {
          background: #420087;
          box-shadow: 0 0 0 4px rgba(66,0,135,0.14);
          width: 14px;
          height: 14px;
          left: -8px;
        }

        .nsc-ntl-item.race::before {
          background: #dc2626;
          border-color: #dc2626;
          box-shadow: 0 0 0 4px rgba(220,38,38,0.15);
          width: 14px;
          height: 14px;
          left: -8px;
        }

        .nsc-ntl-item.optional::before {
          background: #fff;
          border-color: #aaa;
        }

        .nsc-ntl-time {
          font-family: 'DM Mono', monospace;
          font-size: 0.68rem;
          letter-spacing: 0.15em;
          color: #420087;
          margin-bottom: 2px;
        }

        .nsc-ntl-item.race .nsc-ntl-time { color: #dc2626; }
        .nsc-ntl-item.optional .nsc-ntl-time { color: #999; }

        .nsc-ntl-action {
          font-weight: 700;
          font-size: 0.92rem;
          color: #111;
        }

        .nsc-ntl-item.race .nsc-ntl-action {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 1.3rem;
          color: #dc2626;
          font-weight: 400;
        }

        .nsc-ntl-item.optional .nsc-ntl-action { color: #888; }

        .nsc-ntl-detail {
          font-size: 0.8rem;
          color: #8A8480;
          margin-top: 2px;
          line-height: 1.55;
          max-width: 58ch;
        }

        /* Supplement grid */
        .nsc-supp-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(185px, 1fr));
          gap: 1px;
          background: #E8E4E0;
          border: 1px solid #E8E4E0;
          margin-top: 1.5rem;
        }

        .nsc-supp {
          background: #fff;
          padding: 1.25rem 1.5rem;
          transition: background 0.2s;
        }

        .nsc-supp:hover { background: #FAF8FF; }

        .nsc-supp-icon { font-size: 1.2rem; margin-bottom: 0.4rem; }

        .nsc-supp-name {
          font-weight: 700;
          font-size: 0.87rem;
          color: #111;
          margin-bottom: 0.2rem;
        }

        .nsc-supp-detail {
          font-size: 0.78rem;
          color: #8A8480;
          line-height: 1.45;
        }

        .nsc-supp-time {
          font-family: 'DM Mono', monospace;
          font-size: 0.68rem;
          letter-spacing: 0.12em;
          color: #420087;
          margin-top: 0.4rem;
        }

        /* Breakfast table */
        .nsc-meal-table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 1rem;
          font-size: 0.88rem;
        }

        .nsc-meal-table tr {
          border-bottom: 1px solid #F2EFF8;
        }

        .nsc-meal-table tr:last-child { border-bottom: none; }

        .nsc-meal-table td {
          padding: 0.6rem 0;
          color: #444;
        }

        .nsc-meal-table td:last-child {
          text-align: right;
          font-weight: 700;
          color: #420087;
          font-family: 'DM Mono', monospace;
          font-size: 0.8rem;
        }

        .nsc-meal-total {
          font-size: 0.78rem;
          font-family: 'DM Mono', monospace;
          letter-spacing: 0.12em;
          color: #420087;
          margin-top: 0.75rem;
          padding-top: 0.5rem;
          border-top: 2px solid #EAE6F0;
          text-align: right;
        }

        /* Alert cards */
        .nsc-alert {
          border-radius: 4px;
          padding: 1.1rem 1.4rem;
          font-size: 0.85rem;
          line-height: 1.65;
          margin-top: 1rem;
        }

        .nsc-alert-title {
          font-weight: 700;
          font-size: 0.87rem;
          margin-bottom: 0.3rem;
          display: block;
        }

        .nsc-alert.green {
          background: #f0fdf4;
          border: 1px solid #bbf7d0;
          color: #166534;
        }

        .nsc-alert.amber {
          background: #fffbeb;
          border: 1px solid #fde68a;
          color: #92400e;
        }

        /* In-race fuel summary */
        .nsc-fuel-row {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          padding: 0.65rem 0;
          border-bottom: 1px solid #F2EFF8;
          font-size: 0.87rem;
          gap: 1rem;
        }

        .nsc-fuel-row:last-child { border-bottom: none; }

        .nsc-fuel-label { color: #333; }

        .nsc-fuel-val {
          font-weight: 700;
          color: #420087;
          font-family: 'DM Mono', monospace;
          font-size: 0.8rem;
          white-space: nowrap;
        }

        /* Two-col layout for nutrition */
        .nsc-nutr-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2.5rem;
          align-items: start;
          margin-top: 2rem;
        }

        @media (max-width: 720px) {
          .nsc-nutr-grid { grid-template-columns: 1fr; gap: 2rem; }
          .nsc-supp-grid { grid-template-columns: 1fr 1fr; }
        }

        .nsc-sub-label {
          font-family: 'DM Mono', monospace;
          font-size: 0.65rem;
          letter-spacing: 0.24em;
          text-transform: uppercase;
          color: #420087;
          margin-bottom: 0.5rem;
        }

        .nsc-sub-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 1.5rem;
          color: #111;
          margin-bottom: 1rem;
          line-height: 1;
        }

        /* ── RESPONSIVE ─────────────────────────────────────────── */
        @media (max-width: 768px) {
          .nsc-countdown-block { min-width: 72px; padding: 0.9rem 1rem; }
          .nsc-countdown-value { font-size: 2.6rem; }
          .nsc-tab-btn { padding: 0.85rem 1rem; font-size: 0.78rem; }
        }
      `}</style>
      <Navbar />
      <div className="nsc-root">
        {/* ── HERO ─────────────────────────────────────────────── */}
        <section className="nsc-hero">
          <div className="nsc-hero-bg" />
          <div className="nsc-scroll-hint">
            <span>Scroll</span>
            <div className="nsc-scroll-line" />
          </div>
          <div
            className="nsc-container"
            style={{ position: "relative", zIndex: 1, paddingBottom: "4.5rem" }}
          >
            <FadeIn delay={0}>
              <span className="nsc-badge">Race Prep · Members Only</span>
              <span className="nsc-date-pill">June 7, 2026</span>
            </FadeIn>
            <FadeIn delay={80}>
              <h1 className="nsc-hero-title">
                NEUSEEN
                <br />
                <em>CLASSICS</em>
              </h1>
            </FadeIn>
            <FadeIn delay={145}>
              <p className="nsc-hero-sub">
                PŸUR Neuseen Classics &nbsp;·&nbsp; Leipziger Neuseenland
                &nbsp;·&nbsp; #nsc60 &nbsp;·&nbsp; 64.4 km
              </p>
            </FadeIn>
            <FadeIn delay={210}>
              <div className="nsc-countdown">
                {(
                  [
                    { v: timeLeft.days, l: "Days" },
                    { v: timeLeft.hours, l: "Hours" },
                    { v: timeLeft.minutes, l: "Min" },
                    { v: timeLeft.seconds, l: "Sec" },
                  ] as const
                ).map(({ v, l }) => (
                  <div key={l} className="nsc-countdown-block">
                    <span className="nsc-countdown-value">
                      {String(v).padStart(2, "0")}
                    </span>
                    <span className="nsc-countdown-label">{l}</span>
                  </div>
                ))}
              </div>
            </FadeIn>
          </div>
        </section>

        {/* ── STATS BAR ────────────────────────────────────────── */}
        <div className="nsc-stats-bar">
          {RACE_STATS.map(({ value, unit, label }, i) => (
            <FadeIn key={label} delay={i * 60}>
              <div className="nsc-stat">
                <div>
                  <span className="nsc-stat-value">{value}</span>
                  <span className="nsc-stat-unit">&thinsp;{unit}</span>
                </div>
                <div className="nsc-stat-label">{label}</div>
              </div>
            </FadeIn>
          ))}
        </div>

        {/* ── TABS ─────────────────────────────────────────────── */}
        <section className="nsc-section">
          <div className="nsc-container">
            <nav className="nsc-tab-nav" role="tablist">
              {TABS.map((t) => (
                <button
                  key={t.id}
                  role="tab"
                  aria-selected={activeTab === t.id}
                  className={`nsc-tab-btn${activeTab === t.id ? " active" : ""}`}
                  onClick={() => setActiveTab(t.id)}
                >
                  <span className="nsc-tab-icon">{t.icon}</span>
                  {t.label}
                </button>
              ))}
            </nav>

            {/* key triggers re-animation on tab switch */}
            <div key={activeTab} className="nsc-tab-panel">
              {activeTab === "overview"  && <OverviewTab />}
              {activeTab === "strategy"  && <StrategyTab />}
              {activeTab === "weather"   && <WeatherTab />}
              {activeTab === "nutrition" && <NutritionTab />}
              {activeTab === "packlist" && (
                <PacklistTab
                  checked={checked}
                  toggle={toggleCheck}
                  done={doneCount}
                  total={totalCount}
                  onReset={() => {
                    setChecked(new Set());
                    try {
                      localStorage.removeItem("nsc26-packlist");
                    } catch {
                      // ignore
                    }
                  }}
                />
              )}
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}

/* ── TAB CONTENTS ─────────────────────────────────────────────── */

function WeatherTab() {
  const [hourly, setHourly] = useState<WeatherHour[]>([]);
  const [daily, setDaily] = useState<WeatherDaily | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const url =
      "https://api.open-meteo.com/v1/forecast" +
      "?latitude=51.27&longitude=12.38" +
      "&hourly=temperature_2m,wind_speed_10m,wind_direction_10m,precipitation_probability,weather_code" +
      "&daily=temperature_2m_max,temperature_2m_min,wind_speed_10m_max,wind_direction_10m_dominant,precipitation_probability_max,weather_code" +
      "&timezone=Europe%2FBerlin" +
      "&start_date=2026-06-07&end_date=2026-06-07";

    fetch(url)
      .then((r) => r.json())
      .then((data) => {
        setDaily({
          tempMax: Math.round(data.daily.temperature_2m_max[0]),
          tempMin: Math.round(data.daily.temperature_2m_min[0]),
          windMax: Math.round(data.daily.wind_speed_10m_max[0]),
          windDir: data.daily.wind_direction_10m_dominant[0],
          rainMax: data.daily.precipitation_probability_max[0],
          code: data.daily.weather_code[0],
        });

        const hours: WeatherHour[] = [];
        (data.hourly.time as string[]).forEach((t, i) => {
          const h = parseInt(t.slice(11, 13));
          if (h >= 5 && h <= 12) {
            hours.push({
              time: t.slice(11, 16),
              temp: Math.round(data.hourly.temperature_2m[i]),
              windSpeed: Math.round(data.hourly.wind_speed_10m[i]),
              windDir: Math.round(data.hourly.wind_direction_10m[i]),
              rainPct: data.hourly.precipitation_probability[i],
              code: data.hourly.weather_code[i],
            });
          }
        });
        setHourly(hours);
        setLoading(false);
      })
      .catch(() => { setError(true); setLoading(false); });
  }, []);

  if (loading) return <div className="nsc-wx-loading">Fetching live forecast…</div>;
  if (error || !daily) return (
    <div className="nsc-wx-error">
      ⚠ Could not load forecast. Check your connection or try again later.
    </div>
  );

  const { text: condText, emoji: condEmoji } = wmoLabel(daily.code);
  const windFrom = degToCompass(daily.windDir);

  return (
    <div>
      <p className="nsc-section-label">Live Forecast · June 7, 2026</p>
      <h2 className="nsc-section-title">Weather & Wind</h2>
      <p style={{ color: "#8A8480", fontSize: "0.85rem", marginBottom: "0.5rem", lineHeight: 1.6 }}>
        Störmthaler & Markkleberger See · Leipzig · sourced from Open-Meteo
      </p>

      {/* Daily summary grid */}
      <div className="nsc-wx-summary">
        <div className="nsc-wx-cell">
          <div className="nsc-wx-cell-label">Condition</div>
          <div className="nsc-wx-cell-val">{condEmoji} {condText}</div>
          <div className="nsc-wx-cell-note">All-day outlook</div>
        </div>
        <div className="nsc-wx-cell">
          <div className="nsc-wx-cell-label">Temperature</div>
          <div className="nsc-wx-cell-val">{daily.tempMin}° – {daily.tempMax}°C</div>
          <div className="nsc-wx-cell-note">Min / Max for race day</div>
        </div>
        <div className="nsc-wx-cell">
          <div className="nsc-wx-cell-label">Wind</div>
          <div className="nsc-wx-cell-val">{daily.windMax} km/h</div>
          <div className="nsc-wx-cell-note">Peak — from {windFrom} ({daily.windDir}°)</div>
        </div>
        <div className="nsc-wx-cell">
          <div className="nsc-wx-cell-label">Rain Chance</div>
          <div className="nsc-wx-cell-val" style={{ color: daily.rainMax > 40 ? "#2563eb" : "#111" }}>
            {daily.rainMax}%
          </div>
          <div className="nsc-wx-cell-note">{daily.rainMax <= 20 ? "Looks dry 👍" : daily.rainMax <= 50 ? "Low risk" : "Pack a vest"}</div>
        </div>
      </div>

      {/* Wind compass */}
      <div className="nsc-wx-compass-wrap">
        <div className="nsc-wx-compass">
          <div className="nsc-wx-compass-ring" />
          <span className="nsc-wx-compass-label n">N</span>
          <span className="nsc-wx-compass-label s">S</span>
          <span className="nsc-wx-compass-label e">E</span>
          <span className="nsc-wx-compass-label w">W</span>
          <svg viewBox="0 0 80 80" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
            {/* Arrow points in direction wind is blowing TO */}
            <g transform={`rotate(${daily.windDir}, 40, 40)`}>
              <polygon points="40,12 44,40 40,36 36,40" fill="#420087" opacity="0.9" />
              <polygon points="40,68 44,40 40,44 36,40" fill="#D0C8E0" />
            </g>
            <circle cx="40" cy="40" r="3" fill="#420087" />
          </svg>
        </div>
        <div>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#420087", marginBottom: "0.35rem" }}>
            Dominant wind direction
          </div>
          <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.6rem", color: "#111", lineHeight: 1 }}>
            From {windFrom} at {daily.windMax} km/h
          </div>
          <div style={{ fontSize: "0.8rem", color: "#8A8480", marginTop: "0.4rem", maxWidth: "40ch", lineHeight: 1.55 }}>
            A crosswind split may form near the finish — stay alert and don&apos;t get caught on the wrong side.
          </div>
        </div>
      </div>

      {/* Hourly breakdown */}
      <p className="nsc-sub-label">Hour by Hour · Race Window</p>
      <div className="nsc-wx-hourly">
        {hourly.map((h) => {
          const isRace = h.time >= "09:00" && h.time <= "11:00";
          const { emoji } = wmoLabel(h.code);
          return (
            <div key={h.time} className={`nsc-wx-hour${isRace ? " race-time" : ""}`}>
              <div className="nsc-wx-hour-time">{h.time}{isRace ? " 🏁" : ""}</div>
              <div className="nsc-wx-hour-emoji">{emoji}</div>
              <div className="nsc-wx-hour-temp">{h.temp}°</div>
              <div className="nsc-wx-hour-wind">
                <svg width="14" height="14" viewBox="0 0 14 14" style={{ display: "inline-block", verticalAlign: "middle", marginRight: 2 }}>
                  <g transform={`rotate(${h.windDir}, 7, 7)`}>
                    <polygon points="7,1 8.5,7 7,6 5.5,7" fill="#420087" />
                    <polygon points="7,13 8.5,7 7,8 5.5,7" fill="#D0C8E0" />
                  </g>
                </svg>
                {h.windSpeed} km/h {degToCompass(h.windDir)}
              </div>
              <div className="nsc-wx-hour-rain">💧{h.rainPct}%</div>
            </div>
          );
        })}
      </div>

      <div className="nsc-wind-alert" style={{ marginTop: "0.5rem" }}>
        <p className="nsc-wind-alert-title">Forecast Note</p>
        <p className="nsc-wind-alert-body">
          Data is updated every hour from Open-Meteo. Refresh the page for the latest forecast closer to race day. Wind direction shows where the wind is blowing <strong>to</strong> — the dark arrow tip points downwind.
        </p>
      </div>
    </div>
  );
}

function OverviewTab() {
  return (
    <div>
      <p className="nsc-section-label">Race Details</p>
      <h2 className="nsc-section-title">Race Overview</h2>
      <div className="nsc-overview-grid">
        {OVERVIEW_ITEMS.map((item) => (
          <div key={item.key} className="nsc-overview-row">
            <div className="nsc-overview-key">{item.key}</div>
            <div className="nsc-overview-val">{item.val}</div>
            <div className="nsc-overview-note">{item.note}</div>
          </div>
        ))}
      </div>
      <div className="nsc-wind-alert">
        <p className="nsc-wind-alert-title">Wind Advisory</p>
        <p className="nsc-wind-alert-body">
          Light westerly wind at the start, increasing throughout the race. A
          crosswind split may form near the finish —{" "}
          <strong>stay alert in the final kilometres.</strong>
        </p>
      </div>
      <div
        style={{
          marginTop: "1.75rem",
          display: "flex",
          alignItems: "center",
          gap: "1rem",
          flexWrap: "wrap",
        }}
      >
        <a
          href="https://www.komoot.com/de-de/tour/2710701410"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            background: "#4f6812",
            color: "#fff",
            fontFamily: "'Barlow', sans-serif",
            fontWeight: 700,
            fontSize: "0.82rem",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            padding: "0.8rem 1.5rem",
            textDecoration: "none",
            borderRadius: "2px",
            transition: "opacity 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
        >
          View Route on Komoot ↗
        </a>
        <span
          style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: "0.68rem",
            letterSpacing: "0.14em",
            color: "#aaa",
          }}
        >
          64.4 km · 250 hm · Mostly asphalt
        </span>
      </div>
    </div>
  );
}

function StrategyTab() {
  return (
    <div>
      <p className="nsc-section-label">Team Plan</p>
      <h2 className="nsc-section-title">Race Strategy</h2>

      {/* Golden Rule */}
      <div className="nsc-golden-rule">
        <div className="nsc-golden-rule-icon">🚫</div>
        <div>
          <div className="nsc-golden-rule-label">The One Rule That Wins This Race</div>
          <div className="nsc-golden-rule-text">
            Do not attack AND do not follow each other
          </div>
          <div className="nsc-golden-rule-sub">
            If one NRC rider attacks, the others stay. No exceptions, no chasing teammates.
            Let it play out — that&apos;s how we end up with someone at the front alone.
          </div>
        </div>
      </div>

      {/* Attack squad */}
      <p className="nsc-section-label">Attack Squad</p>
      <p style={{ fontSize: "0.85rem", color: "#5A5550", marginBottom: "0.75rem", lineHeight: 1.6 }}>
        These five go from the gun. Everyone else sits in, protects position, and keeps NRC numbers at the front.
      </p>
      <div className="nsc-squad-row">
        {ATTACK_SQUAD.map((name) => (
          <span key={name} className="nsc-squad-badge">{name}</span>
        ))}
        <span className="nsc-squad-badge support">+ Rest of team in behind</span>
      </div>

      {/* Sprinters */}
      <p className="nsc-section-label" style={{ marginTop: "1.75rem" }}>Sprint Option</p>
      <p style={{ fontSize: "0.85rem", color: "#5A5550", marginBottom: "0.75rem", lineHeight: 1.6 }}>
        If the race comes back together and ends in a bunch sprint, these are our cards to play.
      </p>
      <div className="nsc-squad-row">
        {SPRINTERS.map((name) => (
          <span key={name} className="nsc-squad-badge" style={{ background: "#7C3AED" }}>{name}</span>
        ))}
        <span className="nsc-squad-badge support">Lead-out if possible</span>
      </div>

      {/* Race phases */}
      <p className="nsc-section-label">Race Plan</p>
      <p className="nsc-section-title" style={{ marginBottom: "1.25rem" }}>Phase by Phase</p>
      <div className="nsc-phases">
        {RACE_PHASES.map((p) => (
          <div key={p.phase} className={`nsc-phase${p.critical ? " critical" : ""}`}>
            <div className="nsc-phase-num">{p.phase}</div>
            <div>
              <div className="nsc-phase-km">{p.km}</div>
              <div className="nsc-phase-title">{p.title}</div>
              <div className="nsc-phase-detail">{p.detail}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Why it matters */}
      <div className="nsc-why-card">
        <div className="nsc-why-label">Motivation</div>
        <div className="nsc-why-title">This Is Our Home Race</div>
        <div className="nsc-why-body">
          The NSC is raced in our backyard, in front of our sponsors, in our
          city. A win here is the most visible result we can get — it directly
          impacts negotiations for next year&apos;s deals and the team&apos;s
          reputation going into the second half of the season. We race to win.
          Nothing less is acceptable.
        </div>
      </div>

      {/* Goals grid */}
      <div className="nsc-strategy-grid">
        <div className="nsc-strategy-card">
          <div className="nsc-strategy-card-title">Overall Goals</div>
          {TEAM_GOALS.map((g) => (
            <div key={g} className="nsc-strategy-item">
              <div className="nsc-strategy-bullet" />
              <span>{g}</span>
            </div>
          ))}
        </div>
        <div className="nsc-strategy-card">
          <div className="nsc-strategy-card-title">Race Objectives</div>
          {RACE_GOALS.map((g) => (
            <div key={g} className="nsc-strategy-item">
              <div className="nsc-strategy-bullet" />
              <span>{g}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Tips */}
      <div className="nsc-tips-grid" style={{ marginTop: "1.5rem" }}>
        {STRATEGY_TIPS.map(({ icon, title, tip }) => (
          <div key={title} className="nsc-tip-item">
            <div className="nsc-tip-icon">{icon}</div>
            <div className="nsc-tip-title">{title}</div>
            <div className="nsc-tip-body">{tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function NutritionTab() {
  return (
    <div>
      <p className="nsc-section-label">Race Fuel</p>
      <h2 className="nsc-section-title">Nutrition Plan</h2>
      <p
        style={{
          color: "#8A8480",
          fontSize: "0.88rem",
          maxWidth: "60ch",
          lineHeight: 1.65,
          marginBottom: "2.5rem",
        }}
      >
        64.4 km · 250 hm · ~1h45–2h · flat &amp; fast. This is a high-tempo
        bunch race, not an endurance grind — no carb loading needed. Focus on
        staying fuelled for surges and the sprint finish.
      </p>

      {/* Pre-race timeline */}
      <p className="nsc-sub-label">Pre-Race Timeline</p>
      <p className="nsc-sub-title">Race Morning</p>
      <div className="nsc-timeline">
        {NUTRITION_TIMELINE.map((item, i) => (
          <div
            key={i}
            className={`nsc-ntl-item${item.type !== "normal" ? ` ${item.type}` : ""}`}
          >
            <div className="nsc-ntl-time">{item.time}</div>
            <div className="nsc-ntl-action">{item.action}</div>
            <div className="nsc-ntl-detail">{item.detail}</div>
          </div>
        ))}
      </div>

      {/* Two-col: Breakfast + In-race fuel */}
      <div className="nsc-nutr-grid">
        {/* Breakfast */}
        <div>
          <p className="nsc-sub-label" style={{ marginTop: "2.5rem" }}>
            Breakfast — 06:00
          </p>
          <p className="nsc-sub-title">~135g Carbs</p>
          <table className="nsc-meal-table">
            <tbody>
              {BREAKFAST_ITEMS.map((r) => (
                <tr key={r.item}>
                  <td>{r.item}</td>
                  <td>{r.carbs}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="nsc-meal-total">Total ≈ 138g carbs</div>
          <p
            style={{
              fontSize: "0.78rem",
              color: "#8A8480",
              marginTop: "0.75rem",
              lineHeight: 1.55,
            }}
          >
            Keep fat and fibre low. White toast + jam works equally well if your
            gut prefers it before a hard start.
          </p>
        </div>

        {/* In-race fueling */}
        <div>
          <p className="nsc-sub-label" style={{ marginTop: "2.5rem" }}>
            During the Race
          </p>
          <p className="nsc-sub-title">~60g / hour</p>
          <div className="nsc-fuel-row">
            <span className="nsc-fuel-label">Pre-race gel (08:40)</span>
            <span className="nsc-fuel-val">25g · start primed</span>
          </div>
          <div className="nsc-fuel-row">
            <span className="nsc-fuel-label">Gel at ~40 min</span>
            <span className="nsc-fuel-val">25g · ~60g/hr</span>
          </div>
          <div className="nsc-fuel-row">
            <span className="nsc-fuel-label">Gel at ~80 min (optional)</span>
            <span className="nsc-fuel-val">25g · if &gt;90 min</span>
          </div>
          <div className="nsc-fuel-row">
            <span className="nsc-fuel-label">Drink bottle</span>
            <span className="nsc-fuel-val">1× water or 6–8% carb mix</span>
          </div>
          <p
            style={{
              fontSize: "0.78rem",
              color: "#8A8480",
              marginTop: "0.75rem",
              lineHeight: 1.55,
            }}
          >
            At ~2h the benefit is blood-glucose maintenance and CNS stimulation
            — you won't bonk. 60g/hr is plenty. One bottle suffices unless it's
            hot.
          </p>
        </div>
      </div>

      {/* Supplements */}
      <p className="nsc-sub-label" style={{ marginTop: "3rem" }}>
        Supplements
      </p>
      <p className="nsc-sub-title">What, When & Why</p>
      <div className="nsc-supp-grid">
        {SUPPLEMENTS.map((s) => (
          <div key={s.name} className="nsc-supp">
            <div className="nsc-supp-icon">{s.icon}</div>
            <div className="nsc-supp-name">{s.name}</div>
            <div className="nsc-supp-detail">{s.detail}</div>
            <div className="nsc-supp-time">{s.time}</div>
          </div>
        ))}
      </div>

      {/* Alert cards */}
      <div className="nsc-alert amber" style={{ marginTop: "2rem" }}>
        <span className="nsc-alert-title">⚠ Bicarb earns its place here</span>
        Unlike a climbing race, a flat bunch race is full of repeated
        above-threshold surges and a sprint finish — exactly the high-glycolytic
        efforts where bicarbonate buffering helps most. Worth taking if your gut
        tolerates it.
      </div>
      <div className="nsc-alert green">
        <span className="nsc-alert-title">
          ✓ No antibacterial mouthwash race morning
        </span>
        Preserves the oral bacteria that convert dietary nitrate → nitrite.
        Regular toothpaste only — this is the easiest free nitrate win.
      </div>
      <div className="nsc-alert amber">
        <span className="nsc-alert-title">
          Day Before — no loading, just sensible
        </span>
        A flat 2h race doesn&apos;t justify full carb loading. Eat
        normally-to-slightly-high (~6–7 g/kg), keep dinner low-fibre, and arrive
        light. ~430–500g carbs total is plenty.
      </div>
    </div>
  );
}

function PacklistTab({
  checked,
  toggle,
  done,
  total,
  onReset,
}: {
  checked: Set<string>;
  toggle: (id: string) => void;
  done: number;
  total: number;
  onReset: () => void;
}) {
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;

  return (
    <div>
      <p className="nsc-section-label">Equipment</p>
      <h2 className="nsc-section-title">Pack List</h2>

      <div className="nsc-pack-meta">
        <span className="nsc-pack-progress-label">
          {done} / {total} packed &mdash; {pct}%
        </span>
        {done > 0 && (
          <button className="nsc-pack-reset-btn" onClick={onReset}>
            Reset
          </button>
        )}
      </div>
      <div className="nsc-pack-progress-bar">
        <div className="nsc-pack-progress-fill" style={{ width: `${pct}%` }} />
      </div>

      {PACK_CATS.map((cat) => {
        const items = PACKLIST.filter((i) => i.cat === cat);
        return (
          <div key={cat}>
            <div className="nsc-pack-cat-title">{cat}</div>
            {items.map((item) => (
              <div
                key={item.id}
                className={`nsc-pack-item${checked.has(item.id) ? " done" : ""}`}
                onClick={() => toggle(item.id)}
              >
                <div className="nsc-pack-checkbox">
                  <span className="nsc-pack-checkmark">✓</span>
                </div>
                <span className="nsc-pack-text">{item.text}</span>
              </div>
            ))}
          </div>
        );
      })}

      {done === total && total > 0 && (
        <div className="nsc-pack-complete">
          <div className="nsc-pack-complete-title">Bereit! 🏁</div>
          <div className="nsc-pack-complete-sub">
            Everything packed — see you at the start line
          </div>
        </div>
      )}
    </div>
  );
}

/* ── UTILITY ──────────────────────────────────────────────────── */

function FadeIn({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
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
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`nsc-fade${visible ? " visible" : ""}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}
