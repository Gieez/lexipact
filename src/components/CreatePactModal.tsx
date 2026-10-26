"use client";

import React, { useState } from "react";
import { LegalPactTemplate, AgreementMilestone } from "@/lib/constants";
import { X, Plus, Trash2, Scale } from "lucide-react";

interface CreatePactModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (pact: LegalPactTemplate) => void;
  currentAddress: string;
}

export function CreatePactModal({
  isOpen,
  onClose,
  onCreate,
  currentAddress,
}: CreatePactModalProps) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("AI x Blockchain Infrastructure");
  const [contractor, setContractor] = useState(
    "0xB0B8F518174a81A7b99c9c450143a2C562D7102c"
  );
  const [milestones, setMilestones] = useState<
    { title: string; amountEth: string; description: string }[]
  >([
    {
      title: "Milestone 1: Smart Contract Architecture",
      amountEth: "0.20",
      description: "Architecture design, security patterns, and unit tests.",
    },
    {
      title: "Milestone 2: AI Compliance Watcher & Deployment",
      amountEth: "0.25",
      description: "Autonomous verification oracle and production deployment.",
    },
  ]);

  if (!isOpen) return null;

  const totalEth = milestones.reduce(
    (acc, m) => acc + (parseFloat(m.amountEth) || 0),
    0
  );

  const handleAddMilestone = () => {
    setMilestones([
      ...milestones,
      {
        title: `Milestone ${milestones.length + 1}: Deliverables`,
        amountEth: "0.10",
        description: "Milestone deliverables and automated verification.",
      },
    ]);
  };

  const handleRemoveMilestone = (idx: number) => {
    if (milestones.length <= 1) return;
    setMilestones(milestones.filter((_, i) => i !== idx));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    const newPactId = `LP-2026-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

    const formattedMilestones: AgreementMilestone[] = milestones.map(
      (m, idx) => ({
        id: `m-custom-${idx + 1}`,
        title: m.title,
        description: m.description,
        amountEth: m.amountEth,
        deliverableSpecs: m.description,
        status: "pending",
      })
    );

    const newPact: LegalPactTemplate = {
      id: newPactId,
      title,
      category,
      jurisdiction: "Lex Cryptographia / Base L2 Consensus Code",
      arbitrationForum: "Decentralized On-Chain Escrow Quorum",
      totalAmountEth: totalEth.toFixed(2),
      client: currentAddress.startsWith("0x")
        ? (currentAddress as `0x${string}`)
        : "0xA11ce9589d81d5964E767E9675Ac227847E45d61",
      contractor: contractor.startsWith("0x")
        ? (contractor as `0x${string}`)
        : "0xB0B8F518174a81A7b99c9c450143a2C562D7102c",
      aiOracle: "0x07aC1E5e896478950B2f43A88909772B4012489e",
      summary: `Legally binding agreement for ${title} with autonomous AI milestone verification.`,
      recitals: [
        "WHEREAS, Client agrees to deposit specified funds into trustless Base Sepolia escrow;",
        "WHEREAS, Contractor undertakes to deliver scope satisfying agreed benchmarks;",
        "WHEREAS, milestone releases require AI Compliance Oracle certification.",
      ],
      clauses: [
        {
          title: "Clause 1. Scope & Deliverable Standards",
          content:
            "Contractor will complete deliverables in accordance with professional software engineering specifications.",
        },
        {
          title: "Clause 2. Autonomous AI Compliance Oracle Gate",
          content:
            "Milestone payouts remain locked in smart escrow until the designated AI Oracle verifies code and security criteria with score >= 85%.",
        },
      ],
      milestones: formattedMilestones,
    };

    onCreate(newPact);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-lexi-card border border-lexi-border rounded-xl shadow-docket max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between border-b border-lexi-border pb-4">
          <div className="flex items-center gap-2">
            <Scale className="w-5 h-5 text-lexi-gold" />
            <h3 className="font-serif text-xl font-bold text-white">
              Forge New Legal Escrow Pact
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-lexi-parchmentMuted hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-mono">
          <div>
            <label className="text-lexi-parchmentMuted uppercase block mb-1">
              Agreement Title:
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Cross-Chain Protocol Development & SLA"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-lexi-bg border border-lexi-border rounded-lg p-2.5 text-white font-serif focus:border-lexi-gold focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-lexi-parchmentMuted uppercase block mb-1">
                Hackathon Track / Category:
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-lexi-bg border border-lexi-border rounded-lg p-2.5 text-white focus:border-lexi-gold focus:outline-none"
              >
                <option value="AI x Blockchain Infrastructure">
                  AI x Blockchain Infrastructure
                </option>
                <option value="LegalTech & RegTech">LegalTech & RegTech</option>
              </select>
            </div>

            <div>
              <label className="text-lexi-parchmentMuted uppercase block mb-1">
                Contractor Wallet:
              </label>
              <input
                type="text"
                required
                value={contractor}
                onChange={(e) => setContractor(e.target.value)}
                className="w-full bg-lexi-bg border border-lexi-border rounded-lg p-2.5 text-white focus:border-lexi-gold focus:outline-none"
              />
            </div>
          </div>

          {/* Milestones dynamic builder */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between border-b border-lexi-border/60 pb-1">
              <span className="text-lexi-gold uppercase font-bold">
                Escrow Milestones
              </span>
              <span className="text-lexi-goldLight font-bold">
                Total: {totalEth.toFixed(2)} ETH
              </span>
            </div>

            {milestones.map((m, idx) => (
              <div
                key={idx}
                className="p-3 rounded-lg bg-lexi-bg border border-lexi-border/80 space-y-2"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-lexi-parchmentMuted text-[10px]">
                    Milestone #{idx + 1}
                  </span>
                  {milestones.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveMilestone(idx)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <input
                    type="text"
                    required
                    placeholder="Title"
                    value={m.title}
                    onChange={(e) => {
                      const updated = [...milestones];
                      updated[idx].title = e.target.value;
                      setMilestones(updated);
                    }}
                    className="sm:col-span-2 bg-lexi-card border border-lexi-border rounded p-1.5 text-white"
                  />
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="Amount (ETH)"
                    value={m.amountEth}
                    onChange={(e) => {
                      const updated = [...milestones];
                      updated[idx].amountEth = e.target.value;
                      setMilestones(updated);
                    }}
                    className="bg-lexi-card border border-lexi-border rounded p-1.5 text-white"
                  />
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={handleAddMilestone}
              className="text-lexi-gold hover:underline flex items-center gap-1 text-[11px]"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Another Milestone</span>
            </button>
          </div>

          <div className="pt-4 border-t border-lexi-border flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-lexi-border text-lexi-parchmentMuted hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-lexi-gold hover:bg-lexi-goldHover text-lexi-bg font-bold uppercase tracking-wider shadow-seal"
            >
              Forge & Initialize Pact
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
