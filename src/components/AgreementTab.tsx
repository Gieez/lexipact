"use client";

import React, { useState } from "react";
import {
  LegalPactTemplate,
  AgreementMilestone,
} from "@/lib/constants";
import {
  shortenAddress,
  formatEth,
  computePactDigest,
  buildEIP712Payload,
  simulateDeterministicSignature,
} from "@/lib/web3";
import {
  FileCheck,
  KeyRound,
  CheckCircle,
  Clock,
  Code2,
  Copy,
  Check,
  Stamp,
} from "lucide-react";
import confetti from "canvas-confetti";

interface AgreementTabProps {
  pact: LegalPactTemplate;
  clientSigned: boolean;
  contractorSigned: boolean;
  clientSignatureHash?: string;
  contractorSignatureHash?: string;
  onSignPact: (party: "client" | "contractor") => Promise<void>;
  activeRole: "client" | "contractor" | "oracle";
  userAddress: string;
}

export function AgreementTab({
  pact,
  clientSigned,
  contractorSigned,
  clientSignatureHash,
  contractorSignatureHash,
  onSignPact,
  activeRole,
  userAddress,
}: AgreementTabProps) {
  const [showJsonInspector, setShowJsonInspector] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isSigning, setIsSigning] = useState(false);

  const digest = computePactDigest(pact.id, pact.title, JSON.stringify(pact.clauses));
  const eip712Payload = buildEIP712Payload(
    pact.id,
    pact.title,
    pact.client,
    pact.contractor,
    pact.totalAmountEth,
    digest
  );

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(eip712Payload, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSign = async () => {
    if (activeRole !== "client" && activeRole !== "contractor") return;
    setIsSigning(true);
    try {
      await onSignPact(activeRole);
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
        colors: ["#d97706", "#f59e0b", "#10b981"],
      });
    } finally {
      setIsSigning(false);
    }
  };

  const canSign =
    (activeRole === "client" && !clientSigned) ||
    (activeRole === "contractor" && !contractorSigned);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
      {/* Left Column: Legal Docket Document */}
      <div className="lg:col-span-7 space-y-6">
        <div className="rounded-xl border border-lexi-border bg-lexi-card p-4 sm:p-8 shadow-docket relative overflow-hidden">
          {/* Official Document Header Ribbon */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4 pb-4 sm:pb-6 border-b border-lexi-border/70 text-xs font-mono">
            <div>
              <span className="text-lexi-gold uppercase font-bold tracking-wider text-[11px] sm:text-xs">
                Docket: {pact.id}
              </span>
              <p className="text-lexi-parchmentMuted text-[10px] sm:text-[11px] mt-0.5">
                Jurisdiction: {pact.jurisdiction}
              </p>
            </div>
            <div className="self-start sm:self-auto">
              <span className="inline-block px-2.5 py-1 rounded bg-lexi-bg border border-lexi-border text-lexi-parchment font-semibold text-[11px] sm:text-xs">
                Total Escrow: {formatEth(pact.totalAmountEth)}
              </span>
            </div>
          </div>

          {/* Legal Instrument Body */}
          <div className="pt-5 sm:pt-6 space-y-5 sm:space-y-6 text-lexi-parchment">
            <div className="text-center space-y-1.5 sm:space-y-2">
              <h2 className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-white">
                {pact.title}
              </h2>
              <p className="text-[10px] sm:text-xs uppercase font-mono tracking-widest text-lexi-gold">
                EIP-712 Cryptographically Verified Smart Agreement
              </p>
            </div>

            {/* Recitals */}
            <div className="space-y-2.5 pt-2">
              <h3 className="font-serif text-xs sm:text-sm font-semibold uppercase tracking-wider text-lexi-goldLight border-b border-lexi-border/40 pb-1">
                Recitals & Mutual Covenants
              </h3>
              {pact.recitals.map((recital, idx) => (
                <p
                  key={idx}
                  className="font-serif text-xs sm:text-sm leading-relaxed text-lexi-parchment/90 italic pl-3 border-l-2 border-lexi-gold/40"
                >
                  {recital}
                </p>
              ))}
            </div>

            {/* Operative Clauses */}
            <div className="space-y-3 sm:space-y-4 pt-2 sm:pt-4">
              <h3 className="font-serif text-xs sm:text-sm font-semibold uppercase tracking-wider text-lexi-goldLight border-b border-lexi-border/40 pb-1">
                Operative Articles
              </h3>
              {pact.clauses.map((clause, idx) => (
                <div
                  key={idx}
                  className="space-y-1 bg-lexi-bg/50 p-3 sm:p-4 rounded-lg border border-lexi-border/60"
                >
                  <h4 className="text-[11px] sm:text-xs font-mono font-bold text-white uppercase tracking-wide">
                    {clause.title}
                  </h4>
                  <p className="text-xs sm:text-sm font-serif leading-relaxed text-lexi-parchment/85">
                    {clause.content}
                  </p>
                </div>
              ))}
            </div>

            {/* Milestone Summary Table inside Legal Document */}
            <div className="space-y-3 pt-2 sm:pt-4">
              <h3 className="font-serif text-xs sm:text-sm font-semibold uppercase tracking-wider text-lexi-goldLight border-b border-lexi-border/40 pb-1">
                Milestone Settlement Schedule
              </h3>
              <div className="rounded-lg border border-lexi-border/70 overflow-x-auto text-xs">
                <table className="w-full text-left font-mono min-w-[480px]">
                  <thead className="bg-lexi-bg border-b border-lexi-border text-lexi-parchmentMuted text-[11px]">
                    <tr>
                      <th className="p-2.5 sm:p-3">Milestone Title</th>
                      <th className="p-2.5 sm:p-3 text-right">Escrow</th>
                      <th className="p-2.5 sm:p-3 text-center">AI Verification Gate</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-lexi-border/50 text-lexi-parchment text-[11px] sm:text-xs">
                    {pact.milestones.map((m, idx) => (
                      <tr key={idx} className="hover:bg-lexi-cardHover/50">
                        <td className="p-2.5 sm:p-3 font-medium text-white">{m.title}</td>
                        <td className="p-2.5 sm:p-3 text-right text-lexi-goldLight font-bold whitespace-nowrap">
                          {formatEth(m.amountEth)}
                        </td>
                        <td className="p-2.5 sm:p-3 text-center whitespace-nowrap">
                          <span className="px-2 py-0.5 rounded text-[9px] sm:text-[10px] bg-lexi-emeraldMuted text-lexi-emerald border border-lexi-emerald/40 font-mono">
                            AI Audit Required
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: EIP-712 Signing Deck & Execution State */}
      <div className="lg:col-span-5 space-y-6">
        {/* Signatures Status Card */}
        <div className="rounded-xl border border-lexi-border bg-lexi-card p-4 sm:p-6 shadow-docket space-y-4 sm:space-y-6">
          <div className="flex items-center justify-between border-b border-lexi-border pb-3 sm:pb-4">
            <div className="flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-lexi-gold shrink-0" />
              <h3 className="font-mono text-xs uppercase tracking-wider text-white font-bold">
                EIP-712 Status
              </h3>
            </div>
            <span
              className={`text-[11px] sm:text-xs font-mono font-bold px-2 py-0.5 rounded border ${
                clientSigned && contractorSigned
                  ? "bg-lexi-emeraldMuted text-lexi-emerald border-lexi-emerald/50"
                  : "bg-lexi-goldMuted text-lexi-gold border-lexi-gold/50"
              }`}
            >
              {clientSigned && contractorSigned ? "Fully Executed" : "Pending Signature"}
            </span>
          </div>

          {/* Client Signer Box */}
          <div className="p-3 sm:p-4 rounded-lg border border-lexi-border bg-lexi-bg space-y-1.5 sm:space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-mono text-lexi-parchmentMuted text-[11px] sm:text-xs">
                Party A: Client
              </span>
              {clientSigned ? (
                <span className="flex items-center gap-1 text-lexi-emerald font-mono font-medium text-[10px] sm:text-[11px]">
                  <CheckCircle className="w-3.5 h-3.5" /> Signed
                </span>
              ) : (
                <span className="flex items-center gap-1 text-lexi-gold font-mono font-medium text-[10px] sm:text-[11px]">
                  <Clock className="w-3.5 h-3.5" /> Awaiting Signature
                </span>
              )}
            </div>
            <p className="font-mono text-xs text-white">{shortenAddress(pact.client)}</p>
            {clientSigned && (
              <div className="pt-2 border-t border-lexi-border/50 text-[9px] sm:text-[10px] font-mono text-lexi-parchmentMuted break-all leading-tight">
                <span className="text-lexi-goldLight">Sig:</span>{" "}
                {clientSignatureHash || simulateDeterministicSignature(pact.client, digest)}
              </div>
            )}
          </div>

          {/* Contractor Signer Box */}
          <div className="p-3 sm:p-4 rounded-lg border border-lexi-border bg-lexi-bg space-y-1.5 sm:space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-mono text-lexi-parchmentMuted text-[11px] sm:text-xs">
                Party B: Contractor
              </span>
              {contractorSigned ? (
                <span className="flex items-center gap-1 text-lexi-emerald font-mono font-medium text-[10px] sm:text-[11px]">
                  <CheckCircle className="w-3.5 h-3.5" /> Signed
                </span>
              ) : (
                <span className="flex items-center gap-1 text-lexi-gold font-mono font-medium text-[10px] sm:text-[11px]">
                  <Clock className="w-3.5 h-3.5" /> Awaiting Signature
                </span>
              )}
            </div>
            <p className="font-mono text-xs text-white">{shortenAddress(pact.contractor)}</p>
            {contractorSigned && (
              <div className="pt-2 border-t border-lexi-border/50 text-[9px] sm:text-[10px] font-mono text-lexi-parchmentMuted break-all leading-tight">
                <span className="text-lexi-goldLight">Sig:</span>{" "}
                {contractorSignatureHash || simulateDeterministicSignature(pact.contractor, digest)}
              </div>
            )}
          </div>

          {/* Action Button: Sign as Active Role */}
          {canSign ? (
            <button
              onClick={handleSign}
              disabled={isSigning}
              className="w-full min-h-[44px] py-3 px-4 rounded-lg bg-gradient-to-r from-lexi-gold to-lexi-goldHover text-lexi-bg font-bold font-mono text-xs tracking-wider uppercase hover:opacity-95 transition-all shadow-seal flex items-center justify-center gap-2"
            >
              <Stamp className="w-4 h-4 shrink-0" />
              <span>{isSigning ? "Signing EIP-712..." : `Sign Agreement as ${activeRole}`}</span>
            </button>
          ) : clientSigned && contractorSigned ? (
            <div className="p-3 rounded-lg bg-lexi-emeraldMuted border border-lexi-emerald/40 text-lexi-emerald text-xs font-mono text-center flex items-center justify-center gap-2">
              <FileCheck className="w-4 h-4 shrink-0" />
              <span>Agreement Cryptographically Bound & Sealed</span>
            </div>
          ) : (
            <div className="p-3 rounded-lg bg-lexi-bg border border-lexi-border text-lexi-parchmentMuted text-xs font-mono text-center">
              Switch role in header to sign as {clientSigned ? "Contractor" : "Client"}
            </div>
          )}
        </div>

        {/* EIP-712 Typed Data Inspector */}
        <div className="rounded-xl border border-lexi-border bg-lexi-card p-4 sm:p-6 shadow-docket space-y-3 sm:space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Code2 className="w-4 h-4 text-lexi-gold shrink-0" />
              <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-white">
                EIP-712 Schema & Digest
              </h4>
            </div>
            <button
              onClick={() => setShowJsonInspector(!showJsonInspector)}
              className="text-[11px] sm:text-xs font-mono text-lexi-gold hover:underline"
            >
              {showJsonInspector ? "Hide Payload" : "Inspect Payload"}
            </button>
          </div>

          <div className="space-y-2 text-xs font-mono">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-2.5 rounded bg-lexi-bg border border-lexi-border/70 text-lexi-parchment gap-1">
              <span className="text-lexi-parchmentMuted text-[11px]">Terms Digest:</span>
              <span className="text-lexi-goldLight font-bold text-[11px] break-all">{shortenAddress(digest)}</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-2.5 rounded bg-lexi-bg border border-lexi-border/70 text-lexi-parchment gap-1">
              <span className="text-lexi-parchmentMuted text-[11px]">Contract:</span>
              <span className="text-lexi-emerald font-bold text-[11px] break-all">
                {shortenAddress(eip712Payload.domain.verifyingContract)}
              </span>
            </div>
          </div>

          {showJsonInspector && (
            <div className="relative mt-2">
              <pre className="p-3 rounded-lg bg-lexi-bg border border-lexi-border text-[10px] sm:text-[11px] font-mono text-lexi-parchment/80 overflow-x-auto max-h-64 leading-tight">
                {JSON.stringify(eip712Payload, null, 2)}
              </pre>
              <button
                onClick={handleCopyJson}
                className="absolute top-2 right-2 p-1.5 rounded bg-lexi-card border border-lexi-border text-xs text-lexi-parchmentMuted hover:text-white"
                title="Copy EIP-712 JSON"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-lexi-emerald" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
