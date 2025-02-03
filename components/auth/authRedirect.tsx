"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

const useAuthRedirect = () => {
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get("token");

    if (token) {
      router.push("/dashboard"); // Přesměrování na dashboard, pokud token existuje
    }
  }, [router]);
};

export default useAuthRedirect;
