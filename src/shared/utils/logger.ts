const logger = {
  log: (...args: unknown[]): void => {
    if (__DEV__) {
      console.log('[LOG]:', ...args);
    }
  },
  warn: (...args: unknown[]): void => {
    if (__DEV__) {
      console.warn('[WARN]:', ...args);
    }
  },
  error: (...args: unknown[]): void => {
    if (__DEV__) {
      console.error('[ERROR]:', ...args);
    }
  },
};
export default logger;
