import '@testing-library/jest-dom'

// jsdom does not implement IntersectionObserver — provide a no-op stub
if (typeof globalThis.IntersectionObserver === 'undefined') {
  globalThis.IntersectionObserver = class IntersectionObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  } as any
}