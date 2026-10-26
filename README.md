# LexiPact

**AI-Audited On-Chain Legal Escrow & EIP-712 Agreement Protocol**  
Built for the **Legal-Hack-2026 Hackathon** on DoraHacks (Target Tracks: **AI x Blockchain** & **LegalTech & RegTech**).

---

## Executive Summary

Traditional commercial contracts live in disconnected PDF silos, requiring slow, manual, or litigious enforcement when deliverables fail. Meanwhile, raw smart contracts lack the legal expressiveness, recitals, and contextual understanding required for complex technical and freelance deliverables.

**LexiPact** unifies both worlds into a single verifiable cryptographic docket:
1. **Legally Binding EIP-712 Agreements**: Parties define operative clauses and milestone schedules, binding them with off-chain wallet signatures under typed structured data standards.
2. **Non-Custodial Milestone Escrow**: Funds are locked in smart contract escrow vaults on **Base Sepolia**.
3. **Autonomous AI Compliance Oracle Gate**: Before milestone payouts can be released, an autonomous AI compliance watcher audits deliverable artifacts (GitHub repositories, commits, or verification CIDs) against contractual clauses, verifying functional coverage, Web3 security patterns, and license purity (zero GPL contagion).
4. **Notarized Cryptographic Deed**: Every agreement produces an exportable, notarized legal deed with verifiable on-chain proofs and SHA-256 digests.
5. **Hybrid Reviewer Mode**: Reviewers can test the entire lifecycle via live Web3 wallet connection or through the integrated interactive sandbox with pre-configured personas.

---

## Core Architecture

```text
[ Buyer / Client (Alice) ]         [ Contractor (Bob) ]
            │                               │
            └──► EIP-712 Typed Signing ◄────┘
                         │
                         ▼
             [ Base Sepolia Escrow Vault ]
           (Funds locked in smart contract)
                         │
         Contractor submits deliverable artifact
                         │
                         ▼
        [ Autonomous AI Compliance Oracle ]
       ├─ Phase 1: Artifact & Checksum Resolution
       ├─ Phase 2: Semantic Legal Clause Matching
       ├─ Phase 3: OWASP AST & License Purity Audit
       └─ Phase 4: Cryptographic Proof Attestation (Score >= 85%)
                         │
                         ▼
           Milestone Released to Contractor
                         │
                         ▼
        [ Exportable Notarized Legal Certificate ]
```

---

## Key Features

### 1. Interactive Legal Pact Architect
- Presets for **Autonomous AI Agent Engineering SLA** and **Web3 RegTech Smart Contract Audits**.
- Dynamic custom pact builder supporting custom clauses, milestone allocations, and jurisdiction terms.
- Real-time EIP-712 typed data inspector with one-click payload export and Keccak256 digest calculation.

### 2. Smart Milestone Escrow Vault
- Fully non-custodial Solidity contract deployed on **Base Sepolia**.
- Multi-stage lifecycle: `Draft` -> `Signed` -> `Vault Funded` -> `Submitted` -> `AI Verified` -> `Released`.
- Real-time financial telemetry tracking Total Value Locked, Disbursed Capital, and Remaining Escrow.

### 3. Autonomous AI Compliance Watcher (AI x Blockchain)
- Autonomous sentinel engine running multi-stage inspections against submitted deliverables.
- Real-time tactical telemetry terminal showing timestamped evaluation steps.
- Deterministic compliance scoring across Scope Coverage, Web3 Security, and Legal/License Hygiene.
- Issues cryptographic oracle attestations directly authorizing milestone disbursement.

### 4. Notarized Digital Docket & Legal Deed
- Formal legal deed formatted to arbitral standards.
- Embedded cryptographic seals, SHA-256 terms digest, and dual EIP-712 signature proofs.
- 1-click printable / exportable docket view.

### 5. Resilient Hybrid Reviewer Sandbox
- Eliminates reviewer friction: switch between live Base Sepolia network and instant interactive sandbox with pre-funded testing personas (Client Alice, Contractor Bob, and AI Oracle Sentinel).

---

## Network & Deployment Details

- **Target Chain**: Base Sepolia (EVM L2)
- **Chain ID**: `84532`
- **Native Currency**: `ETH` (18 Decimals)
- **Escrow Contract Address**: `0x789F8F813093AcB10E6F0C053f3D039bB4A099E1`
- **Block Explorer**: [https://sepolia.basescan.org](https://sepolia.basescan.org)
- **RPC URL**: `https://sepolia.base.org`

---

## Tech Stack

- **Framework**: Next.js 14 App Router (React 18, TypeScript)
- **Web3 Layer**: Viem 2.x, EIP-712 Typed Data Specification, EIP-1193 Browser Wallet Provider
- **Smart Contracts**: Solidity 0.8.20 (`LexiPactEscrow.sol`)
- **Styling**: Tailwind CSS, Lucide Icons, Canvas Confetti
- **Design System**: Strict Swiss Cryptographic Legal Docket protocol

---

## Local Development

```bash
# Clone the repository
git clone https://github.com/Gieez/lexipact.git
cd lexipact

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## License

MIT License. Designed and engineered for DoraHacks Legal-Hack-2026.
