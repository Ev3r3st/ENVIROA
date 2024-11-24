// authRedirect.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const useAuthRedirect = () => {
  const router = useRouter();

  useEffect(() => {
    // Kontrola, zda je token uložen v Local Storage
    const token = localStorage.getItem("token");

    if (token) {
      // Pokud token je přítomen, přesměrujeme na dashboard
      router.push("/dashboard");
    }
  }, [router]);
};

export default useAuthRedirect;
