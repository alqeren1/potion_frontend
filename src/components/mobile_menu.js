import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/router";
export default function MobileMenu({ menuOpen, setMenuOpen, hamburgerRef }) {
  const router = useRouter();
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      // If the menu is open and the click target is NOT inside menuRef
      if (
        menuOpen &&
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        hamburgerRef.current &&
        !hamburgerRef.current.contains(event.target)
      ) {
        setMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

  return (
    <div
      ref={menuRef}
      className={`fixed top-0  border-l-[1px] border-[#23242C] px-8 md:px-[32px]  right-0 w-72 h-full bg-[#11121B] z-10 transform transition-transform duration-300 ${
        menuOpen ? "translate-x-0" : "translate-x-full"
      } lg:hidden`}
    >
      <div className="justify-between  h-full flex flex-col">
        <nav className="mt-44 text-right">
          <ul className="flex flex-col space-y-6 text-3xl font-bold">
            <li>
              <a
                onClick={() => router.push(`/`)}
                className="text-white cursor-pointer hover:text-[#d105fb] "
              >
                Leaderboards
              </a>
            </li>
            <li>
              <a href="#" className="text-white hover:text-[#d105fb]  ">
                Learn
              </a>
            </li>
            <li>
              <a href="#" className="text-white hover:text-[#d105fb]  ">
                Prizes
              </a>
            </li>
          </ul>
        </nav>
        <div>
          <div className="flex mb-2 w500:mb-6 lg:hidden items-center space-x-6  justify-end">
            <a target="_blank" href="https://x.com/potionalpha">
              <img
                className=""
                src="/x_logo.svg"
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
