import "@testing-library/jest-dom";

// Mock window.matchMedia for tests
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock IntersectionObserver
const mockIntersectionObserver = jest.fn();
mockIntersectionObserver.mockReturnValue({
  observe: () => null,
  unobserve: () => null,
  disconnect: () => null,
});
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(window as any).IntersectionObserver = mockIntersectionObserver;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(global as any).IntersectionObserver = mockIntersectionObserver;

// Mock ResizeObserver
const mockResizeObserver = jest.fn();
mockResizeObserver.mockReturnValue({
  observe: () => null,
  unobserve: () => null,
  disconnect: () => null,
});
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(window as any).ResizeObserver = mockResizeObserver;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(global as any).ResizeObserver = mockResizeObserver;
