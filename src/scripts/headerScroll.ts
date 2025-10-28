import "@/scss/blocks/header.scss";

export class HeaderScroll {
  header: HTMLElement | null;
  HeaderTop = 0;

  isTicking: boolean = false;

  selectors = {
    header: "header",
  };

  stateClasses = {
    fixed: "fixed",
  };

  constructor() {
    this.header = document.getElementById(this.selectors.header) as HTMLElement;

    if (this.header) {
      this.HeaderTop = this.header.getBoundingClientRect().top;
    }

    this.bindEvents();
  }

  bindEvents(): void {
    document.addEventListener("scroll", () => {
      if (!this.isTicking) {
        window.requestAnimationFrame(() => {
          this.onScroll();
          this.isTicking = false;
        });
        this.isTicking = true;
      }
    });
  }

  onScroll(): void {
    if (!this.header) return;
    const headerPadding = parseInt(
      getComputedStyle(this.header).getPropertyValue("--header-padding")
    );

    if (window.scrollY > this.HeaderTop - headerPadding) {
      this.header.classList.add(this.stateClasses.fixed);
    } else {
      this.header.classList.remove(this.stateClasses.fixed);
    }
  }
}
