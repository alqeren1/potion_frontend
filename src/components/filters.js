import { useState, useRef, useEffect } from "react";

export default function Filters({ onFilterChange }) {
  const [isOpen, setIsOpen] = useState(false);

  // Local states for each range input pair.
  // Numeric-only: Realized, ROI, Holding, Invested, Winning/Losing Trades
  // MC, AvgBuy, AvgSell must end with K/M/B
  // Held must end with m/h
  const [realizedFrom, setRealizedFrom] = useState("");
  const [realizedTo, setRealizedTo] = useState("");

  const [roiFrom, setRoiFrom] = useState("");
  const [roiTo, setRoiTo] = useState("");

  const [entryFrom, setEntryFrom] = useState("");
  const [entryTo, setEntryTo] = useState("");

  const [holdingFrom, setHoldingFrom] = useState("");
  const [holdingTo, setHoldingTo] = useState("");

  const [tokensFrom, setTokensFrom] = useState("");
  const [tokensTo, setTokensTo] = useState("");

  const [avgBuyFrom, setAvgBuyFrom] = useState("");
  const [avgBuyTo, setAvgBuyTo] = useState("");

  const [followersFrom, setFollowersFrom] = useState("");
  const [followersTo, setFollowersTo] = useState("");

  const [winningTradesFrom, setWinningTradesFrom] = useState("");
  const [winningTradesTo, setWinningTradesTo] = useState("");

  const [losingTradesFrom, setLosingTradesFrom] = useState("");
  const [losingTradesTo, setLosingTradesTo] = useState("");

  const [heldFrom, setHeldFrom] = useState("");
  const [heldTo, setHeldTo] = useState("");

  // Count how many filters are in use (non-empty)
  const filterCount = [
    [realizedFrom, realizedTo],
    [roiFrom, roiTo],
    [entryFrom, entryTo],
    [holdingFrom, holdingTo],
    [tokensFrom, tokensTo],
    [avgBuyFrom, avgBuyTo],
    [followersFrom, followersTo],
    [winningTradesFrom, winningTradesTo],
    [losingTradesFrom, losingTradesTo],
    [heldFrom, heldTo],
  ].filter(
    ([fromVal, toVal]) => fromVal.trim() !== "" || toVal.trim() !== ""
  ).length;

  const buttonRef = useRef(null);
  const menuRefDesktop = useRef(null);
  const menuRefMobile = useRef(null);

  const handleClickTraders = () => {
    setIsOpen((prev) => !prev);
  };
  const resetFilters = () => {
    setRealizedFrom("");
    setRealizedTo("");
    setRoiFrom("");
    setRoiTo("");
    setEntryFrom("");
    setEntryTo("");
    setHoldingFrom("");
    setHoldingTo("");
    setTokensFrom("");
    setTokensTo("");
    setAvgBuyFrom("");
    setAvgBuyTo("");
    setFollowersFrom("");
    setFollowersTo("");
    setWinningTradesFrom("");
    setWinningTradesTo("");
    setLosingTradesFrom("");
    setLosingTradesTo("");
    setHeldFrom("");
    setHeldTo("");
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        buttonRef.current &&
        !buttonRef.current.contains(event.target) &&
        menuRefDesktop.current &&
        !menuRefDesktop.current.contains(event.target) &&
        menuRefMobile.current &&
        !menuRefMobile.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // On mount, load saved filters from localStorage
  useEffect(() => {
    const savedFilters = localStorage.getItem("filters2");
    if (savedFilters) {
      const filters = JSON.parse(savedFilters);
      if (filters.realizedFrom) setRealizedFrom(filters.realizedFrom);
      if (filters.realizedTo) setRealizedTo(filters.realizedTo);
      if (filters.roiFrom) setRoiFrom(filters.roiFrom);
      if (filters.roiTo) setRoiTo(filters.roiTo);
      if (filters.entryFrom) setEntryFrom(filters.entryFrom);
      if (filters.entryTo) setEntryTo(filters.entryTo);
      if (filters.holdingFrom) setHoldingFrom(filters.holdingFrom);
      if (filters.holdingTo) setHoldingTo(filters.holdingTo);
      if (filters.tokensFrom) setTokensFrom(filters.tokensFrom);
      if (filters.tokensTo) setTokensTo(filters.tokensTo);
      if (filters.avgBuyFrom) setAvgBuyFrom(filters.avgBuyFrom);
      if (filters.avgBuyTo) setAvgBuyTo(filters.avgBuyTo);
      if (filters.followersFrom) setFollowersFrom(filters.followersFrom);
      if (filters.followersTo) setFollowersTo(filters.followersTo);
      if (filters.winningTradesFrom)
        setWinningTradesFrom(filters.winningTradesFrom);
      if (filters.winningTradesTo) setWinningTradesTo(filters.winningTradesTo);
      if (filters.losingTradesFrom)
        setLosingTradesFrom(filters.losingTradesFrom);
      if (filters.losingTradesTo) setLosingTradesTo(filters.losingTradesTo);
      if (filters.heldFrom) setHeldFrom(filters.heldFrom);
      if (filters.heldTo) setHeldTo(filters.heldTo);
    }
  }, []);

  // Save filters to localStorage whenever any filter changes
  useEffect(() => {
    const filters = {
      realizedFrom,
      realizedTo,
      roiFrom,
      roiTo,
      entryFrom,
      entryTo,
      holdingFrom,
      holdingTo,
      tokensFrom,
      tokensTo,
      avgBuyFrom,
      avgBuyTo,
      followersFrom,
      followersTo,
      winningTradesFrom,
      winningTradesTo,
      losingTradesFrom,
      losingTradesTo,
      heldFrom,
      heldTo,
    };
    localStorage.setItem("filters2", JSON.stringify(filters));
    // <-- New: Notify parent of filter changes
    if (typeof onFilterChange === "function") {
      onFilterChange(filters);
    }
  }, [
    realizedFrom,
    realizedTo,
    roiFrom,
    roiTo,
    entryFrom,
    entryTo,
    holdingFrom,
    holdingTo,
    tokensFrom,
    tokensTo,
    avgBuyFrom,
    avgBuyTo,
    followersFrom,
    followersTo,
    winningTradesFrom,
    winningTradesTo,
    losingTradesFrom,
    losingTradesTo,
    heldFrom,
    heldTo,
  ]);

  // Helpers to enforce pattern for MC/AvgBuy/AvgSell and Held
  const handleMcChange = (setter) => (e) => {
    const value = e.target.value.toUpperCase();
    // must start with number, end with K/M/B, or be empty
    // pattern: ^\d+(K|M|B)?$

    if (!value || /^[0-9]+[KMB]?$/.test(value)) {
      setter(value);
    }
  };

  const handleHeldChange = (setter) => (e) => {
    const value = e.target.value;
    // must start with number, end with m/h, or be empty
    // pattern: ^\d+(m|h)?$
    if (!value || /^[0-9]+[mh]?$/.test(value)) {
      setter(value);
    }
  };

  // Numeric-only inputs can be type="number"
  // MC, AvgBuy, AvgSell => text with the handleMcChange
  // Held => text with handleHeldChange

  return (
    <div className="relative inline-block  ">
      <div className="flex">
        <div
          ref={buttonRef}
          onClick={handleClickTraders}
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
          {/* Only show the bubble if filterCount > 0 */}
          {filterCount > 0 && (
            <div className="absolute w-5 h-5 bg-[#AA00FF] font-semibold flex items-center justify-center rounded-full ml-5 mt-[-7px] text-white text-sm">
              <div className="mt-[2px]">{filterCount}</div>
            </div>
          )}
        </div>
      </div>

      {/* Desktop Filters Panel */}
      <div
        ref={menuRefDesktop}
        className={`
          hidden md:block
          fixed top-0 right-0
          h-screen w-[500px]
          bg-[#1c1b29] text-white font-semibold
          border-l border-[#464558]
          shadow-lg z-[999]
          transform transition-transform duration-300
          ${isOpen ? "translate-x-0" : "translate-x-full"}
        `}
        style={{ transformOrigin: "top" }}
      >
        <div className="pointer-events-none absolute top-0 left-0 w-full h-16 rounded-t-2xl bg-gradient-to-b from-[#1c1b29] to-transparent" />

        <div className="h-screen overflow-y-auto custom-scrollbar pt-4">
          {/* Realized PNL (numeric) */}
          <div className="">
            <div className="flex justify-between items-center px-4 mt-6  mb-1">
              <div className=" font-semibold flex text-white w-auto">
                Realized PNL
              </div>{" "}
              <div
                onClick={resetFilters}
                className="  font-light hover:underline cursor-pointer flex text-white  w-auto"
              >
                Reset
              </div>{" "}
            </div>
            <div className="w-full px-3 flex justify-center">
              <div className="flex w-full items-center space-x-4">
                <input
                  type="number"
                  placeholder="SOL"
                  value={realizedFrom}
                  onChange={(e) => setRealizedFrom(e.target.value)}
                  className="w-full h-8 rounded-3xl border-[1px] border-[#464558] bg-transparent text-white px-3
                             focus:outline-none focus:ring-2 focus:ring-[#AA00FF]"
                />
                <div>to</div>
                <input
                  type="number"
                  placeholder="SOL"
                  value={realizedTo}
                  onChange={(e) => setRealizedTo(e.target.value)}
                  className="w-full h-8 rounded-3xl border-[1px] border-[#464558] bg-transparent text-white px-3
                             focus:outline-none focus:ring-2 focus:ring-[#AA00FF]"
                />
              </div>
            </div>
            <div className="border-b mt-4 border-[#464558]" />
          </div>
          {/* Avg Buy (must end with K/M/B) */}
          <div className="">
            <div className="px-4 mt-4 mb-1 font-semibold flex text-white rounded-3xl w-auto">
              Avg Buy
            </div>
            <div className="w-full px-3 flex justify-center">
              <div className="flex w-full items-center space-x-4">
                <input
                  type="number"
                  value={avgBuyFrom}
                  onChange={(e) => setAvgBuyFrom(e.target.value)}
                  placeholder="SOL"
                  className="w-full h-8 rounded-3xl border-[1px] border-[#464558] bg-transparent text-white px-3
                             focus:outline-none focus:ring-2 focus:ring-[#AA00FF]"
                />
                <div>to</div>
                <input
                  type="number"
                  value={avgBuyTo}
                  onChange={(e) => setAvgBuyTo(e.target.value)}
                  placeholder="SOL"
                  className="w-full h-8 rounded-3xl border-[1px] border-[#464558] bg-transparent text-white px-3
                             focus:outline-none focus:ring-2 focus:ring-[#AA00FF]"
                />
              </div>
            </div>
            <div className="border-b mt-4 border-[#464558]" />
          </div>

          {/* ROI (numeric) */}
          <div className="">
            <div className="px-4 mt-4 mb-1 font-semibold flex text-white rounded-3xl w-auto">
              Win Rate
            </div>
            <div className="w-full px-3 flex justify-center">
              <div className="flex w-full items-center space-x-4">
                <input
                  type="number"
                  placeholder="e.g. 70"
                  value={roiFrom}
                  onChange={(e) => setRoiFrom(e.target.value)}
                  className="w-full h-8 rounded-3xl border-[1px] border-[#464558] bg-transparent text-white px-3 
                             focus:outline-none focus:ring-2 focus:ring-[#AA00FF]"
                />
                <div>to</div>
                <input
                  type="number"
                  placeholder="e.g. 80"
                  value={roiTo}
                  onChange={(e) => setRoiTo(e.target.value)}
                  className="w-full h-8 rounded-3xl border-[1px] border-[#464558] bg-transparent text-white px-3 
                             focus:outline-none focus:ring-2 focus:ring-[#AA00FF]"
                />
              </div>
            </div>
            <div className="border-b mt-4 border-[#464558]" />
          </div>

          {/* MC (must end with K/M/B) */}
          <div className="">
            <div className="px-4 mt-4 mb-1 font-semibold flex text-white rounded-3xl w-auto">
              Avg Entry
            </div>
            <div className="w-full px-3 flex justify-center">
              <div className="flex w-full items-center space-x-4">
                <input
                  type="text"
                  value={entryFrom}
                  onChange={handleMcChange(setEntryFrom)}
                  placeholder="e.g. 10K"
                  className="w-full h-8 rounded-3xl border-[1px] border-[#464558] bg-transparent text-white px-3
                             focus:outline-none focus:ring-2 focus:ring-[#AA00FF]"
                />
                <div>to</div>
                <input
                  type="text"
                  value={entryTo}
                  onChange={handleMcChange(setEntryTo)}
                  placeholder="e.g. 100M"
                  className="w-full h-8 rounded-3xl border-[1px] border-[#464558] bg-transparent text-white px-3
                             focus:outline-none focus:ring-2 focus:ring-[#AA00FF]"
                />
              </div>
            </div>
            <div className="border-b mt-4 border-[#464558]" />
          </div>

          {/* Holding   */}
          <div className="">
            <div className="px-4 mt-4 mb-1 font-semibold flex text-white rounded-3xl w-auto">
              Avg Hold
            </div>
            <div className="w-full px-3 flex justify-center">
              <div className="flex w-full items-center space-x-4">
                <input
                  type="text"
                  placeholder="e.g. 10m"
                  value={holdingFrom}
                  onChange={handleHeldChange(setHoldingFrom)}
                  className="w-full h-8 rounded-3xl border-[1px] border-[#464558] bg-transparent text-white px-3 
                             focus:outline-none focus:ring-2 focus:ring-[#AA00FF]"
                />
                <div>to</div>
                <input
                  type="text"
                  placeholder="e.g. 24h"
                  value={holdingTo}
                  onChange={handleHeldChange(setHoldingTo)}
                  className="w-full h-8 rounded-3xl border-[1px] border-[#464558] bg-transparent text-white px-3 
                             focus:outline-none focus:ring-2 focus:ring-[#AA00FF]"
                />
              </div>
            </div>
            <div className="border-b mt-4 border-[#464558]" />
          </div>
          {/* Winning Trades (numeric) */}
          <div className="">
            <div className="px-4 mt-4 mb-1 font-semibold flex text-white rounded-3xl w-auto">
              Winning Trades
            </div>
            <div className="w-full px-3 flex justify-center">
              <div className="flex w-full items-center space-x-4">
                <input
                  type="number"
                  placeholder="e.g. 100"
                  value={winningTradesFrom}
                  onChange={(e) => setWinningTradesFrom(e.target.value)}
                  className="w-full h-8 rounded-3xl border-[1px] border-[#464558] bg-transparent text-white px-3
                             focus:outline-none focus:ring-2 focus:ring-[#AA00FF]"
                />
                <div>to</div>
                <input
                  type="number"
                  placeholder="e.g. 200"
                  value={winningTradesTo}
                  onChange={(e) => setWinningTradesTo(e.target.value)}
                  className="w-full h-8 rounded-3xl border-[1px] border-[#464558] bg-transparent text-white px-3
                             focus:outline-none focus:ring-2 focus:ring-[#AA00FF]"
                />
              </div>
            </div>
            <div className="border-b mt-4 border-[#464558]" />
          </div>

          {/* Losing Trades (numeric) */}
          <div className="">
            <div className="px-4 mt-4 mb-1 font-semibold flex text-white rounded-3xl w-auto">
              Losing Trades
            </div>
            <div className="w-full px-3 flex justify-center">
              <div className="flex w-full items-center space-x-4">
                <input
                  type="number"
                  placeholder="e.g. 100"
                  value={losingTradesFrom}
                  onChange={(e) => setLosingTradesFrom(e.target.value)}
                  className="w-full h-8 rounded-3xl border-[1px] border-[#464558] bg-transparent text-white px-3
                             focus:outline-none focus:ring-2 focus:ring-[#AA00FF]"
                />
                <div>to</div>
                <input
                  type="number"
                  placeholder="e.g. 200"
                  value={losingTradesTo}
                  onChange={(e) => setLosingTradesTo(e.target.value)}
                  className="w-full h-8 rounded-3xl border-[1px] border-[#464558] bg-transparent text-white px-3
                             focus:outline-none focus:ring-2 focus:ring-[#AA00FF]"
                />
              </div>
            </div>
            <div className="border-b mt-4 border-[#464558]" />
          </div>

          {/* Invested (numeric) */}
          <div className="">
            <div className="px-4 mt-4 mb-1 font-semibold flex text-white rounded-3xl w-auto">
              Tokens
            </div>
            <div className="w-full px-3 flex justify-center">
              <div className="flex w-full items-center space-x-4">
                <input
                  type="number"
                  placeholder="e.g. 10"
                  value={tokensFrom}
                  onChange={(e) => setTokensFrom(e.target.value)}
                  className="w-full h-8 rounded-3xl border-[1px] border-[#464558] bg-transparent text-white px-3 
                             focus:outline-none focus:ring-2 focus:ring-[#AA00FF]"
                />
                <div>to</div>
                <input
                  type="number"
                  placeholder="e.g. 30"
                  value={tokensTo}
                  onChange={(e) => setTokensTo(e.target.value)}
                  className="w-full h-8 rounded-3xl border-[1px] border-[#464558] bg-transparent text-white px-3 
                             focus:outline-none focus:ring-2 focus:ring-[#AA00FF]"
                />
              </div>
            </div>
            <div className="border-b mt-4 border-[#464558]" />
          </div>

          {/* Avg Sell (must end with K/M/B) */}
          <div className="">
            <div className="px-4 mt-4 mb-1 font-semibold flex text-white rounded-3xl w-auto">
              Followers
            </div>
            <div className="w-full px-3 mb-14 flex justify-center">
              <div className="flex w-full items-center space-x-4">
                <input
                  type="text"
                  value={followersFrom}
                  onChange={handleMcChange(setFollowersFrom)}
                  placeholder="e.g. 30K"
                  className="w-full h-8 rounded-3xl border-[1px] border-[#464558] bg-transparent text-white px-3 
                             focus:outline-none focus:ring-2 focus:ring-[#AA00FF]"
                />
                <div>to</div>
                <input
                  type="text"
                  value={followersTo}
                  onChange={handleMcChange(setFollowersTo)}
                  placeholder="e.g. 1M"
                  className="w-full h-8 rounded-3xl border-[1px] border-[#464558] bg-transparent text-white px-3 
                             focus:outline-none focus:ring-2 focus:ring-[#AA00FF]"
                />
              </div>
            </div>
            <div className="border-b mt-4 border-[#464558]" />
          </div>
        </div>
        <div className="pointer-events-none absolute bottom-0 left-0 w-full h-10 rounded-b-2xl bg-gradient-to-t from-[#1c1b29] to-transparent" />
      </div>

      {/* Mobile Filters Modal */}
      <div
        ref={menuRefMobile}
        className={`
    fixed bottom-0 left-0 w-screen h-3/5 rounded-t-2xl md:hidden px-2
    border-[1px] border-[#464558] mt-2 bg-[#1c1b29] 
    shadow-lg text-white font-semibold text-left transform transition-transform duration-200
    ${isOpen ? "translate-y-0" : "translate-y-full"}
  `}
        style={{ transformOrigin: "bottom" }}
      >
        <div className="absolute top-0 left-0 w-full h-16 rounded-t-2xl bg-gradient-to-b from-[#1c1b29] to-transparent pointer-events-none" />

        <div className="h-full overflow-y-auto custom-scrollbar pt-4">
          {/* Realized PNL (numeric) */}
          <div className="">
            <div className="flex justify-between items-center px-4 mt-6  mb-1">
              <div className=" font-semibold flex text-white w-auto">
                Realized PNL
              </div>{" "}
              <div
                onClick={resetFilters}
                className="  font-light hover:underline cursor-pointer flex text-white  w-auto"
              >
                Reset
              </div>{" "}
            </div>
            <div className="w-full px-3 flex justify-center">
              <div className="flex w-full items-center space-x-4">
                <input
                  type="number"
                  placeholder="SOL"
                  value={realizedFrom}
                  onChange={(e) => setRealizedFrom(e.target.value)}
                  className="w-full h-8 rounded-3xl border-[1px] border-[#464558] bg-transparent text-white px-3
                             focus:outline-none focus:ring-2 focus:ring-[#AA00FF]"
                />
                <div>to</div>
                <input
                  type="number"
                  placeholder="SOL"
                  value={realizedTo}
                  onChange={(e) => setRealizedTo(e.target.value)}
                  className="w-full h-8 rounded-3xl border-[1px] border-[#464558] bg-transparent text-white px-3
                             focus:outline-none focus:ring-2 focus:ring-[#AA00FF]"
                />
              </div>
            </div>
            <div className="border-b mt-4 border-[#464558]" />
          </div>
          {/* Avg Buy (must end with K/M/B) */}
          <div className="">
            <div className="px-4 mt-4 mb-1 font-semibold flex text-white rounded-3xl w-auto">
              Avg Buy
            </div>
            <div className="w-full px-3 flex justify-center">
              <div className="flex w-full items-center space-x-4">
                <input
                  type="number"
                  value={avgBuyFrom}
                  onChange={(e) => setAvgBuyFrom(e.target.value)}
                  placeholder="SOL"
                  className="w-full h-8 rounded-3xl border-[1px] border-[#464558] bg-transparent text-white px-3
                             focus:outline-none focus:ring-2 focus:ring-[#AA00FF]"
                />
                <div>to</div>
                <input
                  type="number"
                  value={avgBuyTo}
                  onChange={(e) => setAvgBuyTo(e.target.value)}
                  placeholder="SOL"
                  className="w-full h-8 rounded-3xl border-[1px] border-[#464558] bg-transparent text-white px-3
                             focus:outline-none focus:ring-2 focus:ring-[#AA00FF]"
                />
              </div>
            </div>
            <div className="border-b mt-4 border-[#464558]" />
          </div>

          {/* ROI (numeric) */}
          <div className="">
            <div className="px-4 mt-4 mb-1 font-semibold flex text-white rounded-3xl w-auto">
              Win Rate
            </div>
            <div className="w-full px-3 flex justify-center">
              <div className="flex w-full items-center space-x-4">
                <input
                  type="number"
                  placeholder="e.g. 70"
                  value={roiFrom}
                  onChange={(e) => setRoiFrom(e.target.value)}
                  className="w-full h-8 rounded-3xl border-[1px] border-[#464558] bg-transparent text-white px-3 
                             focus:outline-none focus:ring-2 focus:ring-[#AA00FF]"
                />
                <div>to</div>
                <input
                  type="number"
                  placeholder="e.g. 80"
                  value={roiTo}
                  onChange={(e) => setRoiTo(e.target.value)}
                  className="w-full h-8 rounded-3xl border-[1px] border-[#464558] bg-transparent text-white px-3 
                             focus:outline-none focus:ring-2 focus:ring-[#AA00FF]"
                />
              </div>
            </div>
            <div className="border-b mt-4 border-[#464558]" />
          </div>

          {/* MC (must end with K/M/B) */}
          <div className="">
            <div className="px-4 mt-4 mb-1 font-semibold flex text-white rounded-3xl w-auto">
              Avg Entry
            </div>
            <div className="w-full px-3 flex justify-center">
              <div className="flex w-full items-center space-x-4">
                <input
                  type="text"
                  value={entryFrom}
                  onChange={handleMcChange(setEntryFrom)}
                  placeholder="e.g. 10K"
                  className="w-full h-8 rounded-3xl border-[1px] border-[#464558] bg-transparent text-white px-3
                             focus:outline-none focus:ring-2 focus:ring-[#AA00FF]"
                />
                <div>to</div>
                <input
                  type="text"
                  value={entryTo}
                  onChange={handleMcChange(setEntryTo)}
                  placeholder="e.g. 100M"
                  className="w-full h-8 rounded-3xl border-[1px] border-[#464558] bg-transparent text-white px-3
                             focus:outline-none focus:ring-2 focus:ring-[#AA00FF]"
                />
              </div>
            </div>
            <div className="border-b mt-4 border-[#464558]" />
          </div>

          {/* Holding   */}
          <div className="">
            <div className="px-4 mt-4 mb-1 font-semibold flex text-white rounded-3xl w-auto">
              Avg Hold
            </div>
            <div className="w-full px-3 flex justify-center">
              <div className="flex w-full items-center space-x-4">
                <input
                  type="text"
                  placeholder="e.g. 10m"
                  value={holdingFrom}
                  onChange={handleHeldChange(setHoldingFrom)}
                  className="w-full h-8 rounded-3xl border-[1px] border-[#464558] bg-transparent text-white px-3 
                             focus:outline-none focus:ring-2 focus:ring-[#AA00FF]"
                />
                <div>to</div>
                <input
                  type="text"
                  placeholder="e.g. 24h"
                  value={holdingTo}
                  onChange={handleHeldChange(setHoldingTo)}
                  className="w-full h-8 rounded-3xl border-[1px] border-[#464558] bg-transparent text-white px-3 
                             focus:outline-none focus:ring-2 focus:ring-[#AA00FF]"
                />
              </div>
            </div>
            <div className="border-b mt-4 border-[#464558]" />
          </div>
          {/* Winning Trades (numeric) */}
          <div className="">
            <div className="px-4 mt-4 mb-1 font-semibold flex text-white rounded-3xl w-auto">
              Winning Trades
            </div>
            <div className="w-full px-3 flex justify-center">
              <div className="flex w-full items-center space-x-4">
                <input
                  type="number"
                  placeholder="e.g. 100"
                  value={winningTradesFrom}
                  onChange={(e) => setWinningTradesFrom(e.target.value)}
                  className="w-full h-8 rounded-3xl border-[1px] border-[#464558] bg-transparent text-white px-3
                             focus:outline-none focus:ring-2 focus:ring-[#AA00FF]"
                />
                <div>to</div>
                <input
                  type="number"
                  placeholder="e.g. 200"
                  value={winningTradesTo}
                  onChange={(e) => setWinningTradesTo(e.target.value)}
                  className="w-full h-8 rounded-3xl border-[1px] border-[#464558] bg-transparent text-white px-3
                             focus:outline-none focus:ring-2 focus:ring-[#AA00FF]"
                />
              </div>
            </div>
            <div className="border-b mt-4 border-[#464558]" />
          </div>

          {/* Losing Trades (numeric) */}
          <div className="">
            <div className="px-4 mt-4 mb-1 font-semibold flex text-white rounded-3xl w-auto">
              Losing Trades
            </div>
            <div className="w-full px-3 flex justify-center">
              <div className="flex w-full items-center space-x-4">
                <input
                  type="number"
                  placeholder="e.g. 100"
                  value={losingTradesFrom}
                  onChange={(e) => setLosingTradesFrom(e.target.value)}
                  className="w-full h-8 rounded-3xl border-[1px] border-[#464558] bg-transparent text-white px-3
                             focus:outline-none focus:ring-2 focus:ring-[#AA00FF]"
                />
                <div>to</div>
                <input
                  type="number"
                  placeholder="e.g. 200"
                  value={losingTradesTo}
                  onChange={(e) => setLosingTradesTo(e.target.value)}
                  className="w-full h-8 rounded-3xl border-[1px] border-[#464558] bg-transparent text-white px-3
                             focus:outline-none focus:ring-2 focus:ring-[#AA00FF]"
                />
              </div>
            </div>
            <div className="border-b mt-4 border-[#464558]" />
          </div>

          {/* Invested (numeric) */}
          <div className="">
            <div className="px-4 mt-4 mb-1 font-semibold flex text-white rounded-3xl w-auto">
              Tokens
            </div>
            <div className="w-full px-3 flex justify-center">
              <div className="flex w-full items-center space-x-4">
                <input
                  type="number"
                  placeholder="e.g. 10"
                  value={tokensFrom}
                  onChange={(e) => setTokensFrom(e.target.value)}
                  className="w-full h-8 rounded-3xl border-[1px] border-[#464558] bg-transparent text-white px-3 
                             focus:outline-none focus:ring-2 focus:ring-[#AA00FF]"
                />
                <div>to</div>
                <input
                  type="number"
                  placeholder="e.g. 30"
                  value={tokensTo}
                  onChange={(e) => setTokensTo(e.target.value)}
                  className="w-full h-8 rounded-3xl border-[1px] border-[#464558] bg-transparent text-white px-3 
                             focus:outline-none focus:ring-2 focus:ring-[#AA00FF]"
                />
              </div>
            </div>
            <div className="border-b mt-4 border-[#464558]" />
          </div>

          {/* Avg Sell (must end with K/M/B) */}
          <div className="">
            <div className="px-4 mt-4 mb-1 font-semibold flex text-white rounded-3xl w-auto">
              Followers
            </div>
            <div className="w-full px-3 mb-14 flex justify-center">
              <div className="flex w-full items-center space-x-4">
                <input
                  type="text"
                  value={followersFrom}
                  onChange={handleMcChange(setFollowersFrom)}
                  placeholder="e.g. 30K"
                  className="w-full h-8 rounded-3xl border-[1px] border-[#464558] bg-transparent text-white px-3 
                             focus:outline-none focus:ring-2 focus:ring-[#AA00FF]"
                />
                <div>to</div>
                <input
                  type="text"
                  value={followersTo}
                  onChange={handleMcChange(setFollowersTo)}
                  placeholder="e.g. 1M"
                  className="w-full h-8 rounded-3xl border-[1px] border-[#464558] bg-transparent text-white px-3 
                             focus:outline-none focus:ring-2 focus:ring-[#AA00FF]"
                />
              </div>
            </div>
            <div className="border-b mt-4 border-[#464558]" />
          </div>
        </div>

        <div className="absolute bottom-0 left-0 w-full h-10 rounded-b-2xl bg-gradient-to-t from-[#1c1b29] to-transparent pointer-events-none" />
      </div>
    </div>
  );
}
