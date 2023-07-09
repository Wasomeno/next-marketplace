import { useLayoutEffect, useState } from "react";

export function useViewport() {
  const [viewport, setViewport] = useState({ width: 0, height: 0 });
  useLayoutEffect(() => {
    setViewport((currentViewport) => ({
      ...currentViewport,
      width: window.innerWidth,
      height: window.innerHeight,
    }));

    window.addEventListener("resize", () =>
      setViewport((currentViewport) => ({
        ...currentViewport,
        width: window.innerWidth,
        height: window.innerHeight,
      }))
    );
  }, []);

  return viewport;
}
