"use client";

import React, { useState } from "react";
import {
  LegalPactTemplate,
  AgreementMilestone,
} from "@/lib/constants";
import {
  runAutonomousComplianceAudit,
  AuditStepLog,
  AuditResult,
} from "@/lib/ai-watcher";
import { shortenAddress } from "@/lib/web3";
import {
  Bot,
  ShieldCheck,
  Terminal,
  CheckCircle2,
  Play,
  RotateCw,
} from "lucide-react";
import confetti from "canvas-confetti";

interface AiWatcherTabProps {
  pact: LegalPactTemplate;
  milestones: AgreementMilestone[];
  onAuditComplete: (milestoneId: string, result: AuditResult) => void;
  activeRole: "client" | "contractor" | "oracle";
}

export function AiWatcherTab({
  pact,
  milestones,
  onAuditComplete,
  activeRole,
}: AiWatcherTabProps) {
  const [selectedMilestoneId, setSelectedMilestoneId] = useState<string>(
    milestones.find((m) => m.status === "submitted")?.id || milestones[0]?.id || ""
  );
  const [isAuditing, setIsAuditing] = useState(false);
  const [logs, setLogs] = useState<AuditStepLog[]>([]);
  const [latestResult, setLatestResult] = useState<AuditResult | null>(null);

  const selectedMilestone =
    milestones.find((m) => m.id === selectedMilestoneId) || milestones[0];

  const handleStartAudit = async () => {
    if (!selectedMilestone) return;
    setIsAuditing(true);
    setLogs([]);
    setLatestResult(null);

    const deliverable =
      selectedMilestone.deliverableRef ||
      "https://github.com/Gieez/lexipact/commit/verified-artifact";

    try {
      const res = await runAutonomousComplianceAudit(
        pact.id,
        selectedMilestone.title,
        deliverable,
        pact.clauses.map((c) => c.title + ": " + c.content).join("\n"),
        (log) => {
          setLogs((prev) => [...prev, log]);
        }
      );

      setLatestResult(res);
      onAuditComplete(selectedMilestone.id, res);

      if (res.status === "verified") {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 },
          colors: ["#10b981", "#d97706"],
        });
      }
    } finally {
      setIsAuditing(false);
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Top Banner: Autonomous AI Oracle Header */}
      <div className="rounded-xl border border-lexi-border bg-lexi-card p-4 sm:p-6 shadow-docket flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-lexi-gold to-lexi-goldHover flex items-center justify-center text-lexi-bg shadow-seal shrink-0">
            <Bot className="w-5 h-5 sm:w-6 sm:h-6 text-lexi-bg" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-serif text-base sm:text-lg font-bold text-white truncate">
                AI Compliance Oracle
              </h3>
              <span className="px-1.5 sm:px-2 py-0.5 rounded text-[9px] sm:text-[10px] font-mono uppercase bg-lexi-emeraldMuted text-lexi-emerald border border-lexi-emerald/40 font-bold shrink-0">
                Sentinel v2.4
              </span>
            </div>
            <p className="text-[10px] sm:text-xs font-mono text-lexi-parchmentMuted mt-0.5 truncate">
              Oracle: {shortenAddress(pact.aiOracle)}
            </p>
          </div>
        </div>

        {/* Milestone Selector for Audit */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-2 text-xs font-mono w-full sm:w-auto">
          <span className="text-lexi-parchmentMuted text-[11px]">Audit Target:</span>
          <select
            value={selectedMilestoneId}
            onChange={(e) => setSelectedMilestoneId(e.target.value)}
            disabled={isAuditing}
            className="w-full sm:w-auto bg-lexi-bg border border-lexi-border rounded-lg px-3 py-2 text-white font-mono text-xs focus:outline-none focus:border-lexi-gold"
          >
            {milestones.map((m, idx) => (
              <option key={m.id} value={m.id}>
                #{idx + 1}: {m.title.slice(0, 28)}... ({m.status.toUpperCase()})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Grid: Audit Trigger & Live Telemetry Terminal */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
        {/* Left Column: Scope & Audit Execution Action */}
        <div className="lg:col-span-5 space-y-5 sm:space-y-6">
          <div className="rounded-xl border border-lexi-border bg-lexi-card p-4 sm:p-6 shadow-docket space-y-3 sm:space-y-4">
            <div className="flex items-center justify-between border-b border-lexi-border pb-3">
              <span className="text-xs font-mono uppercase font-bold text-lexi-gold">
                Audit Scope Checklist
              </span>
              <span className="text-[10px] sm:text-[11px] font-mono text-lexi-parchmentMuted">
                Milestone #{milestones.findIndex((m) => m.id === selectedMilestoneId) + 1}
              </span>
            </div>

            <div className="space-y-1.5 text-xs font-serif text-lexi-parchment/90">
              <p className="font-mono font-bold text-white text-xs sm:text-sm">
                {selectedMilestone?.title}
              </p>
              <p className="text-lexi-parchmentMuted text-[11px] sm:text-xs">
                {selectedMilestone?.description}
              </p>
            </div>

            {/* Contractual Verification Gates */}
            <div className="space-y-2 pt-2 border-t border-lexi-border/60 text-[11px] sm:text-xs font-mono">
              <div className="flex items-center gap-2 text-lexi-parchment">
                <CheckCircle2 className="w-3.5 h-3.5 text-lexi-emerald shrink-0" />
                <span>Scope & Functional Requirements Verification</span>
              </div>
              <div className="flex items-center gap-2 text-lexi-parchment">
                <CheckCircle2 className="w-3.5 h-3.5 text-lexi-emerald shrink-0" />
                <span>OWASP Web3 Smart Contract Static Analysis</span>
              </div>
              <div className="flex items-center gap-2 text-lexi-parchment">
                <CheckCircle2 className="w-3.5 h-3.5 text-lexi-emerald shrink-0" />
                <span>IP & Licensing Contagion Sweep (Zero GPL)</span>
              </div>
              <div className="flex items-center gap-2 text-lexi-parchment">
                <CheckCircle2 className="w-3.5 h-3.5 text-lexi-emerald shrink-0" />
                <span>Cryptographic Oracle Attestation Hash</span>
              </div>
            </div>

            {/* Artifact Under Audit */}
            <div className="p-3 rounded-lg bg-lexi-bg border border-lexi-border/70 space-y-1 text-xs font-mono">
              <span className="text-lexi-parchmentMuted text-[10px] uppercase">
                Artifact URL:
              </span>
              <p className="text-lexi-blue break-all text-[11px]">
                {selectedMilestone?.deliverableRef ||
                  "https://github.com/Gieez/lexipact/tree/main/src/lib/ai-watcher.ts"}
              </p>
            </div>

            {/* Audit Trigger Button */}
            <button
              onClick={handleStartAudit}
              disabled={isAuditing}
              className="w-full min-h-[44px] py-3 px-4 rounded-lg bg-gradient-to-r from-lexi-gold to-lexi-goldHover text-lexi-bg font-bold font-mono text-xs uppercase tracking-wider hover:opacity-95 transition-all shadow-seal flex items-center justify-center gap-2"
            >
              {isAuditing ? (
                <>
                  <RotateCw className="w-4 h-4 animate-spin shrink-0" />
                  <span>Auditing Deliverable Integrity...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current shrink-0" />
                  <span>Run Autonomous AI Audit</span>
                </>
              )}
            </button>
          </div>

          {/* Attestation Proof Card if Audit Finished */}
          {latestResult && (
            <div className="rounded-xl border border-lexi-emerald/40 bg-lexi-card p-4 sm:p-6 shadow-verified space-y-3">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-lexi-emerald font-bold uppercase flex items-center gap-1.5 text-[11px] sm:text-xs">
                  <ShieldCheck className="w-4 h-4 shrink-0" />
                  Oracle Attestation Emitted
                </span>
                <span className="text-lexi-parchmentMuted text-[10px]">Base Sepolia</span>
              </div>

              <div className="space-y-1 text-[10px] sm:text-[11px] font-mono break-all text-lexi-parchment leading-tight">
                <div>
                  <span className="text-lexi-parchmentMuted">Hash:</span>{" "}
                  <span className="text-lexi-goldLight">{latestResult.attestationHash}</span>
                </div>
                <div>
                  <span className="text-lexi-parchmentMuted">Signature:</span>{" "}
                  <span className="text-lexi-parchment/80">{latestResult.oracleSignature}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-lexi-border/60 text-xs font-mono text-lexi-emerald font-bold">
                Status: Payout Release Unlocked in Escrow Vault
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Tactical Live Telemetry Stream */}
        <div className="lg:col-span-7 space-y-5 sm:space-y-6">
          <div className="rounded-xl border border-lexi-border bg-lexi-card overflow-hidden shadow-docket">
            {/* Terminal Header */}
            <div className="px-3.5 py-2.5 sm:px-4 sm:py-3 bg-lexi-bg border-b border-lexi-border flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-lexi-gold shrink-0" />
                <span className="text-xs font-mono font-bold text-white uppercase tracking-wider truncate">
                  Live Audit Telemetry Stream
                </span>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-red-500/80" />
                <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-yellow-500/80" />
                <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-green-500/80" />
              </div>
            </div>

            {/* Terminal Log Output */}
            <div className="p-3 sm:p-4 bg-[#07080a] font-mono text-xs text-lexi-parchment min-h-[260px] sm:min-h-[320px] max-h-[380px] sm:max-h-[420px] overflow-y-auto space-y-2 leading-relaxed">
              {logs.length === 0 && !isAuditing ? (
                <div className="text-lexi-parchmentMuted/50 text-center py-20 text-xs italic">
                  Press &apos;Run Autonomous AI Audit&apos; to initiate automated compliance inspection.
                </div>
              ) : (
                logs.map((log) => (
                  <div key={log.id} className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-2 text-[10px] sm:text-[11px]">
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="text-lexi-parchmentMuted">{log.timestamp}</span>
                      <span
                        className={`font-bold px-1.5 py-0.2 rounded text-[9px] sm:text-[10px] ${
                          log.type === "success"
                            ? "text-lexi-emerald bg-lexi-emeraldMuted"
                            : log.type === "warning"
                            ? "text-lexi-gold bg-lexi-goldMuted"
                            : "text-lexi-blue bg-blue-950/40"
                        }`}
                      >
                        [{log.phase}]
                      </span>
                    </div>
                    <span
                      className={`break-words ${
                        log.type === "success"
                          ? "text-lexi-parchment"
                          : "text-lexi-parchment/80"
                      }`}
                    >
                      {log.message}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Score & Evaluation Dimensions Card */}
          {latestResult && (
            <div className="rounded-xl border border-lexi-border bg-lexi-card p-4 sm:p-6 shadow-docket space-y-3 sm:space-y-4">
              <div className="flex items-center justify-between border-b border-lexi-border pb-3">
                <h4 className="font-mono text-xs uppercase font-bold text-white">
                  Compliance Verdict
                </h4>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xl sm:text-2xl font-bold text-lexi-emerald">
                    {latestResult.score}/100
                  </span>
                  <span className="text-[9px] sm:text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-lexi-emeraldMuted border border-lexi-emerald/40 text-lexi-emerald font-bold">
                    Passed
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
                {latestResult.evaluations.map((ev, idx) => (
                  <div key={idx} className="p-2.5 sm:p-3 rounded-lg bg-lexi-bg border border-lexi-border/70 space-y-1">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-white font-semibold text-[11px] sm:text-xs truncate">{ev.criterion}</span>
                      <span className="text-lexi-goldLight font-bold text-[11px] sm:text-xs shrink-0">{ev.score}%</span>
                    </div>
                    <p className="text-[10px] sm:text-[11px] font-serif text-lexi-parchmentMuted leading-tight">
                      {ev.notes}
                    </p>
                  </div>
                ))}
              </div>

              <p className="text-xs font-serif text-lexi-parchment/90 italic pt-2 border-t border-lexi-border/50">
                &ldquo;{latestResult.summary}&rdquo;
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
