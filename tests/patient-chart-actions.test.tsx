import { describe, expect, it } from "vitest";
import { canWritePatient } from "@/entities/patient/model";

describe("ações da ficha", () => {
  it("permite editar e iniciar sessão na equipe de um paciente ativo", () => {
    expect(canWritePatient({ personal: false, onCareTeam: true, active: true })).toBe(true);
  });

  it("não libera escrita para acesso amplo fora da equipe", () => {
    expect(canWritePatient({ personal: false, onCareTeam: false, active: true })).toBe(false);
  });

  it("não libera escrita de paciente inativo", () => {
    expect(canWritePatient({ personal: false, onCareTeam: true, active: false })).toBe(false);
  });

  it("trata o consultório pessoal como equipe", () => {
    expect(canWritePatient({ personal: true, onCareTeam: false, active: true })).toBe(true);
  });
});
