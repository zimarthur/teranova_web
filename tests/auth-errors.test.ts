import { describe, expect, it } from "vitest";
import { shouldAdvancePasswordReset, userFacingError } from "@/shared/api/errors";

describe("mensagens de autenticação", () => {
  it("não revela se o e-mail existe no login", () => {
    expect(userFacingError("/auth/login", 401, { error: "Invalid email or password" })).toBe(
      "Credenciais inválidas",
    );
  });

  it("avisa quando o cadastro já existe", () => {
    expect(userFacingError("/auth/signup", 400, { error: "User already exists with this email" })).toBe(
      "Este usuário já possui uma conta.",
    );
  });

  it("segue a recuperação com o mesmo resultado para qualquer e-mail aceito", () => {
    expect(shouldAdvancePasswordReset(200)).toBe(true);
    expect(userFacingError("/auth/request-password-reset", 200, { status: "success" })).not.toMatch(/não encontr/i);
  });
});
