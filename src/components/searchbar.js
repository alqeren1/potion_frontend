import { useState, useRef, useEffect } from "react";
import Image from "next/image";

const SearchInput = ({ onSearch, searchQuery }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filteredTraders, setFilteredTraders] = useState([]);

  const containerRef = useRef(null);
  const buttonRef = useRef(null);
  const menuRefMobile = useRef(null);

  const handleClickSearch = () => {
    setIsOpen((prev) => !prev);
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        buttonRef.current &&
        !buttonRef.current.contains(event.target) &&
        menuRefMobile.current &&
        !menuRefMobile.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close the modal if a click happens outside the component
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsModalOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // --- Handle input change by updating state and calling onSearch ---
  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    if (typeof onSearch === "function") {
      onSearch(newValue);
    }
  };

  return (
    <div className="relative" ref={containerRef}>
      {/* Input bar Desktop */}
      <div className="items-center px-4 py-2 hidden md:px-0 md:flex w-auto md:w-[414px] rounded-3xl border border-[#464558] text-[#858585] cursor-text">
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
          value={inputValue}
          onChange={handleInputChange}
          placeholder="Search by token name or contract"
          className="ml-2 flex-1 px-2 bg-transparent outline-none text-white font-light placeholder:text-[#858585] hidden sm:flex"
        />
      </div>

      {/* Input bar Mobile */}
      <button
        ref={buttonRef}
        onClick={handleClickSearch}
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
        {/* Only show the bubble if filterCount > 0 */}
        {searchQuery.trim() !== "" && (
          <div
            className="absolute w-5 h-5 bg-[#AA00FF] font-semibold flex items-center
           justify-center rounded-full ml-5 mt-[30px] text-white text-sm"
          >
            <div className="mt-[2px]">1</div>
          </div>
        )}
      </button>

      {/* Mobile Filters Modal */}
      <div
        ref={menuRefMobile}
        className={`fixed bottom-0 left-0 w-screen h-auto rounded-t-2xl md:hidden z-[990]
          border-[1px] border-[#464558] mt-2 bg-[#1c1b29] shadow-lg text-white font-semibold text-left  transform transition-transform duration-200
          ${isOpen || isModalOpen ? "translate-y-0" : "translate-y-full"}
        `}
        style={{ transformOrigin: "bottom" }}
      >
        <div className="ml-2 pt-4 pb-1 px-4 text-xl">Search</div>
        <div className="px-4">
          <div className="items-center px-4 py-2 flex md:px-0 md:hidden w-auto rounded-3xl border border-[#464558] text-[#858585] cursor-text">
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
              value={inputValue}
              onChange={handleInputChange}
              placeholder="Search by name or wallet"
              className="ml-2 flex-1 px-2 bg-transparent outline-none text-white font-light placeholder:text-[#858585]"
            />
          </div>
        </div>
        <div className="border-b-[1px] mt-4 border-[#464558] w-full"></div>

        {/* Search Results in Mobile Modal */}
        <div className="h-full overflow-y-auto bg-[#171622] custom-scrollbar pt-2">
          {filteredTraders.length > 0 ? (
            filteredTraders.map((trader) => (
              <div
                key={trader.traderWallet}
                className=" items-center  px-2 flex flex-col justify-center   w-full    "
                onClick={() => setIsModalOpen(false)}
              >
                <div className="flex p-2  rounded-lg w-full cursor-pointer hover:bg-[#25223D]">
                  <Image
                    src={`/${trader.profilePhoto}`}
                    alt={trader.traderName}
                    width={40}
                    height={40}
                    priority
                  />

                  <div className="ml-4">
                    <div className="font-semibold text-white">
                      {trader.traderName}
                    </div>
                    <div className="text-[#858585] text-xs">
                      @{trader.twitterHandle} |{" "}
                      {trader.traderWallet.slice(0, 6)}
                      ...
                      {trader.traderWallet.slice(-6)}
                    </div>
                  </div>
                </div>
                <div className="border-b w-full mt-2 mb-1 border-[#23242C]">
                  {" "}
                </div>
              </div>
            ))
          ) : (
            <div className=" "></div>
          )}
          <div className="pointer-events-none absolute -bottom-1 left-0 w-full  h-10 bg-gradient-to-t from-[#171622] to-transparent" />
        </div>
      </div>
    </div>
  );
};

export default SearchInput;
