"use client";

/**
 * GARBO — Modern Government Style Public Landing Portal
 * Optimized for high trust, official Philippine LGU aesthetic,
 * interactive citizen charter, and localized schedule discovery.
 */

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  BarChart3, 
  ShieldCheck,
  Search,
  Building2,
  ArrowRight,
  MapPin,
  PhoneCall,
  Clock,
  CheckCircle2,
  HeartHandshake,
  Leaf,
  Trash2,
  AlertTriangle,
  TrendingUp,
  Check,
  X,
  Mail,
  Smartphone
} from "lucide-react";

// Mock database of Sitios and their collection calendars for the public finder
const SITIO_SCHEDULES = [
  {
    id: "mahiga",
    name: "Sitio Mahiga",
    days: "Mondays, Wednesdays, & Fridays",
    organic: "Mon & Fri (08:00 AM - 11:00 AM)",
    recyclable: "Wed (09:00 AM - 12:00 PM)",
    residual: "Fri (01:00 PM - 03:00 PM)",
    truck: "TRUCK-A104 (Sanitation Team Alpha)",
    focal: "Kagawad Robert Tecson",
    contact: "+63 (32) 231-1054",
  },
  {
    id: "bukid",
    name: "Sitio Bukid",
    days: "Tuesdays, Thursdays, & Saturdays",
    organic: "Tue & Sat (07:00 AM - 10:00 AM)",
    recyclable: "Thu (08:00 AM - 11:00 AM)",
    residual: "Sat (02:00 PM - 04:00 PM)",
    truck: "TRUCK-B202 (Sanitation Team Beta)",
    focal: "Kagawad Robert Tecson",
    contact: "+63 (32) 231-1054",
  },
  {
    id: "pahina",
    name: "Sitio Pahina",
    days: "Mondays, Thursdays, & Saturdays",
    organic: "Mon & Sat (08:30 AM - 11:30 AM)",
    recyclable: "Thu (09:30 AM - 12:30 PM)",
    residual: "Sat (01:30 PM - 03:30 PM)",
    truck: "TRUCK-A104 (Sanitation Team Alpha)",
    focal: "Sanitation Lead Maria Cruz",
    contact: "+63 (32) 231-1055",
  },
  {
    id: "back-cabang",
    name: "Sitio Back of Cabang",
    days: "Tuesdays, Fridays, & Sundays",
    organic: "Tue & Sun (08:00 AM - 11:00 AM)",
    recyclable: "Fri (09:00 AM - 12:00 PM)",
    residual: "Sun (01:00 PM - 03:00 PM)",
    truck: "TRUCK-C303 (Sanitation Team Gamma)",
    focal: "Kagawad Robert Tecson",
    contact: "+63 (32) 231-1054",
  },
  {
    id: "lower-banilad",
    name: "Sitio Lower Banilad",
    days: "Mondays, Wednesdays, & Saturdays",
    organic: "Mon & Sat (07:00 AM - 10:00 AM)",
    recyclable: "Wed (08:00 AM - 11:00 AM)",
    residual: "Sat (12:00 PM - 02:00 PM)",
    truck: "TRUCK-B202 (Sanitation Team Beta)",
    focal: "Sanitation Lead Maria Cruz",
    contact: "+63 (32) 231-1055",
  },
  {
    id: "san-jose",
    name: "Sitio San Jose",
    days: "Wednesdays, Fridays, & Sundays",
    organic: "Wed & Sun (08:30 AM - 11:30 AM)",
    recyclable: "Fri (09:30 AM - 12:30 PM)",
    residual: "Sun (02:00 PM - 04:00 PM)",
    truck: "TRUCK-C303 (Sanitation Team Gamma)",
    focal: "Kagawad Robert Tecson",
    contact: "+63 (32) 231-1054",
  }
];

export default function LandingPage() {
  const [selectedSitio, setSelectedSitio] = useState("");
  const [foundSchedule, setFoundSchedule] = useState<typeof SITIO_SCHEDULES[0] | null>(null);
  const [activeSortingTab, setActiveSortingTab] = useState<"organic" | "recyclable" | "residual" | "hazardous">("organic");
  const [currentTime, setCurrentTime] = useState("");
  
  // Feedback form states
  const [feedbackName, setFeedbackName] = useState("");
  const [feedbackEmail, setFeedbackEmail] = useState("");
  const [feedbackSitio, setFeedbackSitio] = useState("");
  const [feedbackMsg, setFeedbackMsg] = useState("");
  const [feedbackStatus, setFeedbackStatus] = useState<"idle" | "submitting" | "success">("idle");

  // Keep live Philippine Standard Time clock in the header banner for that high-trust gov vibe
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      // Format to Philippine Standard Time (PST is UTC+8)
      const options: Intl.DateTimeFormatOptions = {
        timeZone: "Asia/Manila",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric"
      };
      setCurrentTime(now.toLocaleString("en-US", options) + " (PST)");
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleSearchSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    const match = SITIO_SCHEDULES.find(s => s.id === selectedSitio || s.name.toLowerCase().includes(selectedSitio.toLowerCase()));
    if (match) {
      setFoundSchedule(match);
    } else {
      setFoundSchedule(null);
    }
  };

  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedbackStatus("submitting");
    setTimeout(() => {
      setFeedbackStatus("success");
      setFeedbackName("");
      setFeedbackEmail("");
      setFeedbackSitio("");
      setFeedbackMsg("");
      setTimeout(() => setFeedbackStatus("idle"), 5000);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--color-bg-page)" }}>
      
      {/* ── GovPH Announcement Ribbon ────────────────────────────────── */}
      <div className="bg-[#3E472E] text-[rgba(255,255,255,0.85)] text-[10.5px] font-mono tracking-wider py-2 px-6 border-b border-[#626F47]/20 flex flex-col md:flex-row items-center justify-between gap-2 z-50">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>Official Public Services Portal of Barangay Banilad · Cebu City, Region VII</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="hidden lg:inline text-[rgba(255,255,255,0.6)]">Republic of the Philippines RA 9003 Compliance</span>
          <span className="bg-[#FDFAF4] text-[#3E472E] px-2 py-0.5 rounded font-bold text-[9px] uppercase">
            {currentTime || "Philippine Standard Time"}
          </span>
        </div>
      </div>

      {/* ── Top Navigation ──────────────────────────────────────────── */}
      <header
        className="sticky top-0 z-[var(--z-sticky)] border-b border-[var(--color-border)]"
        style={{ background: "rgba(253,250,244,0.95)", backdropFilter: "blur(12px)" }}
      >
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* LGU Logo & Branding */}
          <Link
            href="/"
            className="flex items-center gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] rounded-md px-1"
            aria-label="GARBO home"
          >
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center shadow-sm"
              style={{ background: "linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%)" }}
            >
              <Building2 size={18} className="text-white" aria-hidden="true" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-base font-bold text-[var(--color-primary-dark)] tracking-wide font-sans">
                  BANILAD LGU
                </span>
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-800 uppercase font-mono tracking-tighter">
                  GARBO
                </span>
              </div>
              <p className="text-[10px] text-[var(--color-text-muted)] font-medium -mt-1 font-sans">
                Solid Waste Management Bureau
              </p>
            </div>
          </Link>

          {/* Nav links — matches Philippine Gov standards */}
          <nav className="flex items-center gap-6" aria-label="Main">
            <Link
              href="/"
              className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-primary)] hover:text-[var(--color-primary)] transition-colors"
            >
              Home
            </Link>
            <Link
              href="#about"
              className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors"
            >
              Charter & Approach
            </Link>
            <Link
              href="#schedule-lookup"
              className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors"
            >
              Schedules
            </Link>
            <Link
              href="/feed"
              className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors flex items-center gap-1"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live Feed
            </Link>
            <Link
              href="/login"
              className="text-xs font-bold uppercase tracking-wider bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white px-3.5 py-2 rounded-lg transition-all shadow-sm"
            >
              Portal Sign In
            </Link>
          </nav>
        </div>
      </header>

      {/* ── Hero Section ─────────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden py-16 lg:py-24 border-b border-[var(--color-border)]"
        style={{
          background: `linear-gradient(135deg, #4A5531 0%, #2A311D 100%)`,
        }}
        aria-label="Hero"
      >
        {/* Background grid texture pattern */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `radial-gradient(#ffffff 1px, transparent 1px), radial-gradient(#ffffff 1px, #2A311D 1px)`,
            backgroundSize: "24px 24px",
            backgroundPosition: "0 0, 12px 12px"
          }}
          aria-hidden="true"
        />

        <div className="relative max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Text */}
          <div className="lg:col-span-7">
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-semibold mb-6 shadow-sm border border-emerald-500/20"
              style={{ background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.95)" }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              BAGONG PILIPINAS compliance: Ecological Waste Management Program
            </div>

            <h1
              className="text-4xl lg:text-5xl font-black text-white mb-5 leading-tight tracking-tight"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Integrated Solid Waste Management & Tracking System
            </h1>

            <p className="text-sm leading-relaxed mb-8 text-neutral-200/90 max-w-xl font-sans">
              Welcome to the official digital dashboard of Barangay Banilad. In alliance with the 
              Cebu City Sanitary Department and Republic Act 9003, we provide real-time collection telemetry, 
              neighborhood ecological schedules, and rapid public safety advisory channels to foster 
              a cleaner, zero-waste neighborhood.
            </p>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/login"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-150 hover:-translate-y-0.5 shadow-md hover:shadow-lg focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2"
                style={{
                  background: "var(--color-accent)",
                  color: "var(--color-primary-dark)",
                }}
              >
                Access Administrator Portal <ArrowRight size={14} />
              </Link>
              <Link
                href="/feed"
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider text-white border border-white/20 bg-white/5 hover:bg-white/10 transition-all duration-150 hover:-translate-y-0.5"
              >
                Explore Public Live Feed
              </Link>
            </div>
          </div>

          {/* Right Preview Card (Live Dashboard preview) */}
          <div className="lg:col-span-5 hidden lg:block">
            <div
              className="bg-neutral-900/40 backdrop-blur-md rounded-2xl p-6 border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.37)] text-white"
            >
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
                  <span className="text-[11px] font-mono tracking-widest text-neutral-300">LIVE SYSTEM TELEMETRY</span>
                </div>
                <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded">
                  98.4% EFFICIENCY
                </span>
              </div>

              {/* Mini dashboard items */}
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-neutral-400">Daily Completion Rate</span>
                    <span className="font-semibold text-emerald-400">92%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-neutral-800 overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: "92%" }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-neutral-400">Monthly diverted waste goal</span>
                    <span className="font-semibold text-amber-400">1,240 / 1,500 kg</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-neutral-800 overflow-hidden">
                    <div className="h-full bg-amber-500 rounded-full" style={{ width: "82.6%" }} />
                  </div>
                </div>

                <div className="pt-2">
                  <span className="text-[10px] font-mono text-neutral-400 block mb-2 uppercase">ACTIVE SECTORS:</span>
                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div className="bg-white/5 rounded-lg p-2 flex items-center justify-between border border-white/5">
                      <span className="text-neutral-300">Sitio Mahiga</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    </div>
                    <div className="bg-white/5 rounded-lg p-2 flex items-center justify-between border border-white/5">
                      <span className="text-neutral-300">Sitio Bukid</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    </div>
                    <div className="bg-white/5 rounded-lg p-2 flex items-center justify-between border border-white/5">
                      <span className="text-neutral-300">Sitio Pahina</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                    </div>
                    <div className="bg-white/5 rounded-lg p-2 flex items-center justify-between border border-white/5">
                      <span className="text-neutral-300">Lower Banilad</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Interactive Citizen Waste Schedule Finder ─────────────────── */}
      <section id="schedule-lookup" className="max-w-6xl mx-auto px-6 -mt-8 relative z-20">
        <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-[var(--shadow-modal)] border border-[var(--color-border)]">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-[var(--color-primary)] uppercase tracking-wider mb-1">
                <MapPin className="w-4 h-4 text-amber-500" />
                Neighborhood Lookup
              </div>
              <h2 className="text-2xl font-extrabold text-[var(--color-text-primary)]" style={{ fontFamily: "var(--font-heading)" }}>
                Find Your Sitio Collection Schedule
              </h2>
              <p className="text-xs text-[var(--color-text-muted)] mt-1">
                Select your neighborhood block below to see the authorized collection truck, timings, and ecology focal points.
              </p>
            </div>
            
            {/* Quick stats indicators */}
            <div className="hidden sm:flex items-center gap-6 text-xs text-[var(--color-text-secondary)] font-medium">
              <div className="text-right">
                <span className="text-emerald-700 font-bold block text-sm">6 Active</span>
                <span>Sitio Subdivisions</span>
              </div>
              <div className="h-8 w-px bg-neutral-200" />
              <div className="text-right">
                <span className="text-emerald-700 font-bold block text-sm">3 Fleets</span>
                <span>Operational Trucks</span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSearchSchedule} className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end mb-6">
            <div className="sm:col-span-9">
              <label htmlFor="sitio-select" className="block text-[11px] font-bold uppercase tracking-wider text-[var(--color-text-muted)] mb-1.5">
                Select Your Sitio Zone
              </label>
              <div className="relative">
                <select
                  id="sitio-select"
                  className="w-full px-4 py-3 rounded-xl border border-[var(--color-border)] bg-neutral-50 text-[var(--color-text-primary)] font-medium text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:bg-white appearance-none transition-all"
                  value={selectedSitio}
                  onChange={(e) => {
                    setSelectedSitio(e.target.value);
                    const match = SITIO_SCHEDULES.find(s => s.id === e.target.value);
                    if (match) setFoundSchedule(match);
                  }}
                >
                  <option value="">-- Choose Barangay Sitio Zone --</option>
                  {SITIO_SCHEDULES.map((s) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-neutral-500">
                  ▼
                </div>
              </div>
            </div>
            <button
              type="submit"
              className="sm:col-span-3 w-full bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white font-bold py-3 px-6 rounded-xl text-sm transition-all flex items-center justify-center gap-2 shadow-sm"
            >
              <Search size={16} /> Look Up Schedule
            </button>
          </form>

          {/* Schedule output block */}
          {foundSchedule ? (
            <div className="bg-[#FAFDF2] border border-[#C8DA9C] rounded-2xl p-5 lg:p-6 animate-fade-in">
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-4 border-b border-[#C8DA9C]/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-800">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[#1B5E20]">{foundSchedule.name} Calendar</h3>
                    <p className="text-xs text-[var(--color-text-muted)]">Focal Person: <strong className="text-[var(--color-text-primary)]">{foundSchedule.focal}</strong></p>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <span className="text-[10px] font-mono font-bold bg-emerald-50 text-[#1B5E20] border border-[#1B5E20]/20 px-3 py-1 rounded-full flex items-center gap-1">
                    <Clock size={12} /> Live tracking active
                  </span>
                  <span className="text-[10px] font-mono font-bold bg-amber-50 text-amber-800 border border-amber-500/20 px-3 py-1 rounded-full flex items-center gap-1">
                    <PhoneCall size={12} /> {foundSchedule.contact}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-5">
                <div className="bg-white p-4 rounded-xl border border-neutral-100">
                  <span className="text-[10px] font-bold text-emerald-800 flex items-center gap-1.5 mb-1 uppercase tracking-wider">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                    Biodegradable / Organic
                  </span>
                  <div className="text-sm font-extrabold text-[var(--color-text-primary)]">{foundSchedule.organic}</div>
                  <p className="text-[11px] text-[var(--color-text-muted)] mt-1.5">Vegetable scraps, fruit peels, food leftovers, dried leaves.</p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-neutral-100">
                  <span className="text-[10px] font-bold text-blue-800 flex items-center gap-1.5 mb-1 uppercase tracking-wider">
                    <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
                    Non-Biodegradable / Recyclable
                  </span>
                  <div className="text-sm font-extrabold text-[var(--color-text-primary)]">{foundSchedule.recyclable}</div>
                  <p className="text-[11px] text-[var(--color-text-muted)] mt-1.5">Plastic bottles, clean glass, metal cans, clean paper, cardboards.</p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-neutral-100">
                  <span className="text-[10px] font-bold text-rose-800 flex items-center gap-1.5 mb-1 uppercase tracking-wider">
                    <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
                    Residual & Hazardous
                  </span>
                  <div className="text-sm font-extrabold text-[var(--color-text-primary)]">{foundSchedule.residual}</div>
                  <p className="text-[11px] text-[var(--color-text-muted)] mt-1.5">Diapers, sanitary napkins, hazardous elements. Pack separately.</p>
                </div>
              </div>

              <div className="mt-4 p-3 bg-neutral-50 rounded-xl text-xs text-[var(--color-text-muted)] flex items-center justify-between">
                <span>Assigned Vehicle: <strong className="text-[var(--color-text-primary)]">{foundSchedule.truck}</strong></span>
                <span className="text-[var(--color-primary)] font-semibold">Strict segregation is required by law.</span>
              </div>
            </div>
          ) : (
            <div className="p-8 border border-dashed border-neutral-200 rounded-2xl text-center bg-neutral-50/50">
              <p className="text-sm text-[var(--color-text-muted)] font-medium">
                No Sitio selected. Please select your location zone from the dropdown to see your local calendar.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ── Government Transparency & KPI Counters ────────────────────── */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1 text-xs font-bold text-[var(--color-primary)] uppercase tracking-wider mb-2">
            <BarChart3 className="w-4 h-4 text-emerald-500" />
            Performance & Accountability
          </div>
          <h2 className="text-3xl font-black text-[var(--color-text-primary)] tracking-tight" style={{ fontFamily: "var(--font-heading)" }}>
            Monthly Sanitation Audit Scorecard
          </h2>
          <p className="text-xs text-[var(--color-text-muted)] mt-2">
            Real-time public transparency board compiled from daily collector logbooks and supervisor field reports.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-6 bg-white border border-[var(--color-border)] rounded-2xl hover:border-[var(--color-primary)] transition-all text-center">
            <span className="text-xs text-[var(--color-text-muted)] uppercase tracking-wider block mb-1">Total Waste Diverted</span>
            <div className="text-3xl font-extrabold text-[var(--color-text-primary)]">1,240 <span className="text-sm font-medium">kg</span></div>
            <p className="text-[10px] text-emerald-700 font-bold mt-2 flex items-center justify-center gap-1">
              <TrendingUp size={12} className="text-emerald-600" /> +14% from last month
            </p>
          </div>
          <div className="p-6 bg-white border border-[var(--color-border)] rounded-2xl hover:border-[var(--color-primary)] transition-all text-center">
            <span className="text-xs text-[var(--color-text-muted)] uppercase tracking-wider block mb-1">Avg Route Completion</span>
            <div className="text-3xl font-extrabold text-[var(--color-text-primary)]">98.4%</div>
            <p className="text-[10px] text-emerald-700 font-bold mt-2 flex items-center justify-center gap-1">
              <CheckCircle2 size={12} className="text-emerald-600" /> Meets target standard
            </p>
          </div>
          <div className="p-6 bg-white border border-[var(--color-border)] rounded-2xl hover:border-[var(--color-primary)] transition-all text-center">
            <span className="text-xs text-[var(--color-text-muted)] uppercase tracking-wider block mb-1">Response Resolution</span>
            <div className="text-3xl font-extrabold text-[var(--color-text-primary)]">24 <span className="text-xs font-medium">hours</span></div>
            <p className="text-[10px] text-emerald-700 font-bold mt-2 flex items-center justify-center gap-1">
              <Clock size={12} className="text-emerald-600" /> Incident solving average
            </p>
          </div>
          <div className="p-6 bg-white border border-[var(--color-border)] rounded-2xl hover:border-[var(--color-primary)] transition-all text-center">
            <span className="text-xs text-[var(--color-text-muted)] uppercase tracking-wider block mb-1">Ecology Personnel</span>
            <div className="text-3xl font-extrabold text-[var(--color-text-primary)]">18 <span className="text-xs font-medium">Staff</span></div>
            <p className="text-[10px] text-emerald-700 font-bold mt-2 flex items-center justify-center gap-1">
              <ShieldCheck size={12} className="text-emerald-600" /> Daily deployment teams
            </p>
          </div>
        </div>
      </section>

      {/* ── Ecological Solid Waste Management (RA 9003) Charter ───────── */}
      <section id="about" className="py-16 border-t border-b border-[var(--color-border)]" style={{ background: "var(--color-bg-surface)" }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--color-primary)] uppercase tracking-wider mb-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Citizen Charter Guidelines
            </div>
            <h2 className="text-3xl font-black text-[var(--color-text-primary)]" style={{ fontFamily: "var(--font-heading)" }}>
              The Barangay Segregation Mandate
            </h2>
            <p className="text-xs text-[var(--color-text-muted)] mt-2">
              Under Republic Act 9003, failure to classify and segregate garbage at source is subject to LGU administrative penalties. Follow our simple citizen guide below.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Left selector */}
            <div className="lg:col-span-4 flex flex-col gap-2.5">
              <button
                type="button"
                onClick={() => setActiveSortingTab("organic")}
                className={`p-4 rounded-xl text-left border transition-all ${
                  activeSortingTab === "organic" 
                    ? "bg-[#626F47] border-[#626F47] text-white shadow-md" 
                    : "bg-white border-[var(--color-border)] hover:bg-neutral-50 text-[var(--color-text-primary)]"
                }`}
              >
                <div className="font-bold text-sm flex items-center gap-2">
                  <Leaf className="w-4 h-4 text-emerald-500 shrink-0" />
                  Class I: Organic & Biodegradable
                </div>
                <p className="text-[11px] opacity-80 mt-1">Garden leaves, vegetable discards, and organic animal feedstock.</p>
              </button>

              <button
                type="button"
                onClick={() => setActiveSortingTab("recyclable")}
                className={`p-4 rounded-xl text-left border transition-all ${
                  activeSortingTab === "recyclable" 
                    ? "bg-[#626F47] border-[#626F47] text-white shadow-md" 
                    : "bg-white border-[var(--color-border)] hover:bg-neutral-50 text-[var(--color-text-primary)]"
                }`}
              >
                <div className="font-bold text-sm flex items-center gap-2">
                  <Trash2 className="w-4 h-4 text-blue-500 shrink-0" />
                  Class II: Recyclable Dry Waste
                </div>
                <p className="text-[11px] opacity-80 mt-1">Solderable tin boxes, rigid plastic containers, papers, cardboards.</p>
              </button>

              <button
                type="button"
                onClick={() => setActiveSortingTab("residual")}
                className={`p-4 rounded-xl text-left border transition-all ${
                  activeSortingTab === "residual" 
                    ? "bg-[#626F47] border-[#626F47] text-white shadow-md" 
                    : "bg-white border-[var(--color-border)] hover:bg-neutral-50 text-[var(--color-text-primary)]"
                }`}
              >
                <div className="font-bold text-sm flex items-center gap-2">
                  <Trash2 className="w-4 h-4 text-neutral-500 shrink-0" />
                  Class III: Residual Waste
                </div>
                <p className="text-[11px] opacity-80 mt-1">Sanitary sanitaryware, diapers, soiled packaging, multi-layer boxes.</p>
              </button>

              <button
                type="button"
                onClick={() => setActiveSortingTab("hazardous")}
                className={`p-4 rounded-xl text-left border transition-all ${
                  activeSortingTab === "hazardous" 
                    ? "bg-[#626F47] border-[#626F47] text-white shadow-md" 
                    : "bg-white border-[var(--color-border)] hover:bg-neutral-50 text-[var(--color-text-primary)]"
                }`}
              >
                <div className="font-bold text-sm flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
                  Class IV: Special & Hazardous
                </div>
                <p className="text-[11px] opacity-80 mt-1">Leaky battery units, electronic computer parts, expired medical packs.</p>
              </button>
            </div>

            {/* Right details display card */}
            <div className="lg:col-span-8 bg-white border border-[var(--color-border)] rounded-2xl p-6 lg:p-8 flex flex-col justify-between">
              {activeSortingTab === "organic" && (
                <div className="animate-fade-in space-y-4">
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-3 py-1 rounded-full uppercase">Biodegradable Directives</span>
                  <h3 className="text-xl font-bold text-[var(--color-text-primary)]" style={{ fontFamily: "var(--font-heading)" }}>Class I: Natural Compostable Substances</h3>
                  <p className="text-xs text-[var(--color-text-muted)] leading-relaxed">
                    Under Barangay Banilad Ecological Regulation, organic components must be disposed in biological compost canisters or wrapped cleanly in biodegradable bio-sacks.
                  </p>
                  <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
                    <div className="p-3 bg-neutral-50 rounded-lg">
                      <strong className="text-emerald-800 flex items-center gap-1.5 mb-1">
                        <Check size={14} className="text-emerald-600 shrink-0" />
                        Approved Items
                      </strong>
                      Fruit discards, fish guts, animal leftovers, coffee grounds, garden weeds.
                    </div>
                    <div className="p-3 bg-neutral-50 rounded-lg">
                      <strong className="text-rose-800 flex items-center gap-1.5 mb-1">
                        <X size={14} className="text-rose-600 shrink-0" />
                        Prohibited Items
                      </strong>
                      Pet waste, medical gauze, plastic grocery wraps, toxic wood preservatives.
                    </div>
                  </div>
                </div>
              )}

              {activeSortingTab === "recyclable" && (
                <div className="animate-fade-in space-y-4">
                  <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-3 py-1 rounded-full uppercase">Recyclable Dry Goods</span>
                  <h3 className="text-xl font-bold text-[var(--color-text-primary)]" style={{ fontFamily: "var(--font-heading)" }}>Class II: Reusable Dry Fractions</h3>
                  <p className="text-xs text-[var(--color-text-muted)] leading-relaxed">
                    Dry recycable trash must be rinsed completely clean before truck pick-up. Damp cardboards must be flattened out to compress total volume inside public collection units.
                  </p>
                  <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
                    <div className="p-3 bg-neutral-50 rounded-lg">
                      <strong className="text-emerald-800 flex items-center gap-1.5 mb-1">
                        <Check size={14} className="text-emerald-600 shrink-0" />
                        Approved Items
                      </strong>
                      PET clear bottles, empty metal tinwares, dry white sheets, corrugated cardboard flaps.
                    </div>
                    <div className="p-3 bg-neutral-50 rounded-lg">
                      <strong className="text-rose-800 flex items-center gap-1.5 mb-1">
                        <X size={14} className="text-rose-600 shrink-0" />
                        Prohibited Items
                      </strong>
                      Soiled food cardboard boxes, oil canisters, carbonaceous tracing paper.
                    </div>
                  </div>
                </div>
              )}

              {activeSortingTab === "residual" && (
                <div className="animate-fade-in space-y-4">
                  <span className="bg-neutral-100 text-neutral-800 text-[10px] font-bold px-3 py-1 rounded-full uppercase">Residual Materials</span>
                  <h3 className="text-xl font-bold text-[var(--color-text-primary)]" style={{ fontFamily: "var(--font-heading)" }}>Class III: Ultimate Discards</h3>
                  <p className="text-xs text-[var(--color-text-muted)] leading-relaxed">
                    Residual wastes are non-recyclable materials destined directly for authorized municipal sanitary landfills. Always bundle safely inside black heavy-gauge trash sacks.
                  </p>
                  <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
                    <div className="p-3 bg-neutral-50 rounded-lg">
                      <strong className="text-emerald-800 flex items-center gap-1.5 mb-1">
                        <Check size={14} className="text-emerald-600 shrink-0" />
                        Approved Items
                      </strong>
                      Domestic sanitary napkins, single-use diapers, multi-layer foil chip packaging bags.
                    </div>
                    <div className="p-3 bg-neutral-50 rounded-lg">
                      <strong className="text-rose-800 flex items-center gap-1.5 mb-1">
                        <X size={14} className="text-rose-600 shrink-0" />
                        Prohibited Items
                      </strong>
                      Sewer liquids, toxic automotive parts, mercury light tubes, chemical reagent flasks.
                    </div>
                  </div>
                </div>
              )}

              {activeSortingTab === "hazardous" && (
                <div className="animate-fade-in space-y-4">
                  <span className="bg-rose-100 text-rose-800 text-[10px] font-bold px-3 py-1 rounded-full uppercase">Special & Hazardous</span>
                  <h3 className="text-xl font-bold text-[var(--color-text-primary)]" style={{ fontFamily: "var(--font-heading)" }}>Class IV: Dangerous Toxins</h3>
                  <p className="text-xs text-[var(--color-text-muted)] leading-relaxed">
                    DO NOT blend special hazardous chemicals with domestic household bin waste. Hand directly to the Barangay Eco-Patrol or take to the designated Barangay Material Recovery Facility (MRF).
                  </p>
                  <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
                    <div className="p-3 bg-neutral-50 rounded-lg">
                      <strong className="text-emerald-800 flex items-center gap-1.5 mb-1">
                        <Check size={14} className="text-emerald-600 shrink-0" />
                        Approved Items
                      </strong>
                      Fluorescent tubes, lithium batteries, spray containers, expired apothecary items.
                    </div>
                    <div className="p-3 bg-neutral-50 rounded-lg">
                      <strong className="text-rose-800 flex items-center gap-1.5 mb-1">
                        <X size={14} className="text-rose-600 shrink-0" />
                        Prohibited Items
                      </strong>
                      Unidentified pressurized chemical gas cylinders, nuclear radiative wastes.
                    </div>
                  </div>
                </div>
              )}

              {/* Legal mandate quote */}
              <div className="mt-6 pt-4 border-t border-dashed border-neutral-200 flex items-start gap-2 text-[11px] text-[var(--color-text-muted)]">
                <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                <span><strong>Article 4, Section 48 (RA 9003):</strong> Unauthorized dumping or mixing of segregated components is punishable by statutory court fines and municipal rendering hours.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Direct Feedback Desk & Emergency Hotline Center ─────────────── */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left panel: Hotlines */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <div className="inline-flex items-center gap-1 text-xs font-bold text-[var(--color-primary)] uppercase tracking-wider mb-2">
                <PhoneCall className="w-4 h-4 text-amber-500 animate-bounce" />
                Contact Registry
              </div>
              <h2 className="text-2xl font-black text-[var(--color-text-primary)]" style={{ fontFamily: "var(--font-heading)" }}>
                Emergency Sanitation Hotlines
              </h2>
              <p className="text-xs text-[var(--color-text-muted)] mt-1">
                Having issues with missed trucks, full smart bins, or illegal trash dumpers? Contact Barangay focal coordinates directly.
              </p>
            </div>

            <div className="space-y-3.5 text-xs">
              <div className="p-4 bg-white border border-[var(--color-border)] rounded-xl flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                  <PhoneCall size={14} className="text-emerald-700" />
                </div>
                <div>
                  <h4 className="font-bold text-[var(--color-text-primary)]">Main LGU Sanitation Office</h4>
                  <p className="text-[var(--color-text-muted)] mt-0.5">Barangay Hall Complex, Banilad, Cebu City</p>
                  <div className="font-mono text-emerald-800 font-bold mt-1">+63 (32) 231-1054</div>
                </div>
              </div>

              <div className="p-4 bg-white border border-[var(--color-border)] rounded-xl flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center shrink-0">
                  <Smartphone size={14} className="text-blue-700" />
                </div>
                <div>
                  <h4 className="font-bold text-[var(--color-text-primary)]">Eco-Patrol & Incident Response Team</h4>
                  <p className="text-[var(--color-text-muted)] mt-0.5">Report garbage piles, roadblock hazards or illegal dumping</p>
                  <div className="font-mono text-emerald-800 font-bold mt-1">+63 (917) 843-0902</div>
                </div>
              </div>

              <div className="p-4 bg-white border border-[var(--color-border)] rounded-xl flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                  <Mail size={14} className="text-amber-700" />
                </div>
                <div>
                  <h4 className="font-bold text-[var(--color-text-primary)]">Administrative Bureau Email</h4>
                  <p className="text-[var(--color-text-muted)] mt-0.5">Send general waste inquiries or public requests</p>
                  <div className="font-mono text-emerald-800 font-bold mt-1">sanitation.banilad@cebucity.gov.ph</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right panel: Feedback form */}
          <div className="lg:col-span-7 bg-white border border-[var(--color-border)] rounded-2xl p-6 lg:p-8 shadow-sm">
            <h3 className="text-lg font-bold text-[var(--color-text-primary)] mb-1 flex items-center gap-2" style={{ fontFamily: "var(--font-heading)" }}>
              <HeartHandshake className="w-5 h-5 text-emerald-600" />
              Citizen Feedback & Service Desk
            </h3>
            <p className="text-xs text-[var(--color-text-muted)] mb-5">
              Have a request or need support? Write directly to our Barangay Sanitation Inspector.
            </p>

            {feedbackStatus === "success" && (
              <div className="mb-4 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-start gap-2.5 animate-bounce">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold">Mabuhay! Feedback Submitted Successfully</h4>
                  <p className="text-[11px] text-emerald-700 mt-0.5">Your ticket has been logged inside our citizen query registry. Our LGU Inspector will contact you within 24 hours.</p>
                </div>
              </div>
            )}

            <form onSubmit={handleFeedbackSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="feedback-name" className="block text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-muted)] mb-1">
                    Your Full Name
                  </label>
                  <input
                    type="text"
                    id="feedback-name"
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--color-border)] bg-neutral-50 text-[var(--color-text-primary)] font-medium text-xs focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:bg-white transition-all"
                    placeholder="e.g. Juan dela Cruz"
                    value={feedbackName}
                    onChange={(e) => setFeedbackName(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="feedback-email" className="block text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-muted)] mb-1">
                    Your Email Address
                  </label>
                  <input
                    type="email"
                    id="feedback-email"
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--color-border)] bg-neutral-50 text-[var(--color-text-primary)] font-medium text-xs focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:bg-white transition-all"
                    placeholder="e.g. juan@gmail.com"
                    value={feedbackEmail}
                    onChange={(e) => setFeedbackEmail(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="feedback-sitio" className="block text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-muted)] mb-1">
                  Your Sitio Location
                </label>
                <select
                  id="feedback-sitio"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--color-border)] bg-neutral-50 text-[var(--color-text-primary)] font-medium text-xs focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:bg-white appearance-none transition-all"
                  value={feedbackSitio}
                  onChange={(e) => setFeedbackSitio(e.target.value)}
                >
                  <option value="">-- Select Sitio subdivision --</option>
                  {SITIO_SCHEDULES.map((s) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="feedback-msg" className="block text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-muted)] mb-1">
                  Message / Request Details
                </label>
                <textarea
                  id="feedback-msg"
                  required
                  rows={4}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--color-border)] bg-neutral-50 text-[var(--color-text-primary)] font-medium text-xs focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:bg-white transition-all resize-none"
                  placeholder="e.g. Please clarify if the Recyclable collection this Wednesday is still on schedule despite the minor rain advisory."
                  value={feedbackMsg}
                  onChange={(e) => setFeedbackMsg(e.target.value)}
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={feedbackStatus === "submitting"}
                  className="bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white font-bold py-2.5 px-6 rounded-xl text-xs uppercase tracking-wider shadow-sm transition-all flex items-center gap-2"
                >
                  {feedbackStatus === "submitting" ? "Transmitting Query..." : "Submit Citizen Query"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* ── Philippine Government Commitment Tagline Banner ────────────── */}
      <section
        className="py-16 text-center text-white border-t border-b border-[var(--color-border)]"
        style={{ background: `linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%)` }}
        aria-label="Philippine government zero-waste call to action"
      >
        <div className="max-w-4xl mx-auto px-6">
          <div className="inline-block text-[10px] font-mono tracking-widest bg-amber-500 text-neutral-950 px-3 py-1 rounded-full uppercase font-bold mb-4">
            MAKIBAHAGI SA ZERO-WASTE BANILAD
          </div>
          <h2
            className="text-3xl lg:text-4xl font-extrabold leading-tight"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Sustaining Cebu City&apos;s Sanitation. <br />
            <span style={{ color: "var(--color-accent)" }}>One Sitio segregation at a time.</span>
          </h2>
          <p className="mt-4 text-xs text-neutral-200 max-w-xl mx-auto">
            Our platform provides transparent waste metrics, structured citizen guidelines, and reliable public updates to foster accountability. Join our eco-segregation initiatives.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link
              href="/login"
              className="bg-white hover:bg-neutral-100 text-[var(--color-primary-dark)] font-extrabold py-3 px-6 rounded-xl text-xs uppercase tracking-wider shadow-sm transition-all"
            >
              Access Admin Portal
            </Link>
            <Link
              href="/feed"
              className="bg-transparent border border-white/20 hover:bg-white/10 text-white font-extrabold py-3 px-6 rounded-xl text-xs uppercase tracking-wider transition-all"
            >
              Explore Public Live Feed
            </Link>
          </div>
        </div>
      </section>

      {/* ── Rich Government Directory Footer ───────────────────────────── */}
      <footer
        className="bg-[#2A311D] text-neutral-300 py-12 border-t border-[#4A5531]/30"
      >
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Col 1: LGU brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[var(--color-primary)] flex items-center justify-center text-white">
                <Building2 className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-black tracking-wider text-white uppercase font-sans">
                  BANILAD LGU Portal
                </h4>
                <p className="text-[10px] text-neutral-400">Solid Waste Bureau</p>
              </div>
            </div>
            <p className="text-[10.5px] leading-relaxed text-neutral-400">
              The official Solid Waste Management and Monitoring platform for Barangay Banilad, Cebu City, Region VII, Philippines. Powered by GARBO.
            </p>
          </div>

          {/* Col 2: Services Charter */}
          <div className="space-y-3">
            <h4 className="text-[11px] font-black tracking-wider text-white uppercase">Citizen Services</h4>
            <ul className="space-y-2 text-[10.5px] text-neutral-400">
              <li>
                <Link href="#schedule-lookup" className="hover:text-amber-400 transition-colors">
                  Sitio Collection Calendar
                </Link>
              </li>
              <li>
                <Link href="#about" className="hover:text-amber-400 transition-colors">
                  RA 9003 Classification Charter
                </Link>
              </li>
              <li>
                <Link href="/feed" className="hover:text-amber-400 transition-colors">
                  Real-time Operational Advisory
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-amber-400 transition-colors">
                  Admin Field Logging Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Direct Focal Coordinates */}
          <div className="space-y-3">
            <h4 className="text-[11px] font-black tracking-wider text-white uppercase">Eco Focal Coordinates</h4>
            <div className="text-[10.5px] space-y-2 text-neutral-400">
              <div>
                <strong className="text-white">Hon. Robert Tecson</strong>
                <p>Chairman, Sanitation Committee</p>
              </div>
              <div>
                <strong className="text-white">Maria Cruz</strong>
                <p>Lead Eco-Patrol Inspector</p>
              </div>
            </div>
          </div>

          {/* Col 4: National Portal Banner Links */}
          <div className="space-y-3">
            <h4 className="text-[11px] font-black tracking-wider text-white uppercase">Philippine Gov Links</h4>
            <ul className="space-y-2 text-[10.5px] text-neutral-400">
              <li>
                <a href="https://www.gov.ph" target="_blank" rel="noopener noreferrer" className="hover:text-amber-400 transition-colors">
                  Official GovPH Gateway
                </a>
              </li>
              <li>
                <a href="https://emb.gov.ph" target="_blank" rel="noopener noreferrer" className="hover:text-amber-400 transition-colors">
                  Environmental Management Bureau
                </a>
              </li>
              <li>
                <a href="https://denr.gov.ph" target="_blank" rel="noopener noreferrer" className="hover:text-amber-400 transition-colors">
                  DENR National Portal
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Legal credentials line */}
        <div className="max-w-6xl mx-auto px-6 mt-10 pt-6 border-t border-[#4A5531]/20 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] text-neutral-500">
          <p>© {new Date().getFullYear()} Barangay Banilad Solid Waste Management. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-neutral-400 transition-colors">LGU Privacy Policy</a>
            <a href="#" className="hover:text-neutral-400 transition-colors">Terms of Public Service</a>
            <a href="#" className="hover:text-neutral-400 transition-colors">CCRVibe Tech Systems</a>
          </div>
        </div>
      </footer>

    </div>
  );
}
