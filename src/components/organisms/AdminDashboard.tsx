"use client";

import Link from "next/link";
import { Suspense } from "react";
import { DashboardGrid } from "@/components/organisms/DashboardGrid";
import { WeeklyTrendChart, WeeklyTrendChartSkeleton } from "@/components/organisms/WeeklyTrendChart";
import { TodayRoutesTable } from "@/components/organisms/TodayRoutesTable";
import { RecentActivityFeed } from "@/components/organisms/RecentActivityFeed";
import { Button } from "@/components/atoms/Button";
import { AlertTriangle } from "lucide-react";
import type { DashboardKPIs, RecentActivity } from "@/types/app.types";
import type { DailyTrend, TodayRoute } from "@/services/dashboard.service";

interface AdminDashboardProps {
  kpis: DashboardKPIs;
  trend: DailyTrend[];
  todayRoutes: TodayRoute[];
  activity: RecentActivity[];
  adminName: string;
  greeting: string;
  dateLabel: string;
}

export function AdminDashboard({
  kpis,
  trend,
  todayRoutes,
  activity,
  adminName,
  greeting,
  dateLabel,
}: AdminDashboardProps) {
  return (
    <div id="admin-dashboard-root" className="animate-fade-in max-w-[1360px]">
      {/* ── Page header ─────────────────────────────────────────────── */}
      <div id="admin-header-row" className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div id="admin-page-title" className="page-header mb-0">
          <h2 className="page-header__title">
            {greeting}{" "}
            <span className="text-[var(--color-primary)] capitalize">{adminName}</span>
          </h2>
          <p className="page-header__subtitle mt-1">
            {dateLabel} ·{" "}
            {kpis.pendingRoutes > 0
              ? `${kpis.pendingRoutes} route${kpis.pendingRoutes !== 1 ? "s" : ""} still pending`
              : "All routes accounted for today"}
          </p>
        </div>

        {/* Quick-action buttons */}
        <div id="admin-quick-actions" className="flex items-center gap-2 shrink-0">
          <Link href="/announcements/new">
            <Button id="btn-create-announcement" variant="outline" size="sm">
              + Announcement
            </Button>
          </Link>
          <Link href="/schedule">
            <Button id="btn-view-schedule" variant="primary" size="sm">
              View Schedule
            </Button>
          </Link>
        </div>
      </div>

      {/* ── Missed-routes alert banner ───────────────────────────────── */}
      {kpis.missedToday > 0 && (
        <div id="admin-missed-alert" className="alert-bar alert-bar--danger mb-6 animate-fade-in flex items-center gap-2" role="alert">
          <AlertTriangle className="w-5 h-5 text-[var(--color-danger)] shrink-0" aria-hidden="true" />
          <span className="text-sm">
            <strong>
              {kpis.missedToday} route{kpis.missedToday !== 1 ? "s" : ""} missed today.
            </strong>{" "}
            <Link href="/alerts" className="underline underline-offset-2 font-medium">
              View alerts →
            </Link>
          </span>
        </div>
      )}

      {/* ── KPI Grid ─────────────────────────────────────────────────── */}
      <section id="admin-kpis-section" aria-labelledby="kpi-heading" className="mb-8">
        <h3
          id="kpi-heading"
          className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] mb-3"
        >
          Today&apos;s Overview
        </h3>
        <DashboardGrid kpis={kpis} />
      </section>

      {/* ── Chart + Activity row ─────────────────────────────────────── */}
      <div id="admin-charts-row" className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
        {/* 7-day completion trend — spans 2 of 3 columns */}
        <section
          id="admin-trend-card"
          className="xl:col-span-2 card p-5"
          aria-labelledby="trend-heading"
        >
          <div className="flex items-center justify-between mb-4">
            <h3
              id="trend-heading"
              className="text-sm font-semibold text-[var(--color-text-primary)]"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              7-Day Completion Trend
            </h3>
            <span className="text-xs text-[var(--color-text-muted)]">Completion rate %</span>
          </div>
          <Suspense fallback={<WeeklyTrendChartSkeleton />}>
            <WeeklyTrendChart data={trend} />
          </Suspense>
        </section>

        {/* Recent activity */}
        <section
          id="admin-activity-card"
          className="card p-5 flex flex-col overflow-hidden"
          aria-labelledby="activity-heading"
        >
          <div className="flex items-center justify-between mb-4 shrink-0">
            <h3
              id="activity-heading"
              className="text-sm font-semibold text-[var(--color-text-primary)]"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Recent Activity
            </h3>
            <Link
              href="/logbook"
              className="text-xs text-[var(--color-primary)] hover:underline font-medium"
            >
              View all
            </Link>
          </div>
          <RecentActivityFeed activities={activity} />
        </section>
      </div>

      {/* ── Today's Routes Table ─────────────────────────────────────── */}
      <section id="admin-routes-section" aria-labelledby="routes-heading">
        <div className="flex items-center justify-between mb-3">
          <h3
            id="routes-heading"
            className="text-sm font-semibold text-[var(--color-text-primary)]"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Today&apos;s Collection Routes
          </h3>
          <div className="flex items-center gap-4">
            {/* Status legend */}
            <div className="hidden sm:flex items-center gap-3 text-[10px] text-[var(--color-text-muted)]">
              {(["Completed", "Delayed", "Missed"] as const).map((s) => (
                <span key={s} className="flex items-center gap-1">
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ background: `var(--status-${s.toLowerCase()})` }}
                  />
                  {s}
                </span>
              ))}
            </div>
            <Link
              href="/schedule"
              className="text-xs text-[var(--color-primary)] hover:underline font-medium"
            >
              Full schedule →
            </Link>
          </div>
        </div>

        <TodayRoutesTable routes={todayRoutes} />
      </section>
    </div>
  );
}
