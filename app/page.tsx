"use client";

import { useEffect, useMemo, useState } from "react";

type Role = "director" | "admin" | "service" | "company" | "foreman" | "worker";
type Company = { id: string; name: string; city: string; mode: "A" | "B"; workers: number; overdue: number; sites: string[] };
type Worker = { id: string; name: string; role: string; companyId: string; site: string; admitted: boolean };
type Tab = "dashboard" | "people" | "journal" | "clients" | "client" | "workers" | "tasks" | "sites" | "history" | "lesson" | "access";

const companies: Company[] = [
  { id: "construct-nord", name: "Construct Nord SRL", city: "Chișinău", mode: "B", workers: 42, overdue: 2, sites: ["Șantier Valea Morilor", "Depozit Industrial"] },
  { id: "drum-bun", name: "Drum Bun SRL", city: "Bălți", mode: "A", workers: 27, overdue: 1, sites: ["Centura Bălți", "Baza Nord"] },
  { id: "alfa-build", name: "Alfa Build SRL", city: "Orhei", mode: "B", workers: 18, overdue: 0, sites: ["Parc Industrial"] },
];
const workers: Worker[] = [
  { id: "elena", name: "Elena Rusu", role: "Operator utilaj", companyId: "construct-nord", site: "Șantier Valea Morilor", admitted: false },
  { id: "ion", name: "Ion Munteanu", role: "Maistru", companyId: "construct-nord", site: "Depozit Industrial", admitted: false },
  { id: "sorin", name: "Sorin Lupu", role: "Mecanic", companyId: "drum-bun", site: "Centura Bălți", admitted: true },
  { id: "ana", name: "Ana Ceban", role: "Muncitor calificat", companyId: "alfa-build", site: "Parc Industrial", admitted: true },
];
const lessons = [
  { title: "Observă riscul", text: "Înainte de a începe, identifică zonele cu risc de cădere și păstrează căile de acces libere.", question: "Ce faci înainte să începi lucrul?", options: ["Verifici zona și riscurile", "Pornești utilajul imediat", "Aștepți să apară o problemă"], answer: 0, explain: "Verificarea zonei este primul pas pentru a preveni un incident." },
  { title: "Folosește protecția", text: "Casca, încălțămintea de protecție și vesta vizibilă se poartă conform riscului și regulilor locului de muncă.", question: "De ce porți vesta vizibilă?", options: ["Pentru confort", "Pentru a fi observat în zona de trafic", "Doar la fotografii"], answer: 1, explain: "Vesta crește vizibilitatea în zonele cu vehicule și utilaje." },
  { title: "Oprește și anunță", text: "Dacă observi o situație periculoasă, oprește lucrul în siguranță și anunță imediat responsabilul.", question: "Cum reacționezi la un pericol nou?", options: ["Îl ignori dacă te grăbești", "Îl filmezi și pleci", "Oprești în siguranță și anunți"], answer: 2, explain: "Oprirea controlată și anunțarea responsabilului limitează expunerea la risc." },
];
const STORAGE = "ssm-portfolio-demo-v1";
const roleMeta: Record<Role, { label: string; short: string; description: string }> = {
  director: { label: "Director serviciu", short: "01", description: "tablou general și oameni" },
  admin: { label: "Administrator", short: "02", description: "clienți și echipă" },
  service: { label: "Angajat serviciu", short: "03", description: "clienții mei și lucru pentru client" },
  company: { label: "Companie", short: "04", description: "lucrători, sarcini și puncte" },
  foreman: { label: "Conducător loc", short: "05", description: "sarcinile obiectului" },
  worker: { label: "Lucrător", short: "06", description: "card propriu și termene" },
};

function Pill({ children, tone = "neutral" }: { children: React.ReactNode; tone?: "good" | "warn" | "bad" | "accent" | "neutral" }) { return <span className={`pill ${tone}`}>{children}</span>; }
function Metric({ value, label, tone = "" }: { value: string | number; label: string; tone?: string }) { return <div className={`metric ${tone}`}><strong>{value}</strong><span>{label}</span></div>; }

export default function Home() {
  const [role, setRole] = useState<Role>("director");
  const [companyId, setCompanyId] = useState(companies[0].id);
  const [tab, setTab] = useState<Tab>("dashboard");
  const [assignedWorkerId, setAssignedWorkerId] = useState<string | null>(null);
  const [completed, setCompleted] = useState<number[]>([]);
  const [attempts, setAttempts] = useState<Record<number, number>>({});
  const [lessonIndex, setLessonIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState<"correct" | "wrong" | "">("");
  const [notice, setNotice] = useState("");
  const company = companies.find((item) => item.id === companyId) ?? companies[0];
  const companyWorkers = useMemo(() => workers.filter((item) => item.companyId === companyId), [companyId]);
  const assigned = workers.find((item) => item.id === assignedWorkerId);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const requestedRole = params.get("role") as Role;
    if (requestedRole && requestedRole in roleMeta) {
      setRole(requestedRole);
      const requestedTab = params.get("tab") as Tab;
      if (requestedTab) setTab(requestedTab);
    }
    try {
      const saved = JSON.parse(window.localStorage.getItem(STORAGE) ?? "null") as { assignedWorkerId?: string | null; completed?: number[]; attempts?: Record<number, number> } | null;
      if (saved) { setAssignedWorkerId(typeof saved.assignedWorkerId === "string" ? saved.assignedWorkerId : null); setCompleted(Array.isArray(saved.completed) ? saved.completed : []); setAttempts(saved.attempts ?? {}); }
    } catch { /* local demo can start clean */ }
    if (requestedRole === "worker") setAssignedWorkerId("elena");
  }, []);
  useEffect(() => { window.localStorage.setItem(STORAGE, JSON.stringify({ assignedWorkerId, completed, attempts })); }, [assignedWorkerId, completed, attempts]);

  function navigate(nextRole: Role, nextTab: Tab = "dashboard") { setRole(nextRole); setTab(nextTab); setNotice(""); }
  function selectCompany(id: string, nextRole: Role = "company", nextTab: Tab = "workers") { setCompanyId(id); navigate(nextRole, nextTab); }
  function assign(workerId: string) { setAssignedWorkerId(workerId); setCompleted([]); setAttempts({}); navigate("worker", "lesson"); }
  function checkAnswer() {
    if (answer === "") return;
    const lesson = lessons[lessonIndex]; const correct = Number(answer) === lesson.answer;
    setFeedback(correct ? "correct" : "wrong"); setAttempts((value) => ({ ...value, [lessonIndex]: (value[lessonIndex] ?? 0) + 1 }));
    if (correct) setCompleted((value) => value.includes(lessonIndex) ? value : [...value, lessonIndex]);
  }
  function reset() { window.localStorage.removeItem(STORAGE); setAssignedWorkerId(null); setCompleted([]); setAttempts({}); setLessonIndex(0); setAnswer(""); setFeedback(""); setNotice(""); }
  function completeTask() { setNotice("Instrucțiunea a fost înregistrată în jurnal. Următorul termen: 18.02.2027."); }

  const nav = (next: Tab) => setTab(next);
  const renderTabs = (items: [Tab, string][]) => <nav className="tabs" aria-label="Secțiuni cabinet">{items.map(([value, label]) => <button key={value} className={tab === value ? "active" : ""} onClick={() => nav(value)}>{label}</button>)}</nav>;

  function Director() { return <>
    {renderTabs([["dashboard", "Tablou"], ["people", "Oameni · 3"], ["journal", "Jurnal serviciu"]])}
    {tab === "dashboard" && <><div className="metrics"><Metric value="7" label="companii client" /><Metric value="184" label="lucrători" /><Metric value="62" label="instruiri luna aceasta" /><Metric value="9" label="restanțe" tone="bad" /><Metric value="31" label="documente tipărite" /></div><section className="panel"><PanelHead title="Cu ce sunt ocupați oamenii" meta="vedere de serviciu" />{["Bivol Sergiu · administrator", "Rotaru Veronica · angajat serviciu", "Lungu Andrei · angajat serviciu"].map((person, index) => <Row key={person} title={person} subtitle={`${index + 1 + 2} companii · ${index ? 71 : 96} lucrători`} end={<><Pill tone={index === 0 ? "bad" : "good"}>{index === 0 ? "restanțe 6" : "fără restanțe"}</Pill><button className="button ghost" onClick={() => navigate("service", "clients")}>Deschide</button></>} />)}</section></>}
    {tab === "people" && <section className="panel"><PanelHead title="Echipa serviciului" meta="directorul vede, administratorul creează" />{["Bivol Sergiu · administrator", "Rotaru Veronica · angajat serviciu", "Lungu Andrei · angajat serviciu"].map((person) => <Row key={person} title={person} subtitle="serviciu SSM · activ" end={<Pill tone="accent">profil</Pill>} />)}</section>}
    {tab === "journal" && <Journal />}
  </>; }

  function Admin() { return <>{renderTabs([["clients", "Clienți · 3"], ["people", "Angajați serviciu"], ["client", "Client nou"]])}{tab === "clients" && <section className="grid">{companies.map((item) => <button className="card selectable" key={item.id} onClick={() => selectCompany(item.id, "service", "client")}><span className="overline">{item.city} · regim {item.mode}</span><strong>{item.name}</strong><span>{item.workers} lucrători · {item.sites.length} puncte de lucru</span><Pill tone={item.overdue ? "bad" : "good"}>{item.overdue ? `${item.overdue} restanțe` : "la zi"}</Pill></button>)}</section>}{tab === "people" && <section className="panel"><PanelHead title="Angajați serviciu" meta="acces pe rol" />{["Rotaru Veronica Ion", "Lungu Andrei Mihai", "Bivol Sergiu Anatol"].map((person, i) => <Row key={person} title={person} subtitle={i === 2 ? "administrator · 3 clienți" : "angajat serviciu · 1–3 clienți"} end={<button className="button ghost" onClick={() => setNotice("În demo, invitația este simulată local.")}>Gestionează</button>} />)}</section>}{tab === "client" && <CreateClient onDone={() => { setNotice("Clientul demonstrativ a fost adăugat în listă."); nav("clients"); }} />}</>; }

  function Service() { return <>{renderTabs([["clients", "Clienții mei · 3"], ["client", "Card client"], ["journal", "Jurnal"]])}{tab === "clients" && <section className="grid">{companies.map((item) => <button className="card selectable" key={item.id} onClick={() => selectCompany(item.id, "service", "client")}><span className="overline">{item.city} · mod {item.mode}</span><strong>{item.name}</strong><span>{item.workers} lucrători · {item.sites.length} puncte</span><span className="card-foot"><Pill tone={item.overdue ? "bad" : "good"}>{item.overdue ? `${item.overdue} restanțe` : "curat"}</Pill> Deschide clientul →</span></button>)}</section>}{tab === "client" && <ClientCard />}{tab === "journal" && <Journal />}</>; }

  function ClientCard() { return <><div className="context"><div><strong>Lucrez pentru {company.name}</strong><span>Regim {company.mode} · orice acțiune intră în jurnalul clientului cu autorul.</span></div><Pill tone="accent">serviciu SSM</Pill></div>{renderTabs([["client", "Rezumat"], ["workers", "Lucrători"], ["tasks", "Sarcini · 3"], ["sites", "Puncte de lucru"], ["history", "Istorie"]])}{tab === "client" && <><div className="metrics"><Metric value={company.workers} label="lucrători" /><Metric value={company.sites.length} label="puncte de lucru" /><Metric value={company.overdue} label="restanțe" tone="bad" /></div><section className="panel"><PanelHead title="Ultimele acțiuni" meta="vizibile și clientului" /><Row title="Instruire periodică · Elena Rusu" subtitle="12.08.2026 · 1 oră · serviciu" end={<Pill tone="good">admis</Pill>} /><Row title="Transfer · Ion Munteanu" subtitle="Depozit Industrial · 08.08.2026" end={<Pill tone="accent">istorie</Pill>} /></section></>}{tab === "workers" && <WorkerList serviceMode />}{tab === "tasks" && <TaskList />}{tab === "sites" && <SiteList />}{tab === "history" && <Journal />}</>; }

  function Company() { return <>{renderTabs([["workers", "Lucrători · 3"], ["tasks", "Sarcini · 4"], ["sites", "Puncte · 2"], ["history", "Istorie"]])}{tab === "workers" && <WorkerList />}{tab === "tasks" && <TaskList />}{tab === "sites" && <SiteList />}{tab === "history" && <Journal />}</>; }
  function WorkerList({ serviceMode = false }: { serviceMode?: boolean }) { return <section className="panel"><PanelHead title="Registrul lucrătorilor" meta={serviceMode ? "semnat de serviciu" : "decizia și admiterea sunt stări diferite"} />{companyWorkers.map((worker) => { const scenarioAdmitted = worker.id === assignedWorkerId && completed.length === 3; return <div className="row roster-row" key={worker.id}><div className="row-main"><strong>{worker.name}</strong><span>{worker.site} · {worker.role}</span></div><Pill tone={worker.admitted || scenarioAdmitted ? "good" : "bad"}>{scenarioAdmitted ? "Admis pentru scenariu" : worker.admitted ? "Admis" : "Ne-admis"}</Pill><button className="button ghost" onClick={() => worker.admitted || scenarioAdmitted ? setNotice("Cardul lucrătorului este deschis mai jos în demo.") : assign(worker.id)}>{worker.admitted || scenarioAdmitted ? "Card" : "Atribuie instruirea"}</button></div>; })}</section>; }
  function TaskList() { return <section className="panel"><PanelHead title="Sarcini" meta="restantele sunt primele · pragul demo 30 zile" /><div className="task-group"><h3 className="bad-text">Restante · 2</h3><Row title="Ion Munteanu · instruire suplimentară" subtitle="motiv 11 · termen 02.08.2026" end={<button className="button primary" onClick={completeTask}>Marchează</button>} /><Row title="Elena Rusu · instruire periodică" subtitle="termen 21.07.2026" end={<button className="button primary" onClick={completeTask}>Marchează</button>} /></div><div className="task-group"><h3 className="warn-text">Următoarele 30 zile · 1</h3><Row title="Sorin Lupu · instruire periodică" subtitle="termen 19.08.2026" end={<button className="button ghost" onClick={completeTask}>Marchează</button>} /></div>{notice && <div className="notice" role="status">{notice}</div>}</section>; }
  function SiteList() { return <section className="panel"><PanelHead title="Puncte de lucru" meta="locul și postul rămân legate de lucrător" />{company.sites.map((site, index) => <Row key={site} title={site} subtitle={`${index ? "Depozit Industrial 4" : "mun. " + company.city + ", zona centrală"} · ${index ? 11 : 24} lucrători`} end={<Pill tone={index ? "warn" : "good"}>{index ? "1 termen apropiat" : "la zi"}</Pill>} />)}<div className="actions"><button className="button ghost" onClick={() => setNotice("Formularul de punct nou este disponibil în produsul sursă.")}>Adaugă punct de lucru</button></div></section>; }
  function Foreman() { return <>{renderTabs([["tasks", "Sarcinile obiectului · 3"], ["lesson", "Marchează instruire"]])}{tab === "tasks" && <><div className="context"><div><strong>Șantier Valea Morilor</strong><span>Conducătorul locului de muncă vede sarcinile obiectului.</span></div><Pill tone="accent">proiector</Pill></div><TaskList /></>}{tab === "lesson" && <section className="panel form-panel"><h2>Marchează instruirea</h2><p>Conducătorul locului de muncă este precompletat ca autor al verificării.</p><label>Data <input type="date" defaultValue="2026-08-12" /></label><label>Durata, ore <input defaultValue="1" /></label><button className="button primary" onClick={completeTask}>Înregistrează</button>{notice && <div className="notice">{notice}</div>}</section>}</>; }
  function Worker() { if (!assigned) return <section className="empty"><h2>Cabinetul lucrătorului</h2><p>Selectează un lucrător din cabinetul companiei pentru a porni scenariul.</p><button className="button primary" onClick={() => navigate("company", "workers")}>Mergi la companie</button></section>; const lesson = lessons[lessonIndex]; return <>{renderTabs([["lesson", "Eu și termenele"], ["access", "Intrare cu cod"]])}{tab === "access" && <section className="panel access"><span className="overline">CARD DE ACCES</span><h2>Intrare cu cod</h2><p>Lucrătorul introduce codul de pe cardul tipărit. Nu are nevoie de telefon sau email.</p><div className="code">SSM · 47 82 19</div><Pill tone="neutral">doar date proprii · read-only</Pill></section>}{tab === "lesson" && <><div className="worker-head"><div><span className="overline">CARD LUCRĂTOR · {assigned.site}</span><h2>{assigned.name}</h2><p>{assigned.role} · {company.name}</p></div><Pill tone={completed.length === 3 ? "good" : "accent"}>{completed.length}/3 finalizate</Pill></div><div className="progress"><span style={{ width: `${completed.length * 33.333}%` }} /></div><div className="lesson-nav">{lessons.map((item, index) => <button key={item.title} className={lessonIndex === index ? "active" : ""} onClick={() => { setLessonIndex(index); setAnswer(""); setFeedback(""); }}><b>{completed.includes(index) ? "✓" : index + 1}</b>{item.title}</button>)}</div><article className="lesson"><span className="overline">SECȚIUNEA {lessonIndex + 1} DIN 3</span><h2>{lesson.title}</h2><p>{lesson.text}</p><div className="ack">✓ Citește și confirmă înțelegerea prin răspunsul de mai jos</div><fieldset><legend>{lesson.question}</legend>{lesson.options.map((option, index) => <label key={option}><input type="radio" name={`answer-${lessonIndex}`} value={index} checked={answer === String(index)} onChange={(event) => { setAnswer(event.target.value); setFeedback(""); }} />{option}</label>)}</fieldset>{feedback === "wrong" && <div className="feedback wrong" role="alert"><strong>Mai încearcă o dată.</strong> {lesson.explain}</div>}{feedback === "correct" && <div className="feedback correct" role="status">Răspuns corect. Secțiunea a fost confirmată.</div>}<button className="button primary" onClick={checkAnswer} disabled={!answer}>Confirmă răspunsul</button>{completed.length === 3 && <div className="completion"><strong>Instruire completată pentru acest scenariu</strong><span>Istoric: {Object.values(attempts).reduce((sum, value) => sum + value, 0)} încercări · următor termen: 18.02.2027.</span><button className="link-button" onClick={() => navigate("company", "workers")}>Vezi registrul companiei →</button></div>}</article></>}</>; }

  return <main><header className="topbar"><div className="brand"><span className="brand-mark">S</span><span>siguranță<span className="muted">/</span>flux</span></div><div className="top-actions"><span className="live-dot" /> demo local <button className="reset" onClick={reset}>Resetează</button></div></header><div className="shell"><aside className="rail"><div className="rail-title">SSM / OPERAȚIUNI</div><div className="rail-sub">serviciu extern · 3 companii demo</div><div className="role-list">{(Object.keys(roleMeta) as Role[]).map((value) => <button aria-label={roleMeta[value].label} key={value} className={`role-item ${role === value ? "active" : ""}`} onClick={() => navigate(value, value === "worker" ? "lesson" : value === "director" ? "dashboard" : value === "admin" ? "clients" : value === "service" ? "clients" : value === "company" ? "workers" : "tasks")}><span className="role-number">{roleMeta[value].short}</span><span><strong>{roleMeta[value].label}</strong><small>{roleMeta[value].description}</small></span></button>)}</div><div className="rail-note"><strong>DEMO SINTETIC</strong><span>Structura urmează cabinetele SSM sursă. Datele sunt inventate și locale.</span></div></aside><section className="content"><div className="synthetic-banner"><strong>DEMO SINTETIC</strong><span>Nu este evidență oficială, nu semnează acte și nu înlocuiește instruirea practică.</span></div><div className="heading"><div><span className="overline">CABINET · {roleMeta[role].short}</span><h1>{roleMeta[role].label}</h1><p>{roleMeta[role].description} · {company.name}</p></div><div className="heading-meta"><Pill tone={role === "worker" ? "neutral" : "accent"}>acces demonstrativ</Pill><button className="button ghost" onClick={() => setNotice("În produsul sursă această acțiune este auditabilă.")}>Ajutor</button></div></div>{role === "director" && <Director />}{role === "admin" && <Admin />}{role === "service" && <Service />}{role === "company" && <Company />}{role === "foreman" && <Foreman />}{role === "worker" && <Worker />}{notice && role !== "foreman" && role !== "company" && <div className="notice" role="status">{notice}</div>}<p className="disclaimer">Interfață de portofoliu inspirată de modelul de cabinete SSM: niveluri de acces, sarcini, jurnal și card lucrător. Datele publicate aici sunt sintetice.</p></section></div></main>;
}

function PanelHead({ title, meta }: { title: string; meta: string }) { return <div className="panel-head"><h2>{title}</h2><span>{meta}</span></div>; }
function Row({ title, subtitle, end }: { title: string; subtitle: string; end?: React.ReactNode }) { return <div className="row"><div className="row-main"><strong>{title}</strong><span>{subtitle}</span></div><div className="row-end">{end}</div></div>; }
function Journal() { return <section className="panel"><PanelHead title="Jurnal" meta="cine, ce și când" /><div className="journal"><div><b>12.08.2026 · 14:22</b><span>Rotaru Veronica · serviciu</span><p>a înregistrat instruirea periodică · Elena Rusu</p></div><div><b>12.08.2026 · 14:05</b><span>Cojocaru Petru · loc de muncă</span><p>a confirmat instruirea · Ion Munteanu</p></div><div><b>08.08.2026 · 10:11</b><span>Ursu Mihai · companie</span><p>a adăugat punctul „Depozit Industrial”</p></div></div></section>; }
function CreateClient({ onDone }: { onDone: () => void }) { return <section className="panel form-panel"><h2>Client nou</h2><p>În produsul real, clientul se creează împreună cu primul punct de lucru.</p><label>Denumire companie <input defaultValue="Nordic Atelier SRL" /></label><label>IDNO demo <input defaultValue="1000000000001" /></label><label>Regim <select defaultValue="B"><option value="A">A · responsabil propriu</option><option value="B">B · serviciul lucrează pentru client</option></select></label><button className="button primary" onClick={onDone}>Adaugă clientul</button></section>; }
