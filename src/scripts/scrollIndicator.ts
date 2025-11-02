import "@/scss/blocks/scroll-indicator.scss";
import { pageSizes } from "./utils";

export class ScrollIndicator {
  scrollIndicator: HTMLElement | null;
  indicatorLinks?: HTMLCollectionOf<HTMLElement>;
  navigationList: HTMLElement | null;

  firstSection: HTMLElement | null;
  secondSection: HTMLElement | null;
  thirdSection: HTMLElement | null;

  animationTimer: ReturnType<typeof setTimeout> | null = null;

  isScrollWatchingBlocked: boolean;

  selectors = {
    indicator: "scroll-indicator",
    indicatorLink: "data-js-indicator-link",
    navigation: "nav-link",
    firstSection: "section-01",
    secondSection: "section-02",
    thirdSection: "section-03",
  } as const;

  stateClasses = {
    isActive: "is-active",
  } as const;

  constructor() {
    this.scrollIndicator = document.getElementById(this.selectors.indicator);
    this.navigationList = document.getElementById(this.selectors.navigation);
    this.indicatorLinks = this.navigationList?.children as HTMLCollectionOf<HTMLElement>;

    this.firstSection = document.getElementById(this.selectors.firstSection);
    this.secondSection = document.getElementById(this.selectors.secondSection);
    this.thirdSection = document.getElementById(this.selectors.thirdSection);

    this.isScrollWatchingBlocked = false;

    this.bindEvents();
  }

  bindEvents(): void {
    this.navigationList?.addEventListener("mouseover", (event) => {
      if (
        document.documentElement.clientWidth >= pageSizes.mobileWidth &&
        window.matchMedia("(pointer: fine)").matches &&
        document.documentElement.clientHeight >= pageSizes.mobileHeight
      ) {
        this.onMouseOver(event);
      }
    });
    this.navigationList?.addEventListener("mouseout", (event) => {
      if (
        document.documentElement.clientWidth >= pageSizes.mobileWidth &&
        window.matchMedia("(pointer: fine)").matches &&
        document.documentElement.clientHeight >= pageSizes.mobileHeight
      ) {
        this.onMouseOut(event);
      }
    });
    this.navigationList?.addEventListener("click", (event) => {
      this.onClick(event);
    });
    document.addEventListener("scroll", () => {
      if (
        document.documentElement.clientWidth >= pageSizes.mobileWidth &&
        document.documentElement.clientHeight >= pageSizes.mobileHeight
      ) {
        this.onScroll();
      }
    });
  }

  updateActiveElement(navigationLink: HTMLElement) {
    if (!this.navigationList) return;

    Array.from(this.navigationList.children as Iterable<HTMLElement>).forEach((element) => {
      if (element !== navigationLink) {
        element.classList.remove(this.stateClasses.isActive);
      }
    });
    navigationLink.classList.add(this.stateClasses.isActive);
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

    const activeElement = this.navigationList.querySelector(
      `.${this.stateClasses.isActive}`
    ) as HTMLElement;
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

  onClick(event: PointerEvent) {
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

  onScroll() {
    if (
      !this.firstSection ||
      !this.secondSection ||
      !this.thirdSection ||
      !this.indicatorLinks ||
      this.isScrollWatchingBlocked
    )
      return;

    const scrollCenter = scrollY + document.documentElement.clientHeight / 2;

    const thirdSectionRect = this.thirdSection.getBoundingClientRect();
    if (scrollCenter >= scrollY + thirdSectionRect.top + thirdSectionRect.height * 0.15) {
      this.updateActiveElement(this.indicatorLinks[3]);
      this.updateIndicatorPosition(3);
      return;
    }
    const secondSectionRect = this.secondSection.getBoundingClientRect();
    if (
      scrollCenter >= scrollY + secondSectionRect.top + secondSectionRect.height * 0.15 &&
      scrollCenter <=
        scrollY + secondSectionRect.top + secondSectionRect.height - secondSectionRect.height * 0.15
    ) {
      this.updateActiveElement(this.indicatorLinks[2]);
      this.updateIndicatorPosition(2);
      return;
    }
    const firstSectionRect = this.firstSection.getBoundingClientRect();
    if (
      scrollY !== 0 &&
      scrollCenter >= scrollY + firstSectionRect.top + firstSectionRect.height * 0.15 &&
      scrollCenter <=
        scrollY + firstSectionRect.top + firstSectionRect.height - firstSectionRect.height * 0.15
    ) {
      this.updateActiveElement(this.indicatorLinks[1]);
      this.updateIndicatorPosition(1);
      return;
    }
    if (scrollY === 0 || scrollCenter < scrollY + firstSectionRect.top) {
      this.updateActiveElement(this.indicatorLinks[0]);
      this.updateIndicatorPosition(0);
    }
  }

  updateIndicatorPosition(elementIndex: number): void {
    if (elementIndex < 0 || !this.scrollIndicator) return;

    this.scrollIndicator.style.setProperty("--active-index", elementIndex.toString());
  }
}
