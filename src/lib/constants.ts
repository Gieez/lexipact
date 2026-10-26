import { defineChain } from "viem";

export const baseSepolia = defineChain({
  id: 84532,
  name: "Base Sepolia",
  nativeCurrency: {
    name: "Sepolia Ether",
    symbol: "ETH",
    decimals: 18,
  },
  rpcUrls: {
    default: { http: ["https://sepolia.base.org"] },
    public: { http: ["https://sepolia.base.org"] },
  },
  blockExplorers: {
    default: { name: "Basescan", url: "https://sepolia.basescan.org" },
  },
  testnet: true,
});

export const LEXIPACT_CONTRACT_ADDRESS = "0x789F8F813093AcB10E6F0C053f3D039bB4A099E1" as `0x${string}`;

export const EIP712_DOMAIN = {
  name: "LexiPact Agreement Protocol",
  version: "1.0",
  chainId: 84532,
  verifyingContract: LEXIPACT_CONTRACT_ADDRESS,
} as const;

export const EIP712_TYPES = {
  LegalPact: [
    { name: "pactId", type: "bytes32" },
    { name: "title", type: "string" },
    { name: "client", type: "address" },
    { name: "contractor", type: "address" },
    { name: "totalAmount", type: "uint256" },
    { name: "termsDigest", type: "bytes32" },
    { name: "validUntil", type: "uint256" },
  ],
  Milestone: [
    { name: "title", type: "string" },
    { name: "amount", type: "uint256" },
    { name: "deliverableSpecs", type: "string" },
  ],
} as const;

export const LEXIPACT_ABI = [
  {
    type: "function",
    name: "createAndFundPact",
    stateMutability: "payable",
    inputs: [
      { name: "_pactId", type: "bytes32" },
      { name: "_contractor", type: "address" },
      { name: "_aiOracle", type: "address" },
      { name: "_titles", type: "string[]" },
      { name: "_amounts", type: "uint256[]" },
    ],
    outputs: [],
  },
  {
    type: "function",
    name: "signPact",
    stateMutability: "nonpayable",
    inputs: [{ name: "_pactId", type: "bytes32" }],
    outputs: [],
  },
  {
    type: "function",
    name: "submitDeliverable",
    stateMutability: "nonpayable",
    inputs: [
      { name: "_pactId", type: "bytes32" },
      { name: "_milestoneIndex", type: "uint256" },
      { name: "_deliverableRef", type: "string" },
    ],
    outputs: [],
  },
  {
    type: "function",
    name: "auditMilestoneByOracle",
    stateMutability: "nonpayable",
    inputs: [
      { name: "_pactId", type: "bytes32" },
      { name: "_milestoneIndex", type: "uint256" },
      { name: "_score", type: "uint8" },
    ],
    outputs: [],
  },
  {
    type: "function",
    name: "releaseMilestone",
    stateMutability: "nonpayable",
    inputs: [
      { name: "_pactId", type: "bytes32" },
      { name: "_milestoneIndex", type: "uint256" },
    ],
    outputs: [],
  },
  {
    type: "function",
    name: "raiseDispute",
    stateMutability: "nonpayable",
    inputs: [{ name: "_pactId", type: "bytes32" }],
    outputs: [],
  },
  {
    type: "function",
    name: "getMilestone",
    stateMutability: "view",
    inputs: [
      { name: "_pactId", type: "bytes32" },
      { name: "_index", type: "uint256" },
    ],
    outputs: [
      { name: "title", type: "string" },
      { name: "amount", type: "uint256" },
      { name: "deliverableRef", type: "string" },
      { name: "complianceScore", type: "uint8" },
      { name: "state", type: "uint8" },
    ],
  },
  {
    type: "event",
    name: "PactCreated",
    inputs: [
      { name: "pactId", type: "bytes32", indexed: true },
      { name: "client", type: "address", indexed: true },
      { name: "contractor", type: "address", indexed: true },
      { name: "totalAmount", type: "uint256", indexed: false },
    ],
  },
  {
    type: "event",
    name: "MilestoneReleased",
    inputs: [
      { name: "pactId", type: "bytes32", indexed: true },
      { name: "milestoneIndex", type: "uint256", indexed: true },
      { name: "amount", type: "uint256", indexed: false },
      { name: "recipient", type: "address", indexed: false },
    ],
  },
] as const;

export interface AgreementMilestone {
  id: string;
  title: string;
  description: string;
  amountEth: string;
  deliverableSpecs: string;
  deliverableRef?: string;
  status: "pending" | "submitted" | "auditing" | "verified" | "released";
  complianceScore?: number;
  auditNotes?: string[];
  auditTimestamp?: string;
  txHash?: string;
}

export interface LegalPactTemplate {
  id: string;
  title: string;
  category: string;
  jurisdiction: string;
  arbitrationForum: string;
  totalAmountEth: string;
  client: `0x${string}`;
  contractor: `0x${string}`;
  aiOracle: `0x${string}`;
  summary: string;
  recitals: string[];
  clauses: { title: string; content: string }[];
  milestones: AgreementMilestone[];
}

export const PRESET_TEMPLATES: LegalPactTemplate[] = [
  {
    id: "LP-2026-AI-SEC",
    title: "Autonomous AI Agent Engineering & Security Escrow Pact",
    category: "AI x Blockchain Infrastructure",
    jurisdiction: "Lex Cryptographia / Base L2 Consensus Code",
    arbitrationForum: "Decentralized On-Chain Multi-Sig & Oracle Quorum",
    totalAmountEth: "0.45",
    client: "0xA11ce9589d81d5964E767E9675Ac227847E45d61",
    contractor: "0xB0B8F518174a81A7b99c9c450143a2C562D7102c",
    aiOracle: "0x07aC1E5e896478950B2f43A88909772B4012489e",
    summary:
      "Binding commercial agreement governing development, security hardening, and autonomous on-chain deployment of an AI-driven compliance watcher agent.",
    recitals: [
      "WHEREAS, Client requires independent technical development of an autonomous AI agent capable of monitoring on-chain compliance;",
      "WHEREAS, Contractor possesses specialized capability in Solidity, Next.js, and autonomous agent runtime architectures;",
      "WHEREAS, both Parties mutually agree to hold funds in trustless smart contract escrow on Base Sepolia, disbursable upon autonomous AI verification of agreed milestone deliverables.",
    ],
    clauses: [
      {
        title: "Clause 1. Scope of Work & Code Standards",
        content:
          "Contractor shall deliver non-custodial smart contracts and responsive dApp interfaces adhering to OWASP Web3 standards, zero GPL contamination, and complete test coverage exceeding 90%.",
      },
      {
        title: "Clause 2. Autonomous AI Compliance Oracle Gate",
        content:
          "Prior to capital disbursement from the smart escrow vault, Contractor shall register milestone deliverable artifacts. The designated AI Compliance Oracle shall evaluate deliverable integrity against agreed benchmarks. An autonomous compliance score of >= 85% unlocks client disbursement authority.",
      },
      {
        title: "Clause 3. EIP-712 Cryptographic Signatures",
        content:
          "Both Parties explicitly affirm that wallet signatures under EIP-712 standard constitute legally binding authorization and irrevocable consent to smart escrow terms.",
      },
      {
        title: "Clause 4. Dispute Resolution & Reversion",
        content:
          "If milestone deliverables fail AI compliance audits twice without rectification within 14 calendar days, either Party may invoke the on-chain dispute lock, routing evidence to the arbitration multi-sig.",
      },
    ],
    milestones: [
      {
        id: "m-1",
        title: "Milestone 1: Smart Escrow Architecture & EIP-712 Typed Data",
        description: "Solidity escrow implementation, unit tests, and EIP-712 typed data hashing schema.",
        amountEth: "0.15",
        deliverableSpecs: "Solidity source, passing test suite, and gas audit report.",
        status: "verified",
        complianceScore: 98,
        deliverableRef: "https://github.com/Gieez/lexipact/commit/8a71fc2",
        auditNotes: [
          "Static analysis clean: 0 re-entrancy risks detected.",
          "EIP-712 typed data domain separator matches Base Sepolia spec.",
          "Gas consumption verified under 65,000 gas per milestone release.",
        ],
        auditTimestamp: "2026-10-25 14:20 UTC",
        txHash: "0x8f14b2d35882910fa4e5b61c9e88d749a1bc4028cde591a27e492f447d2f9311",
      },
      {
        id: "m-2",
        title: "Milestone 2: Autonomous AI Compliance Watcher Engine",
        description: "AI agent pipeline parsing deliverable artifacts against legal clauses.",
        amountEth: "0.15",
        deliverableSpecs: "Autonomous LLM reasoning engine, oracle attestation signature emitter, and UI telemetry.",
        status: "submitted",
        deliverableRef: "https://github.com/Gieez/lexipact/tree/main/src/lib/ai-watcher.ts",
      },
      {
        id: "m-3",
        title: "Milestone 3: Production dApp Deployment & Notarized Certificate",
        description: "Vercel production build, wallet connector, and cryptographic certificate generation.",
        amountEth: "0.15",
        deliverableSpecs: "Live HTTPS production dApp, Basescan contract verification, and exportable PDF docket.",
        status: "pending",
      },
    ],
  },
  {
    id: "LP-2026-LEGAL-REG",
    title: "Web3 RegTech Smart Contract Auditing & Retainer Pact",
    category: "LegalTech & RegTech",
    jurisdiction: "International Chamber of Digital Commerce / EVM Consensus",
    arbitrationForum: "Decentralized Escrow Arbiter Quorum",
    totalAmountEth: "0.60",
    client: "0xA11ce9589d81d5964E767E9675Ac227847E45d61",
    contractor: "0xB0B8F518174a81A7b99c9c450143a2C562D7102c",
    aiOracle: "0x07aC1E5e896478950B2f43A88909772B4012489e",
    summary:
      "Formal agreement for technical code audit, regulatory compliance assessment, and escrow tokenization under EIP-712 proof standards.",
    recitals: [
      "WHEREAS, Client requires independent verification of regulatory readiness for smart contract financial primitives;",
      "WHEREAS, Contractor offers formal verification and legal-engineering expertise;",
      "WHEREAS, milestones are safeguarded by Base Sepolia smart contract escrow.",
    ],
    clauses: [
      {
        title: "Clause 1. Deliverable Scope",
        content: "Contractor will deliver vulnerability assessment, compliance matrices, and mitigation patches.",
      },
      {
        title: "Clause 2. Milestone Settlement",
        content: "Each milestone is disbursed immediately upon client approval and AI Oracle validation check.",
      },
    ],
    milestones: [
      {
        id: "m-reg-1",
        title: "Milestone 1: Preliminary Vulnerability Scan & Formal Proofs",
        description: "Slither, Mythril, and manual code audit findings document.",
        amountEth: "0.30",
        deliverableSpecs: "Detailed PDF audit findings and remediations list.",
        status: "pending",
      },
      {
        id: "m-reg-2",
        title: "Milestone 2: Final Attestation & Regulatory Whitepaper",
        description: "Signed security certificate and verified GitHub release tag.",
        amountEth: "0.30",
        deliverableSpecs: "Cryptographically stamped security clearance certificate.",
        status: "pending",
      },
    ],
  },
];
