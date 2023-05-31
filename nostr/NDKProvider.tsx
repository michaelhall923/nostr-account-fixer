"use client";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  PropsWithChildren,
} from "react";
import NDK, {
  NDKNip07Signer,
  NDKPrivateKeySigner,
  NDKRelay,
  NDKRelaySet,
} from "@nostr-dev-kit/ndk";

interface NDKContext {
  ndk?: NDK;
  stemstrRelaySet?: NDKRelaySet;
  canPublishEvents: boolean;
}

// Create a context to store the NDK instance
const NDKContext = createContext<NDKContext>({ canPublishEvents: false });

// NDKProvider function component
const NDKProvider = ({
  explicitRelayUrls,
  children,
}: PropsWithChildren<{ explicitRelayUrls: string[] }>) => {
  const [ndk, setNDK] = useState<NDK | undefined>(undefined);

  // Initialize NDK instance on component mount
  useEffect(() => {
    const initNDK = async () => {
      const ndkInstance = new NDK({ explicitRelayUrls });

      // Connect to the relays
      await ndkInstance.connect();

      // Set the NDK instance in the state
      setNDK(ndkInstance);
    };

    initNDK();
  }, [explicitRelayUrls, setNDK]);
  // Return the provider with the NDK instance
  return (
    <NDKContext.Provider value={{ ndk, canPublishEvents: !!ndk?.signer }}>
      {ndk ? children : "Loading..."}
    </NDKContext.Provider>
  );
};

// Custom hook to access NDK instance from the context
const useNDK = () => {
  const context = useContext(NDKContext);
  if (context === undefined) {
    throw new Error("useNDK must be used within an NDKProvider");
  }
  return context;
};

export { NDKProvider, useNDK };
