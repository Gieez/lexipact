"use client";

import React, { useState } from "react";
import { Header } from "@/components/Header";
import { DocketNavigation, DocketTab } from "@/components/DocketNavigation";
import { AgreementTab } from "@/components/AgreementTab";
import { EscrowVaultTab } from "@/components/EscrowVaultTab";
import { AiWatcherTab } from "@/components/AiWatcherTab";
import { CertificateTab } from "@/components/CertificateTab";
import { CreatePactModal } from "@/components/CreatePactModal";
import {
  PRESET_TEMPLATES,
  LegalPactTemplate,
  AgreementMilestone,
} from "@/lib/constants";
import {
  simulateDeterministicSignature,
  computePactDigest,
} from "@/lib/web3";
import { AuditResult } from "@/lib/ai-watcher";
import { Plus, Scale, ExternalLink } from "lucide-react";

export default function Home() {
  const [pacts, setPacts] = useState<LegalPactTemplate[]>(PRESET_TEMPLATES);
  const [selectedPactId, setSelectedPactId] = useState<string>(
    PRESET_TEMPLATES[0].id
  );
  const [activeTab, setActiveTab] = useState<DocketTab>("agreement");

  // Mode and Persona State
  const [isSandbox, setIsSandbox] = useState<boolean>(true);
  const [activeRole, setActiveRole] = useState<"client" | "contractor" | "oracle">(
    "client"
  );
  const [userAddress, setUserAddress] = useState<string>(
    PRESET_TEMPLATES[0].client
  );
  const [isConnected, setIsConnected] = useState<boolean>(false);

  // Pact Execution State
  const [clientSigned, setClientSigned] = useState<boolean>(true);
  const [contractorSigned, setContractorSigned] = useState<boolean>(false);
  const [clientSignatureHash, setClientSignatureHash] = useState<string>(
    "0x9f18a24debc081628172049182374618237461827364182736418273641827361b"
  );
  const [contractorSignatureHash, setContractorSignatureHash] =
    useState<string>("");
  const [escrowFunded, setEscrowFunded] = useState<boolean>(true);
  const [milestones, setMilestones] = useState<AgreementMilestone[]>(
    PRESET_TEMPLATES[0].milestones
  );

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const currentPact =
    pacts.find((p) => p.id === selectedPactId) || PRESET_TEMPLATES[0];

  const handleSelectPact = (pact: LegalPactTemplate) => {
    setSelectedPactId(pact.id);
    setMilestones(pact.milestones);
    setClientSigned(true);
    setContractorSigned(false);
    setEscrowFunded(true);
  };

  const handleCreatePact = (newPact: LegalPactTemplate) => {
    setPacts([newPact, ...pacts]);
    setSelectedPactId(newPact.id);
    setMilestones(newPact.milestones);
    setClientSigned(true);
    setContractorSigned(false);
    setEscrowFunded(false);
    setActiveTab("agreement");
  };

  // Live Wallet Connection Handler
  const handleConnectWallet = async () => {
    if (typeof window === "undefined" || !window.ethereum) {
      alert(
        "No Web3 browser wallet detected (MetaMask / Rabby). Using Reviewer Sandbox mode."
      );
      setIsSandbox(true);
      return;
    }

    try {
      const accounts = (await window.ethereum.request({
        method: "eth_requestAccounts",
      })) as string[];

      if (accounts && accounts[0]) {
        setUserAddress(accounts[0]);
        setIsConnected(true);
        setIsSandbox(false);

        // Auto switch to Base Sepolia
        try {
          await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: "0x14a34" }], // 84532 in hex
          });
        } catch (switchError: unknown) {
          const err = switchError as { code?: number };
          if (err.code === 4902) {
            await window.ethereum.request({
              method: "wallet_addEthereumChain",
              params: [
                {
                  chainId: "0x14a34",
                  chainName: "Base Sepolia",
                  nativeCurrency: { name: "Sepolia Ether", symbol: "ETH", decimals: 18 },
                  rpcUrls: ["https://sepolia.base.org"],
                  blockExplorerUrls: ["https://sepolia.basescan.org"],
                },
              ],
            });
          }
        }
      }
    } catch (err) {
      console.error("Wallet connect error:", err);
    }
  };

  // EIP-712 Signing action
  const handleSignPact = async (party: "client" | "contractor") => {
    const digest = computePactDigest(
      currentPact.id,
      currentPact.title,
      JSON.stringify(currentPact.clauses)
    );
    const sig = simulateDeterministicSignature(
      party === "client" ? currentPact.client : currentPact.contractor,
      digest
    );

    if (party === "client") {
      setClientSigned(true);
      setClientSignatureHash(sig);
    } else {
      setContractorSigned(true);
      setContractorSignatureHash(sig);
    }
  };

  // Escrow funding
  const handleFundEscrow = async () => {
    setEscrowFunded(true);
  };

  // Milestone deliverable submission
  const handleSubmitDeliverable = async (milestoneId: string, ref: string) => {
    setMilestones((prev) =>
      prev.map((m) =>
        m.id === milestoneId ? { ...m, deliverableRef: ref, status: "submitted" } : m
      )
    );
  };

  // AI Compliance Audit completion
  const handleAuditComplete = (milestoneId: string, result: AuditResult) => {
    setMilestones((prev) =>
      prev.map((m) =>
        m.id === milestoneId
          ? {
              ...m,
              status: result.status === "verified" ? "verified" : "pending",
              complianceScore: result.score,
              auditNotes: result.evaluations.map((e) => `${e.criterion}: ${e.notes}`),
              auditTimestamp: new Date().toISOString(),
            }
          : m
      )
    );
  };

  // Milestone release disbursement
  const handleReleaseMilestone = async (milestoneId: string) => {
    const fakeTx = `0x${Math.random().toString(16).substring(2)}${Math.random()
      .toString(16)
      .substring(2)}` as `0x${string}`;

    setMilestones((prev) =>
      prev.map((m) =>
        m.id === milestoneId ? { ...m, status: "released", txHash: fakeTx } : m
      )
    );
  };

  const signaturesCount = (clientSigned ? 1 : 0) + (contractorSigned ? 1 : 0);
  const auditedCount = milestones.filter((m) => m.complianceScore).length;

  return (
    <div className="min-h-screen flex flex-col bg-lexi-bg text-lexi-parchment">
      {/* Header */}
      <Header
        isSandbox={isSandbox}
        setIsSandbox={setIsSandbox}
        activeRole={activeRole}
        setActiveRole={setActiveRole}
        userAddress={userAddress}
        setUserAddress={setUserAddress}
        isConnected={isConnected}
        setIsConnected={setIsConnected}
        onConnectWallet={handleConnectWallet}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8 w-full space-y-5 sm:space-y-8">
        {/* Pact Switcher & Forge Action Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 sm:p-4 rounded-xl border border-lexi-border bg-lexi-card shadow-docket">
          <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto py-1 no-scrollbar">
            <span className="text-[11px] sm:text-xs font-mono text-lexi-parchmentMuted uppercase whitespace-nowrap">
              Docket:
            </span>
            {pacts.map((p) => (
              <button
                key={p.id}
                onClick={() => handleSelectPact(p)}
                className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-mono whitespace-nowrap transition-all border shrink-0 ${
                  selectedPactId === p.id
                    ? "bg-lexi-gold text-lexi-bg font-bold border-lexi-gold shadow-sm"
                    : "bg-lexi-bg border-lexi-border text-lexi-parchmentMuted hover:text-white hover:border-lexi-borderStrong"
                }`}
              >
                {p.id}: {p.title.slice(0, 20)}...
              </button>
            ))}
          </div>

          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="w-full sm:w-auto px-3.5 py-2 rounded-lg border border-lexi-gold/50 bg-lexi-goldMuted hover:bg-lexi-gold/20 text-lexi-goldLight text-xs font-mono font-bold uppercase transition-all flex items-center justify-center gap-1.5 min-h-[40px]"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Forge Custom Pact</span>
          </button>
        </div>

        {/* Docket Tab Navigation */}
        <DocketNavigation
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          signaturesCount={signaturesCount}
          escrowFunded={escrowFunded}
          auditedCount={auditedCount}
          totalMilestones={milestones.length}
        />

        {/* Tab Content Display */}
        <div className="pt-1 sm:pt-2">
          {activeTab === "agreement" && (
            <AgreementTab
              pact={currentPact}
              clientSigned={clientSigned}
              contractorSigned={contractorSigned}
              clientSignatureHash={clientSignatureHash}
              contractorSignatureHash={contractorSignatureHash}
              onSignPact={handleSignPact}
              activeRole={activeRole}
              userAddress={userAddress}
            />
          )}

          {activeTab === "escrow" && (
            <EscrowVaultTab
              pact={currentPact}
              milestones={milestones}
              escrowFunded={escrowFunded}
              onFundEscrow={handleFundEscrow}
              onSubmitDeliverable={handleSubmitDeliverable}
              onReleaseMilestone={handleReleaseMilestone}
              onNavigateToAiWatcher={() => setActiveTab("ai-watcher")}
              activeRole={activeRole}
              userAddress={userAddress}
            />
          )}

          {activeTab === "ai-watcher" && (
            <AiWatcherTab
              pact={currentPact}
              milestones={milestones}
              onAuditComplete={handleAuditComplete}
              activeRole={activeRole}
            />
          )}

          {activeTab === "certificate" && (
            <CertificateTab
              pact={currentPact}
              milestones={milestones}
              clientSigned={clientSigned}
              contractorSigned={contractorSigned}
              escrowFunded={escrowFunded}
              clientSignatureHash={clientSignatureHash}
              contractorSignatureHash={contractorSignatureHash}
            />
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-lexi-border bg-lexi-card/60 py-5 sm:py-6 text-[11px] sm:text-xs font-mono text-lexi-parchmentMuted no-print mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <Scale className="w-4 h-4 text-lexi-gold shrink-0" />
            <span className="font-serif font-bold text-white">LexiPact</span>
            <span>&bull;</span>
            <span>Legal-Hack-2026 DoraHacks Hackathon</span>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="https://sepolia.basescan.org"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-lexi-gold transition-colors flex items-center gap-1"
            >
              <span>Base Sepolia</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <a
              href="https://github.com/Gieez/lexipact"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-lexi-gold transition-colors flex items-center gap-1"
            >
              <span>GitHub</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </footer>

      {/* Modal */}
      <CreatePactModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={handleCreatePact}
        currentAddress={userAddress}
      />
    </div>
  );
}
