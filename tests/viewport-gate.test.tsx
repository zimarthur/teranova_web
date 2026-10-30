import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ViewportGate } from "@/app/ViewportGate";

const setWidth = (value: number) => {
  Object.defineProperty(window, "innerWidth", { configurable: true, value });
};

describe("portão de largura", () => {
  it("mostra só o aviso abaixo de 768 pixels", () => {
    setWidth(767);
    render(
      <ViewportGate>
        <p>produto clínico</p>
      </ViewportGate>,
    );
    expect(screen.getByRole("heading", { name: /aplicativo Teranova/i })).toBeInTheDocument();
    expect(screen.queryByText("produto clínico")).not.toBeInTheDocument();
  });

  it("mostra o produto a partir de 768 pixels", () => {
    setWidth(768);
    render(
      <ViewportGate>
        <p>produto clínico</p>
      </ViewportGate>,
    );
    expect(screen.getByText("produto clínico")).toBeInTheDocument();
  });
});
