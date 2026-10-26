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
  Cpu,
  Terminal,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCw,
  Award,
  Layers,
  FileCode,
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
  // Pick the first submitted or active milestone
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
    <div className="space-y-8">
      {/* Top Banner: Autonomous AI Oracle Header */}
      <div className="rounded-xl border border-lexi-border bg-lexi-card p-6 shadow-docket flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-lexi-gold to-lexi-goldHover flex items-center justify-center text-lexi-bg shadow-seal">
            <Bot className="w-6 h-6 text-lexi-bg" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-serif text-lg font-bold text-white">
                Autonomous AI Compliance Oracle
              </h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-lexi-emeraldMuted text-lexi-emerald border border-lexi-emerald/40 font-bold">
                Sentinel Engine v2.4
              </span>
            </div>
            <p className="text-xs font-mono text-lexi-parchmentMuted mt-0.5">
              Oracle Address: {shortenAddress(pact.aiOracle)} | Autonomous Milestone Verification
            </p>
          </div>
        </div>

        {/* Milestone Selector for Audit */}
        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="text-lexi-parchmentMuted">Select Target:</span>
          <select
            value={selectedMilestoneId}
            onChange={(e) => setSelectedMilestoneId(e.target.value)}
            disabled={isAuditing}
            className="bg-lexi-bg border border-lexi-border rounded-lg px-3 py-1.5 text-white font-mono focus:outline-none focus:border-lexi-gold"
          >
            {milestones.map((m, idx) => (
              <option key={m.id} value={m.id}>
                #{idx + 1}: {m.title.slice(0, 36)}... ({m.status.toUpperCase()})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Grid: Audit Trigger & Live Telemetry Terminal */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Scope & Audit Execution Action */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-xl border border-lexi-border bg-lexi-card p-6 shadow-docket space-y-4">
            <div className="flex items-center justify-between border-b border-lexi-border pb-3">
              <span className="text-xs font-mono uppercase font-bold text-lexi-gold">
                Audit Scope Checklist
              </span>
              <span className="text-[11px] font-mono text-lexi-parchmentMuted">
                Milestone #{milestones.findIndex((m) => m.id === selectedMilestoneId) + 1}
              </span>
            </div>

            <div className="space-y-2 text-xs font-serif text-lexi-parchment/90">
              <p className="font-mono font-bold text-white text-sm">
                {selectedMilestone?.title}
              </p>
              <p className="text-lexi-parchmentMuted text-xs">
                {selectedMilestone?.description}
              </p>
            </div>

            {/* Contractual Verification Gates */}
            <div className="space-y-2 pt-2 border-t border-lexi-border/60 text-xs font-mono">
              <div className="flex items-center gap-2 text-lexi-parchment">
                <CheckCircle2 className="w-3.5 h-3.5 text-lexi-emerald" />
                <span>Scope & Functional Requirements Verification</span>
              </div>
              <div className="flex items-center gap-2 text-lexi-parchment">
                <CheckCircle2 className="w-3.5 h-3.5 text-lexi-emerald" />
                <span>OWASP Web3 Smart Contract Static Analysis</span>
              </div>
              <div className="flex items-center gap-2 text-lexi-parchment">
                <CheckCircle2 className="w-3.5 h-3.5 text-lexi-emerald" />
                <span>IP & Licensing Contagion Sweep (Zero GPL)</span>
              </div>
              <div className="flex items-center gap-2 text-lexi-parchment">
                <CheckCircle2 className="w-3.5 h-3.5 text-lexi-emerald" />
                <span>On-Chain Cryptographic Oracle Attestation Hash</span>
              </div>
            </div>

            {/* Artifact Under Audit */}
            <div className="p-3 rounded-lg bg-lexi-bg border border-lexi-border/70 space-y-1 text-xs font-mono">
              <span className="text-lexi-parchmentMuted text-[10px] uppercase">
                Deliverable Artifact URL:
              </span>
              <p className="text-lexi-blue break-all">
                {selectedMilestone?.deliverableRef ||
                  "https://github.com/Gieez/lexipact/tree/main/src/lib/ai-watcher.ts"}
              </p>
            </div>

            {/* Audit Trigger Button */}
            <button
              onClick={handleStartAudit}
              disabled={isAuditing}
              className="w-full py-3 px-4 rounded-lg bg-gradient-to-r from-lexi-gold to-lexi-goldHover text-lexi-bg font-bold font-mono text-xs uppercase tracking-wider hover:opacity-95 transition-all shadow-seal flex items-center justify-center gap-2"
            >
              {isAuditing ? (
                <>
                  <RotateCw className="w-4 h-4 animate-spin" />
                  <span>Auditing Deliverable Integrity...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  <span>Run Autonomous AI Audit</span>
                </>
              )}
            </button>
          </div>

          {/* Attestation Proof Card if Audit Finished */}
          {latestResult && (
            <div className="rounded-xl border border-lexi-emerald/40 bg-lexi-card p-6 shadow-verified space-y-3">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-lexi-emerald font-bold uppercase flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" />
                  Oracle Attestation Emitted
                </span>
                <span className="text-lexi-parchmentMuted">Base Sepolia</span>
              </div>

              <div className="space-y-1 text-[11px] font-mono break-all text-lexi-parchment">
                <div>
                  <span className="text-lexi-parchmentMuted">Attestation Hash:</span>{" "}
                  <span className="text-lexi-goldLight">{latestResult.attestationHash}</span>
                </div>
                <div>
                  <span className="text-lexi-parchmentMuted">Oracle Signature:</span>{" "}
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
        <div className="lg:col-span-7 space-y-6">
          <div className="rounded-xl border border-lexi-border bg-lexi-card overflow-hidden shadow-docket">
            {/* Terminal Header */}
            <div className="px-4 py-3 bg-lexi-bg border-b border-lexi-border flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-lexi-gold" />
                <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                  Live Audit Telemetry Stream
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
              </div>
            </div>

            {/* Terminal Log Output */}
            <div className="p-4 bg-[#07080a] font-mono text-xs text-lexi-parchment min-h-[320px] max-h-[420px] overflow-y-auto space-y-2 leading-relaxed">
              {logs.length === 0 && !isAuditing ? (
                <div className="text-lexi-parchmentMuted/50 text-center py-24 italic">
                  Press &apos;Run Autonomous AI Audit&apos; to initiate automated compliance inspection.
                </div>
              ) : (
                logs.map((log) => (
                  <div key={log.id} className="flex items-start gap-2 text-[11px]">
                    <span className="text-lexi-parchmentMuted">{log.timestamp}</span>
                    <span
                      className={`font-bold px-1.5 py-0.2 rounded text-[10px] ${
                        log.type === "success"
                          ? "text-lexi-emerald bg-lexi-emeraldMuted"
                          : log.type === "warning"
                          ? "text-lexi-gold bg-lexi-goldMuted"
                          : "text-lexi-blue bg-blue-950/40"
                      }`}
                    >
                      [{log.phase}]
                    </span>
                    <span
                      className={
                        log.type === "success"
                          ? "text-lexi-parchment"
                          : "text-lexi-parchment/80"
                      }
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
            <div className="rounded-xl border border-lexi-border bg-lexi-card p-6 shadow-docket space-y-4">
              <div className="flex items-center justify-between border-b border-lexi-border pb-3">
                <h4 className="font-mono text-xs uppercase font-bold text-white">
                  Compliance Audit Verdict
                </h4>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-2xl font-bold text-lexi-emerald">
                    {latestResult.score}/100
                  </span>
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-lexi-emeraldMuted border border-lexi-emerald/40 text-lexi-emerald font-bold">
                    Passed
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {latestResult.evaluations.map((ev, idx) => (
                  <div key={idx} className="p-3 rounded-lg bg-lexi-bg border border-lexi-border/70 space-y-1">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-white font-semibold">{ev.criterion}</span>
                      <span className="text-lexi-goldLight font-bold">{ev.score}%</span>
                    </div>
                    <p className="text-[11px] font-serif text-lexi-parchmentMuted leading-tight">
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
