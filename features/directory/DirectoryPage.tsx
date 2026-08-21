"use client";

import { ArrowRight, Building2, GraduationCap, MapPin, Search, ShieldCheck, Star } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import styles from "./directory.module.css";

type Provider = { id:string; type:string; name:string; city:string; state:string; country:string; accreditation:string; mode:string; programs:string; feeMin:string; feeMax:string; description:string; facilities:string; mediaNames:string[] };
type CaseStudy = { id:string; clientName:string; clientType:string; title:string; challenge:string; solution:string; outcome:string; metrics:string[]; image:string; associatePartner:boolean };
const types = ["All", "College", "University", "Course", "Medical", "School", "Coaching", "EdTech", "School of AI"];

export default function DirectoryPage() {
  const [providers,setProviders]=useState<Provider[]>([]); const [cases,setCases]=useState<CaseStudy[]>([]); const [type,setType]=useState("All"); const [query,setQuery]=useState(""); const [loading,setLoading]=useState(true);
  useEffect(()=>{fetch("/api/catalog",{cache:"no-store"}).then(r=>r.json()).then(data=>{setProviders(data.providers||[]);setCases(data.caseStudies||[])}).finally(()=>setLoading(false))},[]);
  const filtered=useMemo(()=>providers.filter(p=>(type==="All"||p.type===type)&&`${p.name} ${p.city} ${p.country} ${p.programs}`.toLowerCase().includes(query.toLowerCase())),[providers,type,query]);
  return <main className={styles.page}>
    <header><a href="/"><img src="/logo.png" alt="Admission Saarthi"/></a><nav><a href="/">Home</a><a href="#providers">Education options</a><a href="#case-studies">Case studies</a><a href="/admin/onboarding">Partner panel</a></nav></header>
    <section className={styles.intro}><p>EDUCATION DISCOVERY</p><h1>Find the right education provider</h1><span>Compare published options using factual information supplied by institutions and reviewed by Admission Saarthi.</span><div className={styles.search}><Search/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search by name, location or program"/></div><div className={styles.types}>{types.map(item=><button key={item} className={type===item?styles.active:""} onClick={()=>setType(item)}>{item}</button>)}</div><small><ShieldCheck/> Guidance only. Admission is never guaranteed.</small></section>
    <section className={styles.content} id="providers"><div className={styles.sectionHead}><div><p>PUBLIC DIRECTORY</p><h2>{type === "All" ? "All education providers" : `${type} listings`}</h2></div><span>{filtered.length} results</span></div>
      {loading?<div className={styles.empty}>Loading current listings...</div>:filtered.length?<div className={styles.grid}>{filtered.map(p=><article key={p.id}><div className={styles.cover}><Building2/><span>{p.type}</span></div><div className={styles.cardBody}><span className={styles.badge}>{p.type}</span><h3>{p.name}</h3><p><MapPin/>{[p.city,p.state,p.country].filter(Boolean).join(", ")}</p><div className={styles.tags}><span>{p.mode}</span>{p.accreditation&&<span>{p.accreditation}</span>}</div><p className={styles.description}>{p.description}</p><strong>{p.programs.split("\n").filter(Boolean).slice(0,3).join(" · ")}</strong><a href={`/directory/${p.id}`} style={{marginTop:16,width:"100%",height:40,background:"#f15a2b",color:"white",fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center",gap:7,textDecoration:"none"}}>View details <ArrowRight/></a></div></article>)}</div>:<div className={styles.empty}><GraduationCap/><h3>No published listings yet</h3><p>Approved provider profiles will appear here automatically.</p></div>}
    </section>
    <section className={styles.caseBand} id="case-studies"><div className={styles.content}><div className={styles.sectionHead}><div><p>SELECTED CLIENT WORK</p><h2>Case studies across education</h2></div></div><div className={styles.caseGrid}>{cases.map(item=><article key={item.id}><div className={styles.caseImage}><img src={item.image} alt={`${item.clientName} portfolio material`}/></div><div><span>{item.clientType}</span><h3>{item.clientName}</h3><strong>{item.title}</strong><p>{item.outcome}</p>{item.metrics.length>0&&<div className={styles.metrics}>{item.metrics.map(metric=><b key={metric}>{metric}</b>)}</div>}</div></article>)}</div><p className={styles.disclosure}>* Some portfolio work was delivered with support from our associate partner agency.</p></div></section>
    <footer><img src="/logo.png" alt="Admission Saarthi"/><p>Education discovery, admissions guidance and institution growth.</p><a href="mailto:director@admissionsaarthi.com">director@admissionsaarthi.com</a></footer>
  </main>
}
