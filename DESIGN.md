# Design Direction: LexiPact

## Project
LexiPact: Autonomous Legal Escrow, EIP-712 Agreement Protocol, and AI Compliance Watcher on Base EVM.

## Purpose
Bridge binding digital legal contracts with automated on-chain milestone escrow. Ensure parties can draft agreements, sign via EIP-712 cryptographic proofs, fund trustless smart escrow vaults, and verify deliverables using autonomous AI compliance oracles before disbursing capital.

## Audience
Web3 founders, DAO coordinators, freelance engineers, legal engineers, and DoraHacks hackathon review judges evaluating AI x Blockchain and LegalTech tracks.

## Brand Character
- Authoritative: Demands serious commercial respect, reminiscent of international arbitration courts.
- Cryptographic: Transparent hashes, verified bytecodes, on-chain state transparency.
- Precise: Exact decimal accounting, strict clause verification, deterministic execution.
- Restrained: Zero playful gimmicks, zero whimsical cartoon avatars, zero neon cyberpunk noise.
- Tactile: Feels like interactive digital parchment certified with cryptographic seals.

## Visual Concept: "The Cryptographic Docket"
A synthesis of traditional Swiss legal dockets and high-security EVM execution terminals. Contracts are displayed with classical legal typography, clause index numbering, and wax-seal status badges, counterbalanced by monospaced hash verification ribbons, EIP-712 typed-data inspection panes, and an automated AI audit telemetry console.

## Art Direction
Sober Legal Institutional meets High-Security EVM Terminal. High contrast, sharp edges, 1px precision borders, tactile legal seal stamps, and legible document hierarchy.

## Typography
- Display / Legal Clauses: Editorial serif (`Georgia`, `Playfair Display`, `serif`) for legal pact headers, clauses, and notarization dockets to convey gravitas and legal enforceability.
- Code & Cryptography: Monospace (`JetBrains Mono`, `ui-monospace`, `monospace`) for smart contract addresses, EIP-712 signature digests, transaction hashes, and AI audit telemetry.
- Interface & Navigation: Crisp grotesque (`Inter`, `system-ui`, `sans-serif`) for operational buttons, inputs, tabs, and form controls.
- Text Treatment: Tabular numerals for milestone amounts, uppercase micro-caps for status badges (`VERIFIED ON-CHAIN`, `EIP-712 SIGNED`, `ESCROW LOCKED`).

## Color System
- Canvas / Background: `#0a0c10` (Deep obsidian charcoal, void of generic AI purple)
- Card / Panel Surface: `#11141a` (Subdued legal desk slate)
- Border & Rule: `#232834` (1px clean boundary lines)
- Parchment Text: `#f3f1ea` (Warm off-white for document body, high legibility)
- Muted / Commentary: `#8b949e` (Legal annotations, recitals, timestamps)
- Seal Ochre / Gold Accent: `#d97706` / `#f59e0b` (Notarized seal, active milestone, pending signature)
- Cryptographic Emerald: `#10b981` (Funded escrow, verified deliverable, signed agreement)
- Dispute Crimson: `#ef4444` (Disputed milestone, arbitration trigger, failed audit)

## Composition & Layout
- Two-Tier Split Architecture:
  1. Primary Stage: Interactive Agreement & Escrow Terminal (Interactive Pact Builder, Live EIP-712 Signing Deck, Milestone Escrow Vault, AI Compliance Audit Stream).
  2. Notarized Docket Panel: Real-time legal certificate preview, party addresses, on-chain proof ribbons, and exportable verification deed.
- Asymmetry: Legal document ledger occupies dominant left 60%, cryptographic verification & wallet telemetry occupies right 40%.
- Navigation: Header with live network status indicator (Base Sepolia / Reviewer Simulator toggle), contract address lookup, and fast party switcher.

## Shape Language
- Radius: Minimal and structured (`rounded-md` 6px for inputs/cards, `rounded-sm` 4px for badges). Avoid rounded pill buttons and hyper-curved bubbly containers.
- Borders: Subtle single-pixel dividers (`border border-[#232834]`), inset document wells.
- Seals: Hexagonal or circular notarization insignia with embedded cryptographic checkmarks.

## Motion & Interaction
- Purposeful feedback:
  - Seal stamping animation when EIP-712 signature is generated.
  - Progress bar filling as AI Compliance Watcher parses deliverable requirements.
  - Smooth tab switching between Agreement Text, Milestone Vault, AI Audit, and Certificate.
- Respects `prefers-reduced-motion` with zero decorative looping background blobs.

## Forbidden Patterns
- No generic AI purple gradients or neon laser glows.
- No em-dashes in any user-facing copy or technical text.
- No generic 3-card marketing rows or fake testimonial carousels.
- No floating 3D spheres or disconnected abstract graphics.
- No unhandled RPC failures (Sandbox Simulator fallback is mandatory).

## References & Milestones
- DoraHacks Legal-Hack-2026 track requirements: AI x Blockchain and LegalTech & RegTech.
- Base Sepolia Smart Contract Escrow architecture.
- EIP-712 typed structured data signing specifications.
