// authGuard.tsx
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
      router.replace("/"); // Používáme replace pro rychlejší přesměrování
    } else {
      setAuthorized(true);
    }
    setLoading(false);
  }, [router]);

  return { authorized, loading };
};

export default useAuthGuard;
