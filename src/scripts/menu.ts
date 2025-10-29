import { debounce } from "./utils";

export class Menu {
  openMenuButton: HTMLButtonElement | null;
  closeMenuButton: HTMLButtonElement | null;
  menuDialog: HTMLDialogElement | null;

  duration: number;
  isOpen: boolean;
  isAnimating: boolean;

  selectors = {
    openMenuButton: "open-menu-button",
    closeMenuButton: "close-menu-button",
    menu: "menu",
  };

  stateClasses = {
    isLocked: "is-locked",
    fadeIn: "fade-in",
    fadeOut: "fade-out",
  };

  constructor() {
    this.openMenuButton = document.getElementById(
      this.selectors.openMenuButton
    ) as HTMLButtonElement;
    this.closeMenuButton = document.getElementById(
      this.selectors.closeMenuButton
    ) as HTMLButtonElement;
    this.menuDialog = document.getElementById(this.selectors.menu) as HTMLDialogElement;
    this.isOpen = false;
    this.isAnimating = false;

    this.duration =
      parseFloat(
        getComputedStyle(document.documentElement).getPropertyValue("--transition-duration")
      ) * 1000;

    this.bindEvents();
  }

  bindEvents(): void {
    this.openMenuButton?.addEventListener("click", () => {
      this.openMenu();
    });
    this.closeMenuButton?.addEventListener("click", () => {
      this.closeMenu();
    });
    document.documentElement?.addEventListener("keydown", (event) => {
      this.keyboardHandler(event);
    });
    window.addEventListener(
      "resize",
      debounce(() => {
        this.onResize();
      }, 100)
    );
  }

  openMenu() {
    if (this.isOpen || this.isAnimating) return;

    this.isAnimating = true;
    this.isOpen = true;
    this.menuDialog?.showModal();

    this.menuDialog?.addEventListener(
      "transitionend",
      () => {
        this.isAnimating = false;
      },
      { once: true }
    );

    document.documentElement.classList.add(this.stateClasses.isLocked);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        this.menuDialog?.classList.add(this.stateClasses.fadeIn);
      });
    });
  }

  closeMenu() {
    if (!this.isOpen || this.isAnimating) return;

    this.isOpen = false;
    this.isAnimating = true;
    this.menuDialog?.classList.add(this.stateClasses.fadeOut);
    this.menuDialog?.classList.remove(this.stateClasses.fadeIn);

    document.documentElement.classList.remove(this.stateClasses.isLocked);
    setTimeout(() => {
      this.menuDialog?.close();
      this.menuDialog?.classList.remove(this.stateClasses.fadeOut);
      this.isAnimating = false;
    }, this.duration);
  }

  keyboardHandler(event: KeyboardEvent) {
    if (this.isOpen && event.key === "Escape") {
      event.preventDefault();
      this.closeMenu();
    }
  }

  onResize() {
    if (this.isOpen && innerWidth >= 620) {
      this.closeMenu();
    }
  }
}
