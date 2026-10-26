import {
  createPublicClient,
  http,
  keccak256,
  toHex,
  encodeAbiParameters,
  parseAbiParameters,
} from "viem";
import { baseSepolia, EIP712_DOMAIN, EIP712_TYPES } from "./constants";

export const publicClient = createPublicClient({
  chain: baseSepolia,
  transport: http(),
});

export function shortenAddress(addr?: string): string {
  if (!addr) return "";
  if (addr.length < 10) return addr;
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

export function formatEth(val?: string | number): string {
  if (!val) return "0.00 ETH";
  const num = typeof val === "string" ? parseFloat(val) : val;
  return `${num.toFixed(2)} ETH`;
}

export function computePactDigest(pactId: string, title: string, content: string): `0x${string}` {
  const combined = `${pactId}:${title}:${content}`;
  return keccak256(toHex(combined));
}

export function buildEIP712Payload(
  pactId: string,
  title: string,
  client: `0x${string}`,
  contractor: `0x${string}`,
  totalAmountEth: string,
  termsDigest: `0x${string}`
) {
  const totalAmountWei = BigInt(Math.floor(parseFloat(totalAmountEth) * 1e18));
  return {
    domain: EIP712_DOMAIN,
    types: EIP712_TYPES,
    primaryType: "LegalPact" as const,
    message: {
      pactId: pactId.startsWith("0x") ? (pactId as `0x${string}`) : keccak256(toHex(pactId)),
      title,
      client,
      contractor,
      totalAmount: totalAmountWei,
      termsDigest,
      validUntil: BigInt(Math.floor(Date.now() / 1000) + 365 * 86400),
    },
  };
}

export function simulateDeterministicSignature(
  address: string,
  digest: string
): `0x${string}` {
  const seed = `${address}:${digest}:LEXIPACT_PROOF_V1`;
  const hash = keccak256(toHex(seed));
  // 65 bytes: 32 bytes r + 32 bytes s + 1 byte v (1b or 1c)
  return `0x${hash.slice(2)}${hash.slice(2, 66)}1b` as `0x${string}`;
}
