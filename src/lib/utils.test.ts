import { cn } from "./utils";

describe("utils", () => {
  describe("cn function", () => {
    it("should merge class names correctly", () => {
      const result = cn("px-4", "py-2", "bg-blue-500");
      expect(result).toBe("px-4 py-2 bg-blue-500");
    });

    it("should handle conditional classes", () => {
      const isActive = true;
      const result = cn("base-class", isActive && "active-class");
      expect(result).toBe("base-class active-class");
    });

    it("should handle undefined and false values", () => {
      const result = cn("base-class", undefined, false, "another-class");
      expect(result).toBe("base-class another-class");
    });

    it("should merge conflicting tailwind classes", () => {
      const result = cn("px-4 px-2");
      expect(result).toBe("px-2");
    });
  });
});
