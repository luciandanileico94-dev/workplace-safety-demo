"use client";

import { FormEvent, useMemo, useState } from "react";
import { classifyTask, DEMO_NOW, initialTasks, nextPeriodicTask, SafetyTask, TaskBucket, validateCompletion, workers } from "./lib/tasks";

const bucketInfo: Record<TaskBucket, { label: string; hint: string }> = {
  overdue: { label: "Depășite", hint: "Necesită atenție" },
  soon: { label: "În următoarele 7 zile", hint: "Planifică din timp" },
  later: { label: "Mai târziu", hint: "Pe radar" },
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("ro-RO", { day: "numeric", month: "short", year: "numeric" }).format(new Date(value));
}

export default function Home() {
  const [tasks, setTasks] = useState(initialTasks);
  const [openId, setOpenId] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const groups = useMemo(() => (Object.keys(bucketInfo) as TaskBucket[]).map((bucket) => ({ bucket, tasks: tasks.filter((task) => classifyTask(task.dueAt) === bucket) })), [tasks]);
  const complete = (event: FormEvent, task: SafetyTask) => {
    event.preventDefault();
    const validationError = validateCompletion(note);
    if (validationError) { setError(validationError); return; }
    setTasks((current) => [...current.filter((item) => item.id !== task.id), nextPeriodicTask(task, DEMO_NOW)]);
    setOpenId(null); setNote(""); setError(""); setSuccess(`Activitatea pentru ${workers.find((worker) => worker.id === task.workerId)?.name} a fost înregistrată.`);
  };

  return <main>
    <header className="topbar"><div className="brand"><span className="brand-mark">✦</span><span>siguranță<span className="muted">/</span>flux</span></div><div className="top-meta"><span className="status-dot" /> Demo local <span className="avatar">CO</span></div></header>
    <div className="shell">
      <aside className="sidebar"><div className="eyebrow">SPAȚIU DE LUCRU</div><h1>Operațiuni</h1><nav aria-label="Navigație principală"><a className="active" href="#inbox"><span>▣</span> Inbox <b>{tasks.length}</b></a><a href="#angajati"><span>◎</span> Angajați <b>{workers.length}</b></a><a href="#locatii"><span>⌖</span> Locații</a></nav><div className="side-note"><span>●</span><div><strong>Totul este sintetic</strong><small>Date demonstrative, pentru portofoliu.</small></div></div></aside>
      <section className="content" id="inbox"><div className="page-heading"><div><div className="eyebrow">VINERI, 14 FEBRUARIE 2025</div><h2>Inbox de siguranță</h2><p>Ține echipa pregătită, un pas la fiecare activitate.</p></div><button className="outline-button" type="button">＋ Activitate nouă</button></div>
        {success && <div className="success" role="status">✓ {success}</div>}
        <div className="stats"><div><strong>{tasks.filter((t) => classifyTask(t.dueAt) === "overdue").length}</strong><span>De rezolvat</span></div><div><strong>{tasks.filter((t) => classifyTask(t.dueAt) === "soon").length}</strong><span>Scad în 7 zile</span></div><div><strong>{workers.length}</strong><span>Oameni activi</span></div></div>
        <div className="task-groups">{groups.map(({ bucket, tasks: groupTasks }) => <section className="task-group" key={bucket}><div className="group-heading"><div><h3><span className={`bucket-dot ${bucket}`} />{bucketInfo[bucket].label}</h3><p>{bucketInfo[bucket].hint}</p></div><span className="count">{groupTasks.length}</span></div>{groupTasks.length === 0 ? <div className="empty">Nicio activitate aici.</div> : groupTasks.map((task) => { const worker = workers.find((item) => item.id === task.workerId)!; const isOpen = openId === task.id; return <article className={`task-card ${isOpen ? "expanded" : ""}`} key={task.id}><button className="task-summary" aria-expanded={isOpen} aria-controls={`form-${task.id}`} onClick={() => { setOpenId(isOpen ? null : task.id); setError(""); setSuccess(""); }}><span className={`person ${worker.accent}`}>{worker.initials}</span><span className="task-main"><strong>{task.title}</strong><span>{worker.name} · {worker.role}</span></span><span className="task-site">{task.site}</span><span className="task-date">{formatDate(task.dueAt)} <i>›</i></span></button>{isOpen && <form id={`form-${task.id}`} className="completion-form" onSubmit={(event) => complete(event, task)}><label htmlFor="completion-note">Notă de finalizare <span>*</span></label><textarea id="completion-note" value={note} onChange={(event) => setNote(event.target.value)} placeholder="Ex: Echipamentul a fost verificat și este în stare bună." aria-describedby={error ? "form-error" : undefined} />{error && <p className="form-error" id="form-error" role="alert">{error}</p>}<div className="form-actions"><button type="button" className="cancel" onClick={() => setOpenId(null)}>Anulează</button><button type="submit" className="primary">Marchează finalizată</button></div></form>}</article>; })}</section>)}</div>
        <p className="disclaimer">Demo de portofoliu · Toate numele, locațiile și activitățile sunt inventate. Nu este un sistem juridic sau o evidență oficială SSM.</p>
      </section>
    </div>
  </main>;
}
