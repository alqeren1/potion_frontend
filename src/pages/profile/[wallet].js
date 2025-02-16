import { useState, useRef, useEffect } from "react";
import Image from "next/image";

import { ImSpinner8 } from "react-icons/im";
import { FiAlertTriangle } from "react-icons/fi";
import { CiShare1 } from "react-icons/ci";
import { GoTriangleDown } from "react-icons/go";
import { FiCopy, FiCheck } from "react-icons/fi";
import Navbar from "@/components/navbar";
import TradesModal from "@/components/trades_modal";
import TimeModal from "@/components/timeframe_modal";
import Filters2 from "@/components/filters2";
import MobileMenu from "@/components/mobile_menu";
import Bullx from "../../../public/svgs/bullx";
import { IoRefreshOutline } from "react-icons/io5";
import SearchInput from "@/components/searchbar";
import PerPageButton from "@/components/perPageButton";
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";
import ConnectModalNonDismissable from "@/components/ConnectModalNonDismissable";
import isWalletConnected from "@/components/isWalletConnected";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXTwitter } from "@fortawesome/free-brands-svg-icons";

export async function getServerSideProps({ params }) {
  try {
    const { wallet } = params;
    // Start loading state
    const initialLoading = true;
    // Fetch all trader data from your API
    const res = await fetch(`http://localhost:3000/api/main?wallet=${wallet}`);

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();
    // Find the trader whose wallet matches the parameter, If not found, create a fallback trader object with N/A values
    const trader =
      data.traders.find((t) => t.traderWallet === wallet) ||
      createFallbackTrader(wallet);

    return {
      props: {
        trader,
        initialLoading: false, // Loading complete
        initialError: null,
      },
    };
  } catch (error) {
    return {
      props: {
        trader: createFallbackTrader(params.wallet),
        initialLoading: false, // Loading complete with error
        initialError: error.message,
      },
    };
  }
}
export default function Home({ trader, initialLoading, initialError }) {
  const walletConnected = isWalletConnected();
  const [menuOpen, setMenuOpen] = useState(false);
  const [label, setLabel] = useState("Groups");
  const [label2, setLabel2] = useState("Tokens");
  const [spinning, setSpinning] = useState(false);
  const [timeframe, setTimeframe] = useState("daily");
  const [filterCriteria, setFilterCriteria] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [isMounted, setIsMounted] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [copiedToken, setCopiedToken] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(initialLoading);
    setError(initialError);
  }, [initialLoading, initialError]);

  const solPrice = 200; //solana price, can be fetched from an api and used
  const hamburgerRef = useRef(null);

  // Pagination states:
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  //   Token sorting state and handler *****
  const [tokenSortBy, setTokenSortBy] = useState("lastTrade");
  const [tokenSortDirection, setTokenSortDirection] = useState("asc");
  const copyAddress = async (address) => {
    try {
      await navigator.clipboard.writeText(address);
      setCopiedToken(address);
      // Revert the icon back after 2 seconds
      setTimeout(() => {
        setCopiedToken("");
      }, 2000);
    } catch (err) {
      console.error("Failed to copy!", err);
    }
  };
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Delay the modal rendering by 500ms (adjust as needed)
  useEffect(() => {
    if (isMounted) {
      const timer = setTimeout(() => setShowModal(true), 500);
      return () => clearTimeout(timer);
    }
  }, [isMounted]);

  const handleTokenSort = (column) => {
    if (tokenSortBy === column) {
      setTokenSortDirection((prev) => (prev === "desc" ? "asc" : "desc"));
    } else {
      setTokenSortBy(column);

      setTokenSortDirection(column === "lastTrade" ? "asc" : "desc");
    }
  };
  //  Add helper functions for filtering (same as main code) =====
  const convertSuffixValue = (value) => {
    if (!value) return null;
    const num = parseFloat(value);
    if (value.toUpperCase().includes("K")) return num * 1e3;
    if (value.toUpperCase().includes("M")) return num * 1e6;
    if (value.toUpperCase().includes("B")) return num * 1e9;
    return num;
  };

  const convertHoldValue = (value) => {
    if (!value) return null;
    const num = parseFloat(value);
    if (value.toLowerCase().endsWith("h")) return num * 60;
    return num; // assume minutes if ending with "m" or no suffix
  };

  // Compute sorted tokens for the selected timeframe:
  const tokensForTimeframe = (trader.tokens && trader.tokens[timeframe]) || [];
  //   Filter tokens based on filterCriteria =====
  const filteredTokens = tokensForTimeframe.filter((token) => {
    // Realized PNL filter
    if (
      filterCriteria.realizedFrom?.trim() &&
      token.realizedPnlSol < parseFloat(filterCriteria.realizedFrom)
    )
      return false;
    if (
      filterCriteria.realizedTo?.trim() &&
      token.realizedPnlSol > parseFloat(filterCriteria.realizedTo)
    )
      return false;

    // ROI filter
    const roi = token.invested
      ? (token.realizedPnlSol * 100) / token.invested
      : 0;
    if (
      filterCriteria.roiFrom?.trim() &&
      roi < parseFloat(filterCriteria.roiFrom)
    )
      return false;
    if (filterCriteria.roiTo?.trim() && roi > parseFloat(filterCriteria.roiTo))
      return false;

    // MC (market cap) filter
    if (
      filterCriteria.mcFrom?.trim() &&
      token.marketCap < convertSuffixValue(filterCriteria.mcFrom)
    )
      return false;
    if (
      filterCriteria.mcTo?.trim() &&
      token.marketCap > convertSuffixValue(filterCriteria.mcTo)
    )
      return false;

    // Holding filter
    if (
      filterCriteria.holdingFrom?.trim() &&
      token.holding < convertHoldValue(filterCriteria.holdingFrom)
    )
      return false;
    if (
      filterCriteria.holdingTo?.trim() &&
      token.holding > convertHoldValue(filterCriteria.holdingTo)
    )
      return false;

    // Invested filter
    if (
      filterCriteria.investedFrom?.trim() &&
      token.invested < parseFloat(filterCriteria.investedFrom)
    )
      return false;
    if (
      filterCriteria.investedTo?.trim() &&
      token.invested > parseFloat(filterCriteria.investedTo)
    )
      return false;

    // Avg Buy filter
    if (
      filterCriteria.avgBuyFrom?.trim() &&
      token.avgBuy < parseFloat(filterCriteria.avgBuyFrom)
    )
      return false;
    if (
      filterCriteria.avgBuyTo?.trim() &&
      token.avgBuy > parseFloat(filterCriteria.avgBuyTo)
    )
      return false;

    // Avg Sell filter
    if (
      filterCriteria.avgSellFrom?.trim() &&
      token.avgSell < parseFloat(filterCriteria.avgSellFrom)
    )
      return false;
    if (
      filterCriteria.avgSellTo?.trim() &&
      token.avgSell > parseFloat(filterCriteria.avgSellTo)
    )
      return false;

    // Winning Trades filter (using buyTransactions)
    if (
      filterCriteria.winningTradesFrom?.trim() &&
      token.buyTransactions < parseFloat(filterCriteria.winningTradesFrom)
    )
      return false;
    if (
      filterCriteria.winningTradesTo?.trim() &&
      token.buyTransactions > parseFloat(filterCriteria.winningTradesTo)
    )
      return false;

    // Losing Trades filter (using sellTransactions)
    if (
      filterCriteria.losingTradesFrom?.trim() &&
      token.sellTransactions < parseFloat(filterCriteria.losingTradesFrom)
    )
      return false;
    if (
      filterCriteria.losingTradesTo?.trim() &&
      token.sellTransactions > parseFloat(filterCriteria.losingTradesTo)
    )
      return false;

    // Held filter
    if (
      filterCriteria.heldFrom?.trim() &&
      token.held < convertHoldValue(filterCriteria.heldFrom)
    )
      return false;
    if (
      filterCriteria.heldTo?.trim() &&
      token.held > convertHoldValue(filterCriteria.heldTo)
    )
      return false;

    return true;
  });

  //   Further filter tokens by the search query ---
  const finalTokens = filteredTokens.filter((token) => {
    if (!searchQuery.trim()) return true;
    const lower = searchQuery.toLowerCase();
    return (
      token.tokenName.toLowerCase().includes(lower) ||
      token.tokenAddress.toLowerCase().includes(lower)
    );
  });
  const sortedTokens = finalTokens.slice().sort((a, b) => {
    let valueA, valueB;
    switch (tokenSortBy) {
      case "lastTrade":
        valueA = Number(a.tradeTime);
        valueB = Number(b.tradeTime);
        break;
      case "marketCap":
        valueA = Number(a.marketCap);
        valueB = Number(b.marketCap);
        break;
      case "invested":
        valueA = Number(a.invested);
        valueB = Number(b.invested);
        break;
      case "realizedPnlSol":
        valueA = Number(a.realizedPnlSol);
        valueB = Number(b.realizedPnlSol);
        break;
      case "roi":
        valueA = a.invested ? Number((a.realizedPnlSol * 100) / a.invested) : 0;
        valueB = b.invested ? Number((b.realizedPnlSol * 100) / b.invested) : 0;
        break;
      case "trades":
        valueA = Number(a.buyTransactions + a.sellTransactions);
        valueB = Number(b.buyTransactions + b.sellTransactions);
        break;
      case "holding":
        valueA = Number(a.holding);
        valueB = Number(b.holding);
        break;
      case "avgBuy":
        valueA = Number(a.avgBuy);
        valueB = Number(b.avgBuy);
        break;
      case "avgSell":
        valueA = Number(a.avgSell);
        valueB = Number(b.avgSell);
        break;
      case "held":
        valueA = Number(a.held);
        valueB = Number(b.held);
        break;
      default:
        valueA = 0;
        valueB = 0;
    }
    return tokenSortDirection === "desc" ? valueB - valueA : valueA - valueB;
  });

  // Calculate indices for slicing:
  const totalPages = Math.ceil(sortedTokens.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTokens = sortedTokens.slice(indexOfFirstItem, indexOfLastItem);
  // Disable scrolling if wallet is not connected
  useEffect(() => {
    if (!walletConnected) {
      // Disable scrolling on the body
      document.body.style.overflow = "hidden";
    } else {
      // Re-enable scrolling when wallet is connected
      document.body.style.overflow = "";
    }
    // Cleanup on unmount
    return () => {
      document.body.style.overflow = "";
    };
  }, [walletConnected]);

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
  const handleClickGroups = () => {
    setLabel("Soon");
    setTimeout(() => {
      setLabel("Groups");
    }, 2000); // 2 seconds; adjust as needed
  };
  const handleClickTokens = () => {
    setLabel2("Soon");
    setTimeout(() => {
      setLabel2("Tokens");
    }, 2000); // 2 seconds; adjust as needed
  };
  const handleClickRefresh = () => {
    // Trigger spin
    setSpinning(true);

    setTimeout(() => {
      setSpinning(false);
    }, 530);
  };

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
      {/* Wrapped the page content in a container that disables pointer events when wallet isn't connected */}
      <div className={!walletConnected ? "pointer-events-none  " : ""}>
        <Navbar
          menuOpen={menuOpen}
          setMenuOpen={setMenuOpen}
          hamburgerRef={hamburgerRef}
        />

        <div className="xl:flex  justify-between  space-y-6 xl:space-y-0 xl:space-x-12">
          <div className="flex items-center">
            <div className="w-full">
              <div className="flex mt-16 items-center space-x-4">
                <div className="">
                  <Image
                    className="flex "
                    src={`/${trader.profilePhoto}`}
                    alt={`${trader.traderName} profile photo`}
                    width={80}
                    height={80}
                    priority
                  />
                </div>
                <div>
                  <div className="text-white text-2xl font-semibold">
                    {capitalizeFirstLetter(trader.traderName)}
                  </div>
                  <div className="text-[#858585]">
                    {formatWallet(trader.traderWallet)}
                  </div>
                </div>
              </div>
              <div
                class="flex 
                 
               items-center flex-row justify-between  
                bg-[#11121B]
                mt-8 
                w-full
               w500:w-[377px]
                px-4 h-14
                text-white
                border-b-[1px] border-[#23242C]"
              >
                <div class="font-semibold">X Account</div>

                <div class="text-sm text-right mt-0">
                  <a
                    target="_blank"
                    href={`https://x.com/${trader.twitterHandle}`}
                    className="hover:underline"
                  >
                    @{trader.twitterHandle || "unknown"}
                  </a>
                  <div class="text-[#858585]">
                    {formatNumberWithSuffix(trader.followers)} followers
                  </div>
                </div>
              </div>

              <div>
                <div
                  className="flex flex-row bg-[#11121B] w-full
               w500:w-[377px] px-4  h-14 text-white items-center justify-between "
                >
                  <div className="font-semibold ">Last Trade</div>
                  <div className="flex text-right text-sm items-center">
                    {" "}
                    <div className="mr-2">{formatHold(trader.tradeTime)}</div>
                    <Bullx />
                  </div>
                </div>
                <div></div>
              </div>
            </div>
            <div></div>
          </div>
          <div className="flex-1 items-end flex min-w-0 ">
            <div className="w-full">
              {/* Top row of day filters */}
              <div className="flex justify-between items-center">
                <div className="h-10 md:hidden ">
                  <TimeModal
                    timeframe={timeframe}
                    setTimeframe={setTimeframe}
                  />
                </div>
                <div className="hidden md:flex items-center text-white whitespace-nowrap">
                  <div
                    onClick={() => setTimeframe("daily")}
                    className={`px-5 py-2  rounded-3xl cursor-pointer ${
                      timeframe === "daily"
                        ? "bg-[#25223D] hover:bg-[#423d6d] border-[#464558]  border-[1px]"
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
                <div className=" flex items-center text-[#858585] ">
                  <div className="hidden w370:flex mr-2 text-sm lg:text-base">
                    {" "}
                    Last refreshed seconds ago{" "}
                  </div>
                  <div
                    onClick={handleClickRefresh}
                    className={`
                    text-2xl 
                    transform rotate-45
                    cursor-pointer
                    hover:text-white
                    ${spinning ? "spin-faster" : ""}
                  `}
                  >
                    <IoRefreshOutline />
                  </div>
                  <div className="text-2xl lg:text-3xl ml-2 w500:ml-4 xl:ml-8   cursor-pointer hover:text-[#d105fb]  items-center">
                    <CiShare1 />
                  </div>{" "}
                </div>
              </div>
              {/* Three equal-width columns */}
              <div className="overflow-x-auto w-full mt-4 lg:mt-6 custom-scrollbar">
                <div className="flex min-w-[600px]  whitespace-nowrap bg-red-300">
                  {/* Column 1 */}
                  <div className="w-1/3  border-r border-[#23242C]">
                    <div>
                      <div className="flex bg-[#11121B] px-4 h-14 text-white items-center justify-between">
                        <div className="font-semibold text-sm md:text-base">
                          Tokens
                        </div>
                        <div className="text-right text-sm md:text-base">
                          <div className="">
                            {trader.timeframes[timeframe].tokens}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="border-b-[1px] border-[#23242C]" />
                    <div>
                      <div className="flex bg-[#11121B] px-4 h-14 text-white items-center justify-between">
                        <div className="font-semibold  text-sm md:text-base">
                          Win Rate
                        </div>
                        <div className="flex text-right text-sm md:text-base items-center">
                          <div className="text-[#59CC6C]">
                            {trader.timeframes[timeframe].winRate}%
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="border-b-[1px] border-[#23242C]" />
                    <div>
                      <div className="flex bg-[#11121B] px-4 h-14 text-white items-center justify-between">
                        <div className="font-semibold text-sm md:text-base">
                          Trades
                        </div>
                        <div className="flex text-right space-x-1 text-sm md:text-base items-center">
                          <div className="text-[#59CC6C]">
                            {trader.timeframes[timeframe].winningTrades}
                          </div>
                          <div className="text-[#858585]">/</div>
                          <div className="text-[#CC5959]">
                            {trader.timeframes[timeframe].losingTrades}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Column 2 */}
                  <div className="w-1/3  border-r border-[#23242C]">
                    <div>
                      <div className="flex bg-[#11121B] px-4 h-14 text-white items-center justify-between">
                        <div className="font-semibold text-sm md:text-base">
                          Avarage Buy
                        </div>
                        <div className="text-xs md:text-sm text-right      items-end ">
                          <div className="items-center">
                            <div className="flex items-center justify-end  ">
                              <div className=" text-sm md:text-base  mr-1  ">
                                {trader.timeframes[timeframe].avgBuySol}
                              </div>
                              <div className=" mb-[2px]">
                                <Image
                                  className="hidden lg:flex "
                                  src="/solana.svg"
                                  alt="x logo"
                                  width={13}
                                  height={13}
                                  priority
                                />
                                <Image
                                  className=" lg:hidden "
                                  src="/solana.svg"
                                  alt="x logo"
                                  width={11}
                                  height={11}
                                  priority
                                />
                              </div>
                            </div>
                            <div className="text-[#858585] text-xs md:text-sm mt-[-2px]">
                              {formatDollar(
                                trader.timeframes[timeframe].avgBuySol *
                                  solPrice
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="border-b-[1px] border-[#23242C]" />
                    <div>
                      <div className="flex bg-[#11121B] px-4 h-14 text-white items-center justify-between">
                        <div className="font-semibold text-sm md:text-base">
                          Avarage Entry
                        </div>
                        <div className="flex text-right text-sm md:text-base items-center">
                          <div className="">
                            {" "}
                            {formatMc(trader.timeframes[timeframe].avgEntry)}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="border-b-[1px] border-[#23242C]" />
                    <div>
                      <div className="flex bg-[#11121B] px-4 h-14 text-white items-center justify-between">
                        <div className="font-semibold text-sm md:text-base">
                          Average Hold
                        </div>
                        <div className="flex text-right space-x-1 text-sm md:text-base items-center">
                          <div className=" ">
                            {" "}
                            {formatHold(
                              trader.timeframes[timeframe].avgHoldMinutes
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Column 3 */}
                  <div className="w-1/3  ">
                    <div>
                      <div className="flex bg-[#11121B] px-4 h-14 text-white items-center justify-between">
                        <div className="font-semibold text-sm md:text-base">
                          Total Invested
                        </div>
                        <div className="text-xs md:text-sm text-right      items-end ">
                          <div className="items-center ">
                            <div className="flex items-center justify-end  ">
                              <div className=" text-sm md:text-base  mr-1  ">
                                {formatSOL(
                                  trader.timeframes[timeframe].totalInvested
                                )}
                              </div>
                              <div className=" mb-[2px]">
                                <Image
                                  className="hidden lg:flex "
                                  src="/solana.svg"
                                  alt="x logo"
                                  width={13}
                                  height={13}
                                  priority
                                />
                                <Image
                                  className=" lg:hidden "
                                  src="/solana.svg"
                                  alt="x logo"
                                  width={11}
                                  height={11}
                                  priority
                                />
                              </div>
                            </div>
                            <div className="text-[#858585] text-xs md:text-sm mt-[-2px]">
                              {formatDollar(
                                trader.timeframes[timeframe].totalInvested *
                                  solPrice
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="border-b-[1px] border-[#23242C]" />
                    <div>
                      <div className="flex bg-[#11121B] px-4 h-14 text-white items-center justify-between">
                        <div className="font-semibold text-sm md:text-base">
                          ROI
                        </div>
                        <div className="flex text-right text-sm md:text-base items-center">
                          <div className="text-[#59CC6C]">
                            {formatSOL(
                              (trader.timeframes[timeframe].realizedPnlSol *
                                100) /
                                trader.timeframes[timeframe].totalInvested
                            ) + "%"}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="border-b-[1px] border-[#23242C]" />
                    <div>
                      <div className="flex bg-[#11121B] px-4 h-14 text-white items-center justify-between">
                        <div className="font-semibold text-sm md:text-base">
                          Realized PNL
                        </div>
                        <div className="text-xs md:text-sm text-right      items-end ">
                          <div className="items-center ">
                            <div className="flex items-center justify-end  ">
                              <div className=" text-sm md:text-base   mr-1 text-[#59CC6C] ">
                                {"+" +
                                  formatSOL(
                                    trader.timeframes[timeframe].realizedPnlSol
                                  )}
                              </div>
                              <div className=" mb-[2px]">
                                <Image
                                  className="hidden lg:flex "
                                  src="/solana.svg"
                                  alt="x logo"
                                  width={13}
                                  height={13}
                                  priority
                                />
                                <Image
                                  className=" lg:hidden "
                                  src="/solana.svg"
                                  alt="x logo"
                                  width={11}
                                  height={11}
                                  priority
                                />
                              </div>
                            </div>
                            <div className="text-[#858585] text-xs lg:text-sm mt-[-2px]">
                              {formatDollar(
                                trader.timeframes[timeframe].realizedPnlSol *
                                  solPrice
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mt-[42px] text-white">
          <div className="flex items-center">
            <div className=" hidden lg:flex text-sm px-3 py-1 w500:px-5 w500:py-2 w500:text-base bg-[#25223D] hover:bg-[#423d6d] cursor-pointer border-[#464558] border-[1px] rounded-3xl w-auto">
              Trades
            </div>
            <div className="flex h-10 lg:hidden">
              <TradesModal />
            </div>
            <div
              onClick={handleClickTokens}
              className="px-5 py-2 hidden lg:flex ml-4  w-24  hover:text-[#d105fb] cursor-pointer text-[#858585] rounded-3xl "
            >
              {label2}
            </div>
            <div
              onClick={handleClickGroups}
              className="px-5 py-2 hidden lg:flex     hover:text-[#d105fb] cursor-pointer text-[#858585] rounded-3xl "
            >
              {label}
            </div>
          </div>
          <div className="flex items-center">
            <SearchInput onSearch={setSearchQuery} searchQuery={searchQuery} />
            <Filters2 onFilterChange={setFilterCriteria} />
          </div>
        </div>

        <div className="overflow-x-auto custom-scrollbar ">
          <div className=" w-max w1273:w-full flex justify-between bg-[#25223D] text-sm lg:text-base text-white items-center py-2 px-4  mt-4 lg:mt-6">
            <div className=" flex">
              <div className="font-semibold w-40   "> Token</div>
            </div>
            <div className=" flex space-x-2 wdefinedxl:space-x-4 w1600:space-x-10">
              {/* Last Trade */}
              <div
                onClick={() => handleTokenSort("lastTrade")}
                className={`flex items-center justify-end w-28 cursor-pointer ${
                  tokenSortBy === "lastTrade" ? "text-[#CCAD59]" : "text-white"
                }`}
              >
                <div className="font-semibold hover:underline">Last Trade</div>
                <div
                  className={`text-2xl transition-transform duration-300 ${
                    tokenSortBy === "lastTrade"
                      ? tokenSortDirection === "desc"
                        ? "text-[#CCAD59] rotate-180"
                        : "text-[#CCAD59] rotate-0"
                      : "text-[#AA00FF] rotate-0"
                  }`}
                >
                  <GoTriangleDown />
                </div>
              </div>
              {/* MC */}
              <div
                onClick={() => handleTokenSort("marketCap")}
                className={`flex items-center justify-end w-16 cursor-pointer ${
                  tokenSortBy === "marketCap" ? "text-[#CCAD59]" : "text-white"
                }`}
              >
                <div className="font-semibold hover:underline">MC</div>
                <div
                  className={`text-2xl transition-transform duration-300 ${
                    tokenSortBy === "marketCap"
                      ? tokenSortDirection === "desc"
                        ? "text-[#CCAD59] rotate-180"
                        : "text-[#CCAD59] rotate-0"
                      : "text-[#AA00FF] rotate-0"
                  }`}
                >
                  <GoTriangleDown />
                </div>
              </div>
              {/* Invested */}
              <div
                onClick={() => handleTokenSort("invested")}
                className={`flex items-center justify-end w-24 cursor-pointer ${
                  tokenSortBy === "invested" ? "text-[#CCAD59]" : "text-white"
                }`}
              >
                <div className="font-semibold hover:underline">Invested</div>
                <div
                  className={`text-2xl transition-transform duration-300 ${
                    tokenSortBy === "invested"
                      ? tokenSortDirection === "desc"
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
                onClick={() => handleTokenSort("realizedPnlSol")}
                className={`flex items-center justify-end w-36 cursor-pointer ${
                  tokenSortBy === "realizedPnlSol"
                    ? "text-[#CCAD59]"
                    : "text-white"
                }`}
              >
                <div className="font-semibold hover:underline">
                  Realized PNL
                </div>
                <div
                  className={`text-2xl transition-transform duration-300 ${
                    tokenSortBy === "realizedPnlSol"
                      ? tokenSortDirection === "desc"
                        ? "text-[#CCAD59] rotate-180"
                        : "text-[#CCAD59] rotate-0"
                      : "text-[#AA00FF] rotate-0"
                  }`}
                >
                  <GoTriangleDown />
                </div>
              </div>
              {/* ROI */}
              <div
                onClick={() => handleTokenSort("roi")}
                className={`flex items-center justify-end w-16 cursor-pointer ${
                  tokenSortBy === "roi" ? "text-[#CCAD59]" : "text-white"
                }`}
              >
                <div className="font-semibold hover:underline">ROI</div>
                <div
                  className={`text-2xl transition-transform duration-300 ${
                    tokenSortBy === "roi"
                      ? tokenSortDirection === "desc"
                        ? "text-[#CCAD59] rotate-180"
                        : "text-[#CCAD59] rotate-0"
                      : "text-[#AA00FF] rotate-0"
                  }`}
                >
                  <GoTriangleDown />
                </div>
              </div>
              {/* Trades */}
              <div
                onClick={() => handleTokenSort("trades")}
                className={`flex items-center justify-end w-20 cursor-pointer ${
                  tokenSortBy === "trades" ? "text-[#CCAD59]" : "text-white"
                }`}
              >
                <div className="font-semibold hover:underline">Trades</div>
                <div
                  className={`text-2xl transition-transform duration-300 ${
                    tokenSortBy === "trades"
                      ? tokenSortDirection === "desc"
                        ? "text-[#CCAD59] rotate-180"
                        : "text-[#CCAD59] rotate-0"
                      : "text-[#AA00FF] rotate-0"
                  }`}
                >
                  <GoTriangleDown />
                </div>
              </div>
              {/* Holding */}
              <div
                onClick={() => handleTokenSort("holding")}
                className={`flex items-center justify-end w-24 cursor-pointer ${
                  tokenSortBy === "holding" ? "text-[#CCAD59]" : "text-white"
                }`}
              >
                <div className="font-semibold hover:underline">Holding</div>
                <div
                  className={`text-2xl transition-transform duration-300 ${
                    tokenSortBy === "holding"
                      ? tokenSortDirection === "desc"
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
                onClick={() => handleTokenSort("avgBuy")}
                className={`flex items-center justify-end w-24 cursor-pointer ${
                  tokenSortBy === "avgBuy" ? "text-[#CCAD59]" : "text-white"
                }`}
              >
                <div className="font-semibold hover:underline">Avg Buy</div>
                <div
                  className={`text-2xl transition-transform duration-300 ${
                    tokenSortBy === "avgBuy"
                      ? tokenSortDirection === "desc"
                        ? "text-[#CCAD59] rotate-180"
                        : "text-[#CCAD59] rotate-0"
                      : "text-[#AA00FF] rotate-0"
                  }`}
                >
                  <GoTriangleDown />
                </div>
              </div>
              {/* Avg Sell */}
              <div
                onClick={() => handleTokenSort("avgSell")}
                className={`flex items-center justify-end w-24 cursor-pointer ${
                  tokenSortBy === "avgSell" ? "text-[#CCAD59]" : "text-white"
                }`}
              >
                <div className="font-semibold hover:underline">Avg Sell</div>
                <div
                  className={`text-2xl transition-transform duration-300 ${
                    tokenSortBy === "avgSell"
                      ? tokenSortDirection === "desc"
                        ? "text-[#CCAD59] rotate-180"
                        : "text-[#CCAD59] rotate-0"
                      : "text-[#AA00FF] rotate-0"
                  }`}
                >
                  <GoTriangleDown />
                </div>
              </div>
              {/* Held */}
              <div
                onClick={() => handleTokenSort("held")}
                className={`flex items-center justify-end w-20 cursor-pointer ${
                  tokenSortBy === "held" ? "text-[#CCAD59]" : "text-white"
                }`}
              >
                <div className="font-semibold hover:underline">Held</div>
                <div
                  className={`text-2xl transition-transform duration-300 ${
                    tokenSortBy === "held"
                      ? tokenSortDirection === "desc"
                        ? "text-[#CCAD59] rotate-180"
                        : "text-[#CCAD59] rotate-0"
                      : "text-[#AA00FF] rotate-0"
                  }`}
                >
                  <GoTriangleDown />
                </div>
              </div>
              <div className="font-semibold ml-6 w-12 justify-end">Share</div>
            </div>
          </div>
          {sortedTokens.length > 0 ? (
            <div className="min-h-96 bg-[#11121B] w-max w1273:w-full">
              {currentTokens.map((token, index) => (
                <div className="bg-[#11121B] w-max w1273:w-full items-center   justify-between flex px-4 border-b-[1px] border-[#23242C] text-white py-4">
                  <div className="flex items-center">
                    <div className="flex w-40  ">
                      <Image
                        className=" hidden lg:flex "
                        src={`/${token.tokenPicture}`}
                        alt="x logo"
                        width={43}
                        height={43}
                        priority
                      />
                      <Image
                        className="flex lg:hidden "
                        src={`/${token.tokenPicture}`}
                        alt="x logo"
                        width={35}
                        height={35}
                        priority
                      />
                      <div className="text-xs lg:text-sm items-center ml-2">
                        <div className="font-semibold ">{`${capitalizeFirstLetter(
                          token.tokenName
                        )}`}</div>
                        <div className="flex">
                          <a
                            target="_blank"
                            href={`https://dexscreener.com/solana/${token.tokenAddress}`}
                            className="text-[#858585] hover:underline cursor-pointer"
                          >
                            {formatWallet(token.tokenAddress)}
                          </a>
                          <a
                            target="_blank"
                            href={`https://x.com/search?q=${token.tokenAddress}`}
                            className="ml-3 hover:text-[#696969] text-[#858585]  "
                          >
                            <FontAwesomeIcon icon={faXTwitter} />
                          </a>
                          <div
                            onClick={() => copyAddress(token.tokenAddress)}
                            className="ml-2 mt-[3px] hover:text-[#696969] text-[#858585] cursor-pointer"
                          >
                            {copiedToken === token.tokenAddress ? (
                              <FiCheck />
                            ) : (
                              <FiCopy />
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="  flex items-center space-x-2 wdefinedxl:space-x-4 w1600:space-x-10">
                    <div className="text-sm items-center  text-right  w-28">
                      <div className="font-semibold  mr-2  lg:text-lg text-base">
                        {formatHold(token.tradeTime)}
                      </div>
                    </div>
                    <div className="text-sm items-center  text-right  w-16">
                      <div className="font-semibold  mr-2  lg:text-lg text-base">
                        {formatMc(token.marketCap)}
                      </div>
                    </div>
                    <div className="text-sm text-right h-full  w-24  items-end ">
                      <div className="items-center mr-2">
                        <div className="flex items-center justify-end  ">
                          <div className="font-semibold text-sm lg:text-base mr-1  ">
                            {formatSOL(token.invested)}
                          </div>
                          <div className=" mb-[2px]">
                            <Image
                              className="hidden lg:flex "
                              src="/solana.svg"
                              alt="x logo"
                              width={13}
                              height={13}
                              priority
                            />
                            <Image
                              className=" lg:hidden "
                              src="/solana.svg"
                              alt="x logo"
                              width={11}
                              height={11}
                              priority
                            />
                          </div>
                        </div>
                        <div className="text-[#858585] text-xs lg:text-sm mt-[-2px]">
                          {formatDollar(token.invested * solPrice)}
                        </div>
                      </div>
                    </div>

                    <div className="text-sm text-right h-full  w-36  items-end ">
                      <div className="items-center mr-2">
                        <div className="flex items-center justify-end  ">
                          <div className="font-semibold text-sm lg:text-base mr-1 text-[#59CC6C] ">
                            {"+" + formatSOL(token.realizedPnlSol)}
                          </div>
                          <div className=" mb-[2px]">
                            <Image
                              className="hidden lg:flex "
                              src="/solana.svg"
                              alt="x logo"
                              width={13}
                              height={13}
                              priority
                            />
                            <Image
                              className=" lg:hidden "
                              src="/solana.svg"
                              alt="x logo"
                              width={11}
                              height={11}
                              priority
                            />
                          </div>
                        </div>
                        <div className="text-[#858585] text-xs lg:text-sm mt-[-2px]">
                          {formatDollar(token.realizedPnlSol * solPrice)}
                        </div>
                      </div>
                    </div>
                    <div className="text-sm items-center  text-right w-16  ">
                      <div className="font-semibold text-base lg:text-lg mr-2 text-[#59CC6C] ">
                        {Math.round(
                          (token.realizedPnlSol * 100) / token.invested
                        ) + "%"}
                      </div>
                    </div>
                    <div className="text-sm items-center  text-right w-20  flex justify-end">
                      <div className="font-semibold text-base lg:text-lg mr-1 text-[#59CC6C] ">
                        {token.buyTransactions}
                      </div>
                      <div className="font-semibold text-base lg:text-lg mr-1 text-[#858585]">
                        /
                      </div>
                      <div className="font-semibold text-base lg:text-lg mr-2 text-[#CC5959] ">
                        {token.sellTransactions}
                      </div>
                    </div>
                    <div className="text-sm text-right h-full  w-24  items-end ">
                      <div className="items-center mr-2">
                        <div className="flex items-center justify-end  ">
                          <div className="font-semibold text-sm lg:text-base mr-1  ">
                            {formatSOL(token.holding)}
                          </div>
                          <div className=" mb-[2px]">
                            <Image
                              className="hidden lg:flex "
                              src="/solana.svg"
                              alt="x logo"
                              width={13}
                              height={13}
                              priority
                            />
                            <Image
                              className=" lg:hidden "
                              src="/solana.svg"
                              alt="x logo"
                              width={11}
                              height={11}
                              priority
                            />
                          </div>
                        </div>
                        <div className="text-[#858585] text-xs lg:text-sm mt-[-2px]">
                          {formatDollar(token.holding * solPrice)}
                        </div>
                      </div>
                    </div>
                    <div className="text-sm items-center  text-right   w-24">
                      <div className="font-semibold text-base lg:text-lg mr-2">
                        {formatMc(token.avgBuy)}
                      </div>
                    </div>
                    <div className="text-sm items-center  text-right   w-24">
                      <div className="font-semibold text-base lg:text-lg mr-2">
                        {formatMc(token.avgSell)}
                      </div>
                    </div>
                    <div className="text-sm items-center  text-right   w-20">
                      <div className="font-semibold text-base lg:text-lg mr-2">
                        {formatHold(token.held)}
                      </div>
                    </div>
                    <div className="min-w-12 ml-6 flex    justify-end text-xl cursor-pointer hover:text-[#d105fb]">
                      <div className="mr-2 items-center">
                        <CiShare1 />
                      </div>{" "}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-96   text-2xl bg-[#12121c]"></div>
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
      </div>
      {/* Render the overlay and non-dismissible connect modal on top if wallet is not connected */}
      {isMounted && !walletConnected && showModal && (
        <ConnectModalNonDismissable />
      )}
      <MobileMenu
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
        hamburgerRef={hamburgerRef}
      />
    </div>
  );
}

function createFallbackTrader(wallet) {
  return {
    profilePhoto: "orangie.png",
    followers: "N/A",
    twitterHandle: "handle",
    traderName: "Trader Name",
    traderWallet: wallet,
    tradeTime: "N/A",
    timeframes: {
      daily: {
        tokens: "N/A",
        winRate: "N/A",
        winningTrades: "N/A",
        losingTrades: "N/A",
        avgBuySol: "N/A",
        avgEntry: "N/A",
        avgHoldMinutes: "N/A",
        realizedPnlSol: "N/A",
        totalInvested: "N/A",
      },
      weekly: {
        tokens: "N/A",
        winRate: "N/A",
        winningTrades: "N/A",
        losingTrades: "N/A",
        avgBuySol: "N/A",
        avgEntry: "N/A",
        avgHoldMinutes: "N/A",
        realizedPnlSol: "N/A",
        totalInvested: "N/A",
      },
      monthly: {
        tokens: "N/A",
        winRate: "N/A",
        winningTrades: "N/A",
        losingTrades: "N/A",
        avgBuySol: "N/A",
        avgEntry: "N/A",
        avgHoldMinutes: "N/A",
        realizedPnlSol: "N/A",
        totalInvested: "N/A",
      },
      allTime: {
        tokens: "N/A",
        winRate: "N/A",
        winningTrades: "N/A",
        losingTrades: "N/A",
        avgBuySol: "N/A",
        avgEntry: "N/A",
        avgHoldMinutes: "N/A",
        realizedPnlSol: "N/A",
        totalInvested: "N/A",
      },
    },
    tokens: {
      daily: [],
      weekly: [],
      monthly: [],
      allTime: [],
    },
  };
}
