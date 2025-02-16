import { useState, useRef, useEffect } from "react";
import { IoIosArrowDown } from "react-icons/io";

export default function PerPageButton({ value, onChange, options }) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative inline-block">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex justify-between bg-[#25223D] hover:bg-[#1c1a2e] text-left text-white border border-[#464558] rounded-3xl px-4 w-20 py-2   items-center ${
          isOpen ? "bg-[#1c1a2e]" : "bg-[#25223D]"
        }`}
      >
        {value}

        <IoIosArrowDown />
      </button>
      {isOpen && (
        <ul className="absolute bottom-12 mt-1 w-full bg-[#25223d] border border-[#464558] rounded-lg shadow-lg z-10">
          {options.map((opt) => (
            <li className="px-1 py-1 text-white   ">
              <div
                key={opt}
                onClick={() => {
                  onChange(opt);
                  setIsOpen(false);
                }}
                className="hover:bg-[#1c1a2e] rounded-lg px-2 py-1  cursor-pointer"
              >
                {" "}
                {opt}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
