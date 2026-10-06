import '@testing-library/jest-dom';

// Polyfill window.matchMedia for Ant Design and ThemeContext in JSDOM
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
});

// Polyfill ResizeObserver for Ant Design components
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Polyfill window.scrollTo
window.scrollTo = () => {};

// Polyfill getComputedStyle without triggering JSDOM pseudo-element "not implemented" error
const originalGetComputedStyle = window.getComputedStyle.bind(window);
window.getComputedStyle = function (elt: Element, _pseudoElt?: string | null) {
  try {
    return originalGetComputedStyle(elt);
  } catch {
    return {
      getPropertyValue: () => '',
      width: '0px',
      height: '0px',
    } as unknown as CSSStyleDeclaration;
  }
};

// Mock localStorage
const localStorageMock = (function () {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});
