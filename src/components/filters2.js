import { useState, useRef, useEffect } from "react";

export default function Filters2({ onFilterChange }) {
  const [isOpen, setIsOpen] = useState(false);

  // Local states for each range input pair.
  // Numeric-only: Realized, ROI, Holding, Invested, Winning/Losing Trades
  // MC, AvgBuy, AvgSell must end with K/M/B and Held must end with m/h
  const [realizedFrom, setRealizedFrom] = useState("");
  const [realizedTo, setRealizedTo] = useState("");

  const [roiFrom, setRoiFrom] = useState("");
  const [roiTo, setRoiTo] = useState("");

  const [mcFrom, setMcFrom] = useState("");
  const [mcTo, setMcTo] = useState("");

  const [holdingFrom, setHoldingFrom] = useState("");
  const [holdingTo, setHoldingTo] = useState("");

  const [investedFrom, setInvestedFrom] = useState("");
  const [investedTo, setInvestedTo] = useState("");

  const [avgBuyFrom, setAvgBuyFrom] = useState("");
  const [avgBuyTo, setAvgBuyTo] = useState("");

  const [avgSellFrom, setAvgSellFrom] = useState("");
  const [avgSellTo, setAvgSellTo] = useState("");

  const [winningTradesFrom, setWinningTradesFrom] = useState("");
  const [winningTradesTo, setWinningTradesTo] = useState("");

  const [losingTradesFrom, setLosingTradesFrom] = useState("");
  const [losingTradesTo, setLosingTradesTo] = useState("");

  const [heldFrom, setHeldFrom] = useState("");
  const [heldTo, setHeldTo] = useState("");

  // Count how many filters are in use
  const filterCount = [
    [realizedFrom, realizedTo],
    [roiFrom, roiTo],
    [mcFrom, mcTo],
    [holdingFrom, holdingTo],
    [investedFrom, investedTo],
    [avgBuyFrom, avgBuyTo],
    [avgSellFrom, avgSellTo],
    [winningTradesFrom, winningTradesTo],
    [losingTradesFrom, losingTradesTo],
    [heldFrom, heldTo],
  ].filter(
    ([fromVal, toVal]) => fromVal.trim() !== "" || toVal.trim() !== ""
  ).length;

  const buttonRef = useRef(null);
  const menuRefMobile = useRef(null);
  const menuRefDesktop = useRef(null);

  const handleClickTraders = () => {
    setIsOpen((prev) => !prev);
  };

  const resetFilters = () => {
    setRealizedFrom("");
    setRealizedTo("");
    setRoiFrom("");
    setRoiTo("");
    setMcFrom("");
    setMcTo("");
    setHoldingFrom("");
    setHoldingTo("");
    setInvestedFrom("");
    setInvestedTo("");
    setAvgBuyFrom("");
    setAvgBuyTo("");
    setAvgSellFrom("");
    setAvgSellTo("");

    setWinningTradesFrom("");
    setWinningTradesTo("");

    setLosingTradesFrom("");
    setLosingTradesTo("");
    setHeldFrom("");
    setHeldTo("");
  };

  // Close menu when clicking outside
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
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // On mount, load saved filters from localStorage
  useEffect(() => {
    const savedFilters = localStorage.getItem("filters");
    if (savedFilters) {
      const filters = JSON.parse(savedFilters);
      if (filters.realizedFrom) setRealizedFrom(filters.realizedFrom);
      if (filters.realizedTo) setRealizedTo(filters.realizedTo);
      if (filters.roiFrom) setRoiFrom(filters.roiFrom);
      if (filters.roiTo) setRoiTo(filters.roiTo);
      if (filters.mcFrom) setMcFrom(filters.mcFrom);
      if (filters.mcTo) setMcTo(filters.mcTo);
      if (filters.holdingFrom) setHoldingFrom(filters.holdingFrom);
      if (filters.holdingTo) setHoldingTo(filters.holdingTo);
      if (filters.investedFrom) setInvestedFrom(filters.investedFrom);
      if (filters.investedTo) setInvestedTo(filters.investedTo);
      if (filters.avgBuyFrom) setAvgBuyFrom(filters.avgBuyFrom);
      if (filters.avgBuyTo) setAvgBuyTo(filters.avgBuyTo);
      if (filters.avgSellFrom) setAvgSellFrom(filters.avgSellFrom);
      if (filters.avgSellTo) setAvgSellTo(filters.avgSellTo);
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

  // Whenever any filter changes, save the current filters to localStorage
  useEffect(() => {
    const filters = {
      realizedFrom,
      realizedTo,
      roiFrom,
      roiTo,
      mcFrom,
      mcTo,
      holdingFrom,
      holdingTo,
      investedFrom,
      investedTo,
      avgBuyFrom,
      avgBuyTo,
      avgSellFrom,
      avgSellTo,
      winningTradesFrom,
      winningTradesTo,
      losingTradesFrom,
      losingTradesTo,
      heldFrom,
      heldTo,
    };
    localStorage.setItem("filters", JSON.stringify(filters));
    //   Notify parent component about filter changes if onFilterChange is provided
    if (typeof onFilterChange === "function") {
      onFilterChange(filters);
    }
  }, [
    realizedFrom,
    realizedTo,
    roiFrom,
    roiTo,
    mcFrom,
    mcTo,
    holdingFrom,
    holdingTo,
    investedFrom,
    investedTo,
    avgBuyFrom,
    avgBuyTo,
    avgSellFrom,
    avgSellTo,
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
    // Must start with numbers and optionally end with K/M/B, or be empty
    if (!value || /^[0-9]+[KMB]?$/.test(value)) {
      setter(value);
    }
  };

  const handleHeldChange = (setter) => (e) => {
    const value = e.target.value;
    // Must start with numbers and optionally end with m/h, or be empty
    if (!value || /^[0-9]+[mh]?$/.test(value)) {
      setter(value);
    }
  };

  return (
    <div className="relative inline-block ">
      <div className="flex">
        <div
          ref={buttonRef}
          onClick={handleClickTraders}
          className="px-4 py-2 ml-2 md:ml-4 bg-[#25223D] hover:bg-[#423d6d] cursor-pointer border-[#464558] border-[1px] rounded-3xl w-auto inline-block"
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
          {/* Realized PNL */}
          <div>
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
                  className="w-full h-8 rounded-3xl border-[1px] border-[#464558] bg-transparent text-white px-3 focus:outline-none focus:ring-2 focus:ring-[#AA00FF]"
                />
                <div>to</div>
                <input
                  type="number"
                  placeholder="SOL"
                  value={realizedTo}
                  onChange={(e) => setRealizedTo(e.target.value)}
                  className="w-full h-8 rounded-3xl border-[1px] border-[#464558] bg-transparent text-white px-3 focus:outline-none focus:ring-2 focus:ring-[#AA00FF]"
                />
              </div>
            </div>
            <div className="border-b mt-4 border-[#464558]" />
          </div>

          {/* ROI */}
          <div>
            <div className="px-4 mt-4 mb-1 font-semibold flex text-white rounded-3xl w-auto">
              ROI
            </div>
            <div className="w-full px-3 flex justify-center">
              <div className="flex w-full items-center space-x-4">
                <input
                  type="number"
                  placeholder="e.g. 70"
                  value={roiFrom}
                  onChange={(e) => setRoiFrom(e.target.value)}
                  className="w-full h-8 rounded-3xl border-[1px] border-[#464558] bg-transparent text-white px-3 focus:outline-none focus:ring-2 focus:ring-[#AA00FF]"
                />
                <div>to</div>
                <input
                  type="number"
                  placeholder="e.g. 80"
                  value={roiTo}
                  onChange={(e) => setRoiTo(e.target.value)}
                  className="w-full h-8 rounded-3xl border-[1px] border-[#464558] bg-transparent text-white px-3 focus:outline-none focus:ring-2 focus:ring-[#AA00FF]"
                />
              </div>
            </div>
            <div className="border-b mt-4 border-[#464558]" />
          </div>

          {/* MC */}
          <div>
            <div className="px-4 mt-4 mb-1 font-semibold flex text-white rounded-3xl w-auto">
              MC
            </div>
            <div className="w-full px-3 flex justify-center">
              <div className="flex w-full items-center space-x-4">
                <input
                  type="text"
                  placeholder="e.g. 10K"
                  value={mcFrom}
                  onChange={handleMcChange(setMcFrom)}
                  className="w-full h-8 rounded-3xl border-[1px] border-[#464558] bg-transparent text-white px-3 focus:outline-none focus:ring-2 focus:ring-[#AA00FF]"
                />
                <div>to</div>
                <input
                  type="text"
                  placeholder="e.g. 100M"
                  value={mcTo}
                  onChange={handleMcChange(setMcTo)}
                  className="w-full h-8 rounded-3xl border-[1px] border-[#464558] bg-transparent text-white px-3 focus:outline-none focus:ring-2 focus:ring-[#AA00FF]"
                />
              </div>
            </div>
            <div className="border-b mt-4 border-[#464558]" />
          </div>

          {/* Holding */}
          <div>
            <div className="px-4 mt-4 mb-1 font-semibold flex text-white rounded-3xl w-auto">
              Holding
            </div>
            <div className="w-full px-3 flex justify-center">
              <div className="flex w-full items-center space-x-4">
                <input
                  type="number"
                  placeholder="SOL"
                  value={holdingFrom}
                  onChange={(e) => setHoldingFrom(e.target.value)}
                  className="w-full h-8 rounded-3xl border-[1px] border-[#464558] bg-transparent text-white px-3 focus:outline-none focus:ring-2 focus:ring-[#AA00FF]"
                />
                <div>to</div>
                <input
                  type="number"
                  placeholder="SOL"
                  value={holdingTo}
                  onChange={(e) => setHoldingTo(e.target.value)}
                  className="w-full h-8 rounded-3xl border-[1px] border-[#464558] bg-transparent text-white px-3 focus:outline-none focus:ring-2 focus:ring-[#AA00FF]"
                />
              </div>
            </div>
            <div className="border-b mt-4 border-[#464558]" />
          </div>

          {/* Invested */}
          <div>
            <div className="px-4 mt-4 mb-1 font-semibold flex text-white rounded-3xl w-auto">
              Invested
            </div>
            <div className="w-full px-3 flex justify-center">
              <div className="flex w-full items-center space-x-4">
                <input
                  type="number"
                  placeholder="SOL"
                  value={investedFrom}
                  onChange={(e) => setInvestedFrom(e.target.value)}
                  className="w-full h-8 rounded-3xl border-[1px] border-[#464558] bg-transparent text-white px-3 focus:outline-none focus:ring-2 focus:ring-[#AA00FF]"
                />
                <div>to</div>
                <input
                  type="number"
                  placeholder="SOL"
                  value={investedTo}
                  onChange={(e) => setInvestedTo(e.target.value)}
                  className="w-full h-8 rounded-3xl border-[1px] border-[#464558] bg-transparent text-white px-3 focus:outline-none focus:ring-2 focus:ring-[#AA00FF]"
                />
              </div>
            </div>
            <div className="border-b mt-4 border-[#464558]" />
          </div>

          {/* Avg Buy */}
          <div>
            <div className="px-4 mt-4 mb-1 font-semibold flex text-white rounded-3xl w-auto">
              Avg Buy
            </div>
            <div className="w-full px-3 flex justify-center">
              <div className="flex w-full items-center space-x-4">
                <input
                  type="text"
                  placeholder="e.g. 10K"
                  value={avgBuyFrom}
                  onChange={handleMcChange(setAvgBuyFrom)}
                  className="w-full h-8 rounded-3xl border-[1px] border-[#464558] bg-transparent text-white px-3 focus:outline-none focus:ring-2 focus:ring-[#AA00FF]"
                />
                <div>to</div>
                <input
                  type="text"
                  placeholder="e.g. 3M"
                  value={avgBuyTo}
                  onChange={handleMcChange(setAvgBuyTo)}
                  className="w-full h-8 rounded-3xl border-[1px] border-[#464558] bg-transparent text-white px-3 focus:outline-none focus:ring-2 focus:ring-[#AA00FF]"
                />
              </div>
            </div>
            <div className="border-b mt-4 border-[#464558]" />
          </div>

          {/* Avg Sell */}
          <div>
            <div className="px-4 mt-4 mb-1 font-semibold flex text-white rounded-3xl w-auto">
              Avg Sell
            </div>
            <div className="w-full px-3 flex justify-center">
              <div className="flex w-full items-center space-x-4">
                <input
                  type="text"
                  placeholder="e.g. 350K"
                  value={avgSellFrom}
                  onChange={handleMcChange(setAvgSellFrom)}
                  className="w-full h-8 rounded-3xl border-[1px] border-[#464558] bg-transparent text-white px-3 focus:outline-none focus:ring-2 focus:ring-[#AA00FF]"
                />
                <div>to</div>
                <input
                  type="text"
                  placeholder="e.g. 10M"
                  value={avgSellTo}
                  onChange={handleMcChange(setAvgSellTo)}
                  className="w-full h-8 rounded-3xl border-[1px] border-[#464558] bg-transparent text-white px-3 focus:outline-none focus:ring-2 focus:ring-[#AA00FF]"
                />
              </div>
            </div>
            <div className="border-b mt-4 border-[#464558]" />
          </div>

          {/* Winning Trades */}
          <div>
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
                  className="w-full h-8 rounded-3xl border-[1px] border-[#464558] bg-transparent text-white px-3 focus:outline-none focus:ring-2 focus:ring-[#AA00FF]"
                />
                <div>to</div>
                <input
                  type="number"
                  placeholder="e.g. 200"
                  value={winningTradesTo}
                  onChange={(e) => setWinningTradesTo(e.target.value)}
                  className="w-full h-8 rounded-3xl border-[1px] border-[#464558] bg-transparent text-white px-3 focus:outline-none focus:ring-2 focus:ring-[#AA00FF]"
                />
              </div>
            </div>
            <div className="border-b mt-4 border-[#464558]" />
          </div>

          {/* Losing Trades */}
          <div>
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
                  className="w-full h-8 rounded-3xl border-[1px] border-[#464558] bg-transparent text-white px-3 focus:outline-none focus:ring-2 focus:ring-[#AA00FF]"
                />
                <div>to</div>
                <input
                  type="number"
                  placeholder="e.g. 200"
                  value={losingTradesTo}
                  onChange={(e) => setLosingTradesTo(e.target.value)}
                  className="w-full h-8 rounded-3xl border-[1px] border-[#464558] bg-transparent text-white px-3 focus:outline-none focus:ring-2 focus:ring-[#AA00FF]"
                />
              </div>
            </div>
            <div className="border-b mt-4 border-[#464558]" />
          </div>

          {/* Held */}
          <div>
            <div className="px-4 mt-4 mb-1 font-semibold flex text-white rounded-3xl w-auto">
              Held
            </div>
            <div className="w-full mb-14 px-3 flex justify-center">
              <div className="flex w-full items-center space-x-4">
                <input
                  type="text"
                  placeholder="e.g. 30m"
                  value={heldFrom}
                  onChange={handleHeldChange(setHeldFrom)}
                  className="w-full h-8 rounded-3xl border-[1px] border-[#464558] bg-transparent text-white px-3 focus:outline-none focus:ring-2 focus:ring-[#AA00FF]"
                />
                <div>to</div>
                <input
                  type="text"
                  placeholder="e.g. 24h"
                  value={heldTo}
                  onChange={handleHeldChange(setHeldTo)}
                  className="w-full h-8 rounded-3xl border-[1px] border-[#464558] bg-transparent text-white px-3 focus:outline-none focus:ring-2 focus:ring-[#AA00FF]"
                />
              </div>
            </div>
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
          shadow-lg text-white font-semibold text-left z-[90] transform transition-transform duration-200
          ${isOpen ? "translate-y-0" : "translate-y-full"}
        `}
        style={{ transformOrigin: "bottom" }}
      >
        <div className="absolute top-0 left-0 w-full h-16 rounded-t-2xl bg-gradient-to-b from-[#1c1b29] to-transparent pointer-events-none" />

        <div className="h-full overflow-y-auto custom-scrollbar pt-4">
          {/* Realized PNL */}
          <div>
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
                  className="w-full h-8 rounded-3xl border-[1px] border-[#464558] bg-transparent text-white px-3 focus:outline-none focus:ring-2 focus:ring-[#AA00FF]"
                />
                <div>to</div>
                <input
                  type="number"
                  placeholder="SOL"
                  value={realizedTo}
                  onChange={(e) => setRealizedTo(e.target.value)}
                  className="w-full h-8 rounded-3xl border-[1px] border-[#464558] bg-transparent text-white px-3 focus:outline-none focus:ring-2 focus:ring-[#AA00FF]"
                />
              </div>
            </div>
            <div className="border-b mt-4 border-[#464558]" />
          </div>

          {/* ROI */}
          <div>
            <div className="px-4 mt-4 mb-1 font-semibold flex text-white rounded-3xl w-auto">
              ROI
            </div>
            <div className="w-full px-3 flex justify-center">
              <div className="flex w-full items-center space-x-4">
                <input
                  type="number"
                  placeholder="e.g. 70"
                  value={roiFrom}
                  onChange={(e) => setRoiFrom(e.target.value)}
                  className="w-full h-8 rounded-3xl border-[1px] border-[#464558] bg-transparent text-white px-3 focus:outline-none focus:ring-2 focus:ring-[#AA00FF]"
                />
                <div>to</div>
                <input
                  type="number"
                  placeholder="e.g. 80"
                  value={roiTo}
                  onChange={(e) => setRoiTo(e.target.value)}
                  className="w-full h-8 rounded-3xl border-[1px] border-[#464558] bg-transparent text-white px-3 focus:outline-none focus:ring-2 focus:ring-[#AA00FF]"
                />
              </div>
            </div>
            <div className="border-b mt-4 border-[#464558]" />
          </div>

          {/* MC */}
          <div>
            <div className="px-4 mt-4 mb-1 font-semibold flex text-white rounded-3xl w-auto">
              MC
            </div>
            <div className="w-full px-3 flex justify-center">
              <div className="flex w-full items-center space-x-4">
                <input
                  type="text"
                  placeholder="e.g. 10K"
                  value={mcFrom}
                  onChange={handleMcChange(setMcFrom)}
                  className="w-full h-8 rounded-3xl border-[1px] border-[#464558] bg-transparent text-white px-3 focus:outline-none focus:ring-2 focus:ring-[#AA00FF]"
                />
                <div>to</div>
                <input
                  type="text"
                  placeholder="e.g. 100M"
                  value={mcTo}
                  onChange={handleMcChange(setMcTo)}
                  className="w-full h-8 rounded-3xl border-[1px] border-[#464558] bg-transparent text-white px-3 focus:outline-none focus:ring-2 focus:ring-[#AA00FF]"
                />
              </div>
            </div>
            <div className="border-b mt-4 border-[#464558]" />
          </div>

          {/* Holding */}
          <div>
            <div className="px-4 mt-4 mb-1 font-semibold flex text-white rounded-3xl w-auto">
              Holding
            </div>
            <div className="w-full px-3 flex justify-center">
              <div className="flex w-full items-center space-x-4">
                <input
                  type="number"
                  placeholder="SOL"
                  value={holdingFrom}
                  onChange={(e) => setHoldingFrom(e.target.value)}
                  className="w-full h-8 rounded-3xl border-[1px] border-[#464558] bg-transparent text-white px-3 focus:outline-none focus:ring-2 focus:ring-[#AA00FF]"
                />
                <div>to</div>
                <input
                  type="number"
                  placeholder="SOL"
                  value={holdingTo}
                  onChange={(e) => setHoldingTo(e.target.value)}
                  className="w-full h-8 rounded-3xl border-[1px] border-[#464558] bg-transparent text-white px-3 focus:outline-none focus:ring-2 focus:ring-[#AA00FF]"
                />
              </div>
            </div>
            <div className="border-b mt-4 border-[#464558]" />
          </div>

          {/* Invested */}
          <div>
            <div className="px-4 mt-4 mb-1 font-semibold flex text-white rounded-3xl w-auto">
              Invested
            </div>
            <div className="w-full px-3 flex justify-center">
              <div className="flex w-full items-center space-x-4">
                <input
                  type="number"
                  placeholder="SOL"
                  value={investedFrom}
                  onChange={(e) => setInvestedFrom(e.target.value)}
                  className="w-full h-8 rounded-3xl border-[1px] border-[#464558] bg-transparent text-white px-3 focus:outline-none focus:ring-2 focus:ring-[#AA00FF]"
                />
                <div>to</div>
                <input
                  type="number"
                  placeholder="SOL"
                  value={investedTo}
                  onChange={(e) => setInvestedTo(e.target.value)}
                  className="w-full h-8 rounded-3xl border-[1px] border-[#464558] bg-transparent text-white px-3 focus:outline-none focus:ring-2 focus:ring-[#AA00FF]"
                />
              </div>
            </div>
            <div className="border-b mt-4 border-[#464558]" />
          </div>

          {/* Avg Buy */}
          <div>
            <div className="px-4 mt-4 mb-1 font-semibold flex text-white rounded-3xl w-auto">
              Avg Buy
            </div>
            <div className="w-full px-3 flex justify-center">
              <div className="flex w-full items-center space-x-4">
                <input
                  type="text"
                  placeholder="e.g. 10K"
                  value={avgBuyFrom}
                  onChange={handleMcChange(setAvgBuyFrom)}
                  className="w-full h-8 rounded-3xl border-[1px] border-[#464558] bg-transparent text-white px-3 focus:outline-none focus:ring-2 focus:ring-[#AA00FF]"
                />
                <div>to</div>
                <input
                  type="text"
                  placeholder="e.g. 3M"
                  value={avgBuyTo}
                  onChange={handleMcChange(setAvgBuyTo)}
                  className="w-full h-8 rounded-3xl border-[1px] border-[#464558] bg-transparent text-white px-3 focus:outline-none focus:ring-2 focus:ring-[#AA00FF]"
                />
              </div>
            </div>
            <div className="border-b mt-4 border-[#464558]" />
          </div>

          {/* Avg Sell */}
          <div>
            <div className="px-4 mt-4 mb-1 font-semibold flex text-white rounded-3xl w-auto">
              Avg Sell
            </div>
            <div className="w-full px-3 flex justify-center">
              <div className="flex w-full items-center space-x-4">
                <input
                  type="text"
                  placeholder="e.g. 350K"
                  value={avgSellFrom}
                  onChange={handleMcChange(setAvgSellFrom)}
                  className="w-full h-8 rounded-3xl border-[1px] border-[#464558] bg-transparent text-white px-3 focus:outline-none focus:ring-2 focus:ring-[#AA00FF]"
                />
                <div>to</div>
                <input
                  type="text"
                  placeholder="e.g. 10M"
                  value={avgSellTo}
                  onChange={handleMcChange(setAvgSellTo)}
                  className="w-full h-8 rounded-3xl border-[1px] border-[#464558] bg-transparent text-white px-3 focus:outline-none focus:ring-2 focus:ring-[#AA00FF]"
                />
              </div>
            </div>
            <div className="border-b mt-4 border-[#464558]" />
          </div>

          {/* Winning Trades */}
          <div>
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
                  className="w-full h-8 rounded-3xl border-[1px] border-[#464558] bg-transparent text-white px-3 focus:outline-none focus:ring-2 focus:ring-[#AA00FF]"
                />
                <div>to</div>
                <input
                  type="number"
                  placeholder="e.g. 200"
                  value={winningTradesTo}
                  onChange={(e) => setWinningTradesTo(e.target.value)}
                  className="w-full h-8 rounded-3xl border-[1px] border-[#464558] bg-transparent text-white px-3 focus:outline-none focus:ring-2 focus:ring-[#AA00FF]"
                />
              </div>
            </div>
            <div className="border-b mt-4 border-[#464558]" />
          </div>

          {/* Losing Trades */}
          <div>
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
                  className="w-full h-8 rounded-3xl border-[1px] border-[#464558] bg-transparent text-white px-3 focus:outline-none focus:ring-2 focus:ring-[#AA00FF]"
                />
                <div>to</div>
                <input
                  type="number"
                  placeholder="e.g. 200"
                  value={losingTradesTo}
                  onChange={(e) => setLosingTradesTo(e.target.value)}
                  className="w-full h-8 rounded-3xl border-[1px] border-[#464558] bg-transparent text-white px-3 focus:outline-none focus:ring-2 focus:ring-[#AA00FF]"
                />
              </div>
            </div>
            <div className="border-b mt-4 border-[#464558]" />
          </div>

          {/* Held */}
          <div>
            <div className="px-4 mt-4 mb-1 font-semibold flex text-white rounded-3xl w-auto">
              Held
            </div>
            <div className="w-full px-3 mb-14 flex justify-center">
              <div className="flex w-full items-center space-x-4">
                <input
                  type="text"
                  placeholder="e.g. 30m"
                  value={heldFrom}
                  onChange={handleHeldChange(setHeldFrom)}
                  className="w-full h-8 rounded-3xl border-[1px] border-[#464558] bg-transparent text-white px-3 focus:outline-none focus:ring-2 focus:ring-[#AA00FF]"
                />
                <div>to</div>
                <input
                  type="text"
                  placeholder="e.g. 24h"
                  value={heldTo}
                  onChange={handleHeldChange(setHeldTo)}
                  className="w-full h-8 rounded-3xl border-[1px] border-[#464558] bg-transparent text-white px-3 focus:outline-none focus:ring-2 focus:ring-[#AA00FF]"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="pointer-events-none absolute bottom-0 left-0 w-full h-10 rounded-b-2xl bg-gradient-to-t from-[#1c1b29] to-transparent  " />
      </div>
    </div>
  );
}
