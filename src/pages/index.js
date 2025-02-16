import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { CiShare1 } from "react-icons/ci";
import { GoTriangleDown, GoTriangleUp } from "react-icons/go";
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";
import { FiCopy, FiCheck } from "react-icons/fi";
import Navbar from "../components/navbar";
import TradersModal from "../components/traders_modal";
import TimeModal from "../components/timeframe_modal";
import Filters from "@/components/filters";
import MobileMenu from "@/components/mobile_menu";
import SearchInputMain from "@/components/searchbarMain";
import PerPageButton from "@/components/perPageButton";
import ConnectModal from "@/components/connectModal";
import isWalletConnected from "@/components/isWalletConnected";
import { ImSpinner8 } from "react-icons/im";
import { FiAlertTriangle } from "react-icons/fi";
export default function Home() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [label, setLabel] = useState("Groups");

  const [traders, setTraders] = useState([]);
  const [timeframe, setTimeframe] = useState("daily"); // "daily" "weekly" "monthly" "all"
  const [sortBy, setSortBy] = useState("realizedPnlSol");
  const [sortDirection, setSortDirection] = useState("desc"); // "desc" or "asc"
  const [filterCriteria, setFilterCriteria] = useState({});
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);
  const [copiedWallet, setCopiedWallet] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // This hook continuously tracks the wallet connection status
  const walletConnected = isWalletConnected();
  const hamburgerRef = useRef(null);

  const solPrice = 200; //solana price, can be fetched from an api and used

  const copyAddress = async (address) => {
    try {
      await navigator.clipboard.writeText(address);
      setCopiedWallet(address);
      // Revert the icon back after 2 seconds
      setTimeout(() => {
        setCopiedWallet("");
      }, 2000);
    } catch (err) {
      console.error("Failed to copy!", err);
    }
  };
  useEffect(() => {
    // Function to check if Phantom is connected initially
    const checkInitialConnection = () => {
      if (
        window.solana &&
        window.solana.isPhantom &&
        window.solana.isConnected
      ) {
        console.log("wallet connected");
      }
    };

    // Call it once on mount
    checkInitialConnection();
  }, []);
  // Pagination states:
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Helper: Convert a string like "10K", "1M", etc. to a number
  const convertSuffixValue = (value) => {
    if (!value) return null;
    const num = parseFloat(value);
    if (value.toUpperCase().includes("K")) return num * 1e3;
    if (value.toUpperCase().includes("M")) return num * 1e6;
    if (value.toUpperCase().includes("B")) return num * 1e9;
    return num;
  };

  //Open connect modal
  const handleConnectModal = () => {
    setIsConnectModalOpen(true);
  };
  // Helper: Convert a holding string like "10m" or "24h" to minutes
  const convertHoldValue = (value) => {
    if (!value) return null;
    const num = parseFloat(value);
    if (value.toLowerCase().endsWith("h")) return num * 60;
    return num; // assume minutes if "m" or no suffix
  };

  // Filter traders based on current filter criteria and selected timeframe:
  const filteredTraders = traders.filter((trader) => {
    const data = trader.timeframes[timeframe];
    if (!data) return false;

    // Realized PNL (numeric input)
    if (
      filterCriteria.realizedFrom?.trim() &&
      data.realizedPnlSol < parseFloat(filterCriteria.realizedFrom)
    )
      return false;
    if (
      filterCriteria.realizedTo?.trim() &&
      data.realizedPnlSol > parseFloat(filterCriteria.realizedTo)
    )
      return false;

    // Win Rate (numeric input)
    if (
      filterCriteria.roiFrom?.trim() &&
      data.winRate < parseFloat(filterCriteria.roiFrom)
    )
      return false;
    if (
      filterCriteria.roiTo?.trim() &&
      data.winRate > parseFloat(filterCriteria.roiTo)
    )
      return false;

    // Avg Buy (numeric input)
    if (
      filterCriteria.avgBuyFrom?.trim() &&
      data.avgBuySol < parseFloat(filterCriteria.avgBuyFrom)
    )
      return false;
    if (
      filterCriteria.avgBuyTo?.trim() &&
      data.avgBuySol > parseFloat(filterCriteria.avgBuyTo)
    )
      return false;

    // Avg Entry (text with suffix: K, M, B)
    if (
      filterCriteria.entryFrom?.trim() &&
      data.avgEntry < convertSuffixValue(filterCriteria.entryFrom)
    )
      return false;
    if (
      filterCriteria.entryTo?.trim() &&
      data.avgEntry > convertSuffixValue(filterCriteria.entryTo)
    )
      return false;

    // Avg Hold (text with "m" or "h")
    if (
      filterCriteria.holdingFrom?.trim() &&
      data.avgHoldMinutes < convertHoldValue(filterCriteria.holdingFrom)
    )
      return false;
    if (
      filterCriteria.holdingTo?.trim() &&
      data.avgHoldMinutes > convertHoldValue(filterCriteria.holdingTo)
    )
      return false;

    // Winning Trades (numeric input)
    if (
      filterCriteria.winningTradesFrom?.trim() &&
      data.winningTrades < parseFloat(filterCriteria.winningTradesFrom)
    )
      return false;
    if (
      filterCriteria.winningTradesTo?.trim() &&
      data.winningTrades > parseFloat(filterCriteria.winningTradesTo)
    )
      return false;

    // Losing Trades (numeric input)
    if (
      filterCriteria.losingTradesFrom?.trim() &&
      data.losingTrades < parseFloat(filterCriteria.losingTradesFrom)
    )
      return false;
    if (
      filterCriteria.losingTradesTo?.trim() &&
      data.losingTrades > parseFloat(filterCriteria.losingTradesTo)
    )
      return false;

    // Tokens (numeric input)
    if (
      filterCriteria.tokensFrom?.trim() &&
      data.tokens < parseFloat(filterCriteria.tokensFrom)
    )
      return false;
    if (
      filterCriteria.tokensTo?.trim() &&
      data.tokens > parseFloat(filterCriteria.tokensTo)
    )
      return false;

    // Followers (text with suffix)
    if (
      filterCriteria.followersFrom?.trim() &&
      trader.followers < convertSuffixValue(filterCriteria.followersFrom)
    )
      return false;
    if (
      filterCriteria.followersTo?.trim() &&
      trader.followers > convertSuffixValue(filterCriteria.followersTo)
    )
      return false;

    // If all checks pass, include this trader.
    return true;
  });

  const handleClickGroups = () => {
    setLabel("Coming soon");
    setTimeout(() => {
      setLabel("Groups");
    }, 2000);
  };
  const handleSort = (column) => {
    if (walletConnected) {
      if (sortBy === column) {
        // Toggle sort direction
        setSortDirection((prev) => (prev === "desc" ? "asc" : "desc"));
      } else {
        // New column selected: default to descending order
        setSortBy(column);
        setSortDirection("desc");
      }
    } else {
      handleConnectModal();
    }
  };

  const handleTraderClick = (traderWallet) => {
    if (walletConnected) {
      router.push(`/profile/${traderWallet}`);
    } else {
      handleConnectModal();
    }
  };

  const sortedTraders = filteredTraders.slice().sort((a, b) => {
    let valueA, valueB;
    if (sortBy === "followers") {
      valueA = Number(a.followers || 0);
      valueB = Number(b.followers || 0);
    } else {
      const dataA = a.timeframes[timeframe] || {};
      const dataB = b.timeframes[timeframe] || {};
      if (sortBy === "trades") {
        // Sum winning and losing trades
        valueA = Number((dataA.winningTrades || 0) + (dataA.losingTrades || 0));
        valueB = Number((dataB.winningTrades || 0) + (dataB.losingTrades || 0));
      } else {
        // Map keys for avgBuy and avgHold
        let key = sortBy;
        if (sortBy === "avgBuy") key = "avgBuySol";
        else if (sortBy === "avgHold") key = "avgHoldMinutes";
        valueA = Number(dataA[key] || 0);
        valueB = Number(dataB[key] || 0);
      }
    }
    return sortDirection === "desc" ? valueB - valueA : valueA - valueB;
  });

  // Fetch trader data from the mock API endpoint and save it to state
  useEffect(() => {
    setLoading(true);
    fetch("/api/main")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Error fetching the API data");
        }
        return res.json();
      })
      .then((data) => {
        setTraders(data.traders);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching trader data:", err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // Calculate indices for slicing:
  const totalPages = Math.ceil(sortedTraders.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTraders = sortedTraders.slice(indexOfFirstItem, indexOfLastItem);

  // Helper functions with explicit locale ("en-US")
  function formatWallet(wallet) {
    if (!wallet) return "";
    return wallet.substring(0, 4) + "..." + wallet.substring(wallet.length - 4);
  }
  function formatDollar(n) {
    if (n == null || isNaN(n)) return "$0";
    return "$" + n.toLocaleString("en-US", { maximumFractionDigits: 0 });
  }

  function formatSOL(n) {
    if (n == null || isNaN(n)) return "0.00";
    if (n < 10) return n.toFixed(2);
    else if (n < 100) return n.toFixed(1);
    else return n.toFixed(1);
  }

  function formatNumberWithSuffix(n) {
    if (n == null || isNaN(n)) return "0";
    if (n < 1000) return n.toString();
    else if (n < 1e6) {
      const value = n / 1e3;
      return value < 10 ? value.toFixed(1) + "K" : Math.round(value) + "K";
    } else if (n < 1e9) {
      const value = n / 1e6;
      return value < 10 ? value.toFixed(1) + "M" : Math.round(value) + "M";
    } else {
      const value = n / 1e9;
      return value < 10 ? value.toFixed(1) + "B" : Math.round(value) + "B";
    }
  }
  function formatMc(n) {
    if (n == null || isNaN(n)) return "0";
    if (n < 1000) return "$" + n.toString();
    else if (n < 1e6) {
      const value = n / 1e3;
      return value < 10
        ? "$" + value.toFixed(1) + "K"
        : "$" + Math.round(value) + "K";
    } else if (n < 1e9) {
      const value = n / 1e6;
      return value < 10
        ? "$" + value.toFixed(1) + "M"
        : "$" + Math.round(value) + "M";
    } else {
      const value = n / 1e9;
      return value < 10
        ? "$" + value.toFixed(1) + "B"
        : "$" + Math.round(value) + "B";
    }
  }

  function formatHold(minutes) {
    if (minutes == null || isNaN(minutes)) return "0 m";
    if (minutes < 240) {
      return minutes + " m";
    } else {
      return Math.round(minutes / 60) + " h";
    }
  }
  function capitalizeFirstLetter(str) {
    return str ? str.charAt(0).toUpperCase() + str.slice(1) : "";
  }

  //handles loading states and errors from the API

  if (loading) {
    return (
      <div className="bg-[#060611] min-h-screen flex flex-col items-center justify-center space-y-6">
        <div className="relative">
          <ImSpinner8 className="text-6xl text-[#AA00FF] animate-spin" />
          <div className="absolute inset-0 border-4 border-[#AA00FF] rounded-full animate-ping  "></div>
        </div>
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-white">
            Loading Leaderboards
          </h2>
          <p className="text-[#858585]">Crunching the latest trading data...</p>
        </div>
        <div className="w-64 h-2 bg-[#25223D] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#AA00FF] loading-bar-animation rounded-full"
            style={{ width: "100%" }} // Remove the dynamic width
          ></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[#060611] min-h-screen flex flex-col items-center justify-center space-y-6 px-4 text-center">
        <div className="relative">
          <FiAlertTriangle className="text-6xl text-[#CC5959] " />
          <div className="absolute inset-0 rounded-full bg-[#CC5959] opacity-20 blur-md"></div>
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-white">Data Loading Failed</h2>
          <p className="text-[#858585] max-w-md">{error}</p>
        </div>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-2 bg-[#AA00FF] hover:bg-[#9900DD] rounded-xl font-semibold transition-colors flex items-center space-x-2"
        >
          <span className="text-white">Try Again</span>
          <ImSpinner8 className="text-white animate-spin" />
        </button>
        <p className="text-[#858585] text-sm mt-4">
          Still having issues? Reach out on our{" "}
          <a
            href="https://discord.gg/potionAlpha"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#AA00FF] hover:underline"
          >
            Discord
          </a>
        </p>
      </div>
    );
  }

  return (
    <div className="bg-[#060611] w-full min-h-screen px-4 md:px-[32px] py-[20px]">
      <Navbar
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
        hamburgerRef={hamburgerRef}
      />
      <div className="flex items-center justify-between mt-[42px] text-white">
        <div className="flex items-center">
          <div className=" hidden lg:flex text-sm px-3 py-1 w500:px-5 w500:py-2 w500:text-base bg-[#25223D] hover:bg-[#423d6d] cursor-pointer border-[#464558] border-[1px] rounded-3xl w-auto">
            Traders
          </div>
          <div className="flex lg:hidden">
            <TradersModal />
          </div>
          <div
            onClick={handleClickGroups}
            className="px-5 py-2 hidden lg:flex w-40 hover:text-[#d105fb] cursor-pointer text-[#858585] rounded-3xl "
          >
            {label}
          </div>

          <div className="xl:hidden ml-2 w500:ml-4">
            <TimeModal timeframe={timeframe} setTimeframe={setTimeframe} />
          </div>

          <div className="hidden xl:flex items-center ml-16 wdefinedxl:ml-32 whitespace-nowrap">
            <div
              onClick={() => setTimeframe("daily")}
              className={`px-5 py-2  rounded-3xl cursor-pointer ${
                timeframe === "daily"
                  ? "bg-[#25223D] hover:bg-[#423d6d] border-[#464558] border-[1px]"
                  : "text-[#858585] hover:text-[#d105fb]"
              }`}
            >
              Daily
            </div>
            <div
              onClick={() => setTimeframe("weekly")}
              className={`px-5 py-2   rounded-3xl cursor-pointer ${
                timeframe === "weekly"
                  ? "bg-[#25223D] hover:bg-[#423d6d] border-[#464558] border-[1px]"
                  : "text-[#858585] hover:text-[#d105fb]"
              }`}
            >
              Weekly
            </div>
            <div
              onClick={() => setTimeframe("monthly")}
              className={`px-5 py-2   rounded-3xl cursor-pointer ${
                timeframe === "monthly"
                  ? "bg-[#25223D] hover:bg-[#423d6d] border-[#464558] border-[1px]"
                  : "text-[#858585] hover:text-[#d105fb]"
              }`}
            >
              Monthly
            </div>
            <div
              onClick={() => setTimeframe("allTime")}
              className={`px-5 py-2   rounded-3xl cursor-pointer ${
                timeframe === "allTime"
                  ? "bg-[#25223D] hover:bg-[#423d6d] border-[#464558] border-[1px]"
                  : "text-[#858585] hover:text-[#d105fb]"
              }`}
            >
              All-Time
            </div>
          </div>
        </div>
        <div className="flex items-center ">
          {walletConnected && <SearchInputMain traders={traders} />}
          {!walletConnected && (
            <div>
              {/* Mock Input bar Desktop */}
              <div
                onClick={handleConnectModal}
                className="items-center px-4 py-2 hidden md:px-0 md:flex w-auto md:w-[414px] rounded-3xl border border-[#464558] text-[#858585] cursor-text"
              >
                <div className="text-xl md:ml-4">
                  <Image
                    src="/magnifying-glass.svg"
                    alt="magnifying glass"
                    width={24}
                    height={24}
                    priority
                  />
                </div>
                <input
                  type="text"
                  placeholder="Search by name or wallet"
                  className="ml-2 flex-1 bg-transparent outline-none text-white font-light placeholder:text-[#858585] hidden sm:flex"
                />
              </div>

              {/* Mock Input bar Mobile */}
              <button
                onClick={handleConnectModal}
                className="items-center px-4 py-2 md:hidden hover:bg-[#0d0d22] flex w-auto rounded-3xl border border-[#464558] text-[#858585]"
              >
                <div className="text-xl">
                  <Image
                    src="/magnifying-glass.svg"
                    alt="magnifying glass"
                    width={24}
                    height={24}
                    priority
                  />
                </div>
              </button>
            </div>
          )}

          {walletConnected && <Filters onFilterChange={setFilterCriteria} />}

          {!walletConnected && (
            <div className="flex">
              <div
                onClick={handleConnectModal}
                className={` px-4 py-2 ml-2 md:ml-4 bg-[#25223D] hover:bg-[#423d6d] cursor-pointer border-[#464558] border-[1px] rounded-3xl w-auto inline-block`}
              >
                <img
                  className="flex"
                  src="/adjust-icon.png"
                  alt="adjust-icon"
                  width={24}
                  height={26}
                  priority
                />
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="overflow-x-auto custom-scrollbar">
        <div className="w-max w1273:w-full flex justify-between bg-[#25223D] text-sm lg:text-base text-white items-center py-2 px-4 mt-4 lg:mt-8">
          <div className="flex">
            {sortBy === "realizedPnlSol" && (
              <div className="font-semibold w-10">Rank</div>
            )}
            <div
              className={`font-semibold w-40  ${
                sortBy === "realizedPnlSol" ? "ml-8" : ""
              }`}
            >
              Trader
            </div>
          </div>
          <div className="flex space-x-0 w1600:space-x-6 w1700:space-x-10">
            {/* Followers */}
            <div
              onClick={() => handleSort("followers")}
              className={`flex items-center justify-end w-28 cursor-pointer ${
                sortBy === "followers" ? "text-[#CCAD59]" : "text-white"
              }`}
            >
              <div className="font-semibold hover:underline">Followers</div>
              <div
                className={`text-2xl transition-transform duration-300 ${
                  sortBy === "followers"
                    ? sortDirection === "desc"
                      ? "text-[#CCAD59] rotate-180"
                      : "text-[#CCAD59] rotate-0"
                    : "text-[#AA00FF] rotate-0"
                }`}
              >
                <GoTriangleDown />
              </div>
            </div>
            {/* Tokens */}
            <div
              onClick={() => handleSort("tokens")}
              className={`flex items-center justify-end w-24 cursor-pointer ${
                sortBy === "tokens" ? "text-[#CCAD59]" : "text-white"
              }`}
            >
              <div className="font-semibold hover:underline">Tokens</div>
              <div
                className={`text-2xl transition-transform duration-300 ${
                  sortBy === "tokens"
                    ? sortDirection === "desc"
                      ? "text-[#CCAD59] rotate-180"
                      : "text-[#CCAD59] rotate-0"
                    : "text-[#AA00FF] rotate-0"
                }`}
              >
                <GoTriangleDown />
              </div>
            </div>
            {/* Win Rate */}
            <div
              onClick={() => handleSort("winRate")}
              className={`flex items-center justify-end w-28 h-10 cursor-pointer ${
                sortBy === "winRate" ? "text-[#CCAD59]" : "text-white"
              }`}
            >
              <div className="font-semibold hover:underline">Win Rate</div>
              <div
                className={`text-2xl transition-transform duration-300 ${
                  sortBy === "winRate"
                    ? sortDirection === "desc"
                      ? "text-[#CCAD59] rotate-180"
                      : "text-[#CCAD59] rotate-0"
                    : "text-[#AA00FF] rotate-0"
                }`}
              >
                <GoTriangleDown />
              </div>
            </div>
            {/* Trades (sum of winning and losing trades) */}
            <div
              onClick={() => handleSort("trades")}
              className={`flex items-center justify-end w-24 cursor-pointer ${
                sortBy === "trades" ? "text-[#CCAD59]" : "text-white"
              }`}
            >
              <div className="font-semibold hover:underline">Trades</div>
              <div
                className={`text-2xl transition-transform duration-300 ${
                  sortBy === "trades"
                    ? sortDirection === "desc"
                      ? "text-[#CCAD59] rotate-180"
                      : "text-[#CCAD59] rotate-0"
                    : "text-[#AA00FF] rotate-0"
                }`}
              >
                <GoTriangleDown />
              </div>
            </div>
            {/* Avg Buy */}
            <div
              onClick={() => handleSort("avgBuy")}
              className={`flex items-center justify-end w-24 cursor-pointer ${
                sortBy === "avgBuy" ? "text-[#CCAD59]" : "text-white"
              }`}
            >
              <div className="font-semibold hover:underline">Avg Buy</div>
              <div
                className={`text-2xl transition-transform duration-300 ${
                  sortBy === "avgBuy"
                    ? sortDirection === "desc"
                      ? "text-[#CCAD59] rotate-180"
                      : "text-[#CCAD59] rotate-0"
                    : "text-[#AA00FF] rotate-0"
                }`}
              >
                <GoTriangleDown />
              </div>
            </div>
            {/* Avg Entry */}
            <div
              onClick={() => handleSort("avgEntry")}
              className={`flex items-center justify-end w-28 cursor-pointer ${
                sortBy === "avgEntry" ? "text-[#CCAD59]" : "text-white"
              }`}
            >
              <div className="font-semibold hover:underline">Avg Entry</div>
              <div
                className={`text-2xl transition-transform duration-300 ${
                  sortBy === "avgEntry"
                    ? sortDirection === "desc"
                      ? "text-[#CCAD59] rotate-180"
                      : "text-[#CCAD59] rotate-0"
                    : "text-[#AA00FF] rotate-0"
                }`}
              >
                <GoTriangleDown />
              </div>
            </div>
            {/* Avg Hold */}
            <div
              onClick={() => handleSort("avgHold")}
              className={`flex items-center justify-end w-32 cursor-pointer ${
                sortBy === "avgHold" ? "text-[#CCAD59]" : "text-white"
              }`}
            >
              <div className="font-semibold hover:underline">Avg Hold</div>
              <div
                className={`text-2xl transition-transform duration-300 ${
                  sortBy === "avgHold"
                    ? sortDirection === "desc"
                      ? "text-[#CCAD59] rotate-180"
                      : "text-[#CCAD59] rotate-0"
                    : "text-[#AA00FF] rotate-0"
                }`}
              >
                <GoTriangleDown />
              </div>
            </div>
            {/* Realized PNL */}
            <div
              onClick={() => handleSort("realizedPnlSol")}
              className={`flex items-center justify-end w-36 cursor-pointer ${
                sortBy === "realizedPnlSol" ? "text-[#CCAD59]" : "text-white"
              }`}
            >
              <div className="font-semibold hover:underline">Realized PNL</div>
              <div
                className={`text-2xl transition-transform duration-300 ${
                  sortBy === "realizedPnlSol"
                    ? sortDirection === "desc"
                      ? "text-[#CCAD59] rotate-180"
                      : "text-[#CCAD59] rotate-0"
                    : "text-[#AA00FF] rotate-0"
                }`}
              >
                <GoTriangleDown />
              </div>
            </div>
          </div>
          <div className="font-semibold ml-6 w-12 justify-end">Share</div>
        </div>

        {sortedTraders.length > 0 ? (
          <div>
            {currentTraders.map((trader, index) => {
              const currentData = trader.timeframes[timeframe] || {};
              const globalRank = indexOfFirstItem + index + 1;
              const displayRank =
                sortDirection === "desc"
                  ? globalRank
                  : sortedTraders.length - globalRank + 1;

              return (
                <div
                  key={trader.traderWallet}
                  className="bg-[#11121B] w-max w1273:w-full items-center justify-between flex px-4 border-b-[1px] border-[#23242C] text-white py-4"
                >
                  <div className="flex items-center">
                    <div className=" flex justify-center">
                      {sortBy === "realizedPnlSol" && (
                        <div className="flex items-center">
                          <div className="w-10 flex justify-center">
                            {displayRank < 4 ? (
                              <div
                                className={`h-[24px] w-[24px] lg:h-[28px] lg:w-[28px] rounded-full text-sm text-[#11121B] lg:text-base font-semibold items-center flex justify-center ${
                                  displayRank === 1
                                    ? "bg-[#CCAD59]"
                                    : displayRank === 2
                                    ? "bg-[#BFBFBF]"
                                    : "bg-[#B2835F]"
                                }`}
                              >
                                {displayRank}
                              </div>
                            ) : (
                              <div className="h-[24px] w-[24px] lg:h-[28px] lg:w-[28px] text-sm text-white lg:text-base font-semibold items-center flex justify-center">
                                {displayRank}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    <div
                      className={`flex w-40    ${
                        sortBy === "realizedPnlSol" ? "ml-8" : ""
                      }`}
                    >
                      <Image
                        className="hidden lg:flex cursor-pointer"
                        src={`/${trader.profilePhoto}`}
                        onClick={() => handleTraderClick(trader.traderWallet)}
                        alt={trader.traderName}
                        width={43}
                        height={43}
                        priority
                      />
                      <Image
                        className="flex lg:hidden cursor-pointer"
                        src={`/${trader.profilePhoto}`}
                        onClick={() => handleTraderClick(trader.traderWallet)}
                        alt={trader.traderName}
                        width={35}
                        height={35}
                        priority
                      />
                      <div className="text-xs lg:text-sm items-center ml-2">
                        <div
                          onClick={() => handleTraderClick(trader.traderWallet)}
                          className="font-semibold cursor-pointer"
                        >
                          {capitalizeFirstLetter(trader.traderName)}
                        </div>
                        <div className="flex">
                          <a
                            target="_blank"
                            href={`https://solscan.io/account/${trader.traderWallet}`}
                            className="text-[#858585] hover:underline cursor-pointer"
                          >
                            {formatWallet(trader.traderWallet)}
                          </a>
                          <div
                            onClick={() => copyAddress(trader.traderWallet)}
                            className="ml-2 mt-[3px] hover:text-[#696969] text-[#858585] cursor-pointer"
                          >
                            {copiedWallet === trader.traderWallet ? (
                              <FiCheck />
                            ) : (
                              <FiCopy />
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-0 w1600:space-x-6 w1700:space-x-10">
                    <div className="text-sm items-center text-right w-28">
                      <div className="items-center mr-2">
                        <div className="font-semibold text-sm lg:text-base">
                          {formatNumberWithSuffix(trader.followers)}
                        </div>
                        <a
                          target="_blank"
                          href={`https://x.com/${trader.twitterHandle}`}
                          className="text-[#858585] hover:underline cursor-pointer text-xs lg:text-sm"
                        >
                          {"@" + trader.twitterHandle}
                        </a>
                      </div>
                    </div>
                    <div className="text-sm items-center text-right w-24">
                      <div className="font-semibold -lg mr-2 lg:text-lg text-base">
                        {currentData.tokens}
                      </div>
                    </div>
                    <div className="text-sm items-center text-right w-28">
                      <div className="font-semibold lg:text-lg text-base mr-2 text-[#59CC6C]">
                        {currentData.winRate + "%"}
                      </div>
                    </div>
                    <div className="text-sm items-center text-right w-24">
                      <div className="font-semibold lg:text-lg text-base mr-2">
                        <span className="text-[#59CC6C]">
                          {currentData.winningTrades}
                        </span>
                        <a className="text-[#858585] ml-1">/</a>
                        <a className="text-[#CC5959] ml-1">
                          {currentData.losingTrades}
                        </a>
                      </div>
                    </div>
                    <div className="text-sm text-right h-full w-24 items-end">
                      <div className="items-center mr-2">
                        <div className="flex items-center justify-end">
                          <div className="font-semibold text-sm lg:text-base mr-1">
                            {formatSOL(currentData.avgBuySol)}
                          </div>
                          <div className="mb-[2px]">
                            <Image
                              className="hidden lg:flex"
                              src="/solana.svg"
                              alt="solana logo"
                              width={13}
                              height={13}
                              priority
                            />
                            <Image
                              className="lg:hidden"
                              src="/solana.svg"
                              alt="solana logo"
                              width={11}
                              height={11}
                              priority
                            />
                          </div>
                        </div>
                        <div className="text-[#858585] text-xs lg:text-sm mt-[-2px]">
                          {formatDollar(currentData.avgBuySol * solPrice)}
                        </div>
                      </div>
                    </div>
                    <div className="text-sm items-center text-right w-28">
                      <div className="font-semibold text-base lg:text-lg mr-2">
                        {formatMc(currentData.avgEntry)}
                      </div>
                    </div>
                    <div className="text-sm items-center text-right w-32">
                      <div className="font-semibold text-base lg:text-lg mr-2">
                        {formatHold(currentData.avgHoldMinutes)}
                      </div>
                    </div>
                    <div className="text-sm text-right h-full w-36">
                      <div className="items-center mr-2">
                        <div className="flex items-center justify-end">
                          <div className="font-semibold lg:text-base text-sm mr-1 text-[#59CC6C]">
                            {currentData.realizedPnlSol >= 0 ? "+" : ""}
                            {formatSOL(currentData.realizedPnlSol)}
                          </div>
                          <div className="lg:mb-[3px]">
                            <Image
                              className="hidden lg:flex"
                              src="/solana.svg"
                              alt="solana logo"
                              width={13}
                              height={13}
                              priority
                            />
                            <Image
                              className="lg:hidden"
                              src="/solana.svg"
                              alt="solana logo"
                              width={11}
                              height={11}
                              priority
                            />
                          </div>
                        </div>
                        <div className="text-[#858585] text-xs lg:text-sm mt-[-2px]">
                          {formatDollar(currentData.realizedPnlSol * solPrice)}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="min-w-12 ml-6 flex justify-end text-xl cursor-pointer hover:text-[#d105fb]">
                    <div className="mr-2 items-center">
                      <CiShare1 />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="h-96  w-full min-w-full text-2xl bg-[#12121c]"></div>
        )}
      </div>
      {/* Pagination */}
      <div className="flex bg-[#25223d] items-center justify-between px-4 py-4 ">
        {/* Left: Items per page selection */}
        <PerPageButton
          value={itemsPerPage}
          onChange={(newVal) => {
            setItemsPerPage(Number(newVal));
            setCurrentPage(1);
          }}
          options={[10, 20, 30, 40]}
        />
        {/* Right: Page navigation */}
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="text-white    rounded-md border-[#464558] border-[1px] disabled:hover:bg-transparent transition-colors duration-150 p-2 hover:bg-[#1c1a2e] disabled:opacity-50"
          >
            <IoIosArrowBack />
          </button>
          <span className="text-white w-16 flex justify-center">
            {currentPage} of {totalPages}
          </span>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="text-white transition-colors duration-150 p-2 hover:bg-[#1c1a2e] disabled:hover:bg-transparent rounded-md border-[#464558] border-[1px] disabled:hover:text-white disabled:opacity-50"
          >
            <IoIosArrowForward />
          </button>
        </div>
      </div>

      {/* Render the Connect Modal */}
      <ConnectModal
        isOpen={isConnectModalOpen}
        onClose={() => setIsConnectModalOpen(false)}
      />

      <MobileMenu
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
        hamburgerRef={hamburgerRef}
      />
    </div>
  );
}
