"use client";

import React from "react";
import { FileText, Lock, Bot, Award } from "lucide-react";

export type DocketTab = "agreement" | "escrow" | "ai-watcher" | "certificate";

interface DocketNavigationProps {
  activeTab: DocketTab;
  setActiveTab: (tab: DocketTab) => void;
  signaturesCount: number;
  escrowFunded: boolean;
  auditedCount: number;
  totalMilestones: number;
}

export function DocketNavigation({
  activeTab,
  setActiveTab,
  signaturesCount,
  escrowFunded,
  auditedCount,
  totalMilestones,
}: DocketNavigationProps) {
  const tabs = [
    {
      id: "agreement" as DocketTab,
      label: "Legal Pact & EIP-712",
      shortLabel: "Pact",
      icon: FileText,
      badge: `${signaturesCount}/2 Signed`,
      badgeColor:
        signaturesCount === 2
          ? "text-lexi-emerald border-lexi-emerald/40"
          : "text-lexi-gold border-lexi-gold/40",
    },
    {
      id: "escrow" as DocketTab,
      label: "Milestone Escrow Vault",
      shortLabel: "Vault",
      icon: Lock,
      badge: escrowFunded ? "Funded" : "Deposit",
      badgeColor: escrowFunded
        ? "text-lexi-emerald border-lexi-emerald/40"
        : "text-lexi-parchmentMuted border-lexi-border",
    },
    {
      id: "ai-watcher" as DocketTab,
      label: "AI Compliance Watcher",
      shortLabel: "AI Watcher",
      icon: Bot,
      badge: `${auditedCount}/${totalMilestones} Audited`,
      badgeColor:
        auditedCount > 0
          ? "text-lexi-emerald border-lexi-emerald/40"
          : "text-lexi-gold border-lexi-gold/40",
    },
    {
      id: "certificate" as DocketTab,
      label: "Notarized Docket Deed",
      shortLabel: "Deed",
      icon: Award,
      badge: "Certificate",
      badgeColor: "text-lexi-goldLight border-lexi-gold/40",
    },
  ];

  return (
    <div className="border-b border-lexi-border bg-lexi-card/40 -mx-3 sm:mx-0">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <nav className="flex space-x-2 sm:space-x-4 overflow-x-auto py-2.5 no-scrollbar">
          {tabs.map((t) => {
            const Icon = t.icon;
            const isActive = activeTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`flex items-center gap-1.5 sm:gap-2.5 px-2.5 sm:px-3.5 py-2 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap transition-all border shrink-0 ${
                  isActive
                    ? "bg-lexi-card border-lexi-gold/70 text-white shadow-sm"
                    : "border-transparent text-lexi-parchmentMuted hover:text-white hover:bg-lexi-card/60"
                }`}
              >
                <Icon
                  className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${
                    isActive ? "text-lexi-gold" : "text-lexi-parchmentMuted"
                  }`}
                />
                <span className="hidden sm:inline">{t.label}</span>
                <span className="inline sm:hidden">{t.shortLabel}</span>
                <span
                  className={`text-[9px] sm:text-[10px] font-mono uppercase px-1.5 py-0.5 rounded border bg-lexi-bg/60 ${t.badgeColor}`}
                >
                  {t.badge}
                </span>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
