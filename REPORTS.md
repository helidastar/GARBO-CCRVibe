# GARBO — Reports & Analytics Module
The Reports module provides comprehensive data visualization, key performance indicators (KPIs), performance tracking, and export features.

---

## ── Architectural Overview
The reports subsystem follows an offline-safe, high-performance design architecture that processes queries under **5 seconds** (SRS §3.7.1). It combines aggregated real-time database queries with local caching and offline-capable rendering.

### 1. Data Schema & Aggregation
The central source of report statistics is the `daily_summary` database view, which aggregates data from `daily_operations` and matches it against `master_schedules` and `sitios`. 
Key metrics derived include:
*   **Total Routes Scheduled**: Count of routes created for the target month.
*   **Completion Rate**: Percent of routes marked as "Completed" relative to total schedules.
*   **Missed Pickups**: Count of scheduled routes marked as "Missed".
*   **Delayed Pickups**: Count of scheduled routes marked as "Delayed".
*   **Waste Diverted (kg)**: Aggregated weight of collected garbage.
*   **Fuel Consumption (L)**: Total volume of fuel reported by collection operators.

### 2. Month Switching & API Sync
The user can switch months dynamically. This triggers a server-side fetch request to `/api/reports?year=YYYY&month=M`, returning pre-compiled telemetry.

---

## ── Key Performance Indicators (KPIs)
The module tracks and visualizes 8 primary KPIs inside custom high-contrast metric grids:
1.  **Total Routes**: Absolute count of collection operations generated.
2.  **Completed**: Count of successful collections.
3.  **Completion Rate**: Color-coded percentage reflecting operational efficiency (Green $\ge 80\%$, Amber $50\%-79\%$, Red $< 50\%$).
4.  **Missed**: Critical operational failures requiring immediate supervisor routing.
5.  **Delayed**: Routes completed late or rescheduled due to incidents/breakdowns.
6.  **Total Waste (kg)**: Total tonnage of materials collected and sorted.
7.  **Fuel Used (L)**: Fleet-wide diesel consumption to measure efficiency.
8.  **Incidents**: Logged operational hurdles (breakdowns, roadblocks, illegal dumping).

---

## ── Interactive Visualizations
*   **Weekly Completion Rate**: A dynamic SVG bar chart mapping weekly progress. Each bar is color-bound to its specific completion range to make bottlenecks instantly recognizable.
*   **Performance by Sitio**: A detailed comparative tabular report. It calculates individual completion percentages for each neighborhood zone (e.g., *Sitio Mahiga*, *Sitio Bukid*, *Sitio Pahina*), allowing the sanitation office to optimize driver route distributions.

---

## ── Export & Sharing Capabilities
To facilitate official reports delivery and external auditing, two robust sharing mechanics are supported:

### 1. Export to CSV (Comma Separated Values)
*   **Format**: Comma-separated spreadsheet.
*   **Content**: Contains raw daily metrics, completion stats, waste weight, and fuel consumption per Sitio.
*   **Output filename**: `garbo_monthly_report_[YYYY-MM].csv`

### 2. Export to PDF (Portable Document Format)
*   **Format**: Elegant, fully formatted printable vector document.
*   **Design**: Implements the Barangay Banilad official letterhead, clean tabular formatting for the Sitio performance table, KPI statistics summary blocks, and an official signature panel.
*   **Library**: Powered by `jspdf` and `jspdf-autotable`.
*   **Output filename**: `garbo_monthly_report_[YYYY-MM].pdf`
