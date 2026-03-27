"use client";

import { useEffect, useState } from "react";

export const useScrollPosition = () => {
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    const updateScrollPosition = () => {
      setScrollPosition(window.scrollY || window.pageYOffset || 0);
    };

    updateScrollPosition();
    window.addEventListener("scroll", updateScrollPosition, { passive: true });

    return () => {
      window.removeEventListener("scroll", updateScrollPosition);
    };
  }, []);

  return scrollPosition;
};
