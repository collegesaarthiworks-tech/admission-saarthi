"use client";

import { useMemo, useState } from "react";
import { ArrowRight, BarChart3, BookOpen, Bot, BriefcaseBusiness, Building2, CalendarDays, Check, ChevronDown, CircleUserRound, GraduationCap, Heart, MapPin, Menu, MessageCircle, Search, Send, ShieldCheck, Sparkles, Star, Users, X } from "lucide-react";
import { institutions, events, jobs } from "./data";
import { counsellors, whatsappUrl } from "@/lib/whatsapp";

const categories = [
  ["College & Universities", "1,200+ options", Building2], ["Schools", "500+ schools", BookOpen], ["Coaching", "JEE, NEET, CAT & more", GraduationCap], ["EdTech", "200+ learning platforms", Sparkles], ["Study Abroad", "6 popular destinations", MapPin],
] as const;

export function HomePage() {
  const [menu, setMenu] = useState(false);
  const [tab, setTab] = useState("Colleges");
  const [query, setQuery] = useState("");
  const [searched, setSearched] = useState(false);
  const [shortlisted, setShortlisted] = useState<string[]>([]);
  const [chatOpen, setChatOpen] = useState(false);
  const [chat, setChat] = useState("");
  const [messages, setMessages] = useState(["Hi! I’m AI Saarthi. Tell me your course, budget and preferred location."]);
  const [region, setRegion] = useState<keyof typeof counsellors>("Lucknow / Bangalore");
  const filtered = useMemo(() => institutions.filter(x => `${x.name} ${x.place} ${x.course}`.toLowerCase().includes(query.toLowerCase())), [query]);

  function sendChat() { if (!chat.trim()) return; setMessages(m => [...m, chat, "Based on your preferences, I can shortlist suitable programs. Recommendations are guidance only and never an admission guarantee."]); setChat(""); }

  return <main>
    <header className="siteHeader">
      <a className="brand" href="#top" aria-label="Admission Saarthi home"><img src="/logo.png" alt="Admission Saarthi" style={{ transform: "translateY(-56px) scale(0.9)" }} /></a>
      <nav className={menu ? "nav open" : "nav"}>
        <a href="/directory">Explore <ChevronDown size={14}/></a><a href="/study-abroad">Study Abroad</a><a href="#events">Events</a><a href="#career">Career</a><a href="#growth">For Institutions</a>
      </nav>
      <button className="iconButton mobileMenu" onClick={() => setMenu(!menu)} aria-label="Toggle menu">{menu ? <X/> : <Menu/>}</button>
      <a className="signIn" href="/admin/onboarding"><CircleUserRound size={17}/> Partner panel</a>
    </header>

    <section className="hero" id="top">
      <div className="heroCopy">
        <h1>AI-Powered Education Growth & Admission Ecosystem</h1>
        <p>Discover the right education path, get expert counselling, explore careers and help institutions grow with one trusted platform.</p>
        <div className="heroActions"><a className="button primary" href="#discover">Find Education Options <ArrowRight size={18}/></a><a className="button secondary" href="#growth">Grow Your Admissions <BarChart3 size={18}/></a></div>
        <div className="searchPanel" id="discover">
          <div className="tabs">{["Colleges","Courses","Schools","Coaching","EdTech"].map(x => <button key={x} className={tab===x?"active":""} onClick={()=>setTab(x)}>{x}</button>)}</div>
          <label className="searchBox"><Search size={19}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder={`Search ${tab.toLowerCase()}, locations or programs`} /></label>
          <div className="filters"><button><MapPin size={16}/> Location <ChevronDown size={14}/></button><button>₹ Budget <ChevronDown size={14}/></button><button>Mode <ChevronDown size={14}/></button><button>India / Abroad <ChevronDown size={14}/></button><button className="searchCta" onClick={()=>window.location.href=`/directory?type=${encodeURIComponent(tab.replace("s",""))}&q=${encodeURIComponent(query)}`}>Search</button></div>
          <p className="trustNote"><ShieldCheck size={16}/> Guidance backed by verified information. Admission is never guaranteed.</p>
        </div>
      </div>
      <div className="productPreview">
        <div className="previewTop"><div><span>Student workspace</span><h3>Good evening, Riya</h3></div><button className="iconButton"><CircleUserRound/></button></div>
        <div className="previewTitle"><div><h4>Recommended for you</h4><p>{searched ? `${filtered.length} matches for “${query || tab}”` : "Based on your preferences"}</p></div><span>AI ranked</span></div>
        <div className="resultList">{filtered.slice(0,3).map((x,i)=><article className="result" key={x.name}><div className="institutionMark">{x.name.slice(0,1)}</div><div><h5>{x.name}</h5><p><MapPin size={12}/>{x.place} · {x.course}</p><small>{x.fee}</small></div><div className="match"><button onClick={()=>setShortlisted(s=>s.includes(x.name)?s.filter(n=>n!==x.name):[...s,x.name])} aria-label="Shortlist"><Heart size={17} fill={shortlisted.includes(x.name)?"currentColor":"none"}/></button><span>{94-i*2}% match</span></div></article>)}</div>
        <div className="miniAi"><div className="aiAvatar"><Bot size={21}/></div><div><strong>AI Saarthi</strong><p>Ask about eligibility, fees or careers.</p></div><button onClick={()=>setChatOpen(true)}>Ask AI <ArrowRight size={15}/></button></div>
      </div>
    </section>

    <section className="metrics"><div><strong>4+</strong><span>Years Experience</span></div><div><strong>40+</strong><span>Institutions Served</span></div><div><strong>Multiple</strong><span>Education Domains</span></div><div><strong>AI</strong><span>Enabled Solutions</span></div></section>

    <section className="section categories"><div className="sectionHead"><div><p>Explore education</p><h2>One platform, every learning path</h2></div><a href="#discover">View all categories <ArrowRight size={17}/></a></div><div className="categoryRail">{categories.map(([title,meta,Icon])=><button key={title} onClick={()=>{if(title === "Study Abroad"){window.location.href="/study-abroad";return;}setTab(title.split(" ")[0]); document.getElementById("discover")?.scrollIntoView()}}><Icon/><strong>{title}</strong><span>{meta}</span><ArrowRight className="categoryArrow" size={17}/></button>)}</div></section>

    <section className="aiSection"><div><h2>Meet AI Saarthi</h2><p>Your 24×7 education companion for personalised discovery, eligibility guidance, application support and career direction.</p><ul>{["Personalised college and course recommendations","Eligibility and documentation guidance","Scholarship and financial-aid assistance","Human counsellor escalation when needed"].map(x=><li key={x}><Check size={17}/>{x}</li>)}</ul><button className="button primary" onClick={()=>setChatOpen(true)}>Chat with AI Saarthi <ArrowRight size={18}/></button></div><div className="promptList"><span>Try asking</span>{["Which BBA colleges fit a ₹10 lakh budget?","What are my career options after B.Com?","Suggest scholarships for engineering students","How do I apply to universities in Canada?"].map(q=><button key={q} onClick={()=>{setChat(q);setChatOpen(true)}}><MessageCircle size={16}/>{q}<ArrowRight size={15}/></button>)}</div></section>

    <section className="section split" id="events"><div><div className="sectionHead"><h2>Upcoming events</h2><a href="#">View all <ArrowRight size={16}/></a></div><div className="list">{events.map(e=><article key={e.title}><time><b>{e.day}</b>{e.month}</time><div><strong>{e.title}</strong><span>{e.meta}</span></div><button onClick={()=>alert(`Registration started for ${e.title}`)}>Register</button></article>)}</div></div><div id="career"><div className="sectionHead"><h2>Career opportunities</h2><a href="#">Explore career hub <ArrowRight size={16}/></a></div><div className="list jobs">{jobs.map(j=><article key={j.title}><div className="jobIcon"><BriefcaseBusiness/></div><div><strong>{j.title}</strong><span>{j.company} · {j.meta}</span></div><button onClick={()=>alert(`Application started for ${j.title}`)}>Apply</button></article>)}</div></div></section>

    <section className="growth" id="growth"><div className="growthIcon"><BarChart3/></div><div><h2>Not Meeting Your Admission Goals?</h2><p>One empty seat means lost revenue. Build visibility, improve lead quality and measure conversions with an AI-enabled growth partner.</p></div><a className="button primary" href={whatsappUrl(region,"I need admission growth support.","Institution growth section")} target="_blank">Book Free 30-Minute Strategy Consultation <ArrowRight size={18}/></a></section>

    <section className="section proof"><div className="sectionHead"><div><p>Selected work</p><h2>Growth stories, grounded in delivery</h2></div></div><div className="proofGrid"><article className="proofMain"><span>EDTECH GROWTH</span><h3>2,500 leads generated, 300 converted</h3><p>For CIY, Thinklance and Corizo, Admission Saarthi expanded brand visibility and reached previously untapped audiences.</p><a href="/directory#case-studies">Read case studies <ArrowRight size={16}/></a></article><article><span>DEHRADUN</span><h3>ITM & SIMS</h3><p>Lead generation and admissions-focused outreach highlighting academic and infrastructure strengths.</p></article><article><span>LUCKNOW</span><h3>BBS Degree College</h3><p>Brand positioning and local lead generation through targeted digital outreach.</p></article></div><p style={{fontSize:10,color:"#6a7774",marginTop:12}}>* Some portfolio work was delivered with support from our associate partner agency.</p></section>

    <footer><div><img src="/logo.png" alt="Admission Saarthi"/><p>Education discovery, counselling, events, careers and institution growth in one trusted ecosystem.</p></div><div><strong>Explore</strong><a href="#discover">Colleges & courses</a><a href="#events">Events</a><a href="#career">Career</a></div><div><strong>For institutions</strong><a href="#growth">Growth solutions</a><a href="mailto:director@admissionsaarthi.com">director@admissionsaarthi.com</a></div><div><strong>Talk to a counsellor</strong><select value={region} onChange={e=>setRegion(e.target.value as keyof typeof counsellors)}>{Object.keys(counsellors).map(r=><option key={r}>{r}</option>)}</select><a href={whatsappUrl(region,"I need education guidance.","Footer")} target="_blank">WhatsApp {counsellors[region].name}</a></div></footer>

    <a className="whatsapp" href={whatsappUrl(region,"I need education guidance.","Floating button")} target="_blank" aria-label="Chat on WhatsApp"><MessageCircle/></a>
    {chatOpen && <aside className="chat"><header><div><Bot/><span><strong>AI Saarthi</strong><small>Guidance assistant</small></span></div><button className="iconButton" onClick={()=>setChatOpen(false)}><X/></button></header><div className="messages">{messages.map((m,i)=><p key={i} className={i%3===1?"userMessage":""}>{m}</p>)}</div><div className="chatInput"><input value={chat} onChange={e=>setChat(e.target.value)} onKeyDown={e=>e.key==="Enter"&&sendChat()} placeholder="Ask about education or careers"/><button onClick={sendChat}><Send size={18}/></button></div></aside>}
  </main>;
}
