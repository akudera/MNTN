export function debounce<F extends (...args: any[]) => any>(callback: F, ms = 200) {
  let timeout: ReturnType<typeof setTimeout>;

  return function (this: ThisParameterType<F>, ...args: Parameters<F>) {
    clearTimeout(timeout);

    timeout = setTimeout(() => {
      callback.apply(this, args);
    }, ms);
  };
}
