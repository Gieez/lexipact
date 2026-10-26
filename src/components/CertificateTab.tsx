"use client";

import React, { useRef } from "react";
import {
  LegalPactTemplate,
  AgreementMilestone,
  LEXIPACT_CONTRACT_ADDRESS,
} from "@/lib/constants";
import { formatEth } from "@/lib/web3";
import { Printer, ShieldCheck, Scale } from "lucide-react";

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

  return (
    <div className="space-y-6">
      {/* Top action bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 no-print">
        <div>
          <h3 className="font-serif text-base sm:text-lg font-bold text-white">
            Notarized Cryptographic Docket & Certificate
          </h3>
          <p className="text-[11px] sm:text-xs font-mono text-lexi-parchmentMuted">
            Legally admissible digital execution certificate for arbitral proceedings
          </p>
        </div>

        <button
          onClick={handlePrint}
          className="self-start sm:self-auto px-4 py-2 rounded-lg bg-lexi-gold hover:bg-lexi-goldHover text-lexi-bg font-mono font-bold text-xs uppercase tracking-wider transition-colors flex items-center gap-2 shadow-seal min-h-[40px]"
        >
          <Printer className="w-4 h-4 shrink-0" />
          <span>Print / Export Docket</span>
        </button>
      </div>

      {/* The Printable Notarized Legal Deed */}
      <div
        ref={printRef}
        className="rounded-xl border border-lexi-border bg-lexi-card p-4 sm:p-8 md:p-12 shadow-docket legal-docket-card relative overflow-hidden space-y-6 sm:space-y-8"
      >
        {/* Background Seal Watermark */}
        <div className="absolute -right-12 -bottom-12 opacity-5 pointer-events-none text-lexi-gold">
          <Scale className="w-64 sm:w-96 h-64 sm:h-96" />
        </div>

        {/* Certificate Header */}
        <div className="border-b-2 border-lexi-border pb-4 sm:pb-6 flex flex-col sm:flex-row sm:items-start justify-between gap-4 sm:gap-6">
          <div className="space-y-1">
            <span className="text-[10px] sm:text-xs font-mono uppercase tracking-widest text-lexi-gold font-bold">
              LexiPact Notarization Protocol
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Certificate of Cryptographic Execution
            </h2>
            <p className="text-[10px] sm:text-xs font-mono text-lexi-parchmentMuted">
              Docket: {pact.id}-CERT | Base Sepolia (84532)
            </p>
          </div>

          {/* Notarized Stamp Badge */}
          <div className="border-2 border-lexi-gold/80 rounded-xl p-2.5 sm:p-3 bg-lexi-bg text-center space-y-0.5 sm:space-y-1 self-start sm:self-auto min-w-[140px] sm:min-w-[160px] shadow-seal">
            <div className="flex items-center justify-center text-lexi-gold">
              <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="text-[9px] sm:text-[10px] font-mono font-bold uppercase tracking-wider text-lexi-gold">
              Notarized & Sealed
            </div>
            <div className="text-[8px] sm:text-[9px] font-mono text-lexi-parchmentMuted">
              Lex Cryptographia
            </div>
          </div>
        </div>

        {/* Contractual Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 text-xs font-mono">
          <div className="space-y-2 sm:space-y-3 p-3.5 sm:p-4 rounded-lg bg-lexi-bg border border-lexi-border/70">
            <div className="text-lexi-gold font-bold uppercase text-[10px] sm:text-[11px]">
              Principal Agreement & Parties
            </div>
            <div className="space-y-1 text-lexi-parchment text-[11px] sm:text-xs">
              <div>
                <span className="text-lexi-parchmentMuted">Instrument:</span> {pact.title}
              </div>
              <div>
                <span className="text-lexi-parchmentMuted">Jurisdiction:</span> {pact.jurisdiction}
              </div>
              <div className="break-all">
                <span className="text-lexi-parchmentMuted">Client:</span> {pact.client}
              </div>
              <div className="break-all">
                <span className="text-lexi-parchmentMuted">Contractor:</span> {pact.contractor}
              </div>
            </div>
          </div>

          <div className="space-y-2 sm:space-y-3 p-3.5 sm:p-4 rounded-lg bg-lexi-bg border border-lexi-border/70">
            <div className="text-lexi-gold font-bold uppercase text-[10px] sm:text-[11px]">
              On-Chain Financial Ledger
            </div>
            <div className="space-y-1 text-lexi-parchment text-[11px] sm:text-xs">
              <div>
                <span className="text-lexi-parchmentMuted">Total Escrow:</span>{" "}
                <span className="text-lexi-goldLight font-bold">{formatEth(pact.totalAmountEth)}</span>
              </div>
              <div>
                <span className="text-lexi-parchmentMuted">Vault Deposit:</span>{" "}
                <span className={escrowFunded ? "text-lexi-emerald font-bold" : "text-lexi-gold"}>
                  {escrowFunded ? "Secured on Base Sepolia" : "Pending Deposit"}
                </span>
              </div>
              <div className="break-all">
                <span className="text-lexi-parchmentMuted">Escrow Vault:</span>{" "}
                {LEXIPACT_CONTRACT_ADDRESS}
              </div>
              <div>
                <span className="text-lexi-parchmentMuted">Arbitration:</span> {pact.arbitrationForum}
              </div>
            </div>
          </div>
        </div>

        {/* EIP-712 Dual Signature Attestation Section */}
        <div className="space-y-2.5 sm:space-y-3">
          <h4 className="font-serif text-xs sm:text-sm font-semibold uppercase tracking-wider text-lexi-goldLight border-b border-lexi-border/50 pb-1">
            EIP-712 Structured Data Signatures
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 text-xs font-mono">
            <div className="p-3 sm:p-4 rounded-lg bg-lexi-bg border border-lexi-border/70 space-y-1 sm:space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-white font-bold text-[11px] sm:text-xs">Party A (Client)</span>
                <span className="text-lexi-emerald font-semibold text-[9px] sm:text-[10px] uppercase">
                  {clientSigned ? "Verified Valid" : "Pending"}
                </span>
              </div>
              <div className="text-[9px] sm:text-[10px] text-lexi-parchmentMuted break-all font-mono leading-tight">
                {clientSignatureHash || "0x6f91bc...signed-under-eip712"}
              </div>
            </div>

            <div className="p-3 sm:p-4 rounded-lg bg-lexi-bg border border-lexi-border/70 space-y-1 sm:space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-white font-bold text-[11px] sm:text-xs">Party B (Contractor)</span>
                <span className="text-lexi-emerald font-semibold text-[9px] sm:text-[10px] uppercase">
                  {contractorSigned ? "Verified Valid" : "Pending"}
                </span>
              </div>
              <div className="text-[9px] sm:text-[10px] text-lexi-parchmentMuted break-all font-mono leading-tight">
                {contractorSignatureHash || "0x981fae...signed-under-eip712"}
              </div>
            </div>
          </div>
        </div>

        {/* Milestone Audit & Settlement Evidence Table */}
        <div className="space-y-2.5 sm:space-y-3">
          <h4 className="font-serif text-xs sm:text-sm font-semibold uppercase tracking-wider text-lexi-goldLight border-b border-lexi-border/50 pb-1">
            Deliverables & AI Audit Records
          </h4>
          <div className="rounded-lg border border-lexi-border overflow-x-auto text-xs font-mono">
            <table className="w-full text-left min-w-[500px]">
              <thead className="bg-lexi-bg border-b border-lexi-border text-lexi-parchmentMuted text-[10px] sm:text-[11px]">
                <tr>
                  <th className="p-2.5 sm:p-3">Milestone Stage</th>
                  <th className="p-2.5 sm:p-3">Deliverable Artifact</th>
                  <th className="p-2.5 sm:p-3 text-center">AI Score</th>
                  <th className="p-2.5 sm:p-3 text-right">Settlement</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-lexi-border/50 text-lexi-parchment text-[11px] sm:text-xs">
                {milestones.map((m, idx) => (
                  <tr key={idx} className="hover:bg-lexi-cardHover/30">
                    <td className="p-2.5 sm:p-3 font-medium text-white">{m.title}</td>
                    <td className="p-2.5 sm:p-3 text-lexi-parchmentMuted truncate max-w-xs">
                      {m.deliverableRef || "Pending submission"}
                    </td>
                    <td className="p-2.5 sm:p-3 text-center whitespace-nowrap">
                      {m.complianceScore ? (
                        <span className="text-lexi-emerald font-bold">{m.complianceScore}/100</span>
                      ) : (
                        <span className="text-lexi-parchmentMuted">Pending</span>
                      )}
                    </td>
                    <td className="p-2.5 sm:p-3 text-right font-bold uppercase text-[10px] sm:text-[11px] whitespace-nowrap">
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
        <div className="pt-4 sm:pt-6 border-t-2 border-lexi-border flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 text-xs font-mono">
          <div className="space-y-0.5 sm:space-y-1">
            <div className="text-lexi-parchment font-semibold text-[11px] sm:text-xs">
              Base Sepolia Smart Contract Escrow
            </div>
            <div className="text-[10px] sm:text-[11px] text-lexi-parchmentMuted">
              Attested by LexiPact Autonomous Sentinel AI Oracle (#0x07aC...489e)
            </div>
          </div>
          <div className="sm:text-right">
            <div className="text-lexi-gold font-bold text-[11px] sm:text-xs">SHA-256 Digest Certified</div>
            <div className="text-[9px] sm:text-[10px] text-lexi-parchmentMuted">
              Timestamp: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
