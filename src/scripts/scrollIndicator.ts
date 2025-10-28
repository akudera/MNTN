import "@/scss/blocks/scroll-indicator.scss";

export class ScrollIndicator {
  scrollIndicator: HTMLElement | null;
  indicatorLinks?: HTMLCollectionOf<HTMLElement>;
  navigationList: HTMLElement | null;

  animationTimer: ReturnType<typeof setTimeout> | null = null;

  selectors = {
    indicator: "scroll-indicator",
    indicatorLink: "data-js-indicator-link",
    navigation: "nav-link",
  } as const;

  constructor() {
    this.scrollIndicator = document.getElementById(this.selectors.indicator);
    this.navigationList = document.getElementById(this.selectors.navigation);
    this.indicatorLinks = this.navigationList?.children as HTMLCollectionOf<HTMLElement>;

    this.bindEvents();
  }

  bindEvents(): void {
    this.navigationList?.addEventListener("mouseover", (event) => {
      if (innerWidth >= 620 && window.matchMedia("(pointer: fine)").matches && innerHeight >= 470) {
        this.onMouseOver(event);
      }
    });
    this.navigationList?.addEventListener("mouseout", (event) => {
      if (innerWidth >= 620 && window.matchMedia("(pointer: fine)").matches && innerHeight >= 470) {
        this.onMouseOut(event);
      }
    });
  }

  onMouseOver(event: MouseEvent): void {
    if (!this.indicatorLinks || !this.navigationList) return;

    const target = event.target as HTMLElement;
    if (target === this.navigationList || !this.navigationList.contains(target)) return;
    if (this.animationTimer) {
      clearTimeout(this.animationTimer);
      this.animationTimer = null;
    }

    const elementIndex = Array.from(this.indicatorLinks).indexOf(target);

    this.updateIndicatorPosition(elementIndex);
  }

  onMouseOut(event: MouseEvent): void {
    if (!this.indicatorLinks || !this.navigationList) return;

    const target = event.target as HTMLElement;
    if (target === this.navigationList || !this.navigationList.contains(target)) return;

    const activeElement = this.navigationList.querySelector(".active") as HTMLElement;
    let elementIndex: number;
    if (activeElement) {
      elementIndex = Array.from(this.indicatorLinks).indexOf(activeElement);
    } else {
      elementIndex = 0;
    }

    this.animationTimer = setTimeout(() => {
      this.updateIndicatorPosition(elementIndex);
    }, 200);
  }

  updateIndicatorPosition(elementIndex: number): void {
    if (elementIndex < 0 || !this.scrollIndicator) return;

    this.scrollIndicator.style.setProperty("--active-index", elementIndex.toString());
  }
}
