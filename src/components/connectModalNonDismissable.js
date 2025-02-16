import React, { useState, useEffect } from "react";
// Function to handle wallet connection with Phantom

const ConnectModalNonDismissable = () => {
  const [hasPhantom, setHasPhantom] = useState(true);

  useEffect(() => {
    // Check if Phantom wallet is available (client-side only)
    if (
      typeof window !== "undefined" &&
      window.solana &&
      window.solana.isPhantom
    ) {
      setHasPhantom(true);
    } else {
      setHasPhantom(false);
    }
  }, []);

  // Function to handle wallet connection with Phantom
  const handleConnectWallet = async () => {
    if (!hasPhantom) return; // Do nothing if Phantom is not available
    try {
      // Request connection to Phantom wallet
      const resp = await window.solana.connect();
      console.log("Connected with public key:", resp.publicKey.toString());
      // Clear the flag when user explicitly connects
      localStorage.removeItem("autoConnectDisabled");
      if (typeof onWalletConnect === "function") {
        onWalletConnect(resp.publicKey.toString());
      }
    } catch (err) {
      console.error("Wallet connection error:", err);
    }
  };
  return (
    // Overlay: no onClick here so the user cannot dismiss it by clicking outside.
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      {/* Modal content: Notice no X button */}
      <div
        className="bg-[#1c1b29] w-full sm:w-auto px-4 sm:px-10 py-10 sm:py-12 rounded-3xl relative transform flex flex-col justify-center items-center transition-transform duration-300"
        style={{ transformOrigin: "bottom" }} // Animation origin set to bottom
      >
        <h2 className="text-white text-xl mb-6 text-left sm:text-center">
          Connect your wallet to use Potion Leaderboards
        </h2>
        <div className="flex justify-center">
          <button
            onClick={handleConnectWallet}
            className="px-10 py-3 font-semibold bg-[#AA00FF] hover:bg-[#a200f2]  text-white rounded-xl"
          >
            Connect Wallet
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConnectModalNonDismissable;
