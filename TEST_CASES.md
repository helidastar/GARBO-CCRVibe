# GARBO — System Test Cases
This document details the test suites and standard verification steps designed to validate the system requirements of the GARBO Smart Waste Management System.

---

## ── TC-01: User Login
*   **Purpose**: Verify that users can securely log in to the GARBO system and are correctly routed to their respective role-based portals (Resident, Admin, or Garbage Collector).
*   **Pre-conditions**: Users must be registered in the system with valid email credentials and roles assigned in their metadata.
*   **Test Steps**:
    1.  Navigate to the Login page (`/login` or root `/`).
    2.  Enter valid email (e.g., `admin@garbo.gov`, `resident@garbo.gov`, or `collector@garbo.gov`) and password.
    3.  Click the "Sign In" button.
*   **Expected Result**: Auth state resolves successfully. The user is redirected to the corresponding workspace dashboard:
    *   **Admin**: `/home` (displays full KPIs, 7-day completion chart, and operations log).
    *   **Resident**: `/home` (displays localized schedule, barangay advisories, incident reporting form, and ecological sorting guide).
    *   **Collector**: `/home` (displays assigned route sheets, weight/fuel logging fields, and safety checklists).

---

## ── TC-02: Reports Dashboard
*   **Purpose**: Verify that the Reports and Analytics Dashboard loads properly and visualizes aggregated performance statistics within 5 seconds.
*   **Pre-conditions**: Historical operations data and logged incidents must exist in the database for the active month.
*   **Test Steps**:
    1.  Log in as an Admin.
    2.  Navigate to the **Reports** section via the sidebar.
    3.  Select a specific month from the month selector dropdown.
    4.  Observe the loading skeleton and transition.
*   **Expected Result**: 
    *   The page loads within 5 seconds (SRS §3.7.1 performance constraint).
    *   KPI cards render correct values for **Total Routes**, **Completed**, **Completion Rate**, **Missed**, **Delayed**, **Total Waste**, **Fuel Used**, and **Incidents**.
    *   The **Weekly Completion Rate** bar chart correctly binds to the selected month's historical trends.
    *   The **Performance by Sitio** table renders a breakdown of completed, delayed, and missed pick-ups per neighborhood.

---

## ── TC-03: Notification System
*   **Purpose**: Verify that real-time alerts and notifications (Bin Full Alerts, Missed Collection Alerts, Schedule Updates, and Maintenance Alerts) display correctly.
*   **Pre-conditions**: Active alert triggers are present in the system, or a new operational warning has occurred.
*   **Test Steps**:
    1.  Access the Alerts or Notifications center.
    2.  In the Resident portal, inspect the **Barangay Advisory & Notices** panel.
    3.  In the Admin portal, inspect the **Live Operations Ticker** and **Missed Routes Alert Bar**.
*   **Expected Result**:
    *   "Bin Full Alerts" indicate current bin capacity bottlenecks (>80% fill levels).
    *   "Missed Collection Alerts" trigger warning banners if a route is flagged as "Missed" or remains "Pending" after scheduled hours.
    *   Announcements match actual categories (e.g., *Weather Delay*, *Cancellation*, *Notice*, *Reminder*) with correct badge colors.

---

## ── TC-04: Collection Schedule
*   **Purpose**: Verify that scheduled routes, active statuses, frequency, and collection days load successfully and filter correctly.
*   **Pre-conditions**: Master collection schedules must be pre-populated or dynamically configured by the admin.
*   **Test Steps**:
    1.  Access the **Schedule** tab on the sidebar.
    2.  For Residents: Select a specific Sitio from the dropdown and view the route calendar.
    3.  For Admins: Review the active master schedule registry, toggle route active states, or add new collection rules.
*   **Expected Result**:
    *   The schedule reflects correct route names, target Sitios, active frequencies (e.g., Weekly, Bi-weekly), and precise collection days (e.g., Monday, Wednesday, Friday).
    *   Toggling a route's active status dynamically affects scheduled collections for that Sitio.

---

## ── TC-05: Incident Reporting
*   **Purpose**: Verify that residents and collectors can report waste issues and operational hazards, saving them securely to the database.
*   **Pre-conditions**: The user must be authenticated.
*   **Test Steps**:
    1.  In the Resident Dashboard: Navigate to "Report an Issue".
    2.  Select an issue type (e.g., *Missed Garbage Collection*, *Illegal Trash Dumping*).
    3.  Input specific location details (e.g., *"Beside green gate at Block 3"*) and additional notes.
    4.  Click the "File Incident Report" button.
*   **Expected Result**:
    *   The button indicates an active loading state.
    *   The system saves the incident ticket into the `incidents` table with correct values, capturing the logged-in user's UID and the target Sitio.
    *   A beautiful success state renders on the UI confirming the report is logged.
    *   The ticket immediately shows up in the Admin's **Alerts Logbook** feed.

---

## ── TC-06: User Logout
*   **Purpose**: Verify that the logout process terminates the user session securely and redirects to the public gateway.
*   **Pre-conditions**: The user must be logged in.
*   **Test Steps**:
    1.  Click the user profile dropdown in the top-right corner (or the sidebar logout button).
    2.  Click the **Logout** button.
*   **Expected Result**:
    *   The current session is cleared from storage.
    *   The user is redirected back to the Login gateway screen.
    *   Attempting to access any `/home` or secondary dashboard URL via browser history triggers automatic routing to `/login` (auth protection check).

---

## ── TC-07: Bin Status Monitoring
*   **Purpose**: Verify that the system accurately tracks and displays the real-time fill level status (Empty, Moderate, Full, or Critical/Overfill) of smart waste bins.
*   **Pre-conditions**: Bin fill sensors are simulated or recorded in the database, mapping back to target Sitios.
*   **Test Steps**:
    1.  Navigate to the **Fleet & Bins** portal as an Admin.
    2.  Review the **Capacity Utilization** ring and the **Smart Bin Grid**.
    3.  Simulate a fill level change (e.g., collector logging load or a sensor update).
*   **Expected Result**:
    *   Bin status correctly displays current fill levels (e.g., "78% organic", "24% residual").
    *   Visual indicators (Green, Yellow, Red) color-code bin capacity levels appropriately.
    *   Bins at >80% capacity automatically generate "Bin Full Alerts" in the notifications queue.

---

## ── TC-08: Route Monitoring
*   **Purpose**: Verify that live route tracking, coordinates, fuel consumption, and collection volume metrics display correctly in the monitoring workspace.
*   **Pre-conditions**: Active daily operations are generated.
*   **Test Steps**:
    1.  Navigate to the **Fleet** tab on the admin dashboard.
    2.  View the real-time operations map with truck tracking pointers.
    3.  Inspect the **Live Operations Ticker** at the bottom of the dashboard.
*   **Expected Result**:
    *   The active fleet registry accurately displays driver names, vehicle plates (labels), assigned sectors/Sitios, and current live status.
    *   The tracking map shows truck dots positioned according to current routing progress.
    *   The ticker dynamically outputs completion logs as collectors update their status sheets.
