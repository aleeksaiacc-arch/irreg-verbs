function env(key: string): string {
  return (process.env[key]?.trim() ?? "");
}

function line(label: string, key: string): DonationLine | null {
  const value = env(key);
  if (!value) return null;
  return { label, value };
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
      address: env("EXPO_PUBLIC_DONATION_BTC_ADDRESS"),
      warning: "Send only BTC on the Bitcoin network.",
    },
    {
      id: "eth",
      label: "Ethereum",
      network: env("EXPO_PUBLIC_DONATION_ETH_NETWORK") || "Ethereum (ERC-20)",
      address: env("EXPO_PUBLIC_DONATION_ETH_ADDRESS"),
      warning: "Send only ETH on the network shown above.",
    },
  ];
}

export type DonationBank = { bankName: string; lines: DonationLine[] };

function bank(name: string, entries: (DonationLine | null)[]): DonationBank | null {
  const lines = entries.filter((x): x is DonationLine => x !== null);
  if (lines.length === 0) return null;
  return { bankName: name, lines };
}

export const donationBelarus: DonationBank[] = [
  bank("Priorbank", [
    line("IBAN", "EXPO_PUBLIC_DONATION_PRIOR_IBAN"),
    line("Account / card", "EXPO_PUBLIC_DONATION_PRIOR_ACCOUNT"),
  ]),
  bank("BNB Bank", [
    line("IBAN", "EXPO_PUBLIC_DONATION_BNB_IBAN"),
    line("Account / card", "EXPO_PUBLIC_DONATION_BNB_ACCOUNT"),
  ]),
  bank("Alfa-Bank", [
    line("IBAN", "EXPO_PUBLIC_DONATION_ALFA_IBAN"),
    line("Account / card", "EXPO_PUBLIC_DONATION_ALFA_ACCOUNT"),
  ]),
].filter((b): b is DonationBank => b !== null);

export const donationKaspi: DonationBank | null = bank("Kaspi Bank (Kazakhstan)", [
  line("Phone / Kaspi Gold", "EXPO_PUBLIC_DONATION_KASPI_PHONE"),
  line("Card number", "EXPO_PUBLIC_DONATION_KASPI_CARD"),
]);
