import React from "react";
import { DashboardWithBanner } from "./dashboard-client";
import { DashboardTierSwitcher } from "@/components/DashboardTierSwitcher";

export default function DashboardHome() {
  // Show data dashboard - tier selector can be accessed via "Features" button or URL params
  // This eliminates the need to scroll past tier buttons to see actual company data
  return (
    <DashboardWithBanner>
      <DashboardTierSwitcher />
    </DashboardWithBanner>
  );
}
