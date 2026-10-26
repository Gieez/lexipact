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
      label: "Legal Pact & EIP-712 Deck",
      icon: FileText,
      badge: `${signaturesCount}/2 Signed`,
      badgeColor: signaturesCount === 2 ? "text-lexi-emerald border-lexi-emerald/40" : "text-lexi-gold border-lexi-gold/40",
    },
    {
      id: "escrow" as DocketTab,
      label: "Milestone Escrow Vault",
      icon: Lock,
      badge: escrowFunded ? "Vault Funded" : "Pending Deposit",
      badgeColor: escrowFunded ? "text-lexi-emerald border-lexi-emerald/40" : "text-lexi-parchmentMuted border-lexi-border",
    },
    {
      id: "ai-watcher" as DocketTab,
      label: "AI Compliance Watcher",
      icon: Bot,
      badge: `${auditedCount}/${totalMilestones} Audited`,
      badgeColor: auditedCount > 0 ? "text-lexi-emerald border-lexi-emerald/40" : "text-lexi-gold border-lexi-gold/40",
    },
    {
      id: "certificate" as DocketTab,
      label: "Notarized Docket Deed",
      icon: Award,
      badge: "Cryptographic Proof",
      badgeColor: "text-lexi-goldLight border-lexi-gold/40",
    },
  ];

  return (
    <div className="border-b border-lexi-border bg-lexi-card/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex space-x-2 sm:space-x-6 overflow-x-auto py-2.5">
          {tabs.map((t) => {
            const Icon = t.icon;
            const isActive = activeTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap transition-all border ${
                  isActive
                    ? "bg-lexi-card border-lexi-gold/60 text-white shadow-sm"
                    : "border-transparent text-lexi-parchmentMuted hover:text-white hover:bg-lexi-card/60"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-lexi-gold" : "text-lexi-parchmentMuted"}`} />
                <span>{t.label}</span>
                <span
                  className={`text-[10px] font-mono uppercase px-1.5 py-0.5 rounded border bg-lexi-bg/50 ${t.badgeColor}`}
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
