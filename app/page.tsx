"use client";

import { useEffect, useMemo, useState } from "react";

type Role = "service" | "company" | "worker";
type Company = { id: string; name: string; city: string; risk: string; deadline: string; sites: string[] };
type Worker = { id: string; name: string; role: string; companyId: string; site: string };
type Progress = { assignedWorkerId: string | null; completed: number[]; attempts: Record<number, number> };

const companies: Company[] = [
  { id: "construct-nord", name: "Construct Nord SRL", city: "Chișinău", risk: "lucru la înălțime", deadline: "18 septembrie 2026", sites: ["Șantier Valea Morilor", "Depozit Industrial"] },
  { id: "drum-bun", name: "Drum Bun SRL", city: "Bălți", risk: "utilaje și trafic intern", deadline: "4 octombrie 2026", sites: ["Centura Bălți", "Baza Nord"] },
];
const workers: Worker[] = [
  { id: "elena", name: "Elena Rusu", role: "Operator utilaj", companyId: "construct-nord", site: "Șantier Valea Morilor" },
  { id: "ion", name: "Ion Munteanu", role: "Maistru", companyId: "construct-nord", site: "Depozit Industrial" },
  { id: "sorin", name: "Sorin Lupu", role: "Mecanic", companyId: "drum-bun", site: "Centura Bălți" },
];
const lessons = [
  { title: "Observă riscul", text: "Înainte de a începe, identifică zonele cu risc de cădere și păstrează căile de acces libere.", question: "Ce faci înainte să începi lucrul?", options: ["Verifici zona și riscurile", "Pornești utilajul imediat", "Aștepți să apară o problemă"], answer: 0, explain: "O verificare a zonei este primul pas pentru a preveni un incident." },
  { title: "Folosește protecția", text: "Casca, încălțămintea de protecție și vesta vizibilă se poartă conform riscului și regulilor locului de muncă.", question: "De ce porți vesta vizibilă?", options: ["Pentru confort", "Pentru a fi observat în zona de trafic", "Doar la fotografii"], answer: 1, explain: "Vesta crește vizibilitatea în zonele cu vehicule și utilaje." },
  { title: "Oprește și anunță", text: "Dacă observi o situație periculoasă, oprește lucrul în siguranță și anunță imediat responsabilul.", question: "Cum reacționezi la un pericol nou?", options: ["Îl ignori dacă te grăbești", "Îl filmezi și pleci", "Oprești în siguranță și anunți"], answer: 2, explain: "Oprirea controlată și anunțarea responsabilului limitează expunerea la risc." },
];
const STORAGE = "ssm-portfolio-demo-v1";
const initialProgress: Progress = { assignedWorkerId: null, completed: [], attempts: {} };

function dateLabel(value: string) { return value; }

export default function Home() {
  const [role, setRole] = useState<Role>("service");
  const [companyId, setCompanyId] = useState(companies[0].id);
  const [progress, setProgress] = useState<Progress>(initialProgress);
  const [section, setSection] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");
  const [feedback, setFeedback] = useState<"correct" | "wrong" | "">("");
  const company = companies.find((item) => item.id === companyId)!;
  const companyWorkers = useMemo(() => workers.filter((item) => item.companyId === companyId), [companyId]);
  const assignedWorker = workers.find((item) => item.id === progress.assignedWorkerId);

  useEffect(() => { const saved = window.localStorage.getItem(STORAGE); if (saved) setProgress(JSON.parse(saved)); }, []);
  useEffect(() => { window.localStorage.setItem(STORAGE, JSON.stringify(progress)); }, [progress]);

  function assign(workerId: string) { setProgress((current) => ({ ...current, assignedWorkerId: workerId })); }
  function answer() {
    const lesson = lessons[section];
    if (selectedAnswer === "") return;
    const correct = Number(selectedAnswer) === lesson.answer;
    setFeedback(correct ? "correct" : "wrong");
    setProgress((current) => ({ ...current, attempts: { ...current.attempts, [section]: (current.attempts[section] ?? 0) + 1 } }));
    if (correct) setProgress((current) => ({ ...current, completed: current.completed.includes(section) ? current.completed : [...current.completed, section] }));
  }
  function reset() { setProgress(initialProgress); setSection(0); setSelectedAnswer(""); setFeedback(""); }
  const completedCount = progress.completed.length;
  const rosterStatus = (worker: Worker) => worker.id === progress.assignedWorkerId && completedCount === 3 ? "Instruire completă" : worker.id === progress.assignedWorkerId ? `${completedCount}/3 secțiuni` : "Neatribuit";

  return <main>
    <header className="topbar"><div className="brand"><span className="brand-mark">S</span><span>siguranță<span className="muted">/</span>flux</span></div><div className="top-meta"><span className="status-dot" /> Demo local <button className="reset" onClick={reset}>Resetează demo</button></div></header>
    <div className="shell">
      <aside className="sidebar"><div className="eyebrow">PORTOFOLIU SSM</div><h1>Siguranță în flux</h1><p className="side-copy">O vedere simplă asupra instruirii și a termenelor de lucru.</p><div className="side-note"><strong>DEMO SINTETIC</strong><span>Date inventate, păstrate doar în acest browser.</span></div></aside>
      <section className="content">
        <div className="synthetic-banner"><strong>DEMO SINTETIC</strong><span>Nu este un serviciu reglementat, nu generează semnături și nu înlocuiește documentele sau instruirea practică.</span></div>
        <div className="page-heading"><div><div className="eyebrow">SPAȚIU DE LUCRU</div><h2>Siguranța echipei, vizibilă</h2><p>Urmează scenariul: atribuie instruirea, apoi completeaz-o ca lucrător.</p></div></div>
        <nav className="role-tabs" aria-label="Rol demo">{([["service", "Serviciu SSM"], ["company", "Companie"], ["worker", "Lucrător"]] as [Role, string][]).map(([value, label]) => <button key={value} className={role === value ? "active" : ""} onClick={() => setRole(value)}>{label}</button>)}</nav>
        <div className="context-row"><label htmlFor="company">Companie demonstrativă</label><select id="company" value={companyId} onChange={(event) => { setCompanyId(event.target.value); setRole("company"); }}>{companies.map((item) => <option value={item.id} key={item.id}>{item.name}</option>)}</select><span className="context-detail">{company.city} · {company.sites.length} puncte de lucru</span></div>

        {role === "service" && <section className="view"><div className="section-title"><div><h3>Portofoliu de companii</h3><p>Imagine de ansamblu pentru un serviciu SSM.</p></div><span className="count">{companies.length} companii</span></div><div className="company-grid">{companies.map((item) => <button className={`company-card ${item.id === companyId ? "selected" : ""}`} key={item.id} onClick={() => { setCompanyId(item.id); setRole("company"); }}><span className="card-kicker">{item.city}</span><strong>{item.name}</strong><span>Risc principal: {item.risk}</span><span className="deadline">Următor termen · {item.deadline}</span><span className="card-link">Deschide compania →</span></button>)}</div></section>}
        {role === "company" && <section className="view"><div className="section-title"><div><h3>{company.name}</h3><p>Lucrători, puncte de lucru și starea instruirii.</p></div><span className="pill warning">Termen · {dateLabel(company.deadline)}</span></div><div className="metrics"><div><strong>{companyWorkers.length}</strong><span>lucrători</span></div><div><strong>{company.sites.length}</strong><span>puncte active</span></div><div><strong>{companyWorkers.filter((worker) => rosterStatus(worker) === "Instruire completă").length}</strong><span>instruiri complete</span></div></div><div className="panel"><div className="panel-heading"><h4>Registru de lucru</h4><span>Admisibilitatea este o stare demonstrativă</span></div>{companyWorkers.map((worker) => <div className="roster-row" key={worker.id}><div><strong>{worker.name}</strong><span>{worker.role} · {worker.site}</span></div><span className={`status ${rosterStatus(worker) === "Instruire completă" ? "good" : "neutral"}`}>{rosterStatus(worker)}</span>{worker.id === progress.assignedWorkerId && completedCount === 3 ? <span className="admissible">Admis pentru scenariu</span> : <button className="assign" onClick={() => { assign(worker.id); setRole("worker"); }}>Atribuie instruirea</button>}</div>)}</div></section>}
        {role === "worker" && <section className="view worker-view">{!assignedWorker ? <div className="empty"><h3>Alege un lucrător atribuit</h3><p>Revino în Companie și apasă „Atribuie instruirea” pentru un lucrător.</p><button className="primary" onClick={() => setRole("company")}>Mergi la Companie</button></div> : <><div className="section-title"><div><div className="card-kicker">ÎNVĂȚARE SINTETICĂ · {assignedWorker.site}</div><h3>{assignedWorker.name}</h3><p>{assignedWorker.role} · {company.name}</p></div><span className="pill">{completedCount}/3 completate</span></div><div className="progress" aria-label={`Progres ${completedCount} din 3`}><span style={{ width: `${completedCount * 33.333}%` }} /></div><div className="lesson-nav">{lessons.map((lesson, index) => <button key={lesson.title} className={section === index ? "active" : ""} onClick={() => { setSection(index); setFeedback(""); setSelectedAnswer(""); }}><span>{progress.completed.includes(index) ? "✓" : index + 1}</span>{lesson.title}</button>)}</div><article className="lesson"><span className="card-kicker">SECȚIUNEA {section + 1} DIN 3</span><h3>{lessons[section].title}</h3><p>{lessons[section].text}</p><div className="ack">✓ Citește și confirmă înțelegerea prin răspunsul de mai jos</div><fieldset><legend>{lessons[section].question}</legend>{lessons[section].options.map((option, index) => <label key={option}><input type="radio" name={`answer-${section}`} value={index} checked={selectedAnswer === String(index)} onChange={(event) => { setSelectedAnswer(event.target.value); setFeedback(""); }} />{option}</label>)}</fieldset>{feedback === "wrong" && <div className="feedback wrong" role="alert"><strong>Mai încearcă o dată.</strong> {lessons[section].explain}</div>}{feedback === "correct" && <div className="feedback correct" role="status">Răspuns corect. Secțiunea a fost confirmată.</div>}<button className="primary" onClick={answer} disabled={selectedAnswer === ""}>{section === 2 && feedback === "correct" ? "Vezi rezultatul" : "Confirmă răspunsul"}</button>{completedCount === 3 && <div className="completion"><strong>Instruire completată pentru acest scenariu</strong><span>Istoric: {Object.values(progress.attempts).reduce((sum, value) => sum + value, 0)} încercări · următor termen: {company.deadline} · admisibilitate actualizată în Companie.</span><button className="text-button" onClick={() => setRole("company")}>Vezi registrul companiei →</button></div>}</article></> }</section>}
        <p className="disclaimer">Datele sunt sintetice și locale. Demo-ul ilustrează un flux de portofoliu, nu o evidență oficială SSM.</p>
      </section>
    </div>
  </main>;
}
