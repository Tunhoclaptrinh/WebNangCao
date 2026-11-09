import "@testing-library/jest-dom";
if (typeof window !== "undefined")
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }),
  });
class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}
global.ResizeObserver = ResizeObserverMock;
// jsdom does not implement MessageChannel; Ant Design Select uses it for macrotasks.
if (typeof globalThis.MessageChannel === "undefined") {
  class MessageChannelMock {
    port1 = { onmessage: null as (() => void) | null };
    port2 = {
      postMessage: () => setTimeout(() => this.port1.onmessage?.(), 0),
    };
  }
  Object.defineProperty(globalThis, "MessageChannel", {
    value: MessageChannelMock,
    writable: true,
  });
}
