function env(key: string): string {
  return (process.env[key]?.trim() ?? "");
}

export type DonationLine = { label: string; value: string };

export type DonationCrypto = {
  id: string;
  label: string;
  network: string;
  address: string;
  warning: string;
};

export function getDonationCrypto(): DonationCrypto[] {
  return [
    {
      id: "btc",
      label: "Bitcoin",
      network: "Bitcoin",
      address: process.env.EXPO_PUBLIC_DONATION_BTC_ADDRESS || "",
      warning: "Send only BTC on the Bitcoin network.",
    },
    {
      id: "eth",
      label: "Ethereum",
      network: process.env.EXPO_PUBLIC_DONATION_ETH_NETWORK || "Ethereum (ERC-20)",
      address: process.env.EXPO_PUBLIC_DONATION_ETH_ADDRESS || "",
      warning: "Send only ETH on the network shown above.",
    },
  ];
}

export type KaspiDonationDetails = {
  cardNumber: string;
  cardHolder: string;
  phone: string;
  expiry: string;
};

export function getKaspiDonation(): KaspiDonationDetails | null {
  const cardNumber = process.env.EXPO_PUBLIC_DONATION_KASPI_CARD || "";
  const cardHolder = process.env.EXPO_PUBLIC_DONATION_KASPI_HOLDER || "";
  const phone = process.env.EXPO_PUBLIC_DONATION_KASPI_PHONE || "";
  const expiry = process.env.EXPO_PUBLIC_DONATION_KASPI_EXPIRY || "";
  if (!cardNumber && !cardHolder && !phone && !expiry) return null;
  return { cardNumber, cardHolder, phone, expiry };
}

export function formatCardNumberGroups(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  if (!digits) return "";
  return digits.replace(/(.{4})/g, "$1 ").trim();
}
