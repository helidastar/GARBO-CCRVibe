import type { Metadata } from "next";
import { createSupabaseServerClientReadOnly } from "../../../../supabase/server";
import {
  getDashboardKPIs,
  getWeeklyTrend,
  getTodayRoutes,
  getRecentActivity,
} from "@/services/dashboard.service";
import { AdminDashboard } from "@/components/organisms/AdminDashboard";
import { ResidentDashboard } from "@/components/organisms/ResidentDashboard";
import { CollectorDashboard } from "@/components/organisms/CollectorDashboard";
import { formatDateWithDay, todayISO } from "@/lib/utils/date";

export const metadata: Metadata = { title: "Dashboard" };

// Revalidate every 10s or keep fresh
export const revalidate = 10;

export default async function HomePage() {
  const supabase = await createSupabaseServerClientReadOnly();

  // 1. Get the current user session
  const { data: { user } } = await supabase.auth.getUser();

  // 2. Check if the user is in the admins table
  let isAdminInTable = false;
  if (user) {
    const { data: adminCheck } = await supabase
      .from("admins")
      .select("id")
      .eq("id", user.id)
      .maybeSingle();
    if (adminCheck) isAdminInTable = true;
  }

  // 3. Determine user role
  const userMetadataRole = user?.user_metadata?.role;
  let role: "admin" | "resident" | "collector" = "resident"; // default

  if (userMetadataRole === "admin" || isAdminInTable) {
    role = "admin";
  } else if (userMetadataRole === "collector") {
    role = "collector";
  } else if (userMetadataRole === "resident") {
    role = "resident";
  } else {
    // Check email patterns
    const email = user?.email?.toLowerCase() || "";
    if (email.includes("admin") || email.includes("staff")) {
      role = "admin";
    } else if (email.includes("collector") || email.includes("driver") || email.includes("crew")) {
      role = "collector";
    } else {
      role = "resident";
    }
  }

  const greeting  = getGreeting();
  const dateLabel = formatDateWithDay(todayISO());

  // 4. Fetch data based on role
  if (role === "admin") {
    const [kpis, trend, todayRoutes, activity] = await Promise.all([
      getDashboardKPIs(supabase),
      getWeeklyTrend(supabase),
      getTodayRoutes(supabase),
      getRecentActivity(supabase, 8),
    ]);

    const adminName = user?.user_metadata?.full_name || user?.email?.split("@")[0]?.split(".")?.[0] || "Admin";

    return (
      <AdminDashboard
        kpis={kpis}
        trend={trend}
        todayRoutes={todayRoutes}
        activity={activity}
        adminName={adminName}
        greeting={greeting}
        dateLabel={dateLabel}
      />
    );
  }

  if (role === "collector") {
    // Get today's routes for the collector
    const [todayRoutes, adminRes] = await Promise.all([
      getTodayRoutes(supabase),
      supabase.from("admins").select("id").limit(1).maybeSingle(),
    ]);

    const fallbackAdminId = adminRes.data?.id || "00000000-0000-0000-0000-000000000000";

    return (
      <CollectorDashboard
        user={user}
        initialRoutes={todayRoutes}
        fallbackAdminId={fallbackAdminId}
        greeting={greeting}
        dateLabel={dateLabel}
      />
    );
  }

  // Resident role
  const [sitiosRes, schedulesRes, announcementsRes, adminRes] = await Promise.all([
    supabase.from("sitios").select("id, name, description").order("name"),
    supabase.from("master_schedules").select("id, sitio_id, route_name, collection_days, frequency, is_active").eq("is_active", true),
    supabase.from("announcements").select("id, title, body, type, created_at").eq("is_active", true).order("created_at", { ascending: false }).limit(5),
    supabase.from("admins").select("id").limit(1).maybeSingle(),
  ]);

  const sitios = sitiosRes.data || [];
  const schedules = schedulesRes.data || [];
  const announcements = announcementsRes.data || [];
  const fallbackAdminId = adminRes.data?.id || "00000000-0000-0000-0000-000000000000";

  return (
    <ResidentDashboard
      user={user}
      sitios={sitios as unknown as Parameters<typeof ResidentDashboard>[0]["sitios"]}
      schedules={schedules as unknown as Parameters<typeof ResidentDashboard>[0]["schedules"]}
      announcements={announcements as unknown as Parameters<typeof ResidentDashboard>[0]["announcements"]}
      fallbackAdminId={fallbackAdminId}
      greeting={greeting}
      dateLabel={dateLabel}
    />
  );
}

// ── Greeting helper ─────────────────────────────────────────────────────────
function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning,";
  if (hour < 18) return "Good afternoon,";
  return "Good evening,";
}
