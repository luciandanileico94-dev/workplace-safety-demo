import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import Home from "../app/page";

describe("scenariul complet de instruire", () => {
  beforeEach(() => window.localStorage.clear());

  it("atribuie un lucrător, permite retry și actualizează registrul", async () => {
    const user = userEvent.setup();
    render(<Home />);
    await user.click(screen.getByRole("button", { name: "Companie" }));
    const elena = screen.getByText("Elena Rusu").closest("div.roster-row") as HTMLElement;
    await user.click(within(elena).getByRole("button", { name: "Atribuie instruirea" }));
    expect(screen.getByText("SECȚIUNEA 1 DIN 3")).toBeInTheDocument();

    await user.click(screen.getByLabelText("Pornești utilajul imediat"));
    await user.click(screen.getByRole("button", { name: "Confirmă răspunsul" }));
    expect(screen.getByRole("alert")).toHaveTextContent("Mai încearcă");
    await user.click(screen.getByLabelText("Verifici zona și riscurile"));
    await user.click(screen.getByRole("button", { name: "Confirmă răspunsul" }));
    await user.click(screen.getByRole("button", { name: /Folosește protecția/ }));
    await user.click(screen.getByLabelText("Pentru a fi observat în zona de trafic"));
    await user.click(screen.getByRole("button", { name: "Confirmă răspunsul" }));
    await user.click(screen.getByRole("button", { name: /Oprește și anunță/ }));
    await user.click(screen.getByLabelText("Oprești în siguranță și anunți"));
    await user.click(screen.getByRole("button", { name: "Confirmă răspunsul" }));
    expect(screen.getByText(/Instruire completată/)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /Vezi registrul companiei/ }));
    expect(screen.getByText("Admis pentru scenariu")).toBeInTheDocument();
    expect(JSON.parse(window.localStorage.getItem("ssm-portfolio-demo-v1")!).completed).toHaveLength(3);
  });
});
