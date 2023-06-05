import {server} from "./test/server";
import ResizeObserver from "./test/mocks/ResizeObserver";

// Mocks
window.ResizeObserver = ResizeObserver;

// MSW
beforeAll(() => server.listen());
afterEach(() => {
  server.resetHandlers();
  localStorage.clear();
});
afterAll(() => server.close());
