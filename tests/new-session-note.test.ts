import { describe, expect, it } from "vitest";
import { noteIsFilled } from "@/entities/session/model";

describe("nota da sessão", () => {
  it("não avança com nota vazia ou só com espaços", () => {
    expect(noteIsFilled("")).toBe(false);
    expect(noteIsFilled("   ")).toBe(false);
  });

  it("avança quando há texto", () => {
    expect(noteIsFilled(" atendimento ")).toBe(true);
  });
});
