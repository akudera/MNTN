import { debounce } from "./utils";

export class Menu {
  openMenuButton: HTMLButtonElement | null;
  closeMenuButton: HTMLButtonElement | null;
  menuDialog: HTMLDialogElement | null;

  selectors = {
    openMenuButton: "open-menu-button",
    closeMenuButton: "close-menu-button",
    menu: "menu",
  };

  stateClasses = {
    isLocked: "is-locked",
  };

  constructor() {
    this.openMenuButton = document.getElementById(
      this.selectors.openMenuButton
    ) as HTMLButtonElement;
    this.closeMenuButton = document.getElementById(
      this.selectors.closeMenuButton
    ) as HTMLButtonElement;
    this.menuDialog = document.getElementById(this.selectors.menu) as HTMLDialogElement;

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
        this.onResize(), 100;
      })
    );
  }

  openMenu() {
    this.menuDialog?.showModal();
    document.documentElement.classList.add(this.stateClasses.isLocked);
  }

  closeMenu() {
    this.menuDialog?.close();
    document.documentElement.classList.remove(this.stateClasses.isLocked);
  }

  keyboardHandler(event: KeyboardEvent) {
    if (event.key === "Escape") {
      event.preventDefault();
      this.closeMenu();
    }
  }

  onResize() {
    if (innerWidth >= 620) {
      this.closeMenu();
    }
  }
}
