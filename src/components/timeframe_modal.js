import { useState, useRef, useEffect } from "react";

export default function TimeModal({ timeframe, setTimeframe }) {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef(null);
  const menuRef = useRef(null);

  const timeframeLabels = {
    daily: "Daily",
    weekly: "Weekly",
    monthly: "Monthly",
    allTime: "All",
  };

  const handleToggle = () => {
    setIsOpen((prev) => !prev);
  };

  const handleOptionClick = (option) => {
    setTimeframe(option);
    setIsOpen(false);
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        buttonRef.current &&
        !buttonRef.current.contains(event.target) &&
        menuRef.current &&
        !menuRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block">
      <div
        ref={buttonRef}
        onClick={handleToggle}
        className={`text-base  py-2 z-10 
          bg-[#25223D] hover:bg-[#423d6d] cursor-pointer border-[#464558] 
          w-24 inline-block text-white text-center ${
            isOpen
              ? "rounded-t-lg w500:rounded-t-xl border-t-[1px] border-l-[1px] border-r-[1px]"
              : "rounded-3xl border-[1px]"
          }`}
      >
        {timeframeLabels[timeframe]}
      </div>

      <div
        ref={menuRef}
        className={`
          absolute left-0 top-full 
          border-b-[1px] border-l-[1px] border-r-[1px] border-[#464558] bg-[#1c1b29] 
          rounded-b-lg w500:rounded-b-xl shadow-lg text-white w-24 z-[90]
          ${isOpen ? "scale-y-100" : "scale-y-0"}
        `}
        style={{ transformOrigin: "top" }}
      >
        {Object.entries(timeframeLabels)
          .filter(([key]) => key !== timeframe)
          .map(([key, label]) => (
            <div
              key={key}
              onClick={() => handleOptionClick(key)}
              className="px-5 py-2 text-base flex justify-center cursor-pointer rounded-3xl w-auto text-[#858585] hover:text-[#d105fb]"
            >
              {label}
            </div>
          ))}
      </div>
    </div>
  );
}
