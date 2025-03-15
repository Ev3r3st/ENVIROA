"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

const GoalFormPage: React.FC = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    goal_name: "",
    reason: "",
    destination: "",
    new_self: "",
    daily_action: "",
    daily_learning: "",
    daily_visualization: "",
    duration: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = Cookies.get("token"); // Čtení tokenu z cookies
      console.log("JWT Token:", token); // Logování tokenu
      console.log("FormData:", formData);

      if (!token) {
        throw new Error("No token found in cookies");
      }

      // Kontrola, zda jsou všechna pole vyplněna
      for (const [key, value] of Object.entries(formData)) {
        if (!value) {
          throw new Error(`Field ${key} is missing`);
        }
      }

      const response = await fetch("http://localhost:3001/api/api/goals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          goal_name: formData.goal_name,
          reason: formData.reason,
          destination: formData.destination,
          new_self: formData.new_self,
          daily_action: formData.daily_action,
          daily_learning: formData.daily_learning,
          daily_visualization: formData.daily_visualization,
          duration: parseInt(formData.duration, 10),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Response error:", errorData);
        throw new Error("Failed to create goal");
      }

      const data = await response.json();
      console.log("Goal created:", data);
      router.push("/dashboard");
    } catch (error) {
      console.error("Error:", error);
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-500 via-purple-600 to-red-500 flex items-center justify-center py-5 px-3 pb-[100px]">
      <div className="bg-white text-black rounded-3xl shadow-2xl w-full max-w-5xl pt-12 pb-12 space-y-16">
        <h1 className="grid text-5xl font-extrabold text-center text-gradient bg-clip-text bg-gradient-to-r from-pink-500 to-yellow-500">
          Vytvořte si svůj plán úspěchu
          <span className="pt-2 text-xl md:text-3xl font-extrabold   text-center bg-gradient-to-r from-blue-500 via-purple-600 to-red-500 text-transparent bg-clip-text">
            Všechno začíná v nás
          </span>
        </h1>

        <form onSubmit={handleSubmit} className="space-y-12">
          {/* Goal Name Section */}{" "}
          <section className="goalsection px-12">
            <div className="flex items-center space-x-4 mb-5">
              <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-lg">
                1
              </div>
              <h2 className="text-xl md:text-3xl font-bold">Název cíle</h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-1 md:gap-8 space-y-6 lg:space-y-0">
              <div className="space-y-6">
                <input
                  type="text"
                  name="goal_name"
                  value={formData.goal_name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-5 py-3 bg-gray-100 rounded-lg text-gray-800 focus:outline-none focus:ring-4 focus:ring-blue-500"
                  placeholder="Zadejte název vašeho cíle"
                />
              </div>
              <div className="bg-gray-100 p-6 rounded-lg">
                <h3 className="text-xl font-bold mb-2">
                  Jak zadat název cíle?
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  <strong>Položte si klíčovou otázku:</strong> Co chci
                  dosáhnout?
                  <br />
                  <strong>Formulujte jednoduchý a konkrétní název:</strong>{" "}
                  Vytvořte krátkou větu, která shrne váš záměr.
                  <em>Například:</em> „Zhubnout 10 kg, Naučit se programovat,
                  Běhat maraton.“
                  <br />
                  <strong>Zmapujte současnou situaci:</strong> Ujasněte si, kde
                  se nacházíte – jaké máte zdroje, dovednosti, čas a motivaci.
                  <br />
                  <strong>Stanovte hranice:</strong> Určete, co je a co není
                  součástí vašeho plánu, abyste si udrželi fokus.
                  <br />
                  <br />
                  Název vašeho cíle by měl být stručný a jasný. Popište, čeho
                  chcete dosáhnout.
                  <em>Např.:</em>
                </p>
              </div>
            </div>
            <div className="pt-5 gap-1 md:gap-8 space-y-6 lg:space-y-0">
              <div className="bg-gray-100 p-6 rounded-lg">
                <h3 className="text-xl font-bold mb-2">
                  Definujte si svoji startovací čáru.
                </h3>
                <p className="text-gray-600">
                  Startovací čára představuje moment, kdy se zamyslíte nad tím,
                  co přesně chcete dosáhnout, a stanovíte si základní parametry
                  svého plánu. Dobře definovaný cíl, formulovaný v jednoduchém a
                  jasném názvu, vám pomůže nejen pochopit, co je potřeba udělat,
                  ale také vás udrží motivované a připravené čelit výzvám. Je to
                  jako položit základní kámen – pokud je pevný, celý proces
                  budování se stává snadnějším.
                </p>
              </div>
            </div>
          </section>
          <div className="border-b-2"></div>
          {/* Reason Section */}{" "}
          <section className="px-12">
            <div className="flex items-center space-x-4 pt-10 mb-5">
              <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center text-white font-bold text-lg">
                2
              </div>
              <h2 className="text-xl md:text-3xl font-bold">
                Proč chcete cíle dosáhnout?
              </h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-1 md:gap-8 space-y-6 lg:space-y-0">
              <div className="space-y-6">
                <textarea
                  name="reason"
                  value={formData.reason}
                  onChange={handleInputChange}
                  required
                  className="w-full px-5 py-3 bg-gray-100 rounded-lg text-gray-800 focus:outline-none focus:ring-4 focus:ring-blue-500"
                  placeholder="Popište svou motivaci"
                />
              </div>
              <div className="bg-gray-100 p-6 rounded-lg">
                <h3 className="text-xl font-bold mb-2">
                  Jak popsat svou motivaci?
                </h3>
                <p className="text-gray-600">
                  Když si definujete svůj cíl, je stejně důležité zamyslet se
                  nad tím, proč ho chcete dosáhnout. Vaše motivace je klíčovým
                  faktorem, který vás bude pohánět vpřed, i když narazíte na
                  překážky. Pokud máte jasnou odpověď na otázku „proč?“, budete
                  schopni překonat chvíle, kdy se vám nebude chtít pokračovat.
                </p>
              </div>
            </div>
            <div className="pt-5 gap-1 md:gap-8 space-y-6 lg:space-y-0">
              <div className="bg-gray-100 p-6 rounded-lg">
                <h3 className="text-xl font-bold mb-2">
                  Dobře popsaná motivace zahrnuje:
                </h3>
                <ul className="list-disc pl-6 text-gray-600 leading-relaxed">
                  <li>
                    <strong>Důvody, proč je cíl důležitý:</strong> Zamyslete se
                    nad tím, co vás k cíli vede a proč je pro vás osobně
                    významný.
                  </li>
                  <li>
                    <strong>
                      Dopad, který dosažení cíle bude mít na váš život:
                    </strong>{" "}
                    Popište konkrétně, jaké pozitivní změny očekáváte.
                    Například, jak se budete cítit, co nového získáte, nebo jak
                    to ovlivní vaše okolí.
                  </li>
                  <li>
                    <strong>Změny, které očekáváte:</strong> Uveďte, jaká
                    zlepšení nastanou ve vašem životě – například lepší zdraví,
                    větší sebedůvěra, nové dovednosti nebo efektivnější zvládání
                    problémů.
                  </li>
                </ul>
              </div>
            </div>
          </section>
          <div className="border-b-2"></div>
          {/* Destination Section */}{" "}
          <section className="px-12">
            <div className="flex items-center space-x-4 mb-5">
              <div className="w-12 h-12 rounded-full bg-yellow-500 flex items-center justify-center text-white font-bold text-lg">
                3
              </div>
              <h2 className="text-xl md:text-3xl font-bold">
                Destinace - Jaký přesný cíl chcete dosáhnout?
              </h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-1 md:gap-8 space-y-6 lg:space-y-0">
              <div className="space-y-6">
                <input
                  type="text"
                  name="destination"
                  value={formData.destination}
                  onChange={handleInputChange}
                  required
                  className="w-full px-5 py-3 bg-gray-100 rounded-lg text-gray-800 focus:outline-none focus:ring-4 focus:ring-blue-500"
                  placeholder="Definujte svůj přesný cíl"
                />
              </div>
              <div className="bg-gray-100 p-6 rounded-lg">
                <h3 className="text-xl font-bold mb-2">
                  Jak definovat přesný cíl?
                </h3>
                <p className="text-gray-600">
                  Jak definovat svou destinaci? Popište přesný výsledek:
                  Zamyslete se nad tím, co bude zřetelně označovat váš úspěch.
                  Například: „Běhám pravidelně 5 km bez přestávky.“ „Udržuji
                  zdravou stravu po dobu tří měsíců bez porušení.“ Vytvořte si
                  vizualizaci: Představte si, jaký bude váš život v okamžiku
                  dosažení cíle. Co budete mít, jak se budete cítit, a co budete
                  dělat jinak? Například: „Budu mít více energie, zlepším svou
                  kondici a budu se cítit dobře ve svém těle.“ Stanovte
                  měřitelné ukazatele: Destinace by měla být ověřitelná. Jak
                  poznáte, že jste cíle dosáhli? Například: „Uběhl jsem 5 km za
                  méně než 30 minut.“
                </p>
              </div>
            </div>
            <div className="pt-5 gap-1 md:gap-8 space-y-6 lg:space-y-0">
              <div className="bg-gray-100 p-6 rounded-lg">
                <h3 className="text-xl font-bold mb-2">
                  Příklady definice destinace:
                </h3>
                <ul className="list-disc pl-6 text-gray-600 leading-relaxed">
                  <li>
                    <strong>Fitness destinace:</strong> „Pravidelně běhám 5 km
                    třikrát týdně, cítím se energický a mám lepší fyzickou
                    kondici.“
                  </li>
                  <li>
                    <strong>Zdravotní destinace:</strong> „Udržuji zdravou
                    stravu a mé výsledky krevních testů ukazují zlepšení.“
                  </li>
                  <li>
                    <strong>Kariérní destinace:</strong> „Získal jsem
                    certifikaci v IT a našel si práci jako junior programátor.“
                  </li>
                </ul>
              </div>
            </div>
          </section>
          <div className="border-b-2"></div>
          {/* New Self Section */}{" "}
          <section className="px-12">
            <div className="flex items-center space-x-4 mb-5">
              <div className="w-12 h-12 rounded-full bg-purple-500 flex items-center justify-center text-white font-bold text-lg">
                4
              </div>
              <h2 className="text-xl md:text-3xl font-bold">
                Definujte své nové já -Já 2.0y
              </h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2gap-1 md:gap-8 space-y-6 lg:space-y-0">
              <div className="space-y-6">
                <textarea
                  name="new_self"
                  value={formData.new_self}
                  onChange={handleInputChange}
                  required
                  className="w-full px-5 py-3 bg-gray-100 rounded-lg text-gray-800 focus:outline-none focus:ring-4 focus:ring-blue-500"
                  placeholder="Popište svou ideální verzi sebe samého"
                />
              </div>
              <div className="bg-gray-100 p-6 rounded-lg">
                <h3 className="text-xl font-bold mb-2">
                  Jak definovat své nové já?
                </h3>
                <p className="text-gray-600">
                  „Já 2.0“ představuje vaši ideální verzi – vylepšené,
                  vyspělejší já, které je výsledkem vašeho úsilí a změn, které
                  chcete ve svém životě zavést. Tento koncept vám umožňuje
                  zaměřit se na to, kým chcete být, a vytvářet kroky vedoucí k
                  této transformaci.
                </p>
                <div className="text-gray-700 leading-relaxed space-y-4">
                  <p>
                    <strong>Popište svou ideální verzi sebe samého:</strong>
                  </p>
                  <ul className="list-disc pl-6">
                    <li>
                      <strong>Vlastnosti, které chcete rozvíjet:</strong>{" "}
                      Například větší sebedůvěra, odolnost nebo kreativita.
                    </li>
                    <li>
                      <strong>Dovednosti, které chcete získat:</strong>{" "}
                      Například efektivní komunikace, programování nebo
                      schopnost lépe plánovat.
                    </li>
                    <li>
                      <strong>Zvyky, které chcete zavést:</strong> Například
                      pravidelné cvičení, zdravé stravování nebo čtení každý
                      den.
                    </li>
                  </ul>
                  <p>
                    <strong>Jak definovat své nové já?</strong>
                  </p>
                  <ol className="list-decimal pl-6">
                    <li>
                      <strong>Vytvořte si jasnou vizi:</strong> Zamyslete se,
                      jak chcete, aby vás vnímali ostatní a jak budete jednat
                      jinak.
                    </li>
                    <li>
                      <strong>Zaměřte se na specifické oblasti:</strong>
                      <ul className="list-disc pl-6 mt-2">
                        <li>
                          <strong>Osobní růst:</strong> Jaké vlastnosti chcete
                          zlepšit? Například být odvážnější nebo trpělivější.
                        </li>
                        <li>
                          <strong>Zdraví:</strong> Jak budete pečovat o své tělo
                          a mysl?
                        </li>
                        <li>
                          <strong>Kariéra:</strong> Jaké nové schopnosti nebo
                          úspěchy chcete dosáhnout?
                        </li>
                        <li>
                          <strong>Vztahy:</strong> Jak budete podporovat a
                          budovat své vztahy?
                        </li>
                      </ul>
                    </li>

                    <li>
                      <strong>Spojte své „nové já“ s vašimi cíli:</strong> Jak
                      vaše nové já přispívá k dosažení vašich snů a plánů?
                    </li>
                  </ol>
                  <p>
                    <strong>Příklad „Já 2.0“:</strong>
                  </p>
                  <ul className="list-disc pl-6">
                    <p>
                      {" "}
                      „Jsem sebevědomý člověk, který si věří ve svých
                      rozhodnutích a neustále se učí nové věci. K tomu každý den
                      cvičím alespoň 30 minut a dbám na vyváženou stravu. Moje
                      práce mě naplňuje a baví, našel jsem k ní pozitivní
                      přístup.
                    </p>
                    <li>
                      <strong>Vztahy:</strong> „Jsem empatický a pozorný k
                      potřebám svých blízkých.“
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </section>
          <div className="border-b-2"></div>
          {/* Daily Activities Section */}
          <section className="px-12">
            <div className="flex items-center space-x-4 mb-5">
              <div className="w-12 h-12 rounded-full bg-red-500 flex items-center justify-center text-white font-bold text-lg">
                5
              </div>
              <h2 className="text-xl md:text-3xl font-bold">
                Denní aktivity pro dosažení cíle
              </h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-1 md:gap-8 space-y-2 lg:space-y-0">
              <div className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-lg font-semibold mb-2">
                      Denní akce - Co budete dělat?
                    </label>
                    <input
                      type="text"
                      name="daily_action"
                      value={formData.daily_action}
                      onChange={handleInputChange}
                      required
                      className="w-full px-5 py-3 bg-gray-100 rounded-lg text-gray-800 focus:outline-none focus:ring-4 focus:ring-blue-500"
                      placeholder="Např.: Cvičení v posilovně"
                    />
                  </div>
                  <div>
                    <label className="block text-lg font-semibold mb-2">
                      Denní vzdělávání - Co se naučíte?
                    </label>
                    <input
                      type="text"
                      name="daily_learning"
                      value={formData.daily_learning}
                      onChange={handleInputChange}
                      required
                      className="w-full px-5 py-3 bg-gray-100 rounded-lg text-gray-800 focus:outline-none focus:ring-4 focus:ring-blue-500"
                      placeholder="Např.: Naučit se více o zdravé výživě"
                    />
                  </div>
                  <div>
                    <label className="block text-lg font-semibold mb-2">
                      Denní vizualizace - Vcítění do svého druhého já
                    </label>
                    <input
                      type="text"
                      name="daily_visualization"
                      value={formData.daily_visualization}
                      onChange={handleInputChange}
                      required
                      className="w-full px-5 py-3 bg-gray-100 rounded-lg text-gray-800 focus:outline-none focus:ring-4 focus:ring-blue-500"
                      placeholder="Např.: Meditace, vizualizace vašeho budoucího já"
                    />
                  </div>
                </div>
              </div>
              <div className="bg-gray-100 p-6 rounded-lg">
                <h3 className="text-xl font-bold mb-2">
                  Jak definovat denní aktivity?
                </h3>
                <p className="text-gray-600">
                  Denní aktivity jsou klíčovým prvkem při přeměně plánů na
                  realitu. Pomáhají vám pravidelně pracovat na vašem cíli a
                  udržovat si motivaci. Měly by být strukturované, různorodé a
                  zaměřené na tři základní oblasti: fyzické akce, vzdělávání a
                  vizualizace.
                </p>
              </div>
            </div>

            <div className="pt-5 gap-1 md:gap-8 space-y-6 lg:space-y-0">
              <div className="bg-gray-100 p-6 rounded-lg">
                <div className="text-gray-700 leading-relaxed space-y-4">
                  <p>
                    <strong>Denní akce – Co budete dělat?</strong>
                  </p>
                  <ul className="list-disc pl-6">
                    <li>
                      Fyzické činnosti, které vás přibližují k vašemu cíli.{" "}
                      <em>Příklad:</em> Cvičení v posilovně, běhání, domácí
                      trénink.
                    </li>
                    <li>
                      <strong>Tip:</strong> Vyberte si aktivitu, která vás baví,
                      aby se stala přirozenou součástí vašeho dne.
                    </li>
                  </ul>
                  <p>
                    <strong>Denní vzdělávání – Co se naučíte?</strong>
                  </p>
                  <ul className="list-disc pl-6">
                    <li>
                      Každý den by měl obsahovat vzdělávací prvek.{" "}
                      <em>Příklad:</em> Naučit se více o zdravé výživě, sledovat
                      online kurz, číst knihu o produktivitě.
                    </li>
                    <li>
                      <strong>Tip:</strong> Soustřeďte se na malé kroky. Stačí
                      15–30 minut denně.
                    </li>
                  </ul>
                  <p>
                    <strong>
                      Denní vizualizace – Vcítění do svého druhého já
                    </strong>
                  </p>
                  <ul className="list-disc pl-6">
                    <li>
                      Vizualizace vám pomůže přiblížit se vašemu budoucímu já.{" "}
                      <em>Příklad:</em> Meditace, deník vděčnosti, mentální
                      představa vašeho ideálního já.
                    </li>
                    <li>
                      <strong>Tip:</strong> Vyhraďte si klidný čas, například
                      ráno nebo večer.
                    </li>
                  </ul>
                  <p>
                    <strong>Příklad denního plánu aktivit:</strong>
                  </p>
                  <ul className="list-disc pl-6">
                    <li>
                      <strong>Denní akce:</strong> Ranní běh 3 km nebo 30 minut
                      cvičení doma.
                    </li>
                    <li>
                      <strong>Denní vzdělávání:</strong> Přečtení jedné kapitoly
                      z knihy o zdravé výživě.
                    </li>
                    <li>
                      <strong>Denní vizualizace:</strong> 10 minut meditace a
                      představa, jak se cítíte ve své ideální verzi „Já 2.0“.
                    </li>
                  </ul>
                </div>
                <h3 className="text-xl md:text-3xl font-extrabold p-4 text-center  bg-gradient-to-r from-blue-500 via-purple-600 to-red-500 text-transparent bg-clip-text ">
                  55 minut času denně vás dělí od vašeho cíle
                </h3>
              </div>
            </div>
          </section>
          <div className="border-b-2"></div>
          {/* Duration Section */}{" "}
          <section className="px-12">
            <div className="flex items-center space-x-4 mb-5">
              <div className="w-12 h-12 rounded-full bg-teal-500 flex items-center justify-center text-white font-bold text-lg">
                6
              </div>
              <h2 className="text-xl md:text-3xl font-bold">
                Jak dlouho chcete cíle držet?
              </h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-1 md:gap-8 space-y-6 lg:space-y-0">
              <div className="space-y-6">
                <select
                  name="duration"
                  value={formData.duration}
                  onChange={handleInputChange}
                  required
                  className="w-full px-5 py-3 bg-gray-100 rounded-lg text-gray-800 focus:outline-none focus:ring-4 focus:ring-blue-500"
                >
                  <option value="">Vyberte délku trvání</option>
                  <option value="30">
                    30 dní - Ideální pro rychlé nastavení nových zvyků.
                  </option>
                  <option value="50">
                    50 dní - Vhodné pro hlubší zakořenění nových návyků.
                  </option>
                  <option value="90">
                    90 dní - Pro dosažení skutečné změny a vytvoření stabilního
                    zvyku.
                  </option>
                  <option value="120">
                    120 dní - Vytvořte pevný základ pro celoživotní změnu.
                  </option>
                </select>
              </div>
              <div className="bg-gray-100 p-6 rounded-lg">
                <h3 className="text-xl font-bold mb-2">
                  Jak zvolit délku trvání?
                </h3>
                <p className="text-gray-600">
                  Zvolte délku trvání podle toho, jak dlouho chcete pracovat na
                  svém cíli. 30 dní je vhodné pro rychlý start, zatímco 90 nebo
                  120 dní vám umožní vytvořit pevné návyky a dosáhnout hlubokých
                  změn.
                </p>
              </div>
            </div>
          </section>
          <div className="flex justify-center">
            <button
              type="submit"
              className="px-16 py-4 bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 rounded-lg text-2xl font-bold text-white transition-transform transform hover:scale-110 shadow-xl"
            >
              Odeslat plán
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GoalFormPage;
