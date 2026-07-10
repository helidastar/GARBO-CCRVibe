"use client";

import { useState } from "react";
import { 
  Truck, 
  CheckCircle2, 
  Clock, 
  Wrench,
  Gauge
} from "lucide-react";
import { Button } from "@/components/atoms/Button";
import { cn } from "@/lib/utils/cn";
import getSupabaseBrowserClient from "../../../supabase/client";

interface TodayRoute {
  operationId: string;
  scheduleId: string;
  routeName: string;
  sitioName: string;
  status: "Pending" | "Completed" | "Delayed" | "Missed";
  fuelL: number | null;
  wasteKg: number | null;
}

interface CollectorDashboardProps {
  user: { email?: string | null; user_metadata?: { full_name?: string } | null } | null;
  initialRoutes: TodayRoute[];
  fallbackAdminId: string;
  greeting: string;
  dateLabel: string;
}

export function CollectorDashboard({
  user,
  initialRoutes,
  fallbackAdminId,
  greeting,
  dateLabel,
}: CollectorDashboardProps) {
  const supabase = getSupabaseBrowserClient();
  const driverName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Collector";

  // State
  const [routes, setRoutes] = useState<TodayRoute[]>(initialRoutes);
  const [activeRouteId, setActiveRouteId] = useState<string | null>(null);
  const [activeIncidentId, setActiveIncidentId] = useState<string | null>(null);
  
  // Forms
  const [fuelConsumed, setFuelConsumed] = useState<string>("");
  const [wasteVolume, setWasteVolume] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Incident Form
  const [incidentReason, setIncidentReason] = useState<string>("Vehicle Breakdown");
  const [incidentNotes, setIncidentNotes] = useState<string>("");

  // KPIs
  const totalAssigned = routes.length;
  const completed = routes.filter((r) => r.status === "Completed").length;
  const remaining = totalAssigned - completed;
  const totalWaste = routes.reduce((sum, r) => sum + (r.wasteKg || 0), 0);
  const totalFuel = routes.reduce((sum, r) => sum + (r.fuelL || 0), 0);

  const handleUpdateStatus = async (routeId: string, status: "Completed" | "Delayed") => {
    setIsSubmitting(true);
    setErrorMsg(null);

    const fuel = fuelConsumed ? parseFloat(fuelConsumed) : null;
    const waste = wasteVolume ? parseFloat(wasteVolume) : null;

    try {
      const { error } = await supabase
        .from("daily_operations")
        .update({
          status:          status,
          fuel_consumed_l: fuel,
          waste_volume_kg: waste,
          notes:           notes || null,
          updated_by:      fallbackAdminId,
          updated_at:      new Date().toISOString(),
        })
        .eq("id", routeId);

      if (error) throw new Error(error.message);

      // Update local state
      setRoutes((prev) =>
        prev.map((r) =>
          r.operationId === routeId
            ? { ...r, status, fuelL: fuel, wasteKg: waste }
            : r
        )
      );

      // Close Form
      setActiveRouteId(null);
      setFuelConsumed("");
      setWasteVolume("");
      setNotes("");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setErrorMsg(msg || "Failed to update collection route.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReportIncident = async (routeId: string, route: TodayRoute) => {
    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      // 1. Get the Sitio ID from daily_operations
      const { data: opData, error: opError } = await supabase
        .from("daily_operations")
        .select("sitio_id")
        .eq("id", routeId)
        .single();

      if (opError) throw opError;

      // 2. Insert incident
      const { error: incError } = await supabase.from("incidents").insert({
        sitio_id:             opData.sitio_id,
        operation_id:         routeId,
        incident_type:        "Vehicle Breakdown",
        reason_tag:           incidentReason,
        location_description: `Assigned route: ${route.routeName}`,
        incident_date:        new Date().toISOString().split("T")[0]!,
        logged_by:            fallbackAdminId,
      });

      if (incError) throw incError;

      // 3. Mark operation as "Delayed" or "Missed" due to break down
      const { error: updateError } = await supabase
        .from("daily_operations")
        .update({
          status:     "Delayed",
          notes:      `[Incident Logged]: ${incidentReason}. ${incidentNotes}`,
          updated_by: fallbackAdminId,
          updated_at: new Date().toISOString(),
        })
        .eq("id", routeId);

      if (updateError) throw updateError;

      // Update local state
      setRoutes((prev) =>
        prev.map((r) =>
          r.operationId === routeId
            ? { ...r, status: "Delayed" }
            : r
        )
      );

      setActiveIncidentId(null);
      setIncidentNotes("");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setErrorMsg(msg || "Failed to log route incident.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div id="collector-dashboard-root" className="animate-fade-in max-w-[1360px] space-y-8">
      
      {/* ── Page Header ─────────────────────────────────────────────── */}
      <div id="collector-header" className="page-header mb-0">
        <h2 className="page-header__title">
          {greeting}{" "}
          <span className="text-[var(--color-primary)] capitalize">{driverName}</span>
        </h2>
        <p className="page-header__subtitle mt-1">
          {dateLabel} · Collector & Route Operator Terminal
        </p>
      </div>

      {/* ── KPI Widgets ──────────────────────────────────────────────── */}
      <section id="collector-kpi-grid" className="grid grid-cols-2 md:grid-cols-5 gap-4" aria-label="Operational status counters">
        <div className="card p-4 flex flex-col justify-between">
          <span className="text-[10px] uppercase font-bold tracking-wider text-[var(--color-text-muted)]">Routes Assigned</span>
          <span className="text-2xl font-extrabold text-[var(--color-text-primary)] mt-2">{totalAssigned}</span>
        </div>

        <div className="card p-4 flex flex-col justify-between">
          <span className="text-[10px] uppercase font-bold tracking-wider text-[var(--color-text-muted)]">Completed</span>
          <span className="text-2xl font-extrabold text-emerald-500 mt-2">{completed}</span>
        </div>

        <div className="card p-4 flex flex-col justify-between">
          <span className="text-[10px] uppercase font-bold tracking-wider text-[var(--color-text-muted)] font-mono">Remaining</span>
          <span className={cn(
            "text-2xl font-extrabold mt-2",
            remaining > 0 ? "text-amber-500" : "text-[var(--color-text-muted)]"
          )}>{remaining}</span>
        </div>

        <div className="card p-4 flex flex-col justify-between">
          <span className="text-[10px] uppercase font-bold tracking-wider text-[var(--color-text-muted)]">Waste Collected</span>
          <span className="text-2xl font-extrabold text-[var(--color-primary)] mt-2">{totalWaste.toLocaleString()} <span className="text-xs font-semibold">kg</span></span>
        </div>

        <div className="card p-4 flex flex-col justify-between col-span-2 md:col-span-1">
          <span className="text-[10px] uppercase font-bold tracking-wider text-[var(--color-text-muted)]">Diesel Consumed</span>
          <span className="text-2xl font-extrabold text-sky-500 mt-2">{totalFuel.toLocaleString()} <span className="text-xs font-semibold">L</span></span>
        </div>
      </section>

      {/* ── Route List & Logging ────────────────────────────────────── */}
      <div id="collector-layout-grid" className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Hand: Route Card Grid (2 cols size on lg) */}
        <div id="collector-routes-list" className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
              Your Daily Route Sheets
            </h3>
            <span className="text-xs text-[var(--color-text-muted)]">
              Select any route to log load and complete
            </span>
          </div>

          {routes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {routes.map((route) => {
                const isActive = activeRouteId === route.operationId;
                const isIncidentActive = activeIncidentId === route.operationId;

                return (
                  <div 
                    key={route.operationId} 
                    className={cn(
                      "card p-5 border flex flex-col justify-between relative transition-all duration-200",
                      route.status === "Completed" && "border-emerald-200 bg-emerald-500/5",
                      route.status === "Delayed" && "border-amber-200 bg-amber-500/5",
                      route.status === "Pending" && "border-[var(--color-border)] hover:border-[var(--color-primary)]",
                      (isActive || isIncidentActive) && "ring-2 ring-[var(--color-primary)] shadow-lg"
                    )}
                  >
                    <div>
                      {/* Card header */}
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase">
                            Route Plan
                          </span>
                          <h4 className="font-extrabold text-base text-[var(--color-text-primary)] mt-0.5">
                            {route.routeName}
                          </h4>
                          <span className="text-xs text-[var(--color-text-muted)] flex items-center gap-1 mt-1">
                            <Truck className="w-3.5 h-3.5 shrink-0" />
                            {route.sitioName}
                          </span>
                        </div>

                        {/* Status chip */}
                        <span className={cn(
                          "px-2.5 py-1 rounded-full text-xs font-bold leading-none uppercase",
                          route.status === "Completed" && "bg-emerald-100 text-emerald-800",
                          route.status === "Delayed" && "bg-amber-100 text-amber-800",
                          route.status === "Missed" && "bg-rose-100 text-rose-800",
                          route.status === "Pending" && "bg-gray-100 text-gray-700"
                        )}>
                          {route.status}
                        </span>
                      </div>

                      {/* Display log results if completed */}
                      {route.status === "Completed" && (
                        <div className="mt-4 p-3 bg-emerald-500/10 rounded-xl grid grid-cols-2 gap-2 text-xs font-semibold">
                          <div className="text-emerald-800 dark:text-emerald-400">
                            Waste: {route.wasteKg} kg
                          </div>
                          <div className="text-emerald-800 dark:text-emerald-400">
                            Fuel: {route.fuelL} L
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Quick action controls */}
                    {route.status !== "Completed" && !isActive && !isIncidentActive && (
                      <div className="mt-6 flex items-center gap-2">
                        <Button 
                          id={`btn-log-${route.operationId}`}
                          variant="primary" 
                          size="sm" 
                          className="flex-1"
                          onClick={() => {
                            setActiveRouteId(route.operationId);
                            setActiveIncidentId(null);
                          }}
                        >
                          <CheckCircle2 className="w-4 h-4 shrink-0" />
                          Log Waste
                        </Button>
                        <Button 
                          id={`btn-incident-${route.operationId}`}
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            setActiveIncidentId(route.operationId);
                            setActiveRouteId(null);
                          }}
                        >
                          <Wrench className="w-4 h-4 shrink-0 text-[var(--color-danger)]" />
                        </Button>
                      </div>
                    )}

                    {/* INLINE WASTE & FUEL LOG FORM */}
                    {isActive && (
                      <div className="mt-5 p-4 border border-[var(--color-border)] rounded-xl bg-[var(--color-bg-page)] animate-fade-in space-y-4">
                        <h5 className="text-xs font-bold uppercase text-[var(--color-text-primary)]">Log Route Performance</h5>
                        
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[10px] font-bold text-[var(--color-text-muted)] uppercase mb-1">
                              Waste Vol (kg)
                            </label>
                            <input
                              type="number"
                              required
                              placeholder="e.g. 1250"
                              value={wasteVolume}
                              onChange={(e) => setWasteVolume(e.target.value)}
                              className="w-full px-3 py-2 rounded-lg bg-[var(--color-bg-card)] border border-[var(--color-border)] text-xs text-[var(--color-text-primary)]"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] font-bold text-[var(--color-text-muted)] uppercase mb-1">
                              Fuel Used (Litres)
                            </label>
                            <input
                              type="number"
                              required
                              placeholder="e.g. 15"
                              value={fuelConsumed}
                              onChange={(e) => setFuelConsumed(e.target.value)}
                              className="w-full px-3 py-2 rounded-lg bg-[var(--color-bg-card)] border border-[var(--color-border)] text-xs text-[var(--color-text-primary)]"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-[var(--color-text-muted)] uppercase mb-1">
                            Operator Notes (Optional)
                          </label>
                          <textarea
                            rows={1}
                            placeholder="Road blocks, delay reasons..."
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            className="w-full px-3 py-2 rounded-lg bg-[var(--color-bg-card)] border border-[var(--color-border)] text-xs text-[var(--color-text-primary)]"
                          />
                        </div>

                        {errorMsg && <p className="text-[10px] text-rose-500">{errorMsg}</p>}

                        <div className="flex items-center gap-2">
                          <Button 
                            id="btn-save-log"
                            variant="primary" 
                            size="sm" 
                            className="flex-1"
                            isLoading={isSubmitting}
                            onClick={() => handleUpdateStatus(route.operationId, "Completed")}
                          >
                            Save & Complete
                          </Button>
                          <Button 
                            id="btn-cancel-log"
                            variant="outline" 
                            size="sm"
                            onClick={() => setActiveRouteId(null)}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* INLINE INCIDENT REPORT FORM */}
                    {isIncidentActive && (
                      <div className="mt-5 p-4 border border-[var(--color-border)] rounded-xl bg-[var(--color-bg-page)] animate-fade-in space-y-4">
                        <h5 className="text-xs font-bold uppercase text-[var(--color-text-primary)] flex items-center gap-1 text-[var(--color-danger)]">
                          <Wrench className="w-4 h-4" /> Log Vehicle Breakdown
                        </h5>

                        <div>
                          <label className="block text-[10px] font-bold text-[var(--color-text-muted)] uppercase mb-1">
                            Incident Cause
                          </label>
                          <select
                            value={incidentReason}
                            onChange={(e) => setIncidentReason(e.target.value)}
                            className="w-full px-3 py-2 rounded-lg bg-[var(--color-bg-card)] border border-[var(--color-border)] text-xs text-[var(--color-text-primary)]"
                          >
                            <option value="Engine Breakdown">Engine Breakdown</option>
                            <option value="Flat Tire">Flat Tire / Blowout</option>
                            <option value="Compactor Jammed">Compactor / Loader Jammed</option>
                            <option value="Flooded Street">Flooded Street / Heavy Rain</option>
                            <option value="Accident / Collision">Minor Accident / Collision</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-[var(--color-text-muted)] uppercase mb-1">
                            Details / Current Location
                          </label>
                          <textarea
                            rows={1}
                            placeholder="Describe what happened and your current location..."
                            value={incidentNotes}
                            onChange={(e) => setIncidentNotes(e.target.value)}
                            className="w-full px-3 py-2 rounded-lg bg-[var(--color-bg-card)] border border-[var(--color-border)] text-xs text-[var(--color-text-primary)]"
                          />
                        </div>

                        {errorMsg && <p className="text-[10px] text-rose-500">{errorMsg}</p>}

                        <div className="flex items-center gap-2">
                          <Button 
                            id="btn-save-incident"
                            variant="danger" 
                            size="sm" 
                            className="flex-1"
                            isLoading={isSubmitting}
                            onClick={() => handleReportIncident(route.operationId, route)}
                          >
                            Log Incident
                          </Button>
                          <Button 
                            id="btn-cancel-incident"
                            variant="outline" 
                            size="sm"
                            onClick={() => setActiveIncidentId(null)}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-12 text-center card">
              <Truck className="w-10 h-10 text-[var(--color-text-muted)] mx-auto mb-3 opacity-60 animate-bounce" />
              <p className="text-sm font-semibold text-[var(--color-text-primary)]">
                No active routes generated for today yet
              </p>
              <p className="text-xs text-[var(--color-text-muted)] mt-1">
                Please contact the barangay administration office to generate today&apos;s collections.
              </p>
            </div>
          )}
        </div>

        {/* Right Hand: Safety Checklist / Helpful Guideline Panels */}
        <div id="collector-sidebar" className="space-y-6">
          <section id="collector-safety-card" className="card p-6" aria-labelledby="safety-heading">
            <h3 id="safety-heading" className="text-sm font-bold uppercase tracking-wider text-[var(--color-text-primary)] mb-4 flex items-center gap-2">
              <Gauge className="w-5 h-5 text-[var(--color-primary)]" />
              Operator Checklist & Safety
            </h3>

            <div className="space-y-3.5 text-xs text-[var(--color-text-muted)]">
              <div className="flex items-start gap-2">
                <input type="checkbox" id="check-safety" className="mt-0.5 rounded border-[var(--color-border)]" />
                <label htmlFor="check-safety" className="leading-tight">Wear high-visibility vest, steel-toed boots, and puncture-resistant gloves.</label>
              </div>

              <div className="flex items-start gap-2">
                <input type="checkbox" id="check-brakes" className="mt-0.5 rounded border-[var(--color-border)]" />
                <label htmlFor="check-brakes" className="leading-tight">Inspect vehicle brakes, tires, and hydraulic compactors before leaving.</label>
              </div>

              <div className="flex items-start gap-2">
                <input type="checkbox" id="check-hydraulics" className="mt-0.5 rounded border-[var(--color-border)]" />
                <label htmlFor="check-hydraulics" className="leading-tight">Ensure loader is fully clear of compactor before operating levers.</label>
              </div>

              <div className="flex items-start gap-2">
                <input type="checkbox" id="check-incident" className="mt-0.5 rounded border-[var(--color-border)]" />
                <label htmlFor="check-incident" className="leading-tight">Report any needle-stick injury, cut, or compactor jam instantly.</label>
              </div>
            </div>
          </section>

          <section id="collector-tips-card" className="card p-6" aria-labelledby="tips-heading">
            <h3 id="tips-heading" className="text-sm font-bold uppercase tracking-wider text-[var(--color-text-primary)] mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-sky-500" />
              Fuel Saving Driving Habits
            </h3>

            <ul className="space-y-2 text-xs text-[var(--color-text-muted)] list-disc pl-4 leading-relaxed">
              <li>Minimize idling: Turn off engine if stopped for over 2 minutes.</li>
              <li>Smooth Acceleration: Avoid rapid throttling between trash bins.</li>
              <li>Compactor Timing: Compact waste only when the hopper is full to minimize engine load cycles.</li>
            </ul>
          </section>
        </div>

      </div>

    </div>
  );
}
