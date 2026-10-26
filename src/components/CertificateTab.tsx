"use client";

import React, { useRef } from "react";
import {
  LegalPactTemplate,
  AgreementMilestone,
  LEXIPACT_CONTRACT_ADDRESS,
} from "@/lib/constants";
import { shortenAddress, formatEth } from "@/lib/web3";
import { Award, Printer, ShieldCheck, CheckCircle2, Scale } from "lucide-react";

interface CertificateTabProps {
  pact: LegalPactTemplate;
  milestones: AgreementMilestone[];
  clientSigned: boolean;
  contractorSigned: boolean;
  escrowFunded: boolean;
  clientSignatureHash?: string;
  contractorSignatureHash?: string;
}

export function CertificateTab({
  pact,
  milestones,
  clientSigned,
  contractorSigned,
  escrowFunded,
  clientSignatureHash,
  contractorSignatureHash,
}: CertificateTabProps) {
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  const allReleased = milestones.every((m) => m.status === "released");
  const anyAudited = milestones.some((m) => m.complianceScore);

  return (
    <div className="space-y-6">
      {/* Top action bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 no-print">
        <div>
          <h3 className="font-serif text-lg font-bold text-white">
            Notarized Cryptographic Docket & Certificate
          </h3>
          <p className="text-xs font-mono text-lexi-parchmentMuted">
            Legally admissible digital execution certificate for arbitral proceedings
          </p>
        </div>

        <button
          onClick={handlePrint}
          className="px-4 py-2 rounded-lg bg-lexi-gold hover:bg-lexi-goldHover text-lexi-bg font-mono font-bold text-xs uppercase tracking-wider transition-colors flex items-center gap-2 shadow-seal"
        >
          <Printer className="w-4 h-4" />
          <span>Print / Export Legal Docket</span>
        </button>
      </div>

      {/* The Printable Notarized Legal Deed */}
      <div
        ref={printRef}
        className="rounded-xl border border-lexi-border bg-lexi-card p-8 sm:p-12 shadow-docket legal-docket-card relative overflow-hidden space-y-8"
      >
        {/* Background Seal Watermark */}
        <div className="absolute -right-12 -bottom-12 opacity-5 pointer-events-none text-lexi-gold">
          <Scale className="w-96 h-96" />
        </div>

        {/* Certificate Header */}
        <div className="border-b-2 border-lexi-border pb-6 flex flex-wrap items-start justify-between gap-6">
          <div className="space-y-1">
            <span className="text-xs font-mono uppercase tracking-widest text-lexi-gold font-bold">
              LexiPact Notarization Protocol
            </span>
            <h2 className="font-serif text-3xl font-bold tracking-tight text-white">
              Certificate of Cryptographic Execution
            </h2>
            <p className="text-xs font-mono text-lexi-parchmentMuted">
              Docket Reference: {pact.id}-CERT | Network: Base Sepolia (Chain ID 84532)
            </p>
          </div>

          {/* Notarized Stamp Badge */}
          <div className="border-2 border-lexi-gold/80 rounded-xl p-3 bg-lexi-bg text-center space-y-1 min-w-[160px] shadow-seal">
            <div className="flex items-center justify-center text-lexi-gold">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-lexi-gold">
              Notarized & Sealed
            </div>
            <div className="text-[9px] font-mono text-lexi-parchmentMuted">
              Lex Cryptographia
            </div>
          </div>
        </div>

        {/* Contractual Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs font-mono">
          <div className="space-y-3 p-4 rounded-lg bg-lexi-bg border border-lexi-border/70">
            <div className="text-lexi-gold font-bold uppercase text-[11px]">
              Principal Agreement & Parties
            </div>
            <div className="space-y-1 text-lexi-parchment">
              <div>
                <span className="text-lexi-parchmentMuted">Instrument:</span> {pact.title}
              </div>
              <div>
                <span className="text-lexi-parchmentMuted">Jurisdiction:</span> {pact.jurisdiction}
              </div>
              <div className="break-all">
                <span className="text-lexi-parchmentMuted">Client Address:</span> {pact.client}
              </div>
              <div className="break-all">
                <span className="text-lexi-parchmentMuted">Contractor Address:</span> {pact.contractor}
              </div>
            </div>
          </div>

          <div className="space-y-3 p-4 rounded-lg bg-lexi-bg border border-lexi-border/70">
            <div className="text-lexi-gold font-bold uppercase text-[11px]">
              On-Chain Financial Ledger
            </div>
            <div className="space-y-1 text-lexi-parchment">
              <div>
                <span className="text-lexi-parchmentMuted">Total Escrow Value:</span>{" "}
                <span className="text-lexi-goldLight font-bold">{formatEth(pact.totalAmountEth)}</span>
              </div>
              <div>
                <span className="text-lexi-parchmentMuted">Vault Deposit Status:</span>{" "}
                <span className={escrowFunded ? "text-lexi-emerald font-bold" : "text-lexi-gold"}>
                  {escrowFunded ? "Secured on Base Sepolia" : "Pending Deposit"}
                </span>
              </div>
              <div className="break-all">
                <span className="text-lexi-parchmentMuted">Smart Escrow Vault:</span>{" "}
                {LEXIPACT_CONTRACT_ADDRESS}
              </div>
              <div>
                <span className="text-lexi-parchmentMuted">Arbitration Forum:</span> {pact.arbitrationForum}
              </div>
            </div>
          </div>
        </div>

        {/* EIP-712 Dual Signature Attestation Section */}
        <div className="space-y-3">
          <h4 className="font-serif text-sm font-semibold uppercase tracking-wider text-lexi-goldLight border-b border-lexi-border/50 pb-1">
            EIP-712 Structured Data Signatures
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
            <div className="p-4 rounded-lg bg-lexi-bg border border-lexi-border/70 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-white font-bold">Party A (Client Signature)</span>
                <span className="text-lexi-emerald font-semibold text-[10px] uppercase">
                  {clientSigned ? "Verified Valid" : "Pending"}
                </span>
              </div>
              <div className="text-[10px] text-lexi-parchmentMuted break-all font-mono">
                {clientSignatureHash || "0x6f91bc...signed-under-eip712"}
              </div>
            </div>

            <div className="p-4 rounded-lg bg-lexi-bg border border-lexi-border/70 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-white font-bold">Party B (Contractor Signature)</span>
                <span className="text-lexi-emerald font-semibold text-[10px] uppercase">
                  {contractorSigned ? "Verified Valid" : "Pending"}
                </span>
              </div>
              <div className="text-[10px] text-lexi-parchmentMuted break-all font-mono">
                {contractorSignatureHash || "0x981fae...signed-under-eip712"}
              </div>
            </div>
          </div>
        </div>

        {/* Milestone Audit & Settlement Evidence Table */}
        <div className="space-y-3">
          <h4 className="font-serif text-sm font-semibold uppercase tracking-wider text-lexi-goldLight border-b border-lexi-border/50 pb-1">
            Deliverables & AI Audit Records
          </h4>
          <div className="rounded-lg border border-lexi-border overflow-hidden text-xs font-mono">
            <table className="w-full text-left">
              <thead className="bg-lexi-bg border-b border-lexi-border text-lexi-parchmentMuted">
                <tr>
                  <th className="p-3">Milestone Stage</th>
                  <th className="p-3">Deliverable Artifact</th>
                  <th className="p-3 text-center">AI Audit Score</th>
                  <th className="p-3 text-right">Settlement Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-lexi-border/50 text-lexi-parchment">
                {milestones.map((m, idx) => (
                  <tr key={idx} className="hover:bg-lexi-cardHover/30">
                    <td className="p-3 font-medium text-white">{m.title}</td>
                    <td className="p-3 text-lexi-parchmentMuted truncate max-w-xs">
                      {m.deliverableRef || "Pending submission"}
                    </td>
                    <td className="p-3 text-center">
                      {m.complianceScore ? (
                        <span className="text-lexi-emerald font-bold">{m.complianceScore}/100</span>
                      ) : (
                        <span className="text-lexi-parchmentMuted">Pending</span>
                      )}
                    </td>
                    <td className="p-3 text-right font-bold uppercase text-[11px]">
                      <span
                        className={
                          m.status === "released"
                            ? "text-lexi-emerald"
                            : m.status === "verified"
                            ? "text-lexi-goldLight"
                            : "text-lexi-parchmentMuted"
                        }
                      >
                        {m.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Certificate Sign-off & Seal Footer */}
        <div className="pt-6 border-t-2 border-lexi-border flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
          <div className="space-y-1">
            <div className="text-lexi-parchment font-semibold">
              Signed and Certified via Base Sepolia Smart Contract Escrow
            </div>
            <div className="text-[11px] text-lexi-parchmentMuted">
              Attested by LexiPact Autonomous Sentinel AI Oracle (#0x07aC...489e)
            </div>
          </div>
          <div className="text-right">
            <div className="text-lexi-gold font-bold">SHA-256 Digest Certified</div>
            <div className="text-[10px] text-lexi-parchmentMuted">
              Timestamp: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
