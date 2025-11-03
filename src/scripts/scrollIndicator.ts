import "@/scss/blocks/scroll-indicator.scss";
import { pageSizes } from "./utils";

export class ScrollIndicator {
  scrollIndicator: HTMLElement | null;
  indicatorLinks: HTMLElement[];
  navigationList: HTMLElement | null;

  sections: (HTMLElement | null)[];

  observer: IntersectionObserver | null = null;
  sectionToLink: Map<Element, HTMLElement> = new Map();

  animationTimer: ReturnType<typeof setTimeout> | null = null;

  isScrollWatchingBlocked: boolean;

  selectors = {
    indicator: "scroll-indicator",
    indicatorLink: "data-js-indicator-link",
    navigation: "nav-link",
    hero: "hero",
    firstSectionObserve: "section-01-observe",
    secondSection: "section-02",
    thirdSection: "section-03",
  } as const;

  stateClasses = {
    isActive: "is-active",
  } as const;

  constructor() {
    this.scrollIndicator = document.getElementById(this.selectors.indicator);
    this.navigationList = document.getElementById(this.selectors.navigation);
    this.indicatorLinks =
      Array.from(this.navigationList?.children as HTMLCollectionOf<HTMLElement>) || [];

    this.sections = [
      document.getElementById(this.selectors.hero),
      document.getElementById(this.selectors.firstSectionObserve),
      document.getElementById(this.selectors.secondSection),
      document.getElementById(this.selectors.thirdSection),
    ];

    this.isScrollWatchingBlocked = false;

    this.bindEvents();
  }

  bindEvents(): void {
    this.navigationList?.addEventListener("mouseover", (event) => {
      if (
        matchMedia("(pointer: fine)").matches &&
        document.documentElement.clientWidth >= pageSizes.mobileWidth &&
        document.documentElement.clientHeight >= pageSizes.mobileHeight
      ) {
        this.onMouseOver(event);
      }
    });
    this.navigationList?.addEventListener("mouseout", (event) => {
      if (
        matchMedia("(pointer: fine)").matches &&
        document.documentElement.clientWidth >= pageSizes.mobileWidth &&
        document.documentElement.clientHeight >= pageSizes.mobileHeight
      ) {
        this.onMouseOut(event);
      }
    });
    this.navigationList?.addEventListener("click", (event) => {
      this.onClick(event);
    });
    this.initObserver();
  }

  updateActiveElement(activeLink: HTMLElement): void {
    if (!this.indicatorLinks) return;

    this.indicatorLinks.forEach((link) => {
      link.classList.toggle(this.stateClasses.isActive, link === activeLink);
    });
    activeLink.classList.add(this.stateClasses.isActive);

    const activeLinkIndex = this.indicatorLinks.indexOf(activeLink);
    this.updateIndicatorPosition(activeLinkIndex);
  }

  onMouseOver(event: MouseEvent): void {
    if (this.isScrollWatchingBlocked || !this.indicatorLinks || !this.navigationList) return;

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
    if (this.isScrollWatchingBlocked || !this.indicatorLinks || !this.navigationList) return;

    const target = event.target as HTMLElement;
    if (target === this.navigationList || !this.navigationList.contains(target)) return;

    const activeElement = this.navigationList.querySelector<HTMLElement>(
      `.${this.stateClasses.isActive}`
    );
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

  onClick(event: PointerEvent): void {
    if (!this.indicatorLinks) return;
    const target = event.target as HTMLElement;

    if (target !== this.navigationList && this.navigationList?.contains(target)) {
      this.isScrollWatchingBlocked = true;
      this.updateActiveElement(target);
      this.updateIndicatorPosition(Array.from(this.indicatorLinks).indexOf(target));

      window.addEventListener(
        "scrollend",
        () => {
          this.isScrollWatchingBlocked = false;
        },
        { once: true }
      );
    }
  }

  initObserver(): void {
    this.sections.forEach((section, index) => {
      const link = this.indicatorLinks[index];
      if (section && link) {
        this.sectionToLink.set(section, link);
      }
    });

    this.observer = new IntersectionObserver(
      (entries) => {
        if (
          this.isScrollWatchingBlocked ||
          document.documentElement.clientWidth <= pageSizes.mobileWidth ||
          document.documentElement.clientHeight <= pageSizes.mobileHeight
        )
          return;

        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const link = this.sectionToLink.get(entry.target);
            if (link) {
              this.updateActiveElement(link);
            }
          }
        });
      },
      {
        rootMargin: "-50% 0px -50% 0px",
        threshold: 0,
      }
    );

    this.sections.forEach((section) => {
      if (section) this.observer?.observe(section);
    });
  }

  updateIndicatorPosition(elementIndex: number): void {
    if (elementIndex < 0 || !this.scrollIndicator) return;

    this.scrollIndicator.style.setProperty("--active-index", elementIndex.toString());
  }
}
