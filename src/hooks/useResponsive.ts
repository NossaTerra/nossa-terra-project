import { useMediaQuery } from "react-responsive";

export const useIsMobile = () => useMediaQuery({ query: "(max-width: 768px)" });

export const useIsTablet = () =>
  useMediaQuery({ query: "(min-width: 769px) and (max-width: 1199px)" });

export const useIsDesktop = () =>
  useMediaQuery({ query: "(min-width: 1200px)" });

export const useResponsive = () => {
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  const isDesktop = useIsDesktop();

  return { isMobile, isTablet, isDesktop };
};
