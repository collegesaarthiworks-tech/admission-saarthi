"use client";

import {
  ArrowLeft, Building2, Check, CheckCircle2, ChevronRight, CircleUserRound,
  ClipboardCheck, Eye, FileImage, GraduationCap, LayoutDashboard, Menu,
  Pencil, Plus, Save, Search, Send, Trash2, Upload, X,
} from "lucide-react";
import { ChangeEvent, useEffect, useMemo, useState } from "react";
import styles from "./onboarding.module.css";

const ENTITY_TYPES = ["College", "University", "School", "Coaching", "EdTech", "School of AI"] as const;
const ROLES = ["Admission Saarthi team", "Channel partner", "Institution representative"] as const;
const STORAGE_KEY = "admission-saarthi-onboarding-v1";

type EntityType = typeof ENTITY_TYPES[number];
type Role = typeof ROLES[number];
type Status = "Draft" | "In review" | "Published";
type Step = "Basics" | "Academics" | "Media" | "Review";

type Listing = {
  id: string;
  type: EntityType;
  name: string;
  email: string;
  phone: string;
  website: string;
  city: string;
  state: string;
  country: string;
  address: string;
  established: string;
  accreditation: string;
  mode: string;
  programs: string;
  eligibility: string;
  feeMin: string;
  feeMax: string;
  intake: string;
  description: string;
  facilities: string;
  mediaNames: string[];
  ownerRole: Role;
  status: Status;
  updatedAt: string;
};

const blankListing = (role: Role): Listing => ({
  id: "", type: "College", name: "", email: "", phone: "", website: "", city: "", state: "",
  country: "India", address: "", established: "", accreditation: "", mode: "Offline",
  programs: "", eligibility: "", feeMin: "", feeMax: "", intake: "", description: "",
  facilities: "", mediaNames: [], ownerRole: role, status: "Draft", updatedAt: "",
});

const steps: Step[] = ["Basics", "Academics", "Media", "Review"];

const fieldMeta: Record<EntityType, { credential: string; programs: string; placeholder: string }> = {
  College: { credential: "Accreditation / affiliation", programs: "Courses and programs", placeholder: "MBA\nB.Tech Computer Science\nBBA" },
  University: { credential: "Accreditation / recognition", programs: "Degrees and programs", placeholder: "MBA\nM.Sc Data Science\nPhD Management" },
  School: { credential: "Board", programs: "Grades and streams", placeholder: "Nursery to Grade 12\nScience\nCommerce" },
  Coaching: { credential: "Exam categories", programs: "Batches and programs", placeholder: "JEE Main + Advanced\nNEET Foundation\nDropper batch" },
  EdTech: { credential: "Certification / partners", programs: "Online courses", placeholder: "Full Stack Development\nData Science\nDigital Marketing" },
  "School of AI": { credential: "Certification / academic partners", programs: "AI learning programs", placeholder: "Generative AI Foundations\nMachine Learning\nAI for Business" },
};

function completion(item: Listing) {
  const required = [item.name, item.email, item.phone, item.city, item.country, item.description, item.programs, item.accreditation];
  return Math.round((required.filter(Boolean).length / required.length) * 100);
}

export default function OnboardingPanel() {
  const [role, setRole] = useState<Role>("Admission Saarthi team");
  const [step, setStep] = useState<Step>("Basics");
  const [listings, setListings] = useState<Listing[]>([]);
  const [form, setForm] = useState<Listing>(() => blankListing("Admission Saarthi team"));
  const [media, setMedia] = useState<{ name: string; type: string; url: string }[]>([]);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | Status>("All");
  const [showEditor, setShowEditor] = useState(true);
  const [mobileNav, setMobileNav] = useState(false);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try { setListings(JSON.parse(raw)); } catch { /* Ignore invalid local drafts. */ }
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(listings));
  }, [listings]);

  const progress = completion(form);
  const meta = fieldMeta[form.type];
  const filtered = useMemo(() => listings.filter(item => {
    const matchesText = `${item.name} ${item.city} ${item.type}`.toLowerCase().includes(query.toLowerCase());
    return matchesText && (statusFilter === "All" || item.status === statusFilter);
  }), [listings, query, statusFilter]);

  const update = (key: keyof Listing, value: string) => setForm(current => ({ ...current, [key]: value }));

  const handleMedia = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    const next = files.map(file => ({ name: file.name, type: file.type, url: URL.createObjectURL(file) }));
    setMedia(current => [...current, ...next].slice(0, 8));
    setForm(current => ({ ...current, mediaNames: [...current.mediaNames, ...files.map(file => file.name)].slice(0, 8) }));
  };

  const persist = (status: Status) => {
    if (!form.name.trim()) {
      setStep("Basics");
      setNotice("Add the institution name before saving.");
      return;
    }
    const item = { ...form, id: form.id || crypto.randomUUID(), ownerRole: role, status, updatedAt: new Date().toISOString() };
    setListings(current => [item, ...current.filter(entry => entry.id !== item.id)]);
    setForm(item);
    setNotice(status === "Draft" ? "Draft saved on this device." : status === "Published" ? "Listing published." : "Listing sent for review.");
  };

  const newListing = () => {
    setForm(blankListing(role));
    setMedia([]);
    setStep("Basics");
    setShowEditor(true);
    setNotice("");
  };

  const editListing = (item: Listing) => {
    setForm(item);
    setMedia([]);
    setStep("Basics");
    setShowEditor(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const removeListing = (id: string) => {
    setListings(current => current.filter(item => item.id !== id));
    if (form.id === id) newListing();
  };

  return (
    <main className={styles.appShell}>
      <aside className={`${styles.sidebar} ${mobileNav ? styles.sidebarOpen : ""}`}>
        <div className={styles.brand}><img src="/logo.png" alt="Admission Saarthi" /></div>
        <button className={styles.closeNav} onClick={() => setMobileNav(false)} aria-label="Close navigation"><X /></button>
        <nav>
          <a href="/" className={styles.backLink}><ArrowLeft /> Back to website</a>
          <button className={styles.navActive}><LayoutDashboard /> Onboarding</button>
          <button><Building2 /> All listings <span>{listings.length}</span></button>
          <button><ClipboardCheck /> Review queue <span>{listings.filter(item => item.status === "In review").length}</span></button>
        </nav>
        <div className={styles.sidebarHelp}>
          <strong>Need onboarding help?</strong>
          <a href="mailto:director@admissionsaarthi.com">Contact support</a>
        </div>
      </aside>

      <section className={styles.workspace}>
        <header className={styles.topbar}>
          <button className={styles.menuButton} onClick={() => setMobileNav(true)} aria-label="Open navigation"><Menu /></button>
          <div><span>Partner workspace</span><strong>Institution onboarding</strong></div>
          <div className={styles.roleBox}>
            <CircleUserRound />
            <label><span>Working as</span><select value={role} onChange={event => { const next = event.target.value as Role; setRole(next); setForm(current => ({ ...current, ownerRole: next })); }}>{ROLES.map(item => <option key={item}>{item}</option>)}</select></label>
          </div>
        </header>

        <div className={styles.page}>
          <div className={styles.pageHead}>
            <div><p>ONBOARDING WORKSPACE</p><h1>List an education provider</h1><span>Create complete, review-ready profiles for students and parents.</span></div>
            <button className={styles.primaryButton} onClick={newListing}><Plus /> New listing</button>
          </div>

          <div className={styles.stats}>
            <div><span>Total listings</span><strong>{listings.length}</strong></div>
            <div><span>Drafts</span><strong>{listings.filter(item => item.status === "Draft").length}</strong></div>
            <div><span>Awaiting review</span><strong>{listings.filter(item => item.status === "In review").length}</strong></div>
            <div><span>Published</span><strong>{listings.filter(item => item.status === "Published").length}</strong></div>
          </div>

          {showEditor && <section className={styles.editor}>
            <div className={styles.editorHead}>
              <div><span>{form.id ? "EDIT LISTING" : "NEW LISTING"}</span><h2>{form.name || `Add a ${form.type.toLowerCase()}`}</h2></div>
              <button onClick={() => setShowEditor(false)} aria-label="Close editor"><X /></button>
            </div>

            <div className={styles.progressRow}>
              <div className={styles.progressTrack}><i style={{ width: `${progress}%` }} /></div><strong>{progress}% complete</strong>
            </div>

            <div className={styles.stepper}>
              {steps.map((item, index) => <button key={item} className={step === item ? styles.stepActive : ""} onClick={() => setStep(item)}><span>{index + 1}</span>{item}</button>)}
            </div>

            <div className={styles.formLayout}>
              <div className={styles.formPanel}>
                {notice && <div className={styles.notice}><CheckCircle2 /> {notice}<button onClick={() => setNotice("")}><X /></button></div>}

                {step === "Basics" && <div className={styles.formSection}>
                  <div className={styles.sectionTitle}><span><Building2 /></span><div><h3>Basic information</h3><p>Start with the details students use to identify and contact the provider.</p></div></div>
                  <div className={styles.fieldGrid}>
                    <label className={styles.full}>Provider type <select value={form.type} onChange={event => update("type", event.target.value)}>{ENTITY_TYPES.map(type => <option key={type}>{type}</option>)}</select></label>
                    <label className={styles.full}>Official name <input value={form.name} onChange={event => update("name", event.target.value)} placeholder={`Enter ${form.type.toLowerCase()} name`} /></label>
                    <label>Official email <input type="email" value={form.email} onChange={event => update("email", event.target.value)} placeholder="admissions@example.edu" /></label>
                    <label>Phone / WhatsApp <input value={form.phone} onChange={event => update("phone", event.target.value)} placeholder="+91 98765 43210" /></label>
                    <label className={styles.full}>Website <input type="url" value={form.website} onChange={event => update("website", event.target.value)} placeholder="https://" /></label>
                    <label>City <input value={form.city} onChange={event => update("city", event.target.value)} placeholder="City" /></label>
                    <label>State <input value={form.state} onChange={event => update("state", event.target.value)} placeholder="State / province" /></label>
                    <label>Country <input value={form.country} onChange={event => update("country", event.target.value)} /></label>
                    <label>Established year <input inputMode="numeric" value={form.established} onChange={event => update("established", event.target.value)} placeholder="2012" /></label>
                    <label className={styles.full}>Full address <textarea value={form.address} onChange={event => update("address", event.target.value)} placeholder="Campus or office address" rows={3} /></label>
                  </div>
                </div>}

                {step === "Academics" && <div className={styles.formSection}>
                  <div className={styles.sectionTitle}><span><GraduationCap /></span><div><h3>Academic details</h3><p>Add information students need before making an enquiry.</p></div></div>
                  <div className={styles.fieldGrid}>
                    <label className={styles.full}>{meta.credential}<input value={form.accreditation} onChange={event => update("accreditation", event.target.value)} placeholder={form.type === "School" ? "CBSE, ICSE, IB or state board" : "UGC, AICTE, NAAC or relevant recognition"} /></label>
                    <label>Delivery mode <select value={form.mode} onChange={event => update("mode", event.target.value)}><option>Offline</option><option>Online</option><option>Hybrid</option></select></label>
                    <label>Next intake <input value={form.intake} onChange={event => update("intake", event.target.value)} placeholder="July 2027" /></label>
                    <label className={styles.full}>{meta.programs}<textarea value={form.programs} onChange={event => update("programs", event.target.value)} placeholder={meta.placeholder} rows={5} /><small>Enter one course, grade or program per line.</small></label>
                    <label className={styles.full}>Eligibility <textarea value={form.eligibility} onChange={event => update("eligibility", event.target.value)} placeholder="Minimum qualification, marks or entrance requirements" rows={3} /></label>
                    <label>Minimum annual fee <input inputMode="numeric" value={form.feeMin} onChange={event => update("feeMin", event.target.value)} placeholder="50000" /></label>
                    <label>Maximum annual fee <input inputMode="numeric" value={form.feeMax} onChange={event => update("feeMax", event.target.value)} placeholder="250000" /></label>
                    <label className={styles.full}>Facilities and support <input value={form.facilities} onChange={event => update("facilities", event.target.value)} placeholder="Library, hostel, labs, placement support" /></label>
                    <label className={styles.full}>About the provider <textarea value={form.description} onChange={event => update("description", event.target.value)} placeholder="Write a clear, factual summary. Avoid admission guarantees." rows={6} /></label>
                  </div>
                </div>}

                {step === "Media" && <div className={styles.formSection}>
                  <div className={styles.sectionTitle}><span><FileImage /></span><div><h3>Photos and videos</h3><p>Add clear campus, classroom, facility and student-life media.</p></div></div>
                  <label className={styles.uploadBox}>
                    <Upload /><strong>Choose photos or videos</strong><span>JPG, PNG, WebP or MP4. Up to 8 files in this listing.</span>
                    <input type="file" multiple accept="image/jpeg,image/png,image/webp,video/mp4" onChange={handleMedia} />
                  </label>
                  <div className={styles.mediaGrid}>{media.map((file, index) => <div key={`${file.name}-${index}`} className={styles.mediaItem}>{file.type.startsWith("image") ? <img src={file.url} alt="Uploaded preview" /> : <video src={file.url} controls />}<span>{file.name}</span><button onClick={() => { URL.revokeObjectURL(file.url); setMedia(current => current.filter((_, i) => i !== index)); setForm(current => ({ ...current, mediaNames: current.mediaNames.filter((_, i) => i !== index) })); }} aria-label={`Remove ${file.name}`}><Trash2 /></button></div>)}</div>
                  {!media.length && form.mediaNames.length > 0 && <div className={styles.savedMedia}>{form.mediaNames.map(name => <span key={name}><FileImage />{name}</span>)}</div>}
                </div>}

                {step === "Review" && <div className={styles.formSection}>
                  <div className={styles.sectionTitle}><span><ClipboardCheck /></span><div><h3>Review listing</h3><p>Check the information before it reaches the review team or goes live.</p></div></div>
                  <div className={styles.reviewList}>
                    <div><span>Provider</span><strong>{form.name || "Not added"}</strong><small>{form.type}</small></div>
                    <div><span>Location</span><strong>{[form.city, form.state, form.country].filter(Boolean).join(", ") || "Not added"}</strong></div>
                    <div><span>Contact</span><strong>{form.email || "Not added"}</strong><small>{form.phone}</small></div>
                    <div><span>{meta.programs}</span><strong>{form.programs ? `${form.programs.split("\n").filter(Boolean).length} added` : "Not added"}</strong></div>
                    <div><span>Media</span><strong>{form.mediaNames.length} files selected</strong></div>
                    <div><span>Profile completeness</span><strong>{progress}%</strong></div>
                  </div>
                  {progress < 100 && <div className={styles.reviewWarning}>Complete the highlighted essentials before publication. You can still save this as a draft.</div>}
                </div>}

                <div className={styles.formActions}>
                  <button className={styles.secondaryButton} onClick={() => persist("Draft")}><Save /> Save draft</button>
                  <div>
                    {steps.indexOf(step) > 0 && <button className={styles.textButton} onClick={() => setStep(steps[steps.indexOf(step) - 1])}>Back</button>}
                    {step !== "Review" ? <button className={styles.primaryButton} onClick={() => setStep(steps[steps.indexOf(step) + 1])}>Continue <ChevronRight /></button> : role === "Admission Saarthi team" ? <button className={styles.primaryButton} disabled={progress < 100} onClick={() => persist("Published")}><Check /> Publish listing</button> : <button className={styles.primaryButton} disabled={progress < 100} onClick={() => persist("In review")}><Send /> Submit for review</button>}
                  </div>
                </div>
              </div>

              <aside className={styles.previewPanel}>
                <div className={styles.previewLabel}><Eye /> STUDENT PREVIEW</div>
                <div className={styles.previewCover}>{media.find(file => file.type.startsWith("image")) ? <img src={media.find(file => file.type.startsWith("image"))?.url} alt="Provider cover preview" /> : <><FileImage /><span>Cover photo</span></>}</div>
                <div className={styles.previewBody}><span className={styles.typePill}>{form.type}</span><h3>{form.name || "Provider name"}</h3><p>{[form.city, form.state, form.country].filter(Boolean).join(", ") || "Location will appear here"}</p><div><span>{form.mode}</span>{form.accreditation && <span>{form.accreditation}</span>}</div><p className={styles.previewDescription}>{form.description || "Your factual provider summary will appear here for students and parents."}</p><button>Request information</button></div>
              </aside>
            </div>
          </section>}

          {!showEditor && <button className={styles.reopenEditor} onClick={() => setShowEditor(true)}><Pencil /> Continue editing {form.name || "current listing"}</button>}

          <section className={styles.listSection}>
            <div className={styles.listHead}><div><p>LISTING MANAGEMENT</p><h2>Saved providers</h2></div><button className={styles.primaryButton} onClick={newListing}><Plus /> Add provider</button></div>
            <div className={styles.filters}><label><Search /><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Search by name, city or type" /></label><select value={statusFilter} onChange={event => setStatusFilter(event.target.value as "All" | Status)}><option>All</option><option>Draft</option><option>In review</option><option>Published</option></select></div>
            <div className={styles.tableWrap}>
              {filtered.length ? <table><thead><tr><th>Provider</th><th>Type</th><th>Location</th><th>Complete</th><th>Status</th><th aria-label="Actions" /></tr></thead><tbody>{filtered.map(item => <tr key={item.id}><td><strong>{item.name}</strong><span>{item.email || "No email added"}</span></td><td>{item.type}</td><td>{[item.city, item.country].filter(Boolean).join(", ") || "Not added"}</td><td><div className={styles.miniProgress}><i style={{ width: `${completion(item)}%` }} /></div><span>{completion(item)}%</span></td><td><span className={`${styles.status} ${styles[item.status.replace(" ", "").toLowerCase()]}`}>{item.status}</span></td><td><button onClick={() => editListing(item)} aria-label={`Edit ${item.name}`}><Pencil /></button><button onClick={() => removeListing(item.id)} aria-label={`Delete ${item.name}`}><Trash2 /></button></td></tr>)}</tbody></table> : <div className={styles.empty}><Building2 /><h3>No listings found</h3><p>Add the first education provider or change your filters.</p><button className={styles.primaryButton} onClick={newListing}><Plus /> Add provider</button></div>}
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
