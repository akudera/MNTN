import "../scss/blocks/hero.scss";

export class HeroParallax {
  hero: HTMLElement | null;
  isTicking: boolean;
  layers: NodeListOf<HTMLElement>;

  selectors = {
    hero: "hero",
    scrollSpeed: "[data-scroll-speed]",
  };

  constructor() {
    this.hero = document.getElementById(this.selectors.hero) as HTMLElement;
    this.isTicking = false;
    this.layers = this.hero
      ? this.hero.querySelectorAll<HTMLElement>(this.selectors.scrollSpeed)
      : new (NodeList as any)();

    this.bindEvents();
  }

  bindEvents() {
    document.addEventListener("scroll", () => {
      if (!this.isTicking) {
        this.isTicking = true;
        window.requestAnimationFrame(() => {
          this.updateParallax();
          this.isTicking = false;
        });
      }
    });
  }

  updateParallax(): void {
    if (!this.hero || window.scrollY >= this.hero.offsetHeight) return;

    this.layers.forEach((el) => {
      const speed = parseFloat(el.dataset.scrollSpeed || "1");

      el.style.translate = `0 ${scrollY * speed}px`;
    });
  }
}
