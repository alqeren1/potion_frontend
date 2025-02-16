import { useState, useEffect } from "react";

export default function isWalletConnected() {
  const [walletConnected, setWalletConnected] = useState(false);

  useEffect(() => {
    const checkTrustedConnection = async () => {
      if (window.solana && window.solana.isPhantom) {
        // Check if the user has explicitly disconnected
        const autoConnectDisabled =
          localStorage.getItem("autoConnectDisabled") === "true";
        if (autoConnectDisabled) {
          setWalletConnected(false);
          return;
        }

        try {
          // Attempt a trusted connection; will immediately reject if not trusted.
          const resp = await window.solana.connect({ onlyIfTrusted: true });
          if (resp.publicKey) {
            setWalletConnected(true);
          }
        } catch (err) {
          // This rejection is expected if the site isn't already trusted.
          setWalletConnected(false);
        }
      }
    };

    checkTrustedConnection();

    // If Phantom is available, add event listeners
    if (window.solana && window.solana.isPhantom) {
      const handleConnect = () => {
        // Clear the flag on a fresh connect if needed.
        localStorage.removeItem("autoConnectDisabled");
        setWalletConnected(true);
      };

      const handleDisconnect = () => {
        setWalletConnected(false);
      };

      window.solana.on("connect", handleConnect);
      window.solana.on("disconnect", handleDisconnect);

      // Clean up on unmount
      return () => {
        if (window.solana.removeListener) {
          window.solana.removeListener("connect", handleConnect);
          window.solana.removeListener("disconnect", handleDisconnect);
        }
      };
    }
  }, []);

  return walletConnected;
}
