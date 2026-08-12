import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import Home from "../app/page";

describe("inbox de siguranță", () => {
  it("expandează activitatea, afișează eroarea și apoi confirmă finalizarea", async () => {
    const user = userEvent.setup();
    render(<Home />);
    await user.click(screen.getByRole("button", { name: /Instruire periodică SSM/ }));
    expect(screen.getByLabelText("Notă de finalizare *")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Marchează finalizată" }));
    expect(screen.getByRole("alert")).toHaveTextContent("cel puțin 10 caractere");
    await user.type(screen.getByLabelText("Notă de finalizare *"), "Instruirea a fost parcursă cu succes.");
    await user.click(screen.getByRole("button", { name: "Marchează finalizată" }));
    expect(screen.getByRole("status")).toHaveTextContent("Andrei Popescu");
    expect(screen.getByRole("button", { name: /Instruire periodică SSM/ })).toHaveTextContent("16 mar. 2025");
  });
});
