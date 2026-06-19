import { useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";

const scrollPositions = {};

export default function useScrollPreservation(containerRef) {
  const location = useLocation();
  const prevPath = useRef(location.pathname);

  // Save scroll position before route change
  useEffect(() => {
    const container = containerRef?.current;
    return () => {
      if (container) {
        scrollPositions[prevPath.current] = container.scrollTop;
      }
      prevPath.current = location.pathname;
    };
  }, [location.pathname, containerRef]);

  // Restore scroll position on mount
  useEffect(() => {
    const container = containerRef?.current;
    if (!container) return;
    const saved = scrollPositions[location.pathname] ?? 0;
    container.scrollTop = saved;
  }, [location.pathname, containerRef]);
}