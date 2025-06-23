import { useState, useEffect } from "react";

const MOBILE_BREAKPOINT = 768;

export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;

    const width = window.innerWidth;
    const isUserAgentMobile =
      /Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(
        navigator.userAgent
      );

    return width < MOBILE_BREAKPOINT || isUserAgentMobile;
  });

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const isUserAgentMobile =
        /Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(
          navigator.userAgent
        );

      setIsMobile(width < MOBILE_BREAKPOINT || isUserAgentMobile);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return isMobile;
}
