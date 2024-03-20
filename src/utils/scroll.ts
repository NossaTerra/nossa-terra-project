export const animateScrollToTop = () => {
  const c = document.documentElement.scrollTop || document.body.scrollTop;
  if (c > 0) {
    window.requestAnimationFrame(animateScrollToTop);
    window.scrollTo(0, c - c / 8);
  }
};
