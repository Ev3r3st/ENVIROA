"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

import heroImage from "../../public/images/FITNESA-phonedesign (1).png";
import moudulesImage from "../../public/images/modules.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBrain,
  faBusinessTime,
  faChartLine,
} from "@fortawesome/free-solid-svg-icons";

const HomePage: React.FC = () => {
  const router = useRouter();

  const handleLoginRedirect = () => {
    router.push("/login");
  };

  return (
    <>
      {/* HERO SECTION */}
      <section className="relative bg-gradient-to-r from-purple-700 to-indigo-800 text-white pb-16">
        <div className="max-w-screen-xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 px-6 py-12 lg:py-20">
          <div className="lg:col-span-7 flex flex-col justify-center">
            <h1 className="text-4xl md:text-5xl xl:text-6xl font-extrabold mb-6">
              Asistent pro dosažení vašich cílů
              <span className="block text-2xl md:text-3xl mt-2 font-light">
                Buďte připraveni každý den.
              </span>
            </h1>
            <p className="text-lg md:text-xl text-gray-200 mb-8">
              Vytvořte si vlastní plán kroků ke svému cíli a získejte jasné
              instrukce, které vám pomohou uspět. Sledujte svůj pokrok a buďte
              každým dnem blíže splnění svých snů.
            </p>
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center px-8 py-3 text-lg font-medium bg-white text-gray-900 rounded-full shadow-md hover:shadow-lg transition-all duration-300"
            >
              Zjistit více
            </Link>
          </div>
          <div className="hidden lg:block lg:col-span-5">
            <div className="flex justify-center lg:justify-end h-full">
              <Image
                src={heroImage}
                alt="mockup"
                width={500}
                height={400}
                className="object-cover "
              />
            </div>
          </div>
        </div>
      </section>

      {/* LEARNING COURSES SECTION */}
      <section className="bg-gray-50 dark:bg-gray-900 py-16">
        <div className="max-w-screen-xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            {/* Text Section */}
            <div>
              <h2 className="text-3xl md:text-4xl font-extrabold mb-4 text-gray-900 dark:text-white">
                Naučte se něco nového každý den
              </h2>
              <p className="mb-4 text-gray-700 dark:text-gray-400 text-lg">
                Objevte naše vzdělávací kurzy zaměřené na osobní rozvoj a
                dovednosti. Díky interaktivním lekcím a jasným instrukcím se
                budete rychle zdokonalovat. Získejte cenné rady od profesionálů
                a udělejte další krok k úspěchu.
              </p>
              <p className="mb-6 text-gray-700 dark:text-gray-400 text-lg">
                Začněte svou cestu za novými znalostmi už dnes a přesvědčte se,
                jak snadné je posunout svůj potenciál dál.
              </p>
              <Link
                href="/modules"
                className="inline-flex items-center justify-center px-8 py-3 text-base font-medium bg-indigo-600 text-white rounded-full shadow-md hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-300 transition-all"
              >
                Prozkoumat kurzy
              </Link>
            </div>

            {/* Illustration */}
            <div className="flex justify-center mt-8 lg:mt-0">
              <Image
                src={moudulesImage}
                alt="Ilustrace kurzů"
                width={500}
                height={400}
                className=""
              />
            </div>
          </div>
        </div>
      </section>

      {/* MAIN FEATURES SECTION */}
      <section className="bg-gradient-to-b from-purple-800 to-indigo-900 py-16 text-white">
        <div className="max-w-screen-xl mx-auto px-6 lg:px-8">
          <h2 className="text-4xl font-extrabold text-center mb-12">
            Funkce, které vám pomohou uspět
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature Card 1 */}
            <div className="bg-white text-gray-900 rounded-xl shadow-lg p-8 transition-transform duration-300 hover:scale-105">
              <div className="flex items-center justify-center w-20 h-20 mx-auto mb-4 bg-indigo-600 rounded-full">
                <FontAwesomeIcon
                  icon={faBusinessTime}
                  size="2x"
                  className="text-white"
                />
              </div>
              <h3 className="text-2xl font-bold text-center mb-3">
                Nástroje pro produktivitu
              </h3>
              <p className="text-center">
                Posuňte svou efektivitu na novou úroveň díky osvědčeným
                nástrojům, které vás udrží na správné cestě.
              </p>
            </div>
            {/* Feature Card 2 */}
            <div className="bg-white text-gray-900 rounded-xl shadow-lg p-8 transition-transform duration-300 hover:scale-105">
              <div className="flex items-center justify-center w-20 h-20 mx-auto mb-4 bg-indigo-600 rounded-full">
                <FontAwesomeIcon
                  icon={faChartLine}
                  size="2x"
                  className="text-white"
                />
              </div>
              <h3 className="text-2xl font-bold text-center mb-3">
                Sledování cílů
              </h3>
              <p className="text-center">
                Stanovte si jasné cíle, sledujte jejich plnění a mějte dokonalý
                přehled o svém pokroku.
              </p>
            </div>
            {/* Feature Card 3 */}
            <div className="bg-white text-gray-900 rounded-xl shadow-lg p-8 transition-transform duration-300 hover:scale-105">
              <div className="flex items-center justify-center w-20 h-20 mx-auto mb-4 bg-indigo-600 rounded-full">
                <FontAwesomeIcon
                  icon={faBrain}
                  size="2x"
                  className="text-white"
                />
              </div>
              <h3 className="text-2xl font-bold text-center mb-3">
                Osobní rozvoj
              </h3>
              <p className="text-center">
                Čerpejte inspiraci a zdroje pro svůj růst, abyste se stali tou
                nejlepší verzí sebe sama.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS SECTION */}
      <section className=" bg-white py-16">
        <div className="max-w-screen-xl mx-auto px-6 lg:px-8">
          <h2 className="text-4xl font-extrabold text-center mb-12 text-gray-900">
            Naši uživatelé o nás říkají
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="rounded-xl shadow-lg p-8 transition-shadow duration-300 hover:shadow-2xl">
              <p className="italic text-gray-700 mb-6">
                &quot;Tato aplikace změnila způsob, jakým si plánuji cíle. Je
                jednoduchá na použití a skutečně efektivní.&quot;
              </p>
              <h4 className="text-xl font-bold text-gray-900">
                - Alex Johnson
              </h4>
            </div>
            <div className="rounded-xl shadow-lg p-8 transition-shadow duration-300 hover:shadow-2xl">
              <p className="italic text-gray-700 mb-6">
                &quot;Funkce pro zvyšování produktivity mi pomáhají být efektivní a
                šetřit čas každý den!&quot;
              </p>
              <h4 className="text-xl font-bold text-gray-900">- Maria Lopez</h4>
            </div>
            <div className="rounded-xl shadow-lg p-8 transition-shadow duration-300 hover:shadow-2xl">
              <p className="italic text-gray-700 mb-6">
                &quot;Díky osobnímu rozvoji a vzdělávacím kurzům jsem se naučil
                spoustu nových věcí a cítím se motivovanější.&quot;
              </p>
              <h4 className="text-xl font-bold text-gray-900">
                - James Carter
              </h4>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CALL TO ACTION */}
      <section className="bg-gradient-to-b from-purple-800 to-indigo-900 py-16 text-white">
        <div className="max-w-screen-xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-6">
            Připraveni na další krok?
          </h2>
          <p className="text-lg md:text-xl mb-10 text-white/90 max-w-2xl mx-auto">
            Přidejte se k naší rostoucí komunitě a začněte měnit své sny ve
            skutečnost. Váš nový život začíná právě teď.
          </p>
          <button
            onClick={handleLoginRedirect}
            className="px-10 py-4 bg-white text-gray-900 font-bold text-xl rounded-full shadow-md hover:shadow-lg transition-transform transform hover:scale-110"
          >
            Začít hned
          </button>
        </div>
      </section>
    </>
  );
};

export default HomePage;
