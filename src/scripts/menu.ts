import { debounce, pageSizes } from "./utils";

export class Menu {
  header: HTMLElement | null;
  handleMenuButton: HTMLButtonElement | null;
  menuDialog: HTMLElement | null;

  duration: number;
  isOpen: boolean;
  isAnimating: boolean;

  selectors = {
    visuallyHidden: "visually-hidden",
    menuButton: "menu-button",
    closeMenuButton: "close-menu-button",
    header: "header",
    menu: "menu",
  } as const;

  stateClasses = {
    isLocked: "is-locked",
    fadeIn: "fade-in",
    fadeOut: "fade-out",
    isOpen: "is-modal-open",
    closeButtonMode: "close-mode",
    blurred: "blurred",
  } as const;

  buttonModes = {
    close: "Close the menu",
    open: "Open the menu",
  } as const;

  constructor() {
    this.header = document.getElementById(this.selectors.header) as HTMLElement;
    this.handleMenuButton = document.getElementById(this.selectors.menuButton) as HTMLButtonElement;
    this.menuDialog = document.getElementById(this.selectors.menu);
    this.isOpen = false;
    this.isAnimating = false;

    this.duration =
      parseFloat(
        getComputedStyle(document.documentElement).getPropertyValue("--transition-duration")
      ) * 1000;

    this.bindEvents();
  }

  bindEvents(): void {
    this.handleMenuButton?.addEventListener("click", () => {
      if (!this.isOpen) {
        this.openMenu();
      } else {
        this.closeMenu();
      }
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

  handleMenuStates(isOpen: boolean): void {
    if (!this.menuDialog) return;

    if (isOpen) {
      this.menuDialog.classList.add(this.stateClasses.isOpen);
    } else {
      this.menuDialog.classList.remove(this.stateClasses.isOpen);
    }
    this.menuDialog.ariaHidden = `${isOpen}`;
  }

  handleButtonStates(isCloseMode: boolean) {
    if (!this.handleMenuButton) return;

    const buttonLabel = this.handleMenuButton.querySelector(`.${this.selectors.visuallyHidden}`);
    if (isCloseMode) {
      this.handleMenuButton.classList.add(this.stateClasses.closeButtonMode);
      this.handleMenuButton.ariaLabel = this.buttonModes.close;
      this.handleMenuButton.title = this.buttonModes.close;

      if (buttonLabel) buttonLabel.textContent = this.buttonModes.close;
    } else {
      this.handleMenuButton.classList.remove(this.stateClasses.closeButtonMode);
      this.handleMenuButton.ariaLabel = this.buttonModes.open;
      this.handleMenuButton.title = this.buttonModes.open;

      if (buttonLabel) buttonLabel.textContent = this.buttonModes.open;
    }
  }

  openMenu(): void {
    if (this.isOpen || this.isAnimating) return;

    this.isAnimating = true;
    this.isOpen = true;
    this.handleMenuStates(true);
    this.handleButtonStates(true);

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

  closeMenu(): void {
    if (!this.isOpen || this.isAnimating) return;

    this.isOpen = false;
    this.isAnimating = true;
    this.menuDialog?.classList.add(this.stateClasses.fadeOut);
    this.menuDialog?.classList.remove(this.stateClasses.fadeIn);

    document.documentElement.classList.remove(this.stateClasses.isLocked);
    this.handleButtonStates(false);
    setTimeout(() => {
      this.handleMenuStates(false);
      this.menuDialog?.classList.remove(this.stateClasses.fadeOut);
      this.isAnimating = false;
    }, this.duration);
  }

  keyboardHandler(event: KeyboardEvent): void {
    if (this.isOpen && event.key === "Escape") {
      event.preventDefault();
      this.closeMenu();
    }
  }

  onResize(): void {
    if (this.isOpen && document.documentElement.clientWidth >= pageSizes.mobileWidth) {
      this.closeMenu();
    }
  }
}
