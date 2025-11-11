export class Menu {
  header: HTMLElement | null;
  handleMenuButton: HTMLButtonElement | null;
  menuDialog: HTMLElement | null;
  main: HTMLElement | null;
  footer: HTMLElement | null;

  mediaQueryList: MediaQueryList;
  duration: number;
  isOpen: boolean;
  isAnimating: boolean;

  selectors = {
    visuallyHidden: "visually-hidden",
    menuButton: "menu-button",
    closeMenuButton: "close-menu-button",
    header: "header",
    menu: "menu",
    main: "main",
    footer: "footer",
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
    close: "Close navigation menu",
    open: "Open navigation menu",
  } as const;

  constructor() {
    this.header = document.getElementById(this.selectors.header) as HTMLElement;
    this.handleMenuButton = document.getElementById(this.selectors.menuButton) as HTMLButtonElement;
    this.menuDialog = document.getElementById(this.selectors.menu);
    this.main = document.getElementById(this.selectors.main);
    this.footer = document.getElementById(this.selectors.footer);
    this.isOpen = false;
    this.isAnimating = false;

    this.duration =
      parseFloat(
        getComputedStyle(document.documentElement).getPropertyValue("--transition-duration")
      ) * 1000;

    this.mediaQueryList = window.matchMedia("(max-width: 620px)");
    this.onResize(this.mediaQueryList);
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
    this.mediaQueryList.addEventListener("change", (event) => {
      this.onResize(event);
    });
  }

  handleMenuStates(isOpen: boolean): void {
    if (!this.menuDialog) return;

    if (isOpen) {
      this.menuDialog.classList.add(this.stateClasses.isOpen);
      this.menuDialog.ariaModal = "true";
    } else {
      this.menuDialog.classList.remove(this.stateClasses.isOpen);
      this.menuDialog.ariaModal = "false";
    }
    this.menuDialog.ariaHidden = `${!isOpen}`;
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
    this.main?.setAttribute("inert", "");
    this.footer?.setAttribute("inert", "");

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

  closeMenu(closeImmediately?: boolean): void {
    if (!this.isOpen || this.isAnimating) return;

    this.isOpen = false;
    this.isAnimating = true;
    this.menuDialog?.classList.add(this.stateClasses.fadeOut);
    this.menuDialog?.classList.remove(this.stateClasses.fadeIn);
    this.main?.removeAttribute("inert");
    this.footer?.removeAttribute("inert");

    document.documentElement.classList.remove(this.stateClasses.isLocked);
    this.handleButtonStates(false);
    const closeAnimationHandle = () => {
      this.handleMenuStates(false);
      this.menuDialog?.classList.remove(this.stateClasses.fadeOut);
      this.isAnimating = false;
    };
    if (closeImmediately) {
      closeAnimationHandle();
    } else {
      setTimeout(closeAnimationHandle, this.duration);
    }
  }

  keyboardHandler(event: KeyboardEvent): void {
    if (this.isOpen && event.key === "Escape") {
      event.preventDefault();
      this.closeMenu();
    }
  }

  onResize(event: MediaQueryListEvent | MediaQueryList): void {
    if (event.matches) {
      this.menuDialog?.setAttribute("role", "dialog");
      this.menuDialog?.setAttribute("aria-modal", this.isOpen ? "true" : "false");
      this.menuDialog?.setAttribute("aria-hidden", this.isOpen ? "false" : "true");
    } else {
      if (this.isOpen) {
        this.closeMenu(true);
      }
      this.menuDialog?.removeAttribute("role");
      this.menuDialog?.removeAttribute("aria-modal");
      this.menuDialog?.removeAttribute("aria-hidden");
    }
  }
}
