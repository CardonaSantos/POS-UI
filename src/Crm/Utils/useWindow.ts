import { useState, useEffect } from "react";

export function useWindowScrollPosition() {
  const [atBottom, setAtBottom] = useState(false);

  useEffect(() => {
    const handler = () => {
      const scrollY = window.scrollY || window.pageYOffset;
      const vh = window.innerHeight;
      const pageH = document.documentElement.scrollHeight;
      setAtBottom(scrollY + vh >= pageH - 2);
    };

    // 1) Sólo escuchamos al scroll, NO ejecutamos handler() de inicio
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return atBottom;
}
