import "../scss/blocks/hero.scss";

export class HeroParallax {
  hero: HTMLElement | null;
  isTicking: boolean;

  selectors = {
    hero: "hero",
    scrollSpeed: "[data-scroll-speed]",
  };

  constructor() {
    this.hero = document.getElementById(this.selectors.hero) as HTMLElement;

    this.isTicking = false;
    this.bindEvents();
  }

  bindEvents() {
    document.addEventListener("scroll", () => {
      this.onScroll();
    });
  }

  updateParallax(): void {
    if (!this.hero || scrollY >= this.hero.getBoundingClientRect().height) return;
    const layers = this.hero.querySelectorAll<HTMLElement>(this.selectors.scrollSpeed);

    layers.forEach((el) => {
      const speed = parseFloat(el.dataset.scrollSpeed || "1");

      el.style.translate = `0 ${scrollY * speed}px`;
    });
  }

  onScroll(): void {
    if (!this.isTicking) {
      requestAnimationFrame(() => {
        this.updateParallax();
        this.isTicking = false;
      });
    }
    this.isTicking = true;
  }
}
