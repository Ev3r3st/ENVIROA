// components/Navbar.tsx
import React from "react";
import Link from "next/link";

import {
  faHome,
  faChartLine,
  faBullseye,
  faUser,
  faCog,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Navbar: React.FC = () => {
  return (
    <nav className="bg-gray-700 text-white py-2 px-2 shadow-md fixed bottom-0 w-full md:top-0 md:bottom-auto md:rounded-none rounded-t-md">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo - skrytí na mobile */}
        <Link
          href="/"
          className="text-2xl font-semibold text-pink-200 hover:text-pink-300 hidden md:block"
        >
          Moje Cíle
        </Link>

        {/* Navigation Links */}
        <div className="flex space-x-12 text-center justify-center md:justify-start w-full  ">
          <div className="icons">
            <Link
              href="/home"
              className="hover:text-pink-300 text-sm flex flex-col items-center"
            >
              <FontAwesomeIcon icon={faHome} className="m-1" />
              <span className="">Domů</span>
            </Link>
          </div>
          <div className="icons">
            <Link
              href="/home"
              className="hover:text-pink-300  text-sm flex flex-col items-center"
            >
              <FontAwesomeIcon icon={faChartLine} className="m-1" />
              Domů
            </Link>
          </div>
          <div className="icons">
            <Link
              href="/home"
              className="hover:text-pink-300  text-sm flex flex-col items-center"
            >
              <FontAwesomeIcon icon={faBullseye} className="m-1" />
              Domů
            </Link>
          </div>
          <div className="icons">
            <Link
              href="/home"
              className="hover:text-pink-300  text-sm flex flex-col items-center"
            >
              <FontAwesomeIcon icon={faUser} className="m-1" />
              Domů
            </Link>
          </div>
          <div className="icons">
            <Link
              href="/home"
              className="hover:text-pink-300  text-sm flex flex-col items-center"
            >
              <FontAwesomeIcon icon={faCog} className="m-1" />
              Domů
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
