export function createObserver(options, callback) {
  const obs = new MutationObserver(callback);
  return {
    container: null,
    observe(element) {
      obs.observe(element, options);
    },
    disconnect() {
      obs.disconnect();
    },
  };
}
