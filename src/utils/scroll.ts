export function animateScrollToTop() {
  void scrollToTopAsync();
}

export function scrollToTopAsync(duration = 500): Promise<void> {
  return new Promise((resolve) => {
    // Cálculo da distância a rolar por tick
    const cosParameter = window.scrollY / 2;
    let scrollCount = 0;
    let oldTimestamp = performance.now();

    function step(newTimestamp: number) {
      scrollCount += Math.PI / (duration / (newTimestamp - oldTimestamp));
      if (scrollCount >= Math.PI) window.scrollTo(0, 0);
      if (window.scrollY === 0) resolve(); // Finaliza a promessa quando chega ao topo
      if (scrollCount < Math.PI) {
        oldTimestamp = newTimestamp;
        window.scrollTo(
          0,
          Math.round(cosParameter + cosParameter * Math.cos(scrollCount)),
        );
        window.requestAnimationFrame(step);
      }
    }

    window.requestAnimationFrame(step);
  });
}
