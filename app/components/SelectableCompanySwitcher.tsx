"use client";

import React, { useState, useRef, useEffect } from "react";
import { isDemoCompany } from "@/lib/demoConstants";
import { EnvironmentBadge } from "./EnvironmentBadge";

export interface CompanyOption {
  id: string;
  name: string;
  isDemo?: boolean;
}

interface SelectableCompanySwitcherProps {
  companies: CompanyOption[];
  activeCompanyId?: string | null;
  onSwitchCompany: (companyId: string) => void;
  isLoading?: boolean;
  showBadge?: boolean;
}

/**
 * SelectableCompanySwitcher
 * Dropdown component for switching between demo and live companies.
 * Clearly groups "DEMO" and "YOUR WORKSPACES" sections.
 *
 * Features:
 * - Groups demo and real companies visually
 * - Shows environment badge on active company
 * - Dropdown with smooth open/close animation
 * - Keyboard navigation support
 */
export function SelectableCompanySwitcher({
  companies,
  activeCompanyId,
  onSwitchCompany,
  isLoading = false,
  showBadge = true,
}: SelectableCompanySwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Find active company
  const activeCompany = companies.find((c) => c.id === activeCompanyId);
  const isActiveDemoCompany = isDemoCompany(activeCompanyId);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [isOpen]);

  // Keyboard navigation
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (!isOpen) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          setIsOpen(true);
        }
        return;
      }

      if (e.key === "Escape") {
        setIsOpen(false);
        buttonRef.current?.focus();
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      return () => {
        document.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [isOpen]);

  function handleCompanySelect(companyId: string) {
    onSwitchCompany(companyId);
    setIsOpen(false);
  }

  // Separate demo and live companies - LIVE companies always first
  const liveCompanies = companies.filter((c) => c.isDemo !== true);
  const demoCompanies = companies.filter((c) => c.isDemo === true);

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-xs"
      role="application"
      aria-label="Company switcher"
    >
      {/* Button */}
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        disabled={isLoading}
        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-left text-sm font-medium text-gray-900 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-between gap-2"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={
          activeCompany
            ? `Switch workspace: ${activeCompany.name}`
            : "Switch workspace"
        }
      >
        <span className="flex items-center gap-2 flex-1 min-w-0">
          <span className="truncate">
            {activeCompany?.name || "Select workspace"}
          </span>
          {showBadge && activeCompany && isActiveDemoCompany && (
            <EnvironmentBadge
              companyId={activeCompanyId}
              className="flex-shrink-0"
            />
          )}
        </span>

        {/* Chevron icon */}
        <svg
          className={`w-4 h-4 text-gray-400 flex-shrink-0 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          />
        </svg>
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <div
          className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden"
          role="listbox"
        >
          {/* DEMO section */}
          {demoCompanies.length > 0 && (
            <>
              <div className="px-3 py-2 bg-gray-50 border-b border-gray-100">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Demo
                </p>
              </div>
              <div>
                {demoCompanies.map((company) => (
                  <button
                    key={company.id}
                    onClick={() => handleCompanySelect(company.id)}
                    disabled={false}
                    className={`w-full text-left px-4 py-3 text-sm font-medium transition-colors flex items-center justify-between gap-2 ${
                      activeCompanyId === company.id
                        ? "bg-blue-50 text-blue-700 border-l-2 border-blue-500"
                        : "text-gray-700 hover:bg-blue-50"
                    }`}
                    role="option"
                    aria-selected={activeCompanyId === company.id}
                    title="Demo company with sample data for testing"
                  >
                    <span className="flex-1 min-w-0">
                      <p className="font-medium">🧪 DEMO Company</p>
                      <p className="text-xs text-gray-500">
                        Try product with sample data
                      </p>
                    </span>
                    {isDemoCompany(activeCompanyId) &&
                      activeCompanyId === company.id && (
                        <svg
                          className="w-5 h-5 text-blue-500 flex-shrink-0"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                  </button>
                ))}
              </div>
            </>
          )}

          {/* YOUR WORKSPACES section */}
          {liveCompanies.length > 0 && (
            <>
              <div className="px-3 py-2 bg-gray-50 border-t border-gray-100">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Your Workspaces
                </p>
              </div>
              <div>
                {liveCompanies.map((company) => (
                  <button
                    key={company.id}
                    onClick={() => handleCompanySelect(company.id)}
                    className={`w-full text-left px-4 py-3 text-sm font-medium transition-colors flex items-center justify-between gap-2 ${
                      !isDemoCompany(activeCompanyId) &&
                      activeCompanyId === company.id
                        ? "bg-blue-50 text-blue-700 border-l-2 border-blue-500"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                    role="option"
                    aria-selected={
                      !isDemoCompany(activeCompanyId) &&
                      activeCompanyId === company.id
                    }
                  >
                    <span className="flex-1 min-w-0">
                      <p className="font-medium">{company.name}</p>
                    </span>
                    {!isDemoCompany(activeCompanyId) &&
                      activeCompanyId === company.id && (
                        <svg
                          className="w-5 h-5 text-blue-500 flex-shrink-0"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                  </button>
                ))}
              </div>
            </>
          )}

          {/* Empty state */}
          {companies.length === 0 && (
            <div className="px-4 py-8 text-center">
              <p className="text-sm text-gray-500">
                {isLoading ? "Loading workspaces..." : "No workspaces available"}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default SelectableCompanySwitcher;
