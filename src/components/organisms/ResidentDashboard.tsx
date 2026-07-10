"use client";

import { useState } from "react";
import { 
  Calendar, 
  MapPin, 
  AlertOctagon, 
  CheckCircle, 
  Megaphone, 
  Leaf, 
  Info,
  Trash2,
  Clock,
  Sparkles,
  AlertTriangle,
  Truck
} from "lucide-react";
import { Button } from "@/components/atoms/Button";
import { cn } from "@/lib/utils/cn";
import getSupabaseBrowserClient from "../../../supabase/client";

interface Sitio {
  id: string;
  name: string;
  description: string | null;
}

interface Schedule {
  id: string;
  sitio_id: string;
  route_name: string;
  collection_days: string[];
  frequency: string;
  is_active: boolean;
}

interface Announcement {
  id: string;
  title: string;
  body: string;
  type: string;
  created_at: string;
}

interface ResidentDashboardProps {
  user: { email?: string | null; user_metadata?: { full_name?: string } | null } | null;
  sitios: Sitio[];
  schedules: Schedule[];
  announcements: Announcement[];
  fallbackAdminId: string;
  greeting: string;
  dateLabel: string;
}

export function ResidentDashboard({
  user,
  sitios,
  schedules,
  announcements,
  fallbackAdminId,
  greeting,
  dateLabel,
}: ResidentDashboardProps) {
  const supabase = getSupabaseBrowserClient();
  const citizenName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Resident";

  // State
  const [selectedSitioId, setSelectedSitioId] = useState<string>(sitios[0]?.id || "");
  const [incidentType, setIncidentType] = useState<string>("Missed Collection");
  const [reasonTag, setReasonTag] = useState<string>("No collection team arrived");
  const [locationDesc, setLocationDesc] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submissionSuccess, setSubmissionSuccess] = useState<boolean>(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  // Active schedules for selected sitio
  const activeSchedules = schedules.filter(
    (s) => s.sitio_id === selectedSitioId && s.is_active
  );

  const selectedSitioName = sitios.find((s) => s.id === selectedSitioId)?.name || "your Sitio";

  // Simulated smart bins state for TC-07 Bin Status Monitoring
  const [organicBinFill, setOrganicBinFill] = useState<number>(42);
  const [recycleBinFill, setRecycleBinFill] = useState<number>(78);
  const [residualBinFill, setResidualBinFill] = useState<number>(18);
  const [binAlertText, setBinAlertText] = useState<string | null>(null);

  // Simulated truck transit tracker for TC-08 Route Monitoring
  const [truckETA, setTruckETA] = useState<number>(12);
  const [truckStatus, setTruckStatus] = useState<string>("In Transit");
  const [gpsProgress, setGpsProgress] = useState<number>(65);

  const handleDisposeWaste = (binType: "organic" | "recycle" | "residual") => {
    if (binType === "organic") {
      setOrganicBinFill((prev) => {
        const next = Math.min(100, prev + 15);
        if (next >= 80) {
          setBinAlertText(`[Automated Alert]: Organic waste bin in ${selectedSitioName} has reached a critical level (${next}%)! Collection pickup triggered.`);
        }
        return next;
      });
    } else if (binType === "recycle") {
      setRecycleBinFill((prev) => {
        const next = Math.min(100, prev + 12);
        if (next >= 80) {
          setBinAlertText(`[Automated Alert]: Recyclable waste bin in ${selectedSitioName} has reached a critical level (${next}%)! Collection pickup triggered.`);
        }
        return next;
      });
    } else {
      setResidualBinFill((prev) => {
        const next = Math.min(100, prev + 10);
        if (next >= 80) {
          setBinAlertText(`[Automated Alert]: Residual waste bin in ${selectedSitioName} has reached a critical level (${next}%)! Collection pickup triggered.`);
        }
        return next;
      });
    }
  };

  const handleEmptyBin = (binType: "organic" | "recycle" | "residual") => {
    if (binType === "organic") {
      setOrganicBinFill(0);
    } else if (binType === "recycle") {
      setRecycleBinFill(0);
    } else {
      setResidualBinFill(0);
    }
    setBinAlertText(null);
  };

  const handleSimulateGPS = () => {
    setGpsProgress((prev) => {
      const next = prev >= 95 ? 20 : prev + 10;
      const nextETA = Math.max(2, Math.round((100 - next) * 0.3));
      setTruckETA(nextETA);
      if (next >= 90) {
        setTruckStatus("Arrived & Loading");
      } else if (next >= 75) {
        setTruckStatus("Approaching Block");
      } else {
        setTruckStatus("In Transit");
      }
      return next;
    });
  };

  const handleIncidentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmissionSuccess(false);
    setSubmissionError(null);

    try {
      const { error } = await supabase.from("incidents").insert({
        sitio_id:             selectedSitioId,
        incident_type:        incidentType as "Missed Collection" | "Illegal Dumping" | "Vehicle Breakdown" | "Other",
        reason_tag:           reasonTag,
        location_description: locationDesc || null,
        incident_date:        new Date().toISOString().split("T")[0]!,
        logged_by:            fallbackAdminId,
      });

      if (error) {
        throw new Error(error.message);
      }

      setSubmissionSuccess(true);
      setLocationDesc("");
      setNotes("");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setSubmissionError(msg || "Failed to submit report. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div id="resident-dashboard-root" className="animate-fade-in max-w-[1360px] space-y-8">
      
      {/* ── Page Header ─────────────────────────────────────────────── */}
      <div id="resident-header" className="page-header mb-0">
        <h2 className="page-header__title">
          {greeting}{" "}
          <span className="text-[var(--color-primary)] capitalize">{citizenName}</span>
        </h2>
        <p className="page-header__subtitle mt-1">
          {dateLabel} · Welcome to the Citizen Waste Portal
        </p>
      </div>

      <div id="resident-main-grid" className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* ── LEFT HAND SIDE (8 columns on lg) ───────────────────────── */}
        <div id="resident-left-col" className="lg:col-span-7 space-y-8">
          
          {/* Sitio & Schedule Card */}
          <section id="resident-schedule-card" className="card p-6" aria-labelledby="schedule-heading">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h3 id="schedule-heading" className="text-lg font-bold text-[var(--color-text-primary)] flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-[var(--color-primary)]" />
                  Collection Schedule
                </h3>
                <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
                  View scheduled garbage pickup times for your area
                </p>
              </div>

              {/* Sitio Dropdown */}
              <div className="flex items-center gap-2">
                <label htmlFor="sitio-select" className="text-xs font-semibold text-[var(--color-text-muted)] shrink-0">
                  Select Sitio:
                </label>
                <select
                  id="sitio-select"
                  value={selectedSitioId}
                  onChange={(e) => setSelectedSitioId(e.target.value)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg bg-[var(--color-bg-page)] border border-[var(--color-border)]",
                    "text-[var(--color-text-primary)] text-xs focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                  )}
                >
                  {sitios.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Schedule Info */}
            {activeSchedules.length > 0 ? (
              <div className="space-y-4">
                {activeSchedules.map((sch) => (
                  <div 
                    key={sch.id} 
                    className="p-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-page)] hover:border-[var(--color-primary)] transition-all duration-200"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-[var(--color-primary)] uppercase tracking-wider">
                            {sch.frequency}
                          </span>
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          <span className="text-[10px] text-emerald-500 font-medium">Active Route</span>
                        </div>
                        <h4 className="font-bold text-sm text-[var(--color-text-primary)] mt-1">
                          {sch.route_name}
                        </h4>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap items-center gap-2">
                      <span className="text-xs text-[var(--color-text-muted)] font-medium">Collection Days:</span>
                      {sch.collection_days.map((day) => (
                        <span 
                          key={day} 
                          className="px-2 py-1 rounded bg-[var(--color-primary-light)] text-[var(--color-primary)] text-xs font-semibold"
                        >
                          {day}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center border border-dashed border-[var(--color-border)] rounded-xl bg-[var(--color-bg-page)]">
                <MapPin className="w-8 h-8 text-[var(--color-text-muted)] mx-auto mb-2 opacity-60" />
                <p className="text-sm font-semibold text-[var(--color-text-primary)]">
                  No collection routes scheduled
                </p>
                <p className="text-xs text-[var(--color-text-muted)] mt-1">
                  There are no active garbage routes scheduled for {selectedSitioName} right now.
                </p>
              </div>
            )}
          </section>

          {/* Smart Bin & Route Monitor Widget */}
          <section id="resident-bin-monitor-card" className="card p-6 border border-[var(--color-border)] bg-[var(--color-bg-surface)]" aria-labelledby="bin-monitor-heading">
            <h3 id="bin-monitor-heading" className="text-lg font-bold text-[var(--color-text-primary)] mb-1 flex items-center gap-2" style={{ fontFamily: "var(--font-heading)" }}>
              <Sparkles className="w-5 h-5 text-emerald-500 animate-pulse" />
              Neighborhood Smart Bins & Route Monitor
            </h3>
            <p className="text-xs text-[var(--color-text-muted)] mb-5">
              Live status telemetry for {selectedSitioName} public smart waste hubs
            </p>

            {binAlertText && (
              <div id="smart-bin-alert" className="mb-4 p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs font-semibold animate-bounce flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-rose-500 mt-0.5" />
                <span>{binAlertText}</span>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {/* Organic Bin */}
              <div className="p-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-page)] hover:border-emerald-500/30 transition-all">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                    <Trash2 className="w-3.5 h-3.5" />
                    Organic Bin
                  </span>
                  <span className={cn(
                    "text-[10px] font-bold px-2 py-0.5 rounded",
                    organicBinFill >= 80 ? "bg-rose-100 text-rose-700" : organicBinFill >= 50 ? "bg-amber-100 text-amber-700" : "bg-green-100 text-green-700"
                  )}>
                    {organicBinFill >= 80 ? "CRITICAL" : organicBinFill >= 50 ? "MODERATE" : "OK"}
                  </span>
                </div>
                <div className="h-2 rounded-full bg-[var(--color-bg-muted)] overflow-hidden mb-3">
                  <div className="h-full rounded-full transition-all duration-300" style={{
                    width: `${organicBinFill}%`,
                    backgroundColor: organicBinFill >= 80 ? "#ef4444" : organicBinFill >= 50 ? "#f59e0b" : "#10b981"
                  }} />
                </div>
                <div className="flex items-center justify-between text-xs mb-3">
                  <span className="text-[var(--color-text-muted)]">Capacity:</span>
                  <span className="font-semibold text-[var(--color-text-primary)]">{organicBinFill}%</span>
                </div>
                <div className="flex gap-1">
                  <button id="btn-organic-dispose" type="button" onClick={() => handleDisposeWaste("organic")} className="flex-1 text-[10px] bg-[var(--color-primary)] hover:bg-emerald-700 text-white font-bold py-1 px-1.5 rounded transition-all">
                    Use Bin
                  </button>
                  <button id="btn-organic-empty" type="button" onClick={() => handleEmptyBin("organic")} className="text-[10px] border border-[var(--color-border)] hover:bg-[var(--color-bg-muted)] text-[var(--color-text-secondary)] font-bold py-1 px-1.5 rounded transition-all">
                    Empty
                  </button>
                </div>
              </div>

              {/* Recyclable Bin */}
              <div className="p-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-page)] hover:border-blue-500/30 transition-all">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-blue-700 flex items-center gap-1">
                    <Trash2 className="w-3.5 h-3.5" />
                    Recyclable Bin
                  </span>
                  <span className={cn(
                    "text-[10px] font-bold px-2 py-0.5 rounded",
                    recycleBinFill >= 80 ? "bg-rose-100 text-rose-700" : recycleBinFill >= 50 ? "bg-amber-100 text-amber-700" : "bg-blue-100 text-blue-700"
                  )}>
                    {recycleBinFill >= 80 ? "CRITICAL" : recycleBinFill >= 50 ? "MODERATE" : "OK"}
                  </span>
                </div>
                <div className="h-2 rounded-full bg-[var(--color-bg-muted)] overflow-hidden mb-3">
                  <div className="h-full rounded-full transition-all duration-300" style={{
                    width: `${recycleBinFill}%`,
                    backgroundColor: recycleBinFill >= 80 ? "#ef4444" : recycleBinFill >= 50 ? "#f59e0b" : "#3b82f6"
                  }} />
                </div>
                <div className="flex items-center justify-between text-xs mb-3">
                  <span className="text-[var(--color-text-muted)]">Capacity:</span>
                  <span className="font-semibold text-[var(--color-text-primary)]">{recycleBinFill}%</span>
                </div>
                <div className="flex gap-1">
                  <button id="btn-recycle-dispose" type="button" onClick={() => handleDisposeWaste("recycle")} className="flex-1 text-[10px] bg-[var(--color-primary)] hover:bg-emerald-700 text-white font-bold py-1 px-1.5 rounded transition-all">
                    Use Bin
                  </button>
                  <button id="btn-recycle-empty" type="button" onClick={() => handleEmptyBin("recycle")} className="text-[10px] border border-[var(--color-border)] hover:bg-[var(--color-bg-muted)] text-[var(--color-text-secondary)] font-bold py-1 px-1.5 rounded transition-all">
                    Empty
                  </button>
                </div>
              </div>

              {/* Residual Bin */}
              <div className="p-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-page)] hover:border-gray-500/30 transition-all">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-gray-700 flex items-center gap-1">
                    <Trash2 className="w-3.5 h-3.5" />
                    Residual Bin
                  </span>
                  <span className={cn(
                    "text-[10px] font-bold px-2 py-0.5 rounded",
                    residualBinFill >= 80 ? "bg-rose-100 text-rose-700" : residualBinFill >= 50 ? "bg-amber-100 text-amber-700" : "bg-gray-100 text-gray-700"
                  )}>
                    {residualBinFill >= 80 ? "CRITICAL" : residualBinFill >= 50 ? "MODERATE" : "OK"}
                  </span>
                </div>
                <div className="h-2 rounded-full bg-[var(--color-bg-muted)] overflow-hidden mb-3">
                  <div className="h-full rounded-full transition-all duration-300" style={{
                    width: `${residualBinFill}%`,
                    backgroundColor: residualBinFill >= 80 ? "#ef4444" : residualBinFill >= 50 ? "#f59e0b" : "#6b7280"
                  }} />
                </div>
                <div className="flex items-center justify-between text-xs mb-3">
                  <span className="text-[var(--color-text-muted)]">Capacity:</span>
                  <span className="font-semibold text-[var(--color-text-primary)]">{residualBinFill}%</span>
                </div>
                <div className="flex gap-1">
                  <button id="btn-residual-dispose" type="button" onClick={() => handleDisposeWaste("residual")} className="flex-1 text-[10px] bg-[var(--color-primary)] hover:bg-emerald-700 text-white font-bold py-1 px-1.5 rounded transition-all">
                    Use Bin
                  </button>
                  <button id="btn-residual-empty" type="button" onClick={() => handleEmptyBin("residual")} className="text-[10px] border border-[var(--color-border)] hover:bg-[var(--color-bg-muted)] text-[var(--color-text-secondary)] font-bold py-1 px-1.5 rounded transition-all">
                    Empty
                  </button>
                </div>
              </div>
            </div>

            {/* Collection Vehicle Live Tracker */}
            <div className="p-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-page)]">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[var(--color-text-primary)]">Assigned Collection Truck: TRUCK-A104</h4>
                    <p className="text-[10px] text-[var(--color-text-muted)]">Target Sector: {selectedSitioName}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[10px] font-bold text-white bg-emerald-500 px-2 py-0.5 rounded uppercase">
                    {truckStatus}
                  </span>
                  <span className="text-xs font-bold text-[var(--color-text-primary)]">
                    ETA: {truckETA} mins
                  </span>
                </div>
              </div>

              {/* Progress bar representing travel */}
              <div className="relative mb-4 pt-2">
                <div className="h-1.5 rounded-full bg-[var(--color-bg-muted)] overflow-hidden">
                  <div className="h-full rounded-full bg-emerald-500 transition-all duration-500" style={{ width: `${gpsProgress}%` }} />
                </div>
                {/* Truck marker */}
                <div className="absolute top-1.5 -translate-y-1/2 -translate-x-1/2 transition-all duration-500" style={{ left: `${gpsProgress}%` }}>
                  <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow">
                    <Truck className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between text-[10px] text-[var(--color-text-muted)] mb-4">
                <span>Central Depot (Banilad)</span>
                <span>Active Route Tracking</span>
                <span>{selectedSitioName} Depot</span>
              </div>

              <div className="flex justify-end">
                <button id="btn-simulate-gps" type="button" onClick={handleSimulateGPS} className="text-xs text-[var(--color-primary)] hover:text-emerald-700 font-bold flex items-center gap-1">
                  Simulate GPS Travel Step
                </button>
              </div>
            </div>
          </section>

          {/* Announcements section */}
          <section id="resident-announcements" className="card p-6" aria-labelledby="announcements-heading">
            <h3 id="announcements-heading" className="text-lg font-bold text-[var(--color-text-primary)] mb-4 flex items-center gap-2">
              <Megaphone className="w-5 h-5 text-amber-500" />
              Barangay Advisory & Notices
            </h3>

            {announcements.length > 0 ? (
              <div className="divide-y divide-[var(--color-border)]">
                {announcements.map((ann) => (
                  <div key={ann.id} className="py-4 first:pt-0 last:pb-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className={cn(
                        "text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded",
                        ann.type === "Weather Delay" && "bg-amber-100 text-amber-800 border border-amber-200",
                        ann.type === "Cancellation" && "bg-rose-100 text-rose-800 border border-rose-200",
                        ann.type === "Notice" && "bg-blue-100 text-blue-800 border border-blue-200",
                        ann.type === "Reminder" && "bg-emerald-100 text-emerald-800 border border-emerald-200",
                        (!ann.type || ann.type === "Other") && "bg-gray-100 text-gray-800 border border-gray-200"
                      )}>
                        {ann.type || "Update"}
                      </span>
                      <span className="text-[10px] text-[var(--color-text-muted)]">
                        {new Date(ann.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <h4 className="font-bold text-sm text-[var(--color-text-primary)]">
                      {ann.title}
                    </h4>
                    <p className="text-xs text-[var(--color-text-muted)] mt-1 leading-relaxed">
                      {ann.body}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center bg-[var(--color-bg-page)] rounded-xl border border-[var(--color-border)]">
                <Info className="w-6 h-6 text-[var(--color-text-muted)] mx-auto mb-2 opacity-50" />
                <p className="text-xs text-[var(--color-text-muted)]">
                  All quiet in {selectedSitioName}. No active notices today.
                </p>
              </div>
            )}
          </section>

        </div>

        {/* ── RIGHT HAND SIDE (5 columns on lg) ──────────────────────── */}
        <div id="resident-right-col" className="lg:col-span-5 space-y-8">
          
          {/* Quick Action: Report Incident Form */}
          <section id="resident-report-card" className="card p-6" aria-labelledby="report-heading">
            <h3 id="report-heading" className="text-lg font-bold text-[var(--color-text-primary)] flex items-center gap-2">
              <AlertOctagon className="w-5 h-5 text-[var(--color-danger)]" />
              Report an Issue
            </h3>
            <p className="text-xs text-[var(--color-text-muted)] mt-0.5 mb-6">
              Instantly file a ticket for missed trash pickup or illegal waste dumping
            </p>

            {submissionSuccess ? (
              <div className="p-5 text-center bg-emerald-50 dark:bg-emerald-950/20 rounded-xl border border-emerald-200 animate-fade-in">
                <CheckCircle className="w-10 h-10 text-emerald-500 mx-auto mb-3" />
                <h4 className="font-bold text-sm text-emerald-800 dark:text-emerald-400">Report Submitted Successfully</h4>
                <p className="text-xs text-emerald-600 dark:text-emerald-500 mt-1 leading-relaxed">
                  The barangay sanitation office has been notified. We will inspect {selectedSitioName} shortly.
                </p>
                <Button 
                  id="btn-report-another"
                  variant="outline" 
                  size="sm" 
                  className="mt-4"
                  onClick={() => setSubmissionSuccess(false)}
                >
                  File another report
                </Button>
              </div>
            ) : (
              <form onSubmit={handleIncidentSubmit} className="space-y-4">
                <div>
                  <label htmlFor="issue-type" className="block text-xs font-semibold text-[var(--color-text-muted)] mb-1">
                    What is the issue?
                  </label>
                  <select
                    id="issue-type"
                    value={incidentType}
                    onChange={(e) => {
                      setIncidentType(e.target.value);
                      if (e.target.value === "Missed Collection") {
                        setReasonTag("No collection team arrived");
                      } else {
                        setReasonTag("Unsupervised dumping on sidewalk");
                      }
                    }}
                    className={cn(
                      "w-full px-3 py-2 rounded-lg bg-[var(--color-bg-page)] border border-[var(--color-border)]",
                      "text-[var(--color-text-primary)] text-xs focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                    )}
                  >
                    <option value="Missed Collection">Missed Garbage Collection</option>
                    <option value="Illegal Dumping">Illegal Trash Dumping</option>
                    <option value="Other">Other Operational Issue</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="reason-tag" className="block text-xs font-semibold text-[var(--color-text-muted)] mb-1">
                    Primary Reason
                  </label>
                  <select
                    id="reason-tag"
                    value={reasonTag}
                    onChange={(e) => setReasonTag(e.target.value)}
                    className={cn(
                      "w-full px-3 py-2 rounded-lg bg-[var(--color-bg-page)] border border-[var(--color-border)]",
                      "text-[var(--color-text-primary)] text-xs focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                    )}
                  >
                    {incidentType === "Missed Collection" ? (
                      <>
                        <option value="No collection team arrived">No collection team arrived today</option>
                        <option value="Truck bypassed my block">Truck bypassed my street/block</option>
                        <option value="Only partial bags collected">Only partial bags collected</option>
                      </>
                    ) : (
                      <>
                        <option value="Unsupervised dumping on sidewalk">Unsupervised dumping on sidewalk</option>
                        <option value="Commercial waste in residential bin">Commercial waste in residential bin</option>
                        <option value="Construction debris discarded">Construction debris discarded</option>
                      </>
                    )}
                    <option value="Other">Other (Please explain below)</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="location-desc" className="block text-xs font-semibold text-[var(--color-text-muted)] mb-1">
                    Specific Location
                  </label>
                  <input
                    id="location-desc"
                    type="text"
                    required
                    placeholder="e.g. Near Block 3 Lot 15, beside the green gate"
                    value={locationDesc}
                    onChange={(e) => setLocationDesc(e.target.value)}
                    className={cn(
                      "w-full px-3 py-2 rounded-lg bg-[var(--color-bg-page)] border border-[var(--color-border)]",
                      "text-[var(--color-text-primary)] text-xs focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                    )}
                  />
                </div>

                <div>
                  <label htmlFor="notes" className="block text-xs font-semibold text-[var(--color-text-muted)] mb-1">
                    Additional Details / Notes
                  </label>
                  <textarea
                    id="notes"
                    rows={2}
                    placeholder="Provide any additional notes or descriptions..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className={cn(
                      "w-full px-3 py-2 rounded-lg bg-[var(--color-bg-page)] border border-[var(--color-border)] resize-none",
                      "text-[var(--color-text-primary)] text-xs focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                    )}
                  />
                </div>

                {submissionError && (
                  <div className="p-3 text-xs text-rose-600 bg-rose-50 border border-rose-200 rounded-lg">
                    {submissionError}
                  </div>
                )}

                <Button
                  id="btn-submit-incident"
                  type="submit"
                  variant="danger"
                  size="md"
                  fullWidth
                  isLoading={isSubmitting}
                >
                  File Incident Report
                </Button>
              </form>
            )}
          </section>

          {/* Green Living & Waste Sorting Guide */}
          <section id="resident-guide-card" className="card p-6" aria-labelledby="guide-heading">
            <h3 id="guide-heading" className="text-lg font-bold text-[var(--color-text-primary)] flex items-center gap-2 mb-4">
              <Leaf className="w-5 h-5 text-emerald-500" />
              Barangay Ecological Sorting Guide
            </h3>

            <div className="space-y-4">
              <div className="flex gap-3">
                <span className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center shrink-0 font-bold text-xs text-green-700">
                  B
                </span>
                <div>
                  <h4 className="text-xs font-bold text-[var(--color-text-primary)]">Biodegradable (Nabubulok)</h4>
                  <p className="text-[11px] text-[var(--color-text-muted)] mt-0.5 leading-relaxed">
                    Food scraps, vegetable peelings, garden leaves, and coffee grounds. Place in green bags.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <span className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center shrink-0 font-bold text-xs text-blue-700">
                  R
                </span>
                <div>
                  <h4 className="text-xs font-bold text-[var(--color-text-primary)]">Recyclable (Balik-Gamit)</h4>
                  <p className="text-[11px] text-[var(--color-text-muted)] mt-0.5 leading-relaxed">
                    Clean bottles, plastic cups, dry cardboard, metals, and aluminum cans. Place in blue bags.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <span className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center shrink-0 font-bold text-xs text-gray-700">
                  S
                </span>
                <div>
                  <h4 className="text-xs font-bold text-[var(--color-text-primary)]">Residual Waste (Di-Nabubulok)</h4>
                  <p className="text-[11px] text-[var(--color-text-muted)] mt-0.5 leading-relaxed">
                    Sanitary pads, disposable diapers, food wrappers, and contaminated plastic wraps. Place in black bags.
                  </p>
                </div>
              </div>
            </div>
          </section>

        </div>

      </div>

    </div>
  );
}
