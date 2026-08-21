"use client";

import { ChangeEvent, FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Bot, Calculator, Check, CircleDollarSign, FileCheck2, GraduationCap, Heart, ImagePlus, MapPin, Menu, MessageCircle, Search, ShieldCheck, Sparkles, UploadCloud, Video, X } from "lucide-react";
import { whatsappUrl } from "@/lib/whatsapp";
import styles from "./study-abroad.module.css";

type University = { name:string; country:string; city:string; course:string; level:string; fee:number; intake:string; image:string; note:string };

const destinations = [
  { code:"US", name:"USA", detail:"STEM, business and research", cost:"From Rs 24L/year" },
  { code:"GB", name:"United Kingdom", detail:"One-year masters and law", cost:"From Rs 20L/year" },
  { code:"CA", name:"Canada", detail:"Analytics, engineering and health", cost:"From Rs 17L/year" },
  { code:"AU", name:"Australia", detail:"IT, nursing and green tech", cost:"From Rs 22L/year" },
  { code:"DE", name:"Germany", detail:"Engineering and management", cost:"Low-tuition options" },
  { code:"EU", name:"Europe", detail:"Design, hospitality and finance", cost:"Multiple destinations" },
];

const universities: University[] = [
  { name:"University of Melbourne", country:"Australia", city:"Melbourne", course:"Master of Data Science", level:"Masters", fee:28, intake:"Feb / Jul", image:"/study-abroad/melbourne.jpg", note:"Research-led program with industry projects" },
  { name:"University of Birmingham", country:"United Kingdom", city:"Birmingham", course:"MSc International Business", level:"Masters", fee:26, intake:"Sep", image:"/study-abroad/birmingham.jpg", note:"One-year postgraduate study route" },
  { name:"Arizona State University", country:"USA", city:"Tempe", course:"MS Computer Science", level:"Masters", fee:31, intake:"Jan / Aug", image:"/study-abroad/asu.jpg", note:"STEM-focused curriculum and career services" },
  { name:"University of Alberta", country:"Canada", city:"Edmonton", course:"Bachelor of Commerce", level:"Bachelors", fee:21, intake:"Sep", image:"/study-abroad/alberta.jpg", note:"Business specialisations with co-op options" },
  { name:"Technical University of Munich", country:"Germany", city:"Munich", course:"MSc Management & Technology", level:"Masters", fee:12, intake:"Apr / Oct", image:"/study-abroad/munich.jpg", note:"Technology and management pathway" },
];

const aiTools = [
  ["match","University Matcher","Shortlist options from your profile.",Sparkles],
  ["eligibility","Eligibility Checker","Check likely academic fit.",FileCheck2],
  ["budget","Budget Planner","Estimate tuition and living cost.",Calculator],
  ["scholarship","Scholarship Finder","Find relevant funding routes.",CircleDollarSign],
  ["sop","SOP Assistant","Build a responsible first draft.",Bot],
  ["visa","Visa Checklist","Organise required documents.",ShieldCheck],
] as const;

export function StudyAbroadPage() {
  const [menuOpen,setMenuOpen] = useState(false);
  const [country,setCountry] = useState("All countries");
  const [level,setLevel] = useState("All levels");
  const [budget,setBudget] = useState("Any budget");
  const [query,setQuery] = useState("");
  const [shortlist,setShortlist] = useState<string[]>([]);
  const [compare,setCompare] = useState<string[]>([]);
  const [activeTool,setActiveTool] = useState("match");
  const [toolResult,setToolResult] = useState("");
  const [media,setMedia] = useState<{name:string;url:string;type:string}[]>([]);

  const filtered = useMemo(() => universities.filter(u => {
    const text = `${u.name} ${u.course} ${u.city}`.toLowerCase().includes(query.toLowerCase());
    const place = country === "All countries" || u.country === country;
    const studyLevel = level === "All levels" || u.level === level;
    const ceiling = budget === "Under Rs 15L" ? 15 : budget === "Rs 15L - 25L" ? 25 : Infinity;
    return text && place && studyLevel && u.fee <= ceiling;
  }),[query,country,level,budget]);

  function toggle(list:string[],item:string,setter:(items:string[])=>void,max=Infinity){ setter(list.includes(item)?list.filter(x=>x!==item):[...list,item].slice(-max)); }
  function runTool(event:FormEvent<HTMLFormElement>){ event.preventDefault(); const data=new FormData(event.currentTarget); setToolResult(`Based on ${data.get("score")} and ${data.get("preference")}, we found potential pathways to review. This is guidance, not an admission or visa guarantee.`); }
  function uploadMedia(event:ChangeEvent<HTMLInputElement>){ const files=Array.from(event.target.files||[]).slice(0,6); setMedia(files.map(file=>({name:file.name,url:URL.createObjectURL(file),type:file.type}))); }

  return <main className={styles.page}>
    <header className={styles.header}>
      <Link href="/" className={styles.brand}><img src="/logo.png" alt="Admission Saarthi" style={{ transform: "translateY(-56px) scale(0.9)" }}/></Link>
      <nav className={menuOpen?styles.navOpen:styles.nav}><a href="#destinations">Destinations</a><a href="#universities">Universities</a><a href="#tools">AI tools</a><a href="#journey">How it works</a></nav>
      <a className={styles.counsellorButton} href={whatsappUrl("Lucknow / Bangalore","I need study abroad counselling.","Study abroad header")} target="_blank">Talk to a counsellor</a>
      <button className={styles.menuButton} onClick={()=>setMenuOpen(!menuOpen)} aria-label="Toggle navigation">{menuOpen?<X/>:<Menu/>}</button>
    </header>

    <section className={styles.hero}>
      <div className={styles.heroCopy}><Link href="/" className={styles.back}><ArrowLeft size={16}/> Admission Saarthi home</Link><h1>Study abroad with a clear plan</h1><p>Compare universities, understand costs, check your likely eligibility and get human guidance at every step.</p><div className={styles.heroActions}><a className={styles.primary} href="#universities">Find universities <ArrowRight size={18}/></a><a className={styles.secondary} href="#tools">Try AI tools <Sparkles size={18}/></a></div><div className={styles.heroSearch}><Search/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search a university, course or city"/><a href="#universities">Search</a></div><span className={styles.disclaimer}><ShieldCheck size={15}/> Recommendations use listed information and never guarantee admission or visas.</span></div>
      <div className={styles.heroMedia}><img src="/study-abroad/hero.jpg" alt="International students walking on a university campus"/><div className={styles.heroFact}><strong>One profile</strong><span>Destinations, courses, costs and guidance together</span></div></div>
    </section>

    <section className={styles.destinationSection} id="destinations"><SectionIntro label="Explore destinations" title="Choose a country that fits your goals" text="Start with the course, total budget and career fit. Visa and work rules can change, so confirm them with official sources."/><div className={styles.destinationRail}>{destinations.map(d=><button key={d.name} onClick={()=>{setCountry(d.name==="Europe"?"All countries":d.name);document.getElementById("universities")?.scrollIntoView()}}><b>{d.code}</b><strong>{d.name}</strong><span>{d.detail}</span><small>{d.cost}</small><ArrowRight size={17}/></button>)}</div></section>

    <section className={styles.toolsSection} id="tools">
      <div className={styles.toolsCopy}><span>AI Saarthi toolkit</span><h2>Make the confusing parts simpler</h2><p>Use practical tools before you speak to a counsellor. Results are starting points based on the information you provide.</p><div className={styles.toolList}>{aiTools.map(([id,title,text,Icon])=><button className={activeTool===id?styles.toolActive:""} key={id} onClick={()=>{setActiveTool(id);setToolResult("")}}><Icon/><span><strong>{title}</strong><small>{text}</small></span><ArrowRight size={16}/></button>)}</div></div>
      <div className={styles.toolWorkspace}><div><Bot/><span><strong>{aiTools.find(t=>t[0]===activeTool)?.[1]}</strong><small>AI-assisted, human-reviewed when needed</small></span></div><form onSubmit={runTool}><label>Current academic score<input name="score" required placeholder="Example: 78% or 8.2 CGPA"/></label><label>Preferred destination<select name="preference" required defaultValue=""><option value="" disabled>Choose a country</option>{destinations.slice(0,5).map(d=><option key={d.name}>{d.name}</option>)}</select></label><label>Study level<select name="studyLevel"><option>Bachelors</option><option>Masters</option><option>Doctoral</option></select></label><button type="submit">Get guidance <ArrowRight size={17}/></button></form>{toolResult&&<div className={styles.toolResult}><Check/><p>{toolResult}</p></div>}</div>
    </section>

    <section className={styles.universitySection} id="universities">
      <SectionIntro label="University finder" title="Compare programs, not just names" text={`${filtered.length} programs match your current filters.`}/>
      <div className={styles.filters}><label><Search/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Course or university"/></label><select value={country} onChange={e=>setCountry(e.target.value)}><option>All countries</option>{destinations.slice(0,5).map(d=><option key={d.name}>{d.name}</option>)}</select><select value={level} onChange={e=>setLevel(e.target.value)}><option>All levels</option><option>Bachelors</option><option>Masters</option></select><select value={budget} onChange={e=>setBudget(e.target.value)}><option>Any budget</option><option>Under Rs 15L</option><option>Rs 15L - 25L</option></select></div>
      <div className={styles.universityList}>{filtered.map(u=><article key={u.name} className={styles.university}><img src={u.image} alt={`${u.name} campus`}/><div className={styles.uniMain}><div><span>{u.country} / {u.level}</span><h3>{u.name}</h3><p><MapPin size={14}/>{u.city}</p></div><strong>{u.course}</strong><small>{u.note}</small></div><div className={styles.uniFacts}><div><span>Estimated tuition</span><strong>Rs {u.fee}L/year</strong></div><div><span>Next intake</span><strong>{u.intake}</strong></div></div><div className={styles.uniActions}><button className={shortlist.includes(u.name)?styles.selected:""} onClick={()=>toggle(shortlist,u.name,setShortlist)}><Heart size={17} fill={shortlist.includes(u.name)?"currentColor":"none"}/> Shortlist</button><button className={compare.includes(u.name)?styles.selected:""} onClick={()=>toggle(compare,u.name,setCompare,3)}>Compare</button><a href={whatsappUrl("Lucknow / Bangalore",`I need guidance for ${u.name} - ${u.course}.`,"Study abroad university listing")} target="_blank">Enquire <ArrowRight size={16}/></a></div></article>)}</div>
      {!filtered.length&&<div className={styles.empty}><Search/><h3>No exact matches yet</h3><p>Broaden the country or budget filter, or ask a counsellor to find alternatives.</p></div>}
      {compare.length>0&&<div className={styles.compareBar}><span><strong>{compare.length}/3 selected</strong><small>{compare.join(" / ")}</small></span><button onClick={()=>alert(`Comparison ready for ${compare.join(", ")}`)}>Compare now <ArrowRight size={16}/></button></div>}
    </section>

    <section className={styles.domainBand}><div><span>Popular study areas</span><h2>Find a course for the career you want</h2></div><div>{["Business & MBA","Computer Science","Engineering","Data & AI","Healthcare","Design & Media","Finance","Hospitality"].map(x=><button key={x} onClick={()=>{setQuery(x.split(" ")[0]);document.getElementById("universities")?.scrollIntoView()}}>{x}<ArrowRight size={15}/></button>)}</div></section>

    <section className={styles.journey} id="journey"><SectionIntro label="Application journey" title="Know what happens next" text="A counsellor can help you validate each stage and escalate questions that need official confirmation."/><ol>{["Create your profile","Shortlist programs","Check eligibility","Prepare documents","Submit applications","Track offers and visa"].map((step,i)=><li key={step}><b>{String(i+1).padStart(2,"0")}</b><strong>{step}</strong><span>{["Add education, budget and preferences.","Compare fees, course fit and intakes.","Review academic and exam requirements.","Organise SOP, LOR and financial proofs.","Apply only after reviewing final details.","Follow official timelines and conditions."][i]}</span></li>)}</ol></section>

    <section className={styles.mediaSection}><div><span>For verified institutions</span><h2>Add campus photos and videos without technical work</h2><p>Select files from your phone or computer. They appear in a preview first and remain marked for review before publication. Production storage and admin moderation can be connected in the next backend phase.</p><ul><li><Check/> JPG, PNG, WebP and MP4</li><li><Check/> Up to six files per preview</li><li><Check/> Human approval before public listing</li></ul></div><div className={styles.uploader}><label><UploadCloud/><strong>Upload college media</strong><span>Choose photos or short campus videos</span><input type="file" accept="image/*,video/mp4" multiple onChange={uploadMedia}/></label>{media.length>0&&<div className={styles.mediaGrid}>{media.map(file=><figure key={file.name}>{file.type.startsWith("video")?<video src={file.url} controls/>:<img src={file.url} alt={file.name}/>}<figcaption>{file.type.startsWith("video")?<Video/>:<ImagePlus/>}<span><strong>{file.name}</strong><small>Pending review</small></span></figcaption></figure>)}</div>}</div></section>

    <section className={styles.finalCta}><div><GraduationCap/><span><h2>Not sure where to begin?</h2><p>Share your profile with a counsellor and get a practical next-step plan.</p></span></div><a href={whatsappUrl("Lucknow / Bangalore","I need help planning my study abroad journey.","Study abroad final CTA")} target="_blank">Start on WhatsApp <MessageCircle size={18}/></a></section>
    <footer className={styles.footer}><Link href="/"><img src="/logo.png" alt="Admission Saarthi"/></Link><p>Study abroad guidance with transparent information, responsible AI and human support.</p><a href="mailto:director@admissionsaarthi.com">director@admissionsaarthi.com</a></footer>
  </main>;
}

function SectionIntro({label,title,text}:{label:string;title:string;text:string}){return <div className={styles.sectionIntro}><div><span>{label}</span><h2>{title}</h2></div><p>{text}</p></div>}
