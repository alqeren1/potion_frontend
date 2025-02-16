import { useState, useRef, useEffect } from "react";

export default function TradesModal() {
  const [label, setLabel] = useState("Groups");
  const [label2, setLabel2] = useState("Tokens");
  const [isOpen, setIsOpen] = useState(false);

  const buttonRef = useRef(null);
  const menuRef = useRef(null);
  const handleClickGroups2 = () => {
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

  const handleClickTraders = () => {
    // Check screen width; only open modal if below 'lg' breakpoint (~1024px)

    setIsOpen((prev) => !prev);
  };

  useEffect(() => {
    function handleClickOutside(event) {
      // If the dropdown or the button are NOT clicked, then close the menu
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
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative inline-block">
      <div
        ref={buttonRef}
        onClick={handleClickTraders}
        className={`text-base px-5 py-2 z-10 
                       bg-[#25223D] hover:bg-[#423d6d]
                       cursor-pointer border-[#464558] 
                       w-auto inline-block ${
                         isOpen
                           ? "rounded-t-lg w500:rounded-t-xl border-t-[1px] border-l-[1px] border-r-[1px]"
                           : "rounded-3xl border-[1px]"
                       }`}
      >
        Trades
      </div>

      {/* The drop-down menu under the Traders button (only open on small screens) */}
      <div
        ref={menuRef} // <-- REFERENCE FOR OUTSIDE CLICKS
        className={`
          absolute left-0 top-full 
          border-b-[1px] border-l-[1px] border-r-[1px]  border-[#464558] bg-[#1c1b29] 
          rounded-b-lg w500:rounded-b-xl shadow-lg text-white w-[96px]
          ${isOpen ? "scale-y-100" : "scale-y-0"}
        `}
        style={{
          transformOrigin: "top",
        }}
      >
        <div
          onClick={handleClickTokens}
          className="px-5 py-2 flex justify-center text-base hover:text-[#d105fb] cursor-pointer text-[#858585]   "
        >
          {label2}
        </div>
        <div
          onClick={handleClickGroups2}
          className="px-5 py-2 flex justify-center text-base hover:text-[#d105fb] cursor-pointer text-[#858585]   "
        >
          {label}
        </div>
      </div>
    </div>
  );
}
