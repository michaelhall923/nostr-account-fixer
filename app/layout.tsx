import "./globals.css";
import { Inter } from "next/font/google";
import { NDKProvider } from "@/nostr/NDKProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Nostr Account Fixer",
  description: "Best effort at fixing corrupted nostr account data.",
};

const relayUrls: string[] = [
  // // paid relays
  "wss://eden.nostr.land",
  "wss://puravida.nostr.land",
  "wss://nostr.milou.lol",
  "wss://nostr.wine",
  "wss://relay.nostriches.org",
  "wss://relay.orangepill.dev",
  "wss://nostr.gromeul.eu",
  "wss://relay.deezy.io",
  // // public relays
  "wss://relay.damus.io",
  "wss://relay.snort.social",
  "wss://nos.lol",
  "wss://relay.current.fyi",
  "wss://relayable.org",
  "wss://nostr.orangepill.dev",
  "wss://offchain.pub",
  "wss://nostr-pub.wellorder.net",
  "wss://relay.mostr.pub",
  "wss://welcome.nostr.wine",
  "wss://nostr-relay.nokotaro.com",
  "wss://nostr-world.h3z.jp",
  "wss://nostr.kollider.xyz",
  "wss://purplepag.es",
];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <NDKProvider explicitRelayUrls={relayUrls}>{children}</NDKProvider>
      </body>
    </html>
  );
}
