import type { Metadata } from "next";
import { createSupabaseServerClientReadOnly } from "../../../../supabase/server";
import { getIncidents } from "@/services/incidents.service";
import { getSitios }    from "@/services/schedules.service";
import { AlertsClient } from "./AlertsClient";
import { daysAgoISO, todayISO } from "@/lib/utils/date";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database.types";

export const metadata: Metadata = { title: "Alerts" };
export const revalidate = 30;

export default async function AlertsPage() {
  const supabase = await createSupabaseServerClientReadOnly();

  const [incidents, sitios] = await Promise.all([
    getIncidents(supabase as unknown as SupabaseClient<Database>, {
      dateRange: { from: daysAgoISO(30), to: todayISO() },
      sitioId: null, incidentType: null,
    }),
    getSitios(supabase),
  ]);

  return <AlertsClient incidents={incidents} sitios={sitios} />;
}