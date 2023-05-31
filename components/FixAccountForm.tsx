"use client";
import { useNDK } from "@/nostr/NDKProvider";
import { ChangeEvent, useEffect, useState } from "react";
import { nip19, getPublicKey } from "nostr-tools";
import { NDKEvent, NDKPrivateKeySigner } from "@nostr-dev-kit/ndk";

export default function FixAccountForm() {
  const { ndk } = useNDK();
  const [nsec, setNsec] = useState<string>("");
  const [hexPubKey, setHexPubKey] = useState("");
  const [isFixing, setIsFixing] = useState(false);
  const [isFixed, setIsFixed] = useState(false);

  const handleKeyChange = (event: ChangeEvent<HTMLInputElement>) => {
    setNsec(event.target.value);
    const pubkey = convertNsecToHexPubkey(event.target.value);
    if (pubkey) {
      setHexPubKey(pubkey);
    } else {
      setHexPubKey("");
    }
  };

  const handleSubmit = async () => {
    if (!hexPubKey || !ndk) return;
    setIsFixing(true);
    const user = ndk?.getUser({
      hexpubkey: hexPubKey,
    });
    if (user) {
      user.follows().then(async (follows) => {
        if (follows.size > 0) {
          let event = new NDKEvent(ndk);
          event.kind = 3;
          follows.forEach((follow) => {
            if (follow.hexpubkey()) {
              event.tags.push(["p", follow.hexpubkey(), ""]);
            }
          });
          await event.sign(ndk.signer);
          await ndk.publish(event);
          setIsFixed(true);
          setIsFixing(false);
        } else {
          setIsFixing(false);
        }
      });
    } else {
      setIsFixing(false);
    }
  };

  useEffect(() => {
    if (ndk && hexPubKey) {
      const { type, data } = nip19.decode(nsec);
      if (type === "nsec") {
        ndk.signer = new NDKPrivateKeySigner(data as string);
      }
    }
  }, [nsec]);

  return (
    <div className="flex gap-4 mt-4">
      <input
        onChange={handleKeyChange}
        value={nsec}
        className="p-2 text-black"
        type="password"
        placeholder="Enter nsec..."
      />
      {isFixing ? (
        <span className="p-2">FIXING...</span>
      ) : isFixed ? (
        <span className="text-fuchsia-500 p-2">FIXED</span>
      ) : (
        <button
          className="p-2 bg-fuchsia-500 disabled:bg-fuchsia-200"
          onClick={handleSubmit}
          disabled={!hexPubKey}
        >
          FIX ACCOUNT
        </button>
      )}
    </div>
  );
}

function convertNsecToHexPubkey(nsec: string) {
  try {
    const { type, data } = nip19.decode(nsec);
    if (type === "nsec") {
      return getPublicKey(data as string);
    } else {
      return false;
    }
  } catch (err) {
    return false;
  }
}
