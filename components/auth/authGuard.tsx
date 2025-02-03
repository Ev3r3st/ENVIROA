"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

const useAuthGuard = () => {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = Cookies.get("token");

    if (!token) {
      router.replace("/"); // Přesměrování na přihlašovací stránku, pokud token chybí
    } else {
      setAuthorized(true);
    }
    setLoading(false);
  }, [router]);

  return { authorized, loading };
};

export default useAuthGuard;
