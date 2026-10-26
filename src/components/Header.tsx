"use client";

import React, { useState, useEffect } from "react";
import {
  ShieldCheck,
  Scale,
  Sparkles,
  ExternalLink,
  ChevronDown,
  Wallet,
  Activity,
  Layers,
  CheckCircle2,
} from "lucide-react";
import { LEXIPACT_CONTRACT_ADDRESS, baseSepolia } from "@/lib/constants";
import { shortenAddress } from "@/lib/web3";

interface HeaderProps {
  isSandbox: boolean;
  setIsSandbox: (val: boolean) => void;
  activeRole: "client" | "contractor" | "oracle";
  setActiveRole: (role: "client" | "contractor" | "oracle") => void;
  userAddress: string;
  setUserAddress: (addr: string) => void;
  isConnected: boolean;
  setIsConnected: (conn: boolean) => void;
  onConnectWallet: () => Promise<void>;
}

export function Header({
  isSandbox,
  setIsSandbox,
  activeRole,
  setActiveRole,
  userAddress,
  setUserAddress,
  isConnected,
  setIsConnected,
  onConnectWallet,
}: HeaderProps) {
  const [blockNumber, setBlockNumber] = useState<number>(50334935);
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);

  useEffect(() => {
    // Simulated block tick every 8 seconds
    const interval = setInterval(() => {
      setBlockNumber((prev) => prev + 1);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const roles = [
    {
      id: "client" as const,
      name: "Alice (Client / Buyer)",
      address: "0xA11ce9589d81d5964E767E9675Ac227847E45d61",
      badge: "Deposits & Approves",
    },
    {
      id: "contractor" as const,
      name: "Bob (Lead Contractor)",
      address: "0xB0B8F518174a81A7b99c9c450143a2C562D7102c",
      badge: "Delivers & Claims",
    },
    {
      id: "oracle" as const,
      name: "Sentinel (AI Oracle)",
      address: "0x07aC1E5e896478950B2f43A88909772B4012489e",
      badge: "Audits Deliverables",
    },
  ];

  return (
    <header className="border-b border-lexi-border bg-lexi-card/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-lexi-gold to-lexi-goldHover flex items-center justify-center text-lexi-bg shadow-seal font-bold">
            <Scale className="w-5 h-5 text-lexi-bg" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif text-xl font-bold tracking-tight text-white">
                LexiPact
              </span>
              <span className="text-[10px] font-mono tracking-wider uppercase px-2 py-0.5 rounded border border-lexi-gold/40 text-lexi-goldLight bg-lexi-goldMuted">
                v1.0 Base
              </span>
            </div>
            <p className="text-xs text-lexi-parchmentMuted hidden sm:block">
              AI-Audited On-Chain Legal Escrow & EIP-712 Protocol
            </p>
          </div>
        </div>

        {/* Center: Network & Explorer link */}
        <div className="hidden md:flex items-center gap-3 text-xs font-mono">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded border border-lexi-border bg-lexi-bg/70 text-lexi-parchmentMuted">
            <span className="w-2 h-2 rounded-full bg-lexi-emerald animate-pulse" />
            <span className="text-lexi-parchment">Base Sepolia</span>
            <span className="text-lexi-parchmentMuted">#{blockNumber}</span>
          </div>

          <a
            href={`https://sepolia.basescan.org/address/${LEXIPACT_CONTRACT_ADDRESS}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 px-2.5 py-1 rounded border border-lexi-border bg-lexi-bg/70 text-lexi-parchmentMuted hover:text-lexi-gold hover:border-lexi-gold/50 transition-colors"
          >
            <span>Contract: {shortenAddress(LEXIPACT_CONTRACT_ADDRESS)}</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        {/* Right: Sandbox / Live mode and Wallet */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Mode Switcher */}
          <div className="flex items-center rounded-lg border border-lexi-border bg-lexi-bg p-0.5 text-xs">
            <button
              onClick={() => setIsSandbox(true)}
              className={`px-2.5 py-1 rounded-md transition-all font-medium ${
                isSandbox
                  ? "bg-lexi-gold text-lexi-bg font-semibold shadow-sm"
                  : "text-lexi-parchmentMuted hover:text-white"
              }`}
            >
              Sandbox
            </button>
            <button
              onClick={() => setIsSandbox(false)}
              className={`px-2.5 py-1 rounded-md transition-all font-medium ${
                !isSandbox
                  ? "bg-lexi-emerald text-lexi-bg font-semibold shadow-sm"
                  : "text-lexi-parchmentMuted hover:text-white"
              }`}
            >
              Live Base
            </button>
          </div>

          {/* Sandbox Role Selector */}
          {isSandbox ? (
            <div className="relative">
              <button
                onClick={() => setRoleMenuOpen(!roleMenuOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-lexi-border hover:border-lexi-borderStrong bg-lexi-card text-xs text-white"
              >
                <div className="w-2 h-2 rounded-full bg-lexi-gold" />
                <span className="capitalize font-mono font-medium">
                  {activeRole}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-lexi-parchmentMuted" />
              </button>

              {roleMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-lg border border-lexi-border bg-lexi-card shadow-docket py-1 z-50">
                  <div className="px-3 py-1.5 border-b border-lexi-border/60 text-[11px] font-mono text-lexi-parchmentMuted uppercase">
                    Select Test Persona
                  </div>
                  {roles.map((r) => (
                    <button
                      key={r.id}
                      onClick={() => {
                        setActiveRole(r.id);
                        setUserAddress(r.address);
                        setRoleMenuOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs flex flex-col gap-0.5 hover:bg-lexi-bg transition-colors ${
                        activeRole === r.id
                          ? "bg-lexi-goldMuted border-l-2 border-lexi-gold"
                          : ""
                      }`}
                    >
                      <div className="flex items-center justify-between font-medium text-white">
                        <span>{r.name}</span>
                        {activeRole === r.id && (
                          <CheckCircle2 className="w-3 h-3 text-lexi-gold" />
                        )}
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-lexi-parchmentMuted font-mono">
                        <span>{shortenAddress(r.address)}</span>
                        <span className="text-[10px] text-lexi-goldLight">
                          {r.badge}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            /* Live Wallet Connect Button */
            <button
              onClick={onConnectWallet}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-lexi-emerald/40 bg-lexi-emeraldMuted hover:bg-lexi-emerald/20 text-lexi-emerald text-xs font-mono transition-colors"
            >
              <Wallet className="w-3.5 h-3.5" />
              <span>
                {isConnected ? shortenAddress(userAddress) : "Connect Wallet"}
              </span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
