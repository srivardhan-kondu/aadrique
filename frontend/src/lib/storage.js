/**
 * Storage access that cannot crash the app.
 *
 * localStorage/sessionStorage throw on access when cookies/site data are blocked
 * (Safari Private Mode, hardened privacy settings, some in-app browsers). Reading
 * them directly inside a render path takes the whole site down with a blank page.
 */

const safe = (fn, fallback = null) => {
  try {
    return fn();
  } catch {
    return fallback;
  }
};

export const getLocal = (key) => safe(() => window.localStorage.getItem(key));
export const setLocal = (key, value) => safe(() => window.localStorage.setItem(key, value));

export const getSession = (key) => safe(() => window.sessionStorage.getItem(key));
export const setSession = (key, value) => safe(() => window.sessionStorage.setItem(key, value));

export const prefersLight = () =>
  safe(() => window.matchMedia("(prefers-color-scheme: light)").matches, false);

export const prefersReducedMotion = () =>
  safe(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches, false);
