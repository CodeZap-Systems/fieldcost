import React from "react";
import { DashboardWithBanner } from "./dashboard-client";

export default function DashboardHome() {
  // Show data dashboard (bespoke/white-label, no tiering)
  return (
    <DashboardWithBanner>
      {/* Dashboard content here (no tier switcher) */}
    </DashboardWithBanner>
  );
}
