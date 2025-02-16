import React, { useState, useEffect } from "react";
import { RxCross1 } from "react-icons/rx";

const ConnectModal = ({ isOpen, onClose, onWalletConnect }) => {
  if (!isOpen) return null; // Do not render if modal is not open

  // State to track if Phantom is installed
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
      onClose(); // Close the modal after successful connection
    } catch (err) {
      console.error("Wallet connection error:", err);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[999]"
      onClick={onClose} // Close modal when clicking outside the inner box
    >
      <div
        className="bg-[#1c1b29] w-full sm:w-auto px-4 sm:px-10 py-10 sm:py-12 rounded-3xl relative transform flex flex-col justify-center items-center transition-transform duration-300"
        style={{ transformOrigin: "bottom" }} // Animation origin set to bottom
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
      >
        {/* X button to close modal */}
        <button
          className="absolute top-4 right-4 hover:text-[#d105fb] text-white text-2xl"
          onClick={onClose}
        >
          <RxCross1 />
        </button>
        <h2 className="text-white text-xl mb-6 text-left sm:text-center">
          Connect your wallet to use Potion Leaderboards
        </h2>
        <div className="flex justify-center">
          <button
            onClick={handleConnectWallet}
            className={`px-10 py-3 font-semibold rounded-xl text-white ${
              hasPhantom
                ? "bg-[#AA00FF] hover:bg-[#a200f2]"
                : "bg-[#11121B] cursor-not-allowed"
            }`}
            disabled={!hasPhantom}
          >
            {hasPhantom ? "Connect Wallet" : "No Phantom Wallet"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConnectModal;
