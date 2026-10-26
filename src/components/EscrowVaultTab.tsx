"use client";

import React, { useState } from "react";
import {
  LegalPactTemplate,
  AgreementMilestone,
  LEXIPACT_CONTRACT_ADDRESS,
} from "@/lib/constants";
import { formatEth, shortenAddress } from "@/lib/web3";
import {
  Lock,
  Unlock,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  Upload,
  Coins,
} from "lucide-react";
import confetti from "canvas-confetti";

interface EscrowVaultTabProps {
  pact: LegalPactTemplate;
  milestones: AgreementMilestone[];
  escrowFunded: boolean;
  onFundEscrow: () => Promise<void>;
  onSubmitDeliverable: (milestoneId: string, ref: string) => Promise<void>;
  onReleaseMilestone: (milestoneId: string) => Promise<void>;
  onNavigateToAiWatcher: () => void;
  activeRole: "client" | "contractor" | "oracle";
  userAddress: string;
}

export function EscrowVaultTab({
  pact,
  milestones,
  escrowFunded,
  onFundEscrow,
  onSubmitDeliverable,
  onReleaseMilestone,
  onNavigateToAiWatcher,
  activeRole,
  userAddress,
}: EscrowVaultTabProps) {
  const [submittingId, setSubmittingId] = useState<string | null>(null);
  const [deliverableInput, setDeliverableInput] = useState<Record<string, string>>({});
  const [isFunding, setIsFunding] = useState(false);
  const [releasingId, setReleasingId] = useState<string | null>(null);

  const totalEth = parseFloat(pact.totalAmountEth);
  const releasedEth = milestones
    .filter((m) => m.status === "released")
    .reduce((acc, m) => acc + parseFloat(m.amountEth), 0);
  const lockedEth = escrowFunded ? Math.max(0, totalEth - releasedEth) : 0;

  const handleFund = async () => {
    setIsFunding(true);
    try {
      await onFundEscrow();
      confetti({
        particleCount: 40,
        spread: 50,
        origin: { y: 0.7 },
        colors: ["#10b981", "#d97706"],
      });
    } finally {
      setIsFunding(false);
    }
  };

  const handleSubmit = async (milestoneId: string) => {
    const ref = deliverableInput[milestoneId];
    if (!ref) return;
    setSubmittingId(milestoneId);
    try {
      await onSubmitDeliverable(milestoneId, ref);
    } finally {
      setSubmittingId(null);
    }
  };

  const handleRelease = async (milestoneId: string) => {
    setReleasingId(milestoneId);
    try {
      await onReleaseMilestone(milestoneId);
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#10b981", "#3b82f6"],
      });
    } finally {
      setReleasingId(null);
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Financial Telemetry Banner (2 cols on mobile, 4 on desktop) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
        <div className="rounded-xl border border-lexi-border bg-lexi-card p-3.5 sm:p-5 shadow-docket">
          <div className="flex items-center justify-between text-[11px] sm:text-xs font-mono text-lexi-parchmentMuted">
            <span className="truncate">Total Vault</span>
            <Coins className="w-3.5 h-3.5 text-lexi-gold shrink-0" />
          </div>
          <div className="mt-1.5 sm:mt-2 text-lg sm:text-2xl font-mono font-bold text-white">
            {formatEth(totalEth)}
          </div>
          <p className="text-[9px] sm:text-[11px] font-mono text-lexi-parchmentMuted mt-0.5 truncate">
            {shortenAddress(LEXIPACT_CONTRACT_ADDRESS)}
          </p>
        </div>

        <div className="rounded-xl border border-lexi-border bg-lexi-card p-3.5 sm:p-5 shadow-docket">
          <div className="flex items-center justify-between text-[11px] sm:text-xs font-mono text-lexi-parchmentMuted">
            <span className="truncate">Locked</span>
            <Lock className="w-3.5 h-3.5 text-lexi-emerald shrink-0" />
          </div>
          <div className="mt-1.5 sm:mt-2 text-lg sm:text-2xl font-mono font-bold text-lexi-emerald">
            {formatEth(lockedEth)}
          </div>
          <p className="text-[9px] sm:text-[11px] font-mono text-lexi-parchmentMuted mt-0.5 truncate">
            {escrowFunded ? "Base Sepolia" : "Pending"}
          </p>
        </div>

        <div className="rounded-xl border border-lexi-border bg-lexi-card p-3.5 sm:p-5 shadow-docket">
          <div className="flex items-center justify-between text-[11px] sm:text-xs font-mono text-lexi-parchmentMuted">
            <span className="truncate">Disbursed</span>
            <Unlock className="w-3.5 h-3.5 text-lexi-goldLight shrink-0" />
          </div>
          <div className="mt-1.5 sm:mt-2 text-lg sm:text-2xl font-mono font-bold text-lexi-goldLight">
            {formatEth(releasedEth)}
          </div>
          <p className="text-[9px] sm:text-[11px] font-mono text-lexi-parchmentMuted mt-0.5 truncate">
            To: {shortenAddress(pact.contractor)}
          </p>
        </div>

        <div className="col-span-2 lg:col-span-1 rounded-xl border border-lexi-border bg-lexi-card p-3.5 sm:p-5 shadow-docket flex flex-col justify-between">
          <div className="flex items-center justify-between text-[11px] sm:text-xs font-mono text-lexi-parchmentMuted">
            <span>Vault Status</span>
            <span className="w-2 h-2 rounded-full bg-lexi-emerald animate-pulse" />
          </div>
          <div className="my-1.5 sm:my-2">
            {!escrowFunded ? (
              <button
                onClick={handleFund}
                disabled={isFunding}
                className="w-full min-h-[38px] py-2 px-3 rounded-lg bg-lexi-gold text-lexi-bg font-bold font-mono text-[11px] sm:text-xs uppercase tracking-wider hover:bg-lexi-goldHover transition-all flex items-center justify-center gap-1.5"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>{isFunding ? "Depositing..." : "Deposit & Fund Vault"}</span>
              </button>
            ) : (
              <div className="text-xs sm:text-sm font-mono font-bold text-lexi-emerald flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Escrow Fully Secured</span>
              </div>
            )}
          </div>
          <p className="text-[9px] sm:text-[10px] font-mono text-lexi-parchmentMuted">
            Base Sepolia non-custodial
          </p>
        </div>
      </div>

      {/* Milestone Escrow Ledger */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-serif text-base sm:text-lg font-bold text-white">
            Milestone Escrow Ledger
          </h3>
          <span className="text-[11px] sm:text-xs font-mono text-lexi-parchmentMuted">
            {milestones.length} Stages
          </span>
        </div>

        <div className="space-y-4">
          {milestones.map((m, index) => {
            const isPending = m.status === "pending";
            const isSubmitted = m.status === "submitted";
            const isVerified = m.status === "verified";
            const isReleased = m.status === "released";

            return (
              <div
                key={m.id}
                className="rounded-xl border border-lexi-border bg-lexi-card p-4 sm:p-6 shadow-docket space-y-3 sm:space-y-4 transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-lexi-border/60 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 sm:w-6 sm:h-6 shrink-0 rounded bg-lexi-bg border border-lexi-border text-lexi-goldLight font-mono text-xs font-bold flex items-center justify-center">
                      {index + 1}
                    </span>
                    <h4 className="font-mono text-xs sm:text-sm font-bold text-white">
                      {m.title}
                    </h4>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3 self-stretch sm:self-auto pt-1 sm:pt-0">
                    <span className="font-mono text-xs sm:text-sm font-bold text-lexi-goldLight">
                      {formatEth(m.amountEth)}
                    </span>
                    <span
                      className={`text-[10px] sm:text-[11px] font-mono uppercase font-bold px-2 sm:px-2.5 py-0.5 rounded border ${
                        isReleased
                          ? "bg-lexi-emeraldMuted text-lexi-emerald border-lexi-emerald/50"
                          : isVerified
                          ? "bg-lexi-goldMuted text-lexi-goldLight border-lexi-gold/50"
                          : isSubmitted
                          ? "bg-blue-900/30 text-blue-400 border-blue-500/40"
                          : "bg-lexi-bg text-lexi-parchmentMuted border-lexi-border"
                      }`}
                    >
                      {m.status}
                    </span>
                  </div>
                </div>

                <p className="text-xs font-serif text-lexi-parchment/80 leading-relaxed">
                  {m.description}
                </p>

                {/* Deliverable info or submission input */}
                {m.deliverableRef ? (
                  <div className="p-3 rounded-lg bg-lexi-bg border border-lexi-border/70 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono">
                    <div className="flex flex-wrap items-center gap-1.5 text-lexi-parchment">
                      <span className="text-lexi-parchmentMuted text-[11px]">Artifact:</span>
                      <a
                        href={m.deliverableRef}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-lexi-blue hover:underline flex items-center gap-1 text-[11px] break-all"
                      >
                        <span>{m.deliverableRef}</span>
                        <ExternalLink className="w-3 h-3 shrink-0" />
                      </a>
                    </div>
                    {m.complianceScore && (
                      <span className="self-start sm:self-auto px-2 py-0.5 rounded bg-lexi-emeraldMuted border border-lexi-emerald/40 text-lexi-emerald text-[11px] font-bold">
                        AI: {m.complianceScore}/100
                      </span>
                    )}
                  </div>
                ) : (
                  <div className="p-3 rounded-lg bg-lexi-bg border border-lexi-border/70 space-y-2">
                    <label className="text-[10px] sm:text-[11px] font-mono text-lexi-parchmentMuted block">
                      Submit Deliverable Artifact (GitHub commit, IPFS CID, or live URL):
                    </label>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <input
                        type="text"
                        placeholder="https://github.com/..."
                        value={deliverableInput[m.id] || ""}
                        onChange={(e) =>
                          setDeliverableInput({ ...deliverableInput, [m.id]: e.target.value })
                        }
                        className="flex-1 bg-lexi-card border border-lexi-border rounded px-3 py-2 text-xs font-mono text-white placeholder-lexi-parchmentMuted/50 focus:outline-none focus:border-lexi-gold min-h-[40px]"
                      />
                      <button
                        onClick={() => handleSubmit(m.id)}
                        disabled={submittingId === m.id || !deliverableInput[m.id]}
                        className="px-4 py-2 rounded bg-lexi-gold hover:bg-lexi-goldHover text-lexi-bg font-mono font-bold text-xs uppercase disabled:opacity-50 transition-colors flex items-center justify-center gap-1.5 min-h-[40px]"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>Submit</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Milestone action footer */}
                <div className="pt-1 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs font-mono">
                  {m.txHash ? (
                    <a
                      href={`https://sepolia.basescan.org/tx/${m.txHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-lexi-parchmentMuted hover:text-lexi-gold flex items-center gap-1 text-[11px]"
                    >
                      <span>Tx: {shortenAddress(m.txHash)}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  ) : (
                    <span />
                  )}

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                    {/* If submitted but not verified: link to AI Watcher */}
                    {isSubmitted && (
                      <button
                        onClick={onNavigateToAiWatcher}
                        className="w-full sm:w-auto px-3 py-2 rounded border border-blue-500/50 bg-blue-900/20 text-blue-400 hover:bg-blue-900/40 transition-colors flex items-center justify-center gap-1.5 min-h-[40px]"
                      >
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Run AI Compliance Audit</span>
                      </button>
                    )}

                    {/* If verified by AI and ready for release */}
                    {isVerified && (
                      <button
                        onClick={() => handleRelease(m.id)}
                        disabled={releasingId === m.id || !escrowFunded}
                        className="w-full sm:w-auto px-4 py-2 rounded bg-lexi-emerald hover:bg-emerald-600 text-lexi-bg font-bold uppercase transition-all shadow-verified flex items-center justify-center gap-1.5 min-h-[40px]"
                      >
                        <Unlock className="w-3.5 h-3.5" />
                        <span>
                          {releasingId === m.id ? "Disbursing..." : "Disburse Escrow Payout"}
                        </span>
                      </button>
                    )}

                    {isReleased && (
                      <div className="flex items-center justify-center sm:justify-start gap-1.5 text-lexi-emerald font-bold text-xs py-1">
                        <CheckCircle2 className="w-4 h-4 shrink-0" />
                        <span>Capital Disbursed On-Chain</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
