import { describe, expect, it } from "vitest";
import { cn } from "@/lib/utils";

describe("cn", () => {
  it("menggabungkan kelas biasa dengan spasi", () => {
    expect(cn("flex", "items-center")).toBe("flex items-center");
  });

  it("menyelesaikan konflik kelas Tailwind: yang terakhir menang", () => {
    expect(cn("px-2", "px-4")).toBe("px-4");
    expect(cn("text-red-500 p-2", "text-green-600")).toBe("p-2 text-green-600");
  });

  it("mengabaikan nilai kondisional false, undefined, dan null", () => {
    expect(cn("a", false, undefined, null, "b")).toBe("a b");
    expect(cn(false && "hidden", undefined, null)).toBe("");
  });

  it("mendukung kondisi true, objek, dan array", () => {
    const isActive = true as boolean;
    expect(cn("base", isActive && "px-4")).toBe("base px-4");
    expect(cn({ "font-bold": true, italic: false }, ["underline"])).toBe(
      "font-bold underline",
    );
  });

  it("tanpa argumen menghasilkan string kosong", () => {
    expect(cn()).toBe("");
  });

  it("tidak memutasi array masukan", () => {
    const input = ["px-2", "px-4"];
    cn(input);
    expect(input).toEqual(["px-2", "px-4"]);
  });
});
