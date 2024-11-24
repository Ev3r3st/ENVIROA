// authGuard.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const useAuthGuard = () => {
  const router = useRouter();

  useEffect(() => {
    // Kontrola, zda je token uložen v Local Storage
    const token = localStorage.getItem("token");

    if (!token) {
      // Pokud není token přítomen, přesměrujeme na přihlašovací stránku
      router.push("/");
    }
  }, [router]);
};

export default useAuthGuard;
