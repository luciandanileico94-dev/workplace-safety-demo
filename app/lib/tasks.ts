export type TaskBucket = "overdue" | "soon" | "later";

export type Worker = {
  id: string;
  name: string;
  role: string;
  initials: string;
  accent: string;
};

export type SafetyTask = {
  id: string;
  title: string;
  workerId: string;
  site: string;
  dueAt: string;
  cadenceDays: number;
  category: string;
};

export const DEMO_NOW = new Date("2025-02-14T09:00:00Z");

export const workers: Worker[] = [
  { id: "w1", name: "Andrei Popescu", role: "Operator utilaje", initials: "AP", accent: "blue" },
  { id: "w2", name: "Ioana Marinescu", role: "Coordonator depozit", initials: "IM", accent: "orange" },
  { id: "w3", name: "Mihai Radu", role: "Tehnician mentenanță", initials: "MR", accent: "green" },
];

export const initialTasks: SafetyTask[] = [
  { id: "t1", title: "Instruire periodică SSM", workerId: "w1", site: "Atelier Nord", dueAt: "2025-02-12T09:00:00Z", cadenceDays: 30, category: "SSM" },
  { id: "t2", title: "Verificare echipament de protecție", workerId: "w2", site: "Depozit Central", dueAt: "2025-02-16T09:00:00Z", cadenceDays: 14, category: "Echipament" },
  { id: "t3", title: "Instruire lucru la înălțime", workerId: "w3", site: "Șantier Vest", dueAt: "2025-02-25T09:00:00Z", cadenceDays: 90, category: "Instruire" },
];

export function classifyTask(dueAt: string, now: Date = DEMO_NOW): TaskBucket {
  const days = (new Date(dueAt).getTime() - now.getTime()) / 86_400_000;
  if (days < 0) return "overdue";
  if (days <= 7) return "soon";
  return "later";
}

export function nextPeriodicTask(task: SafetyTask, completedAt: Date): SafetyTask {
  const nextDue = new Date(completedAt);
  nextDue.setUTCDate(nextDue.getUTCDate() + task.cadenceDays);
  return { ...task, id: `${task.id}-next-${nextDue.getTime()}`, dueAt: nextDue.toISOString() };
}

export function validateCompletion(note: string): string | null {
  if (note.trim().length < 10) return "Adaugă o notă de cel puțin 10 caractere.";
  return null;
}
