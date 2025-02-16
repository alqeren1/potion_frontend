import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/router";
export default function SettingsMenu({
  menuOpen,
  setMenuOpen,
  walletAddress,
  setWalletAddress,
}) {
  const router = useRouter();
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      // If the menu is open and the click target is NOT inside menuRef
      if (
        menuOpen &&
        menuRef.current &&
        !menuRef.current.contains(event.target)
      ) {
        setMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

  const handleDisconnectWallet = async () => {
    if (
      typeof window !== "undefined" &&
      window.solana &&
      window.solana.disconnect
    ) {
      try {
        await window.solana.disconnect();
        setWalletAddress("");
        // Set the flag to disable auto-connect
        localStorage.setItem("autoConnectDisabled", "true");
        setMenuOpen(false); // Close the menu by setting menuOpen to false
        console.log("Wallet disconnected");
      } catch (error) {
        console.error("Error disconnecting wallet:", error);
      }
    }
  };
  function formatWallet(wallet) {
    if (!wallet) return "";
    return wallet.substring(0, 6) + "..." + wallet.substring(wallet.length - 6);
  }

  return (
    <div
      ref={menuRef}
      className={`fixed top-0  border-l-[1px] border-[#23242C] px-8 md:px-[32px]  right-0 w-72 lg:w-96 h-full bg-[#11121B] z-[1000] transform transition-transform duration-300 ${
        menuOpen ? "translate-x-0" : "translate-x-full"
      }  `}
    >
      <div className="justify-between  h-full flex flex-col">
        <nav className="mt-8 text-right">
          <div className="w-full flex justify-end">
            <div className="flex items-center space-x-4">
              <div>
                <div className="w-full flex text-white justify-end text-base font-medium">
                  @handle
                </div>
                <div className="w-full flex text-[#858585]  justify-end text-base font-light">
                  {formatWallet(walletAddress)}
                </div>
              </div>
              <div
                onClick={() => router.push(`/profile/${walletAddress}`)}
                className="cursor-pointer"
              >
                <img
                  className=" "
                  src="/orangie.png"
                  alt="orangie pp"
                  width={80}
                  height={80}
                  priority
                />
              </div>
            </div>
          </div>
          <div className="flex mt-4 w-full justify-end">
            <button
              onClick={handleDisconnectWallet}
              className={`px-4 py-2 w-full font-semibold rounded-xl text-base text-white bg-[#AA00FF] hover:bg-[#a200f2] `}
            >
              Disconnect
            </button>
          </div>

          <div className="w-full flex border-b-[1px] mt-4 mb-10 border-[#23242C] "></div>
          <ul className="flex flex-col space-y-6 text-3xl font-bold">
            <li>
              <a href="#" className="text-white hover:text-[#d105fb] ">
                Profile
              </a>
            </li>
            <li>
              <a href="#" className="text-white hover:text-[#d105fb]  ">
                Settings
              </a>
            </li>
            <li>
              <a href="#" className="text-white hover:text-[#d105fb]  ">
                Log out
              </a>
            </li>
          </ul>
        </nav>
        <div>
          <div className="flex mb-2 w500:mb-6  items-center space-x-6  justify-end">
            <a target="_blank" href="https://x.com/potionalpha">
              <img
                className=""
                src="/X_logo.svg"
                alt="x logo"
                width={30}
                height={24}
                priority
              />
            </a>
            <a target="_blank" href="https://discord.com/invite/potionalpha">
              <img
                className=""
                src="/discord.svg"
                alt="discord logo"
                width={38}
                height={23}
                priority
              />
            </a>
          </div>
          <div className="flex w500:hidden justify-end mb-4">
            <img
              className=" "
              src="/potion-logo.png"
              alt="Next.js logo"
              width={200}
              height={67}
              priority
            />
          </div>
        </div>
      </div>
    </div>
  );
}
