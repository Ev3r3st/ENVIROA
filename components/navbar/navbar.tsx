"use client";

// components/Navbar.tsx
import React from "react";
import Link from "next/link";
import logo from "../../public/images/icons/icon-512x512.png";
import Image from "next/image";
import { usePathname } from "next/navigation";

import {
  faHome,
  faChartLine,
  faBullseye,
  faUser,
  faGraduationCap,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Navbar: React.FC = () => {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <>
      {/* Desktop navbar - horní */}
      <nav className="bg-gray-700 text-white py-2 px-4 shadow-md fixed top-0 w-full z-50 hidden md:block">
        <div className="container mx-auto flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center">
            <Link
              href="/"
              className="text-2xl font-semibold text-pink-200 hover:text-pink-300 flex items-center"
            >
              <Image src={logo} alt="logo" width={60} height={60} className="mr-3" />
              <span className="hidden lg:inline">EVO Asistent</span>
            </Link>
          </div>
          
          {/* Navigation Links */}
          <div className="flex space-x-6">
            <Link href="/" className={`hover:text-pink-300 px-3 py-2 rounded-lg transition-colors ${isActive('/') ? 'bg-gray-600' : ''}`}>
              <span className="flex items-center">
                <FontAwesomeIcon icon={faHome} className="mr-2" />
                Domů
              </span>
            </Link>
            <Link href="/dashboard" className={`hover:text-pink-300 px-3 py-2 rounded-lg transition-colors ${isActive('/dashboard') ? 'bg-gray-600' : ''}`}>
              <span className="flex items-center">
                <FontAwesomeIcon icon={faChartLine} className="mr-2" />
                Dashboard
              </span>
            </Link>
            <Link href="/courses" className={`hover:text-pink-300 px-3 py-2 rounded-lg transition-colors ${isActive('/courses') ? 'bg-gray-600' : ''}`}>
              <span className="flex items-center">
                <FontAwesomeIcon icon={faGraduationCap} className="mr-2" />
                Kurzy
              </span>
            </Link>
            <Link href="/GoalFormPage" className={`hover:text-pink-300 px-3 py-2 rounded-lg transition-colors ${isActive('/GoalFormPage') ? 'bg-gray-600' : ''}`}>
              <span className="flex items-center">
                <FontAwesomeIcon icon={faBullseye} className="mr-2" />
                Nový cíl
              </span>
            </Link>
            <Link href="/profile" className={`hover:text-pink-300 px-3 py-2 rounded-lg transition-colors ${isActive('/profile') ? 'bg-gray-600' : ''}`}>
              <span className="flex items-center">
                <FontAwesomeIcon icon={faUser} className="mr-2" />
                Profil
              </span>
            </Link>
          </div>
          
          {/* Login Button */}
          <div>
            <Link
              href="/login"
              className="bg-green-500 text-white font-bold py-2 px-4 rounded hover:bg-green-600 transition duration-300"
            >
              Přihlášení
            </Link>
          </div>
        </div>
      </nav>
      
      {/* Mobile navbar - spodní (ve stylu nativní aplikace) */}
      <nav className="bg-gray-800 text-white py-2 px-2 shadow-lg fixed bottom-0 w-full z-50 md:hidden">
        <div className="flex justify-around items-center">
          <Link
            href="/"
            className={`flex flex-col items-center p-2 rounded-lg ${isActive('/') ? 'bg-gray-700 text-pink-300' : ''}`}
          >
            <FontAwesomeIcon icon={faHome} className="h-6 w-6 mb-1" />
            <span className="text-xs">Domů</span>
          </Link>
          
          <Link
            href="/dashboard"
            className={`flex flex-col items-center p-2 rounded-lg ${isActive('/dashboard') ? 'bg-gray-700 text-pink-300' : ''}`}
          >
            <FontAwesomeIcon icon={faChartLine} className="h-6 w-6 mb-1" />
            <span className="text-xs">Dashboard</span>
          </Link>
          
          <Link
            href="/GoalFormPage"
            className={`flex flex-col items-center p-2 rounded-lg ${isActive('/GoalFormPage') ? 'bg-gray-700 text-pink-300' : ''}`}
          >
            <div className="bg-pink-500 rounded-full p-3 -mt-8 shadow-lg border-4 border-gray-800">
              <FontAwesomeIcon icon={faBullseye} className="h-6 w-6 text-white" />
            </div>
            <span className="text-xs mt-1">Nový cíl</span>
          </Link>
          
          <Link
            href="/courses"
            className={`flex flex-col items-center p-2 rounded-lg ${isActive('/courses') ? 'bg-gray-700 text-pink-300' : ''}`}
          >
            <FontAwesomeIcon icon={faGraduationCap} className="h-6 w-6 mb-1" />
            <span className="text-xs">Kurzy</span>
          </Link>
          
          <Link
            href="/profile"
            className={`flex flex-col items-center p-2 rounded-lg ${isActive('/profile') ? 'bg-gray-700 text-pink-300' : ''}`}
          >
            <FontAwesomeIcon icon={faUser} className="h-6 w-6 mb-1" />
            <span className="text-xs">Profil</span>
          </Link>
        </div>
      </nav>
      
      {/* Přidání odsazení pro mobilní zařízení (spodní padding) */}
      <div className="md:pb-10 md:pb-0 block md:hidden"></div>
      {/* Přidání odsazení pro desktop (horní padding) */}
      <div className="pt-20 hidden md:block"></div>
    </>
  );
};

export default Navbar;
