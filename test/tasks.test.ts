import { describe, expect, it } from "vitest";
import { classifyTask, DEMO_NOW, nextPeriodicTask, validateCompletion } from "../app/lib/tasks";

describe("clasificarea activităților", () => {
  it("separă depășite, în curând și mai târziu", () => {
    expect(classifyTask("2025-02-13T09:00:00Z")).toBe("overdue");
    expect(classifyTask("2025-02-18T09:00:00Z")).toBe("soon");
    expect(classifyTask("2025-03-01T09:00:00Z")).toBe("later");
  });
  it("creează următoarea scadență periodică", () => {
    const next = nextPeriodicTask({ id: "t", title: "x", workerId: "w1", site: "x", dueAt: "2025-01-01T09:00:00Z", cadenceDays: 30, category: "x" }, DEMO_NOW);
    expect(next.dueAt).toBe("2025-03-16T09:00:00.000Z");
    expect(next.id).toContain("t-next");
  });
});

describe("validarea formularului", () => {
  it("cere o notă suficient de descriptivă", () => {
    expect(validateCompletion("")).toBeTruthy();
    expect(validateCompletion("ok")).toBeTruthy();
    expect(validateCompletion("Verificarea a fost efectuată.")).toBeNull();
  });
});
