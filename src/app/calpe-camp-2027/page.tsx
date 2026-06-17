import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { Loader } from "@/components/loader";
import { useAuth } from "@/contexts/auth-context";
import { supabase } from "@/utils/supabase";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const CAMP_DATE = new Date("2027-02-19T09:00:00");

const CAMP_STATS = [
  { value: "8", unit: "days", label: "Training Days" },
  { value: "15", unit: "max", label: "Riders" },
  { value: "10", unit: "rooms", label: "5 single · 5 double" },
  { value: "Full", unit: "", label: "Pension / Board" },
];

const OVERVIEW_ITEMS = [
  {
    key: "Dates",
    val: "19 – 28 Feb",
    note: "CW8 · Fri 19.02 → Sun 28.02.2027 — week after the winter school break",
  },
  {
    key: "Location",
    val: "Calpe",
    note: "Costa Blanca, Spain — winter cycling paradise",
  },
  {
    key: "Hotel",
    val: "Roca Esmeralda",
    note: "AR Roca Esmeralda Hotel — one hotel, full pension",
  },
  {
    key: "Rooms",
    val: "5 + 5",
    note: "5 single rooms · 5 double rooms",
  },
  {
    key: "Group Size",
    val: "≤ 15",
    note: "Small group — not more than 15 people",
  },
  {
    key: "Airport",
    val: "Valencia",
    note: "Bike transfer included from/to Valencia airport only",
  },
];

const INCLUDED = [
  {
    icon: "🏨",
    title: "Hotel & Full Pension",
    body: "AR Roca Esmeralda Hotel on full board — breakfast, lunch and dinner included throughout the camp.",
  },
  {
    icon: "🚐",
    title: "Bike Transfer",
    body: "Transfer for you and your bike to and from Valencia airport (VLC). Other transfers are not included.",
  },
  {
    icon: "🥤",
    title: "4Endurance Nutrition",
    body: "4Endurance sports nutrition included for the week — gels, drink mix and bars to fuel every session.",
  },
  {
    icon: "👕",
    title: "Special Camp Kit",
    body: "Exclusive camp edition jersey, cap and t-shirt — yours to keep.",
  },
  {
    icon: "📋",
    title: "Training Plan",
    body: "A structured 8-day training plan, shared well in advance so you can prepare and know what to expect.",
  },
  {
    icon: "📦",
    title: "One Package",
    body: "Everything above is bundled into a single, simple camp package.",
  },
];

const NOT_INCLUDED = [
  "Flights and individual travel to / from Valencia airport — participants arrange their own travel.",
  "Any transfers other than the included bike transfer from/to Valencia airport.",
];

const CONCEPT_STEPS = [
  {
    step: "01",
    title: "Ride to the climb together",
    body: "We roll out as a group and ride together to the foot of the day's climb — social, steady and in good company.",
  },
  {
    step: "02",
    title: "Individual training on the climb",
    body: "On the climb everyone does their own session at their own level — hit your numbers, your zones, your pace.",
  },
  {
    step: "03",
    title: "Meet for coffee & cake",
    body: "Regroup at the top or at a café for the classic coffee-and-cake stop. Refuel, recover and swap stories.",
  },
  {
    step: "04",
    title: "Ride home together",
    body: "Spin back to the hotel together as a group to round off the day's ride.",
  },
];

const TRAINING_PLAN = [
  {
    day: "Day 1",
    title: "Arrival & Shake-out",
    type: "Easy Spin",
    detail:
      "Travel day. Easy 1–1.5h shake-out spin in Z1–Z2 to loosen the legs, plus bike check and route briefing.",
    accent: false,
  },
  {
    day: "Day 2",
    title: "Long Steady Ride",
    type: "Endurance",
    detail:
      "3–4h steady endurance in Z2 along the coast and rolling roads. Build the aerobic base and settle into the week.",
    accent: false,
  },
  {
    day: "Day 3",
    title: "Sweet Spot",
    type: "Sweet Spot",
    detail:
      "Sustained climbing efforts — e.g. 3×12–15 min at sweet spot (~88–94% FTP) on Coll de Rates. Long warm-up, ride home easy.",
    accent: true,
  },
  {
    day: "Day 4",
    title: "Recovery & Coffee Ride",
    type: "Recovery",
    detail:
      "Easy social Z1–Z2 spin with a proper coffee & cake stop. Legs up, no efforts — let the work from the first days absorb.",
    accent: false,
  },
  {
    day: "Day 5",
    title: "VO2 Max",
    type: "VO2 Max",
    detail:
      "Short, sharp climbing intervals — e.g. 5–6×3 min at VO2 max with full recoveries. High quality over quantity.",
    accent: true,
  },
  {
    day: "Day 6",
    title: "Queen Stage",
    type: "Big Endurance",
    detail:
      "The biggest ride of the week — 4–5h endurance taking in a major climb. The signature day of the camp.",
    accent: true,
  },
  {
    day: "Day 7",
    title: "Threshold & Tempo",
    type: "Threshold",
    detail:
      "Tempo and threshold blocks on rolling terrain — e.g. 2×20 min at threshold. Controlled, race-specific intensity.",
    accent: false,
  },
  {
    day: "Day 8",
    title: "Easy Spin & Departure",
    type: "Easy Spin",
    detail:
      "Short, relaxed shake-out ride before packing up and heading home. Optional for early departures.",
    accent: false,
  },
];

const DAY_SCHEDULE = [
  {
    time: "07:30",
    label: "Breakfast",
    desc: "Full pension breakfast at the hotel — fuel up properly for the day's ride.",
    highlight: false,
  },
  {
    time: "09:00",
    label: "Short Warm-up",
    desc: "Mobility, activation and bike prep before rolling out.",
    highlight: false,
  },
  {
    time: "09:30",
    label: "Group Ride & Main Session",
    desc: "Ride to the climb together, individual training on the climb, coffee & cake, ride home together.",
    highlight: true,
  },
  {
    time: "13:30",
    label: "Lunch",
    desc: "Lunch back at the hotel (or on the road on longer days).",
    highlight: false,
  },
  {
    time: "15:00",
    label: "Stretching & Recovery",
    desc: "Stretching, mobility and recovery time — legs up, rest and refuel.",
    highlight: false,
  },
  {
    time: "17:00",
    label: "Free Time",
    desc: "Coffee, relax, explore Calpe or get a massage.",
    highlight: false,
  },
  {
    time: "19:30",
    label: "Dinner",
    desc: "Full pension dinner together at the hotel.",
    highlight: false,
  },
  {
    time: "20:30",
    label: "Evening Activity",
    desc: "Tactical breakdown of the big races, or a light gym / core session.",
    highlight: true,
  },
];

const TABS = [
  { id: "overview", label: "Camp Overview", icon: "🏔" },
  { id: "plan", label: "Training Plan", icon: "📋" },
  { id: "day", label: "A Day at Camp", icon: "🗓" },
];

type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

function getTimeLeft(): TimeLeft {
  const diff = CAMP_DATE.getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000) / 60000),
    seconds: Math.floor((diff % 60000) / 1000),
  };
}

export default function CalpeCamp2027Page() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [accessGranted, setAccessGranted] = useState(false);
  const [checkingAccess, setCheckingAccess] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(getTimeLeft);

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

  if (authLoading || checkingAccess) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (!accessGranted) return null;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Mono:wght@400;500&family=Barlow:wght@300;400;600;700&display=swap');

        .calpe-root {
          font-family: 'Barlow', sans-serif;
          background: #ffffff;
          color: #111111;
          overflow-x: hidden;
        }

        /* ── HERO ───────────────────────────────────────────────── */
        .calpe-hero {
          position: relative;
          min-height: 67vh;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          overflow: hidden;
          background:
            linear-gradient(140deg, rgba(13,0,32,0.82) 0%, rgba(28,0,72,0.72) 45%, rgba(66,0,135,0.62) 100%),
            url('/image/team-picture-white.webp') center center / cover no-repeat;
        }

        .calpe-hero-bg {
          position: absolute;
          inset: 0;
          background:
            radial-gradient(ellipse at 85% 10%, rgba(140, 80, 255, 0.15) 0%, transparent 55%),
            radial-gradient(ellipse at 15% 90%, rgba(66, 0, 135, 0.25) 0%, transparent 50%);
          pointer-events: none;
        }

        .calpe-hero::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px);
          background-size: 56px 56px;
          pointer-events: none;
        }

        .calpe-badge {
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

        .calpe-date-pill {
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

        .calpe-hero-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(4.5rem, 15vw, 12.5rem);
          line-height: 0.88;
          color: #ffffff;
          margin-top: 1.1rem;
          letter-spacing: 0.02em;
        }

        .calpe-hero-title em {
          font-style: normal;
          color: #b575ff;
        }

        .calpe-hero-sub {
          font-family: 'DM Mono', monospace;
          font-size: clamp(0.62rem, 1.2vw, 0.8rem);
          letter-spacing: 0.24em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.5);
          margin-top: 1.25rem;
        }

        /* Countdown */
        .calpe-countdown {
          display: flex;
          gap: 0.75rem;
          margin-top: 2.5rem;
          flex-wrap: wrap;
        }

        .calpe-countdown-block {
          display: flex;
          flex-direction: column;
          align-items: center;
          background: rgba(255,255,255,0.07);
          border: 1px solid rgba(255,255,255,0.12);
          padding: 1.1rem 1.4rem;
          min-width: 86px;
          backdrop-filter: blur(6px);
        }

        .calpe-countdown-value {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 3.2rem;
          line-height: 1;
          color: #ffffff;
          letter-spacing: 0.04em;
        }

        .calpe-countdown-label {
          font-family: 'DM Mono', monospace;
          font-size: 0.56rem;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.38);
          margin-top: 0.3rem;
        }

        /* ── STATS BAR ──────────────────────────────────────────── */
        .calpe-stats-bar {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          background: #0f0f0f;
        }

        @media (max-width: 640px) {
          .calpe-stats-bar { grid-template-columns: repeat(2, 1fr); }
        }

        .calpe-stat {
          padding: 2rem 1.5rem;
          border-right: 1px solid rgba(255,255,255,0.07);
          text-align: center;
        }

        .calpe-stat:last-child { border-right: none; }

        .calpe-stat-value {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(2.2rem, 4.5vw, 3.5rem);
          line-height: 1;
          color: #ffffff;
        }

        .calpe-stat-unit {
          font-family: 'DM Mono', monospace;
          font-size: 0.65rem;
          color: rgba(255,255,255,0.4);
          margin-left: 4px;
        }

        .calpe-stat-label {
          font-size: 0.66rem;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.3);
          margin-top: 0.25rem;
        }

        /* ── SECTION & CONTAINER ────────────────────────────────── */
        .calpe-section { padding: 4.5rem 0 6rem; }

        .calpe-container {
          max-width: 1100px;
          margin: 0 auto;
          padding: 0 2rem;
        }

        /* ── TABS ───────────────────────────────────────────────── */
        .calpe-tab-nav {
          display: flex;
          border-bottom: 2px solid #EAE6F0;
          margin-bottom: 3rem;
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none;
        }

        .calpe-tab-nav::-webkit-scrollbar { display: none; }

        .calpe-tab-btn {
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

        .calpe-tab-btn:hover { color: #420087; }

        .calpe-tab-btn.active {
          color: #420087;
          border-bottom-color: #420087;
        }

        .calpe-tab-icon { font-size: 1rem; }

        .calpe-tab-panel { animation: calpeFadeTab 0.22s ease; }

        @keyframes calpeFadeTab {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: none; }
        }

        /* ── SHARED LABELS / TITLES ─────────────────────────────── */
        .calpe-section-label {
          font-family: 'DM Mono', monospace;
          font-size: 0.67rem;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          color: #420087;
          margin-bottom: 0.65rem;
        }

        .calpe-section-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(2.2rem, 5vw, 3.8rem);
          line-height: 1;
          color: #111111;
          margin-bottom: 1rem;
        }

        .calpe-lead {
          font-size: 0.95rem;
          color: #555;
          line-height: 1.7;
          max-width: 640px;
        }

        /* ── OVERVIEW GRID ──────────────────────────────────────── */
        .calpe-overview-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1px;
          background: #E8E4E0;
          border: 1px solid #E8E4E0;
          margin-top: 2rem;
        }

        @media (max-width: 760px) {
          .calpe-overview-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 480px) {
          .calpe-overview-grid { grid-template-columns: 1fr; }
        }

        .calpe-overview-row {
          background: #fff;
          padding: 1.5rem 1.75rem;
          transition: background 0.2s;
        }

        .calpe-overview-row:hover { background: #FAF8FF; }

        .calpe-overview-key {
          font-family: 'DM Mono', monospace;
          font-size: 0.62rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #aaa;
          margin-bottom: 0.35rem;
        }

        .calpe-overview-val {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 1.9rem;
          color: #111;
          line-height: 1;
        }

        .calpe-overview-note {
          font-size: 0.76rem;
          color: #8A8480;
          margin-top: 6px;
          line-height: 1.5;
        }

        /* ── INCLUDED CARDS ─────────────────────────────────────── */
        .calpe-cards-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1px;
          background: #E8E4E0;
          border: 1px solid #E8E4E0;
          margin-top: 1.75rem;
        }

        @media (max-width: 760px) {
          .calpe-cards-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 480px) {
          .calpe-cards-grid { grid-template-columns: 1fr; }
        }

        .calpe-card {
          background: #fff;
          padding: 1.6rem 1.75rem;
          transition: background 0.2s;
        }

        .calpe-card:hover { background: #FAF8FF; }

        .calpe-card-icon { font-size: 1.6rem; margin-bottom: 0.7rem; }

        .calpe-card-title {
          font-weight: 700;
          font-size: 0.86rem;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          color: #111;
          margin-bottom: 0.45rem;
        }

        .calpe-card-body { font-size: 0.82rem; color: #8A8480; line-height: 1.6; }

        /* ── NOT INCLUDED ───────────────────────────────────────── */
        .calpe-note-box {
          margin-top: 2.5rem;
          padding: 1.4rem 1.75rem;
          background: #FAF8FF;
          border: 1px solid #E0D8F0;
          border-left: 4px solid #420087;
        }

        .calpe-note-title {
          font-family: 'DM Mono', monospace;
          font-size: 0.65rem;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: #420087;
          margin-bottom: 0.7rem;
        }

        .calpe-note-item {
          display: flex;
          align-items: flex-start;
          gap: 0.6rem;
          font-size: 0.86rem;
          color: #444;
          line-height: 1.6;
          padding: 0.3rem 0;
        }

        .calpe-note-item span {
          color: #420087;
          flex-shrink: 0;
          margin-top: 1px;
        }

        /* ── CONCEPT STEPS ──────────────────────────────────────── */
        .calpe-concept-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1.5rem;
          margin-top: 2rem;
        }

        @media (max-width: 640px) {
          .calpe-concept-grid { grid-template-columns: 1fr; }
        }

        .calpe-concept-card {
          border: 1px solid #EAE6F0;
          padding: 1.6rem 1.85rem;
          position: relative;
          transition: box-shadow 0.2s;
        }

        .calpe-concept-card:hover { box-shadow: 0 4px 24px rgba(66, 0, 135, 0.08); }

        .calpe-concept-step {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 2.4rem;
          line-height: 1;
          color: #EADCFB;
          letter-spacing: 0.04em;
        }

        .calpe-concept-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 1.4rem;
          color: #420087;
          letter-spacing: 0.04em;
          margin: 0.4rem 0 0.6rem;
        }

        .calpe-concept-body { font-size: 0.86rem; color: #555; line-height: 1.6; }

        /* ── TRAINING PLAN ──────────────────────────────────────── */
        .calpe-plan-list { margin-top: 2rem; }

        .calpe-plan-row {
          display: grid;
          grid-template-columns: 120px 1fr;
          gap: 1.5rem;
          align-items: start;
          border: 1px solid #EAE6F0;
          border-bottom: none;
          padding: 1.5rem 1.85rem;
          transition: background 0.2s;
        }

        .calpe-plan-row:last-child { border-bottom: 1px solid #EAE6F0; }
        .calpe-plan-row:hover { background: #FAF8FF; }

        .calpe-plan-row.accent { border-left: 4px solid #420087; }

        @media (max-width: 560px) {
          .calpe-plan-row { grid-template-columns: 1fr; gap: 0.5rem; }
        }

        .calpe-plan-day {
          font-family: 'DM Mono', monospace;
          font-size: 0.7rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #420087;
        }

        .calpe-plan-type {
          display: inline-block;
          margin-top: 0.45rem;
          font-family: 'DM Mono', monospace;
          font-size: 0.6rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #8A8480;
          background: #F2EFF8;
          border: 1px solid #E8E1F5;
          padding: 3px 8px;
          border-radius: 2px;
        }

        .calpe-plan-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 1.55rem;
          color: #111;
          letter-spacing: 0.03em;
          line-height: 1.05;
          margin-bottom: 0.4rem;
        }

        .calpe-plan-detail { font-size: 0.86rem; color: #555; line-height: 1.6; }

        /* ── DAY SCHEDULE TIMELINE ──────────────────────────────── */
        .calpe-timeline {
          max-width: 680px;
          margin-top: 2rem;
          padding-left: 1.25rem;
          border-left: 2px solid #EAE6F0;
        }

        .calpe-tl-item {
          position: relative;
          padding: 0.9rem 0 0.9rem 1.5rem;
        }

        .calpe-tl-item::before {
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

        .calpe-tl-item.highlight::before {
          background: #420087;
          box-shadow: 0 0 0 5px rgba(66, 0, 135, 0.14);
          width: 14px;
          height: 14px;
          left: -8px;
        }

        .calpe-tl-time {
          font-family: 'DM Mono', monospace;
          font-size: 0.7rem;
          letter-spacing: 0.15em;
          color: #420087;
          margin-bottom: 2px;
        }

        .calpe-tl-label {
          font-weight: 700;
          font-size: 0.93rem;
          color: #111;
          line-height: 1.3;
        }

        .calpe-tl-item.highlight .calpe-tl-label {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 1.35rem;
          letter-spacing: 0.05em;
          font-weight: 400;
        }

        .calpe-tl-desc {
          font-size: 0.8rem;
          color: #8A8480;
          margin-top: 2px;
          line-height: 1.5;
        }

        /* ── FADE ───────────────────────────────────────────────── */
        .calpe-fade {
          opacity: 0;
          transform: translateY(18px);
          transition: opacity 0.6s ease, transform 0.6s ease;
        }
        .calpe-fade.visible { opacity: 1; transform: none; }
      `}</style>
      <Navbar />
      <div className="calpe-root">
        {/* ── HERO ─────────────────────────────────────────────── */}
        <section className="calpe-hero pt-14">
          <div className="calpe-hero-bg" />
          <div
            className="calpe-container"
            style={{ position: "relative", zIndex: 1, paddingBottom: "4.5rem" }}
          >
            <FadeIn delay={0}>
              <span className="calpe-badge">Training Camp · Members Only</span>
              <span className="calpe-date-pill">CW8 · Feb 2027</span>
            </FadeIn>
            <FadeIn delay={80}>
              <h1 className="calpe-hero-title">
                CALPE
                <br />
                <em>CAMP</em>
              </h1>
            </FadeIn>
            <FadeIn delay={145}>
              <p className="calpe-hero-sub">
                NRC Training Camp 2027 &nbsp;·&nbsp; Costa Blanca, Spain
                &nbsp;·&nbsp; Fri 19.02 → Sun 28.02.2027
              </p>
            </FadeIn>
            <FadeIn delay={210}>
              <div className="calpe-countdown">
                {(
                  [
                    { v: timeLeft.days, l: "Days" },
                    { v: timeLeft.hours, l: "Hours" },
                    { v: timeLeft.minutes, l: "Min" },
                    { v: timeLeft.seconds, l: "Sec" },
                  ] as const
                ).map(({ v, l }) => (
                  <div key={l} className="calpe-countdown-block">
                    <span className="calpe-countdown-value">
                      {String(v).padStart(2, "0")}
                    </span>
                    <span className="calpe-countdown-label">{l}</span>
                  </div>
                ))}
              </div>
            </FadeIn>
          </div>
        </section>

        {/* ── STATS BAR ────────────────────────────────────────── */}
        <div className="calpe-stats-bar">
          {CAMP_STATS.map(({ value, unit, label }, i) => (
            <FadeIn key={label} delay={i * 60}>
              <div className="calpe-stat">
                <div>
                  <span className="calpe-stat-value">{value}</span>
                  {unit && (
                    <span className="calpe-stat-unit">&thinsp;{unit}</span>
                  )}
                </div>
                <div className="calpe-stat-label">{label}</div>
              </div>
            </FadeIn>
          ))}
        </div>

        {/* ── TABS ─────────────────────────────────────────────── */}
        <section className="calpe-section">
          <div className="calpe-container">
            <nav className="calpe-tab-nav" role="tablist">
              {TABS.map((t) => (
                <button
                  key={t.id}
                  role="tab"
                  aria-selected={activeTab === t.id}
                  className={`calpe-tab-btn${
                    activeTab === t.id ? " active" : ""
                  }`}
                  onClick={() => setActiveTab(t.id)}
                >
                  <span className="calpe-tab-icon">{t.icon}</span>
                  {t.label}
                </button>
              ))}
            </nav>

            <div key={activeTab} className="calpe-tab-panel">
              {activeTab === "overview" && <OverviewTab />}
              {activeTab === "plan" && <PlanTab />}
              {activeTab === "day" && <DayTab />}
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}

/* ── TAB CONTENTS ─────────────────────────────────────────────── */

function OverviewTab() {
  return (
    <div>
      <p className="calpe-section-label">The Camp</p>
      <h2 className="calpe-section-title">NRC Training Camp 2027</h2>
      <p className="calpe-lead">
        A week of focused winter training on the Costa Blanca. One hotel, one
        package, a small group of no more than 15 riders — ride to the climb
        together, train at your own level, refuel over coffee &amp; cake, and
        roll home together.
      </p>

      <div className="calpe-overview-grid">
        {OVERVIEW_ITEMS.map((it) => (
          <div key={it.key} className="calpe-overview-row">
            <div className="calpe-overview-key">{it.key}</div>
            <div className="calpe-overview-val">{it.val}</div>
            <div className="calpe-overview-note">{it.note}</div>
          </div>
        ))}
      </div>

      {/* What's included */}
      <div style={{ marginTop: "4rem" }}>
        <p className="calpe-section-label">One Package</p>
        <h2 className="calpe-section-title">What&apos;s Included</h2>
        <div className="calpe-cards-grid">
          {INCLUDED.map((c) => (
            <div key={c.title} className="calpe-card">
              <div className="calpe-card-icon">{c.icon}</div>
              <div className="calpe-card-title">{c.title}</div>
              <div className="calpe-card-body">{c.body}</div>
            </div>
          ))}
        </div>

        <div className="calpe-note-box">
          <div className="calpe-note-title">Not Included</div>
          {NOT_INCLUDED.map((n) => (
            <div key={n} className="calpe-note-item">
              <span>—</span>
              {n}
            </div>
          ))}
        </div>
      </div>

      {/* The concept */}
      <div style={{ marginTop: "4rem" }}>
        <p className="calpe-section-label">How We Ride</p>
        <h2 className="calpe-section-title">The Concept</h2>
        <p className="calpe-lead">
          Same proven approach as this year — together where it counts,
          individual where it matters.
        </p>
        <div className="calpe-concept-grid">
          {CONCEPT_STEPS.map((s) => (
            <div key={s.step} className="calpe-concept-card">
              <div className="calpe-concept-step">{s.step}</div>
              <div className="calpe-concept-title">{s.title}</div>
              <div className="calpe-concept-body">{s.body}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function PlanTab() {
  return (
    <div>
      <p className="calpe-section-label">8 Days</p>
      <h2 className="calpe-section-title">Training Plan</h2>
      <p className="calpe-lead">
        A balanced 8-day block mixing endurance, intensity and recovery. The
        full plan is shared in advance so you know exactly what to expect and
        can arrive ready. Sessions adapt to the group and the weather.
      </p>

      <div className="calpe-plan-list">
        {TRAINING_PLAN.map((d) => (
          <div
            key={d.day}
            className={`calpe-plan-row${d.accent ? " accent" : ""}`}
          >
            <div>
              <div className="calpe-plan-day">{d.day}</div>
              <span className="calpe-plan-type">{d.type}</span>
            </div>
            <div>
              <div className="calpe-plan-title">{d.title}</div>
              <div className="calpe-plan-detail">{d.detail}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function DayTab() {
  return (
    <div>
      <p className="calpe-section-label">Daily Rhythm</p>
      <h2 className="calpe-section-title">A Day at Camp</h2>
      <p className="calpe-lead">
        An example day — full pension means you fuel up at the hotel before and
        after the ride, with recovery and an evening activity to round things
        off. Exact timings shift with each day&apos;s session.
      </p>

      <div className="calpe-timeline">
        {DAY_SCHEDULE.map((s) => (
          <div
            key={s.time}
            className={`calpe-tl-item${s.highlight ? " highlight" : ""}`}
          >
            <div className="calpe-tl-time">{s.time}</div>
            <div className="calpe-tl-label">{s.label}</div>
            <div className="calpe-tl-desc">{s.desc}</div>
          </div>
        ))}
      </div>
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
      className={`calpe-fade${visible ? " visible" : ""}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}
