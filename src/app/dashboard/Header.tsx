"use client";

import React from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
//import Image from 'next/image'; 
const Header: React.FC = () => {
  return (
    <>
      {/* Horní řádek s logem a "U" */}
      <div className="grid grid-cols-2 items-center">
        <div className="flex items-center bg-white text-black rounded-full p-1 px-3 justify-self-start">
        <>
        {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/app-image/marenas-logo-octo.jpg"
            alt="Logo"
            className="w-10 h-10 rounded-full mr-2"
          /></>
          <h1 className="text-xl font-bold">EVO</h1>
        </div>
        <div className="flex items-center justify-self-end">
          <Link href="/profile" className="relative group">
            <div className="bg-gradient-to-r from-white to-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg cursor-pointer transition-transform transform hover:scale-110">
              <FontAwesomeIcon icon={faUser} className="text-black w-6 h-6" />
            </div>
            <div className="absolute top-14 right-0 bg-gray-800 text-white text-sm rounded-lg shadow-md p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              Profile
            </div>
          </Link>
        </div>
      </div>

      {/* Citát */}
      <section className="bg-white text-black p-4 rounded-lg w-full text-center my-4">
        <p className="text-2xl italic px-2">
          &quot; Dosáhněte vašeho cíle rychleji a úspěšněji. &quot;
        </p>
        <p className="mt-2 text-sm">Krotil Matyáš</p>
      </section>
    </>
  );
};

export default Header; 