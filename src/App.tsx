import { useEffect, useMemo, useState, type ReactNode } from "react";
import { BRAND_THEMES, brandFromLocation, writeBrandHash, type BrandTheme } from "./brands";
import {
  emptyScenario,
  exportSummary,
  generateWorkup,
  getScenario,
  lockConsensus,
  type BrandId,
  type Claim,
  type Phase,
  type Review,
  type Scenario,
  type Workup,
} from "./engine";
import { formatClaim, formatPct, formatUsd } from "./format";
import { TOOL_ID, connectHost, unwrapTool, type Host } from "./host";

const STEPS: Array<{ id: Phase; label: string; hint: string }> = [
  { id: "brand", label: "Brand", hint: "Pick a skin" },
  { id: "ingest", label: "Ingest", hint: "Load a book" },
  { id: "workup", label: "Propose", hint: "Numbers + provenance" },
  { id: "challenge", label: "Challenge", hint: "CHP dissent" },
  { id: "review", label: "Lock", hint: "Human approve" },
  { id: "export", label: "Export", hint: "Locked pack" },
];

function Chip({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <span className={`chip ${className}`}>{children}</span>;
}

function ClaimRow({
  claim,
  review,
  onReview,
}: {
  claim: Claim;
  review?: Review;
  onReview?: (review: Review) => void;
}) {
  return (
    <article className="claim">
      <div>
        <h3>{claim.label}</h3>
        <div className="meta">
          <Chip className={`source-${claim.source}`}>{claim.source}</Chip>
          <Chip className={`status-${claim.status}`}>{claim.status}</Chip>
          <Chip>{claim.confidence} confidence</Chip>
        </div>
        {claim.formula ? <p className="challenge">Formula: {claim.formula}</p> : null}
        {claim.challenges.map((item) => (
          <p key={item.id} className="challenge">
            Challenge ({item.severity}): {item.text}
          </p>
        ))}
        {onReview ? (
          <div className="actions" style={{ marginTop: 10 }}>
            <button className="ok" type="button" onClick={() => onReview({ claimId: claim.id, decision: "approved" })}>
              Approve
            </button>
            <button className="danger" type="button" onClick={() => onReview({ claimId: claim.id, decision: "rejected" })}>
              Reject
            </button>
            {review ? <Chip className={`status-${review.decision}`}>{review.decision}</Chip> : null}
          </div>
        ) : null}
        {claim.reviewNote ? <p className="challenge">Reviewer: {claim.reviewNote}</p> : null}
      </div>
      <div className="value">{formatClaim(claim)}</div>
    </article>
  );
}

function ScenarioForm({
  scenario,
  onChange,
}: {
  scenario: Scenario;
  onChange: (next: Scenario) => void;
}) {
  const set = (patch: Partial<Scenario>) => onChange({ ...scenario, ...patch });
  const field = (key: keyof Scenario, label: string, step = "1") => (
    <label>
      {label}
      <input
        type="number"
        step={step}
        value={Number(scenario[key] ?? 0)}
        onChange={(event) => set({ [key]: Number(event.target.value) } as Partial<Scenario>)}
      />
    </label>
  );
  return (
    <div className="form-grid">
      <label>
        Vertical
        <input value={scenario.vertical} onChange={(event) => set({ vertical: event.target.value })} />
      </label>
      <label>
        Geography
        <input value={scenario.geography} onChange={(event) => set({ geography: event.target.value })} />
      </label>
      {field("ttmRevenue", "TTM revenue ($)")}
      {field("reportedEbitda", "Reported EBITDA ($)")}
      {field("grossMargin", "Gross margin (0–1)", "0.01")}
      {field("recurringPct", "Contract / maintenance mix (0–1)", "0.01")}
      {field("topCustomerPct", "Top account (0–1)", "0.01")}
      {field("ownerFieldHoursWeekly", "Owner field hours / week")}
      {field("technicianCount", "Technicians / operators")}
      {field("fleetCount", "Fleet / bays")}
      {field("workingCapital", "Working capital ($)")}
      {field("netDebt", "Net debt ($)")}
      {field("afterHoursCapturePct", "After-hours capture (0–1)", "0.01")}
      {field("growthRate", "Forward growth assumption (0–1)", "0.01")}
      {field("openQuotes", "Open quotes ($)")}
      {field("safetyIncidents12m", "Recordable incidents (12m)")}
      <label>
        Workflow notes
        <input value={scenario.workflowNotes} onChange={(event) => set({ workflowNotes: event.target.value })} />
      </label>
    </div>
  );
}

export function App() {
  const [host, setHost] = useState<Host | null>(null);
  const [hostError, setHostError] = useState<string | null>(null);
  const [brand, setBrand] = useState<BrandId | null>(null);
  const [phase, setPhase] = useState<Phase>("brand");
  const [scenario, setScenario] = useState<Scenario | null>(null);
  const [workup, setWorkup] = useState<Workup | null>(null);
  const [reviews, setReviews] = useState<Record<string, Review>>({});
  const [exportText, setExportText] = useState<string>("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const theme: BrandTheme | null = brand ? BRAND_THEMES[brand] : null;

  useEffect(() => {
    let cancelled = false;
    connectHost()
      .then((next) => {
        if (cancelled) return;
        setHost(next);
        const found = brandFromLocation(window.location.search, window.location.hash, next.entryPayload);
        if (found) {
          setBrand(found);
          setPhase("ingest");
          setScenario(getScenario(found));
        }
      })
      .catch((err: Error) => {
        if (!cancelled) setHostError(err.message);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    document.documentElement.dataset.brand = brand ?? "";
    if (brand && host) {
      writeBrandHash(brand);
      void host.window.set_title({ title: `${BRAND_THEMES[brand].name} · Cubiczan` });
    }
  }, [brand, host]);

  const persist = async (next: { brand?: BrandId | null; phase?: Phase; scenario?: Scenario | null; workup?: Workup | null }) => {
    if (!host) return;
    await host.storage.set({
      key: "ssfb:session",
      value: {
        brand: next.brand ?? brand,
        phase: next.phase ?? phase,
        scenario: next.scenario ?? scenario,
        workup: next.workup ?? workup,
      },
    });
  };

  const chooseBrand = (id: BrandId) => {
    setBrand(id);
    setPhase("ingest");
    setScenario(getScenario(id));
    setWorkup(null);
    setReviews({});
    setExportText("");
    void persist({ brand: id, phase: "ingest", scenario: getScenario(id), workup: null });
  };

  const invoke = async (method: string, args: Record<string, unknown>) => {
    if (!host) throw new Error("Host is not ready.");
    const out = await host.tools.invoke({ tool_id: TOOL_ID, method, args });
    return unwrapTool(out);
  };

  const runGenerate = async () => {
    if (!brand || !scenario) return;
    setBusy(true);
    setError(null);
    try {
      const local = generateWorkup(brand, scenario);
      setWorkup(local);
      setPhase("workup");
      await invoke("generate_workup", { brand, scenario });
      await persist({ phase: "workup", workup: local });
    } catch (err) {
      setWorkup(generateWorkup(brand, scenario));
      setPhase("workup");
      setError(err instanceof Error ? err.message : "Workup generated locally after the tool call failed.");
    } finally {
      setBusy(false);
    }
  };

  const runLock = async () => {
    if (!workup) return;
    setBusy(true);
    setError(null);
    try {
      const reviewList = Object.values(reviews);
      const local = lockConsensus(workup, reviewList);
      setWorkup(local);
      setPhase(local.lock?.locked ? "export" : "review");
      await invoke("lock_consensus", { workup, reviews: reviewList });
      if (local.lock?.locked) {
        const pack = exportSummary(local);
        setExportText(pack.markdown);
      }
      await persist({ phase: local.lock?.locked ? "export" : "review", workup: local });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Lock failed.");
    } finally {
      setBusy(false);
    }
  };

  const downloadExport = () => {
    const blob = new Blob([exportText || ""], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${brand ?? "cubiczan"}-summary.md`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const visibleSteps = useMemo(() => STEPS, []);
  const pendingCount = workup?.claims.filter((item) => !reviews[item.id] && item.status !== "locked").length ?? 0;

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand-mark">
          <strong>Cubiczan</strong>
          <span>{theme ? `${theme.name} × ${theme.house}` : "ServiceSell × FinBridge"}</span>
        </div>
        <div className="switcher">
          <button type="button" data-testid="switch-servicesell" data-active={brand === "servicesell"} onClick={() => chooseBrand("servicesell")}>
            #servicesell
          </button>
          <button type="button" data-testid="switch-finbridge" data-active={brand === "finbridge"} onClick={() => chooseBrand("finbridge")}>
            #finbridge
          </button>
          <div className="host-pill">{host ? (host.kind === "anna" ? "Anna host" : "Standalone preview") : "Connecting…"}</div>
        </div>
      </header>

      <nav className="rail" aria-label="CHP workflow">
        {visibleSteps.map((step) => (
          <button
            key={step.id}
            type="button"
            data-active={phase === step.id || (step.id === "review" && phase === "locked")}
            onClick={() => {
              if (step.id === "brand") setPhase("brand");
              if (step.id === "ingest" && brand) setPhase("ingest");
              if (step.id === "workup" && workup) setPhase("workup");
              if (step.id === "challenge" && workup) setPhase("challenge");
              if ((step.id === "review" || step.id === "export") && workup) setPhase(step.id === "export" && exportText ? "export" : "review");
            }}
          >
            <small>CHP</small>
            <b>{step.label}</b>
            <span className="challenge" style={{ margin: 0 }}>{step.hint}</span>
          </button>
        ))}
      </nav>

      <main className="main">
        {hostError ? <p className="error">{hostError}</p> : null}
        {error ? <p className="error">{error}</p> : null}

        {phase === "brand" || !brand || !theme ? (
          <section>
            <div className="hero">
              <div className="eyebrow">One product · two skins · cubiczan.com</div>
              <h1>Implement AI agents in the live blue-collar workflow.</h1>
              <p className="lede">
                Cubiczan ships production governed agentic AI (CHP). ServiceSell and FinBridge are two skins on the same
                ability — field-service and shop-floor — not two products, not a sale-readiness pack, and not a chatbot
                with a coat of paint. Impact Quadrant forward-deploys.
              </p>
            </div>
            <div className="gate">
              {(Object.values(BRAND_THEMES) as BrandTheme[]).map((item) => (
                <article key={item.id} className="gate-card" data-brand={item.id}>
                  <div>
                    <div className="eyebrow">{item.eyebrow}</div>
                    <h1>{item.name}</h1>
                    <p>{item.bio}</p>
                    <p>{item.audience}</p>
                  </div>
                  <div className="actions">
                    <button className="primary" type="button" data-testid={`enter-${item.id}`} onClick={() => chooseBrand(item.id)}>
                      Enter {item.alias}
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </section>
        ) : null}

        {brand && theme && phase === "ingest" && scenario ? (
          <section className="grid-2">
            <div className="card">
              <div className="eyebrow">{theme.ingestLabel}</div>
              <h2>{theme.promise}</h2>
              <p className="lede">{scenario.disclaimer}</p>
              <div className="actions" style={{ margin: "14px 0" }}>
                <button className="primary" type="button" onClick={() => setScenario(getScenario(brand))}>
                  Load illustrative composite
                </button>
                <button className="ghost" type="button" onClick={() => setScenario(emptyScenario(brand))}>
                  Start from blank
                </button>
              </div>
              <ScenarioForm scenario={scenario} onChange={setScenario} />
              <div className="actions" style={{ marginTop: 16 }}>
                <button className="primary" type="button" data-testid="generate-workup" disabled={busy || !scenario.ttmRevenue} onClick={() => void runGenerate()}>
                  {busy ? "Generating…" : `Generate ${theme.outputLabel.toLowerCase()}`}
                </button>
              </div>
            </div>
            <aside className="card">
              <h2>What gets ingested</h2>
              <p className="lede">
                {theme.audience} The composite is labeled as illustrative on purpose — this repo does not invent companies
                as customers.
              </p>
              <p className="challenge">{theme.source}</p>
              <p className="challenge">Alias: {theme.alias} · House: {theme.house}</p>
            </aside>
          </section>
        ) : null}

        {workup && (phase === "workup" || phase === "challenge") ? (
          <section>
            <div className="hero">
              <div className="eyebrow">{theme?.outputLabel}</div>
              <h1>{phase === "workup" ? "Proposed workflow pack" : "Challenge board"}</h1>
              <p className="lede">
                Every figure carries a source. Derived lines show the formula. Assumptions stay yellow until a human locks
                them. Production agents, not a demo pitch.
              </p>
              <div className="metrics">
                <div className="metric">
                  <span>Adjusted job EBITDA</span>
                  <b>{formatUsd(workup.metrics.adjEbitda)}</b>
                </div>
                <div className="metric">
                  <span>After-hours capture</span>
                  <b>{formatPct(workup.scenario.afterHoursCapturePct)}</b>
                </div>
                <div className="metric">
                  <span>Workflow score</span>
                  <b>{workup.readiness.score.toFixed(1)}</b>
                </div>
                <div className="metric">
                  <span>Challenges</span>
                  <b>{workup.claims.filter((item) => item.challenges.length).length}</b>
                </div>
              </div>
              <div className="actions">
                <button className="ghost" type="button" data-testid="toggle-challenge" onClick={() => setPhase(phase === "workup" ? "challenge" : "workup")}>
                  {phase === "workup" ? "Open challenge board" : "Back to proposed pack"}
                </button>
                <button className="primary" type="button" data-testid="goto-review" onClick={() => setPhase("review")}>
                  Continue to human lock
                </button>
              </div>
            </div>

            {phase === "workup" && brand === "finbridge" ? (
              <div className="card" style={{ marginTop: 16 }}>
                <h2>Forward operating view</h2>
                <div className="table-wrap">
                  <table>
                    <thead>
                      <tr>
                        <th>Year</th>
                        <th>Revenue</th>
                        <th>Gross profit</th>
                        <th>EBITDA</th>
                        <th>Margin</th>
                      </tr>
                    </thead>
                    <tbody>
                      {workup.proforma.map((row) => (
                        <tr key={row.year}>
                          <td>Y{row.year}</td>
                          <td>{formatUsd(row.revenue)}</td>
                          <td>{formatUsd(row.grossProfit)}</td>
                          <td>{formatUsd(row.ebitda)}</td>
                          <td>{formatPct(row.ebitdaMargin)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : null}

            {phase === "workup" && brand === "servicesell" ? (
              <div className="card" style={{ marginTop: 16 }}>
                <h2>Workflow agent checklist</h2>
                <div className="check-list">
                  {workup.checklist.map((item) => (
                    <article key={item.id} className="check">
                      <div>
                        <h3>{item.title}</h3>
                        <Chip className={item.status}>{item.status}</Chip>
                      </div>
                      <div className="value">
                        {item.claimSnapshot ? formatClaim(item.claimSnapshot) : "—"}
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            ) : null}

            <div className="card" style={{ marginTop: 16 }}>
              <h2>{phase === "challenge" ? "Claims under dissent" : "Provenance ledger"}</h2>
              <div className="claim-list">
                {(phase === "challenge" ? workup.claims.filter((item) => item.challenges.length) : workup.claims).map((item) => (
                  <ClaimRow key={item.id} claim={item} />
                ))}
              </div>
              {phase === "challenge" && workup.claims.every((item) => !item.challenges.length) ? (
                <p className="empty">No automatic challenges fired. A human still has to lock the workflow pack.</p>
              ) : null}
            </div>
          </section>
        ) : null}

        {workup && (phase === "review" || phase === "locked") ? (
          <section className="card">
            <div className="eyebrow">{theme?.lockLabel}</div>
            <h2>Human review is the lock, not a rubber stamp</h2>
            <p className="lede">
              CHP here is Cubiczan-shaped: the agent proposes, the rule pack challenges, a person approves or rejects
              every claim. Lock is refused while anything is still pending.
            </p>
            <p className="banner">{pendingCount} claim{pendingCount === 1 ? "" : "s"} still need a decision.</p>
            <div className="claim-list" style={{ marginTop: 16 }}>
              {workup.claims.map((item) => (
                <ClaimRow
                  key={item.id}
                  claim={item}
                  review={reviews[item.id]}
                  onReview={(next) => setReviews((current) => ({ ...current, [next.claimId]: next }))}
                />
              ))}
            </div>
            <div className="actions" style={{ marginTop: 16 }}>
              <button className="ghost" type="button" data-testid="approve-all" onClick={() => {
                const next: Record<string, Review> = {};
                for (const item of workup.claims) next[item.id] = { claimId: item.id, decision: "approved", note: "Batch approved for demo" };
                setReviews(next);
              }}>
                Approve all (demo)
              </button>
              <button className="primary" type="button" data-testid="lock-consensus" disabled={busy} onClick={() => void runLock()}>
                {busy ? "Locking…" : "Lock consensus"}
              </button>
            </div>
            {workup.lock && !workup.lock.locked ? <p className="error">{workup.lock.reason}</p> : null}
          </section>
        ) : null}

        {phase === "export" ? (
          <section className="card">
            <div className="eyebrow">Export</div>
            <h2>{theme?.outputLabel ?? "Summary"}</h2>
            {exportText ? (
              <>
                <pre className="export">{exportText}</pre>
                <div className="actions" style={{ marginTop: 16 }}>
                  <button className="primary" type="button" onClick={downloadExport}>
                    Download markdown
                  </button>
                  <button className="ghost" type="button" onClick={() => {
                    void navigator.clipboard?.writeText(exportText);
                  }}>
                    Copy
                  </button>
                </div>
              </>
            ) : (
              <p className="empty">Lock the workflow pack first. Export only includes approved or locked claims.</p>
            )}
          </section>
        ) : null}
      </main>

      <p className="footer-note">
        Cubiczan console · illustrative composites only · MIT · cubiczan.com. Production governed agents, not a demo
        pitch. Not a valuation opinion, offer, or customer case study.
      </p>
    </div>
  );
}
