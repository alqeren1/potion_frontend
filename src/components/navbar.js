import Image from "next/image";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { Squash as Hamburger } from "hamburger-react";
import isWalletConnected from "@/components/isWalletConnected";
import SettingsMenu from "./settings_menu";

export default function Navbar({ menuOpen, setMenuOpen, hamburgerRef }) {
  const [hasPhantom, setHasPhantom] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [walletAddress, setWalletAddress] = useState(null);
  const [settingsMenuOpen, setSettingsMenuOpen] = useState(false);
  const router = useRouter();
  const walletConnected = isWalletConnected();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Delay the modal rendering by 500ms (adjust as needed)
  useEffect(() => {
    if (isMounted) {
      const timer = setTimeout(() => setShowModal(true), 100);
      return () => clearTimeout(timer);
    }
  }, [isMounted]);
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

  // Automatically retrieve the wallet address if already connected
  useEffect(() => {
    if (walletConnected && typeof window !== "undefined" && window.solana) {
      // Only try to connect if trusted (won't trigger a popup)
      window.solana
        .connect({ onlyIfTrusted: true })
        .then((resp) => {
          setWalletAddress(resp.publicKey.toString());
        })
        .catch((err) => {
          console.error("Error fetching wallet address:", err);
        });
    }
  }, [walletConnected]);
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
    <div className="flex items-center text-white text-xl font-bold justify-between">
      <div className="flex items-center">
        <Image
          className="hidden lg:flex cursor-pointer"
          src="/potion-logo.png"
          onClick={() => router.push(`/`)}
          alt="Next.js logo"
          width={254}
          height={67}
          priority
        />
        <Image
          className="hidden w500:flex lg:hidden cursor-pointer"
          src="/potion-logo.png"
          onClick={() => router.push(`/`)}
          alt="Next.js logo"
          width={200}
          height={67}
          priority
        />
        <Image
          className="flex w500:hidden cursor-pointer "
          src="/potion-logo.png"
          onClick={() => router.push(`/`)}
          alt="Next.js logo"
          width={150}
          height={67}
          priority
        />
        <div className="hidden lg:flex ml-12 xl:ml-24 space-x-8 xl:space-x-16">
          <a
            className={`cursor-pointer ${
              router.pathname === "/"
                ? "text-[#AA00FF]"
                : "text-inherit hover:text-[#d105fb]"
            }`}
            onClick={() => router.push(`/`)}
          >
            Leaderboards
          </a>
          <a className="hover:text-[#d105fb] cursor-pointer">Learn</a>
          <a className="hover:text-[#d105fb] cursor-pointer">Prizes</a>
        </div>
      </div>
      <div className="flex items-center">
        <div className="hidden lg:flex items-center space-x-6 mr-12">
          <a target="_blank" href="https://x.com/potionalpha">
            <Image
              className=""
              src="/x_logo.svg"
              alt="x logo"
              width={22}
              height={24}
              priority
            />
          </a>
          <a target="_blank" href="https://discord.com/invite/potionalpha">
            <Image
              className=""
              src="/discord.svg"
              alt="discord logo"
              width={30}
              height={23}
              priority
            />
          </a>
        </div>
        {walletConnected && showModal && (
          <div
            className="cursor-pointer"
            onClick={() => setSettingsMenuOpen(true)}
          >
            <Image
              className="hidden mr-8 lg:flex "
              src="/orangie.png"
              alt="orangie pp"
              width={53}
              height={53}
              priority
            />
            <Image
              className={`flex  lg:hidden ${menuOpen ? "mr-[64px]" : "mr-4"}`}
              src="/orangie.png"
              alt="orangie pp"
              width={40}
              height={40}
              priority
            />
          </div>
        )}
        {!walletConnected && showModal && (
          <div
            className={`flex justify-center  lg:mr-0 ${
              menuOpen ? "mr-[64px]" : "mr-4"
            }`}
          >
            <button
              onClick={handleConnectWallet}
              className={`px-4 py-2 font-semibold rounded-xl text-base text-white ${
                hasPhantom
                  ? "bg-[#AA00FF] hover:bg-[#a200f2]"
                  : "bg-[#11121B] cursor-not-allowed"
              }`}
              disabled={!hasPhantom}
            >
              {hasPhantom ? "Connect" : "No Phantom Wallet"}
            </button>
          </div>
        )}

        {/* Animated Hamburger Button (visible on mobile only) */}

        <div
          className={`block   right-4  md:right-8 lg:hidden  z-[900] ${
            menuOpen ? "fixed" : "sticky"
          }`}
          ref={hamburgerRef}
        >
          <Hamburger size={28} toggled={menuOpen} toggle={setMenuOpen} />
        </div>
      </div>
      <SettingsMenu
        menuOpen={settingsMenuOpen}
        setMenuOpen={setSettingsMenuOpen}
        walletAddress={walletAddress}
        setWalletAddress={setWalletAddress}
      />
    </div>
  );
}
