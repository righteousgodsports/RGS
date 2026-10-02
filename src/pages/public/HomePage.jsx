import { useState, useEffect, useRef } from 'react';
import { settingsService, bikesService, athletesService, jerseysService, membersService } from '../../services/firebase';

/* ─── Static imports for the local images ─── */
import logoImg from '../../assets/logo.png';
import bike1Img from '../../assets/bike1.jpg';
import bike2Img from '../../assets/bike2.jpg';
import aboutImg from '../../assets/aboutimg.jpg';
import athlete1 from '../../assets/MiGyJIKL.jpg';
import athlete2 from '../../assets/uK6lj4Ns.jpg';
import athlete3 from '../../assets/W10wzwm5.jpg';
import jersey1 from '../../assets/jersey1.jpg';
import jersey2 from '../../assets/jersey2.jpg';

import { defaultHero, defaultBikes, defaultAthletes, defaultJerseys, defaultMembers } from '../../data/defaultData';

export default function HomePage() {
  const [hero, setHero] = useState(defaultHero);
  const [bikes, setBikes] = useState(defaultBikes);
  const [athletes, setAthletes] = useState(defaultAthletes);
  const [jerseys, setJerseys] = useState([{ id: '1', imageUrl: jersey1 }, { id: '2', imageUrl: jersey2 }]);
  const [members, setMembers] = useState(defaultMembers.map((n, i) => ({ id: String(i), name: n })));
  const [theme, setTheme] = useState(() => localStorage.getItem('rgs-theme') || 'dark');

  /* ─── Firebase data loading ─── */
  useEffect(() => {
    (async () => {
      try {
        const [heroData, bikesData, athletesData, jerseysData, membersData] = await Promise.all([
          settingsService.get('hero'),
          bikesService.getAll('order', 'asc'),
          athletesService.getAll('name', 'asc'),
          jerseysService.getAll('name', 'asc'),
          membersService.getAll('name', 'asc'),
        ]);
        if (heroData) {
          setHero(prev => {
            const merged = { ...prev };
            for (const key in heroData) {
              if (heroData[key] && heroData[key].trim() !== '') {
                merged[key] = heroData[key];
              }
            }
            return merged;
          });
        }
        if (bikesData?.length) setBikes(bikesData);
        if (athletesData?.length) setAthletes(athletesData);
        if (jerseysData?.length) setJerseys(jerseysData);
        if (membersData?.length) setMembers(membersData);
      } catch (err) {
        console.log('Using static content, Firebase unavailable:', err.message);
      }
    })();
  }, []);

  /* ─── Theme ─── */
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('rgs-theme', theme);
  }, [theme]);

  /* ─── Scroll reveal ─── */
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); } }),
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, [bikes, athletes]);

  /* ─── Counter animation ─── */
  const statsRef = useRef(null);
  useEffect(() => {
    const el = statsRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) observer.disconnect(); });
    }, { threshold: 0.5 });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const toggleTheme = () => setTheme(t => t === 'dark' ? 'light' : 'dark');

  return (
    <div data-theme={theme}>
      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-[1000] backdrop-blur-[20px] bg-[var(--nav-bg)] border-b border-[var(--border)] flex items-center justify-between px-10 h-16 transition-[background] duration-[0.4s]">
        <a href="#" className="font-['Bebas_Neue'] text-2xl tracking-[0.12em] text-[var(--text)] no-underline flex items-center gap-2.5">
          <img src={logoImg} alt="RGS Logo" className="w-5 h-5 object-contain" />
          RIGHTEOUS<span className="text-[var(--accent)]">&nbsp;GOD</span>&nbsp;SPORTS
        </a>
        <ul className="flex gap-9 list-none max-md:hidden">
          {['Bikes', 'About', 'Athletes', 'Contact'].map((label, i) => {
            const hrefs = ['#bikes', '#technology', '#athletes', '#contact'];
            return (
              <li key={label}>
                <a href={hrefs[i]} className="font-['Barlow_Condensed'] text-xs font-bold tracking-[0.18em] uppercase text-[var(--text-muted)] no-underline hover:text-[var(--text)] transition-colors relative after:content-[''] after:absolute after:bottom-[-3px] after:left-0 after:right-0 after:h-px after:bg-[var(--accent)] after:scale-x-0 after:origin-left after:transition-transform hover:after:scale-x-100">
                  {label}
                </a>
              </li>
            );
          })}
        </ul>
        <div className="flex items-center gap-5">
          <div onClick={toggleTheme} className="w-12 h-[26px] bg-[var(--surface)] border border-[var(--border)] rounded-[13px] cursor-pointer relative transition-colors before:content-[''] before:w-[18px] before:h-[18px] before:bg-[var(--accent)] before:rounded-full before:absolute before:top-[3px] before:left-1 before:transition-transform data-[light=true]:before:translate-x-[22px]" data-light={theme === 'light'} />
        </div>
      </nav>

      {/* HERO */}
      <section className="min-h-screen grid grid-cols-2 max-md:grid-cols-1 relative overflow-hidden pt-16">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")" }} />
        <div className="flex flex-col justify-center px-20 py-20 max-md:px-8 max-md:py-16 relative z-[2]">
          <div className="font-['Barlow_Condensed'] text-[0.65rem] font-bold tracking-[0.25em] uppercase text-[var(--accent)] mb-5 flex items-center gap-3 before:content-[''] before:w-[30px] before:h-px before:bg-[var(--accent)] animate-[heroIn_1s_ease_both]">
            {hero.tag}
          </div>
          <h1 className="font-['Bebas_Neue'] text-[clamp(5rem,9vw,10rem)] leading-[0.9] tracking-[0.02em] text-[var(--text)] mb-8 animate-[heroIn_1s_ease_both]">
            {hero.title1}<br />
            <em className="not-italic text-[var(--accent)] block" style={{ textShadow: '0 0 60px rgba(212,245,14,0.2)' }}>{hero.title2}</em>
            <span className="text-transparent" style={{ WebkitTextStroke: '1px var(--text)' }}>{hero.title3}</span>
          </h1>
          <p className="text-base font-light leading-[1.8] text-[var(--text-muted)] max-w-[420px] mb-12 animate-[heroIn_1s_0.2s_ease_both]">{hero.description}</p>
          <div className="flex gap-4 items-center animate-[heroIn_1s_0.35s_ease_both]">
            <a href="#bikes" className="font-['Barlow_Condensed'] text-xs font-bold tracking-[0.18em] uppercase bg-[var(--accent)] text-[#0a0a0a] px-10 py-4 no-underline inline-block hover:bg-white hover:-translate-y-0.5 transition-all" style={{ clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%)' }}>{hero.cta1}</a>
            <a href="#technology" className="font-['Barlow_Condensed'] text-xs font-bold tracking-[0.18em] uppercase bg-transparent border border-[var(--border)] text-[var(--text)] px-10 py-4 no-underline inline-block hover:border-[var(--text)] transition-all">{hero.cta2}</a>
          </div>
        </div>
        <div className="relative overflow-hidden bg-[var(--bg2)] max-md:hidden">
          <div className="w-full h-full relative overflow-hidden">
            <img src={hero.imageUrl || logoImg} alt="Hero" className="w-full h-full object-contain" />
            <div className="absolute right-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[var(--accent)] to-transparent opacity-40" />
          </div>
        </div>
        <div ref={statsRef} className="absolute bottom-10 left-20 max-md:left-8 flex gap-[50px] animate-[heroIn_1s_0.5s_ease_both]">
          <div>
            <div className="font-['Bebas_Neue'] text-[2.5rem] text-[var(--accent)] leading-none">{hero.stat1}</div>
            <div className="font-['Barlow_Condensed'] text-[0.6rem] font-bold tracking-[0.2em] uppercase text-[var(--text-muted)] mt-1">{hero.stat1Label}</div>
          </div>
          <div>
            <div className="font-['Bebas_Neue'] text-[2.5rem] text-[var(--accent)] leading-none">{hero.stat2}</div>
            <div className="font-['Barlow_Condensed'] text-[0.6rem] font-bold tracking-[0.2em] uppercase text-[var(--text-muted)] mt-1">{hero.stat2Label}</div>
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <div className="border-t border-b border-[var(--border)] overflow-hidden py-[18px] bg-[var(--bg2)]">
        <div className="flex whitespace-nowrap animate-[marquee_25s_linear_infinite]">
          {[...members, ...members].map((m, i) => (
            <span key={i} className="font-['Bebas_Neue'] text-base tracking-[0.2em] px-10 text-[var(--text-muted)] flex items-center gap-10">
              {m.name}<span className="text-[var(--accent)]">✦</span>
            </span>
          ))}
        </div>
      </div>

      {/* BIKES */}
      <section className="py-[120px] px-20 max-md:py-20 max-md:px-8 bg-[var(--bg)]" id="bikes">
        <div className="flex items-end justify-between mb-[60px] reveal">
          <div>
            <div className="font-['Barlow_Condensed'] text-[0.65rem] font-bold tracking-[0.25em] uppercase text-[var(--accent)] mb-4 flex items-center gap-3 before:content-[''] before:w-[30px] before:h-px before:bg-[var(--accent)]">2025 Lineup</div>
            <h2 className="font-['Bebas_Neue'] text-[clamp(2.5rem,5vw,5rem)] leading-[0.95] tracking-[0.02em] text-[var(--text)]">TOP BIKES</h2>
          </div>
        </div>
        <div className="grid grid-cols-[2fr_1fr_1fr] max-md:grid-cols-1 gap-0.5">
          {bikes.map((bike, i) => (
            <div key={bike.id} className={`bg-[var(--bg2)] relative overflow-hidden reveal ${i === 0 ? 'row-span-2 max-md:row-span-1' : `reveal-delay-${Math.min(i, 3)}`} group`}>
              {bike.imageUrl && <img src={bike.imageUrl} alt={bike.name} className="absolute inset-0 w-full h-full object-cover bg-[var(--bg3)] group-hover:scale-[1.03] transition-transform duration-600" />}
              <div className="absolute top-6 right-6 font-['Bebas_Neue'] text-[5rem] leading-none text-[var(--border)] group-hover:text-[var(--accent)] group-hover:opacity-30 transition-colors">{String(i + 1).padStart(2, '0')}</div>
              <div className={`p-10 h-full flex flex-col justify-end ${i === 0 ? 'min-h-[640px] max-md:min-h-[320px]' : 'min-h-[320px]'} relative`}>
                <div className="relative z-[2]">
                  <div className="font-['Barlow_Condensed'] text-[0.6rem] font-bold tracking-[0.2em] uppercase text-[var(--accent)] mb-1.5">{bike.category}</div>
                  <div className={`font-['Bebas_Neue'] ${i === 0 ? 'text-5xl' : 'text-3xl'} tracking-[0.05em] text-[var(--text)] mb-1`}>{bike.name}</div>
                  <div className="font-['Barlow_Condensed'] text-sm font-bold text-[var(--text-muted)] tracking-[0.1em]">{bike.price}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ABOUT */}
      <section className="py-[120px] px-20 max-md:py-20 max-md:px-8 bg-[var(--bg2)]" id="technology">
        <div className="grid grid-cols-2 max-md:grid-cols-1 gap-20 items-center">
          <div className="reveal"><img src={aboutImg} alt="About RGS" className="w-full h-full object-contain" /></div>
          <div>
            <div className="font-['Barlow_Condensed'] text-[0.65rem] font-bold tracking-[0.25em] uppercase text-[var(--accent)] mb-4 reveal flex items-center gap-3 before:content-[''] before:w-[30px] before:h-px before:bg-[var(--accent)]">ABOUT US</div>
            <h2 className="font-['Bebas_Neue'] text-[clamp(2.5rem,5vw,5rem)] leading-[0.95] tracking-[0.02em] text-[var(--text)] mb-5 reveal">RIGHTEOUS<br />GOD SPORT</h2>
            <div className="flex flex-col">
              {[
                'Righteous God Sport was born from a simple belief: discipline, faith, and endurance can turn ordinary riders into extraordinary athletes. What started as a small group of friends riding through city streets and uphill roads soon grew into a unified cycling team driven by purpose and passion.',
                'Every ride became more than just training—it became a test of character. Through early morning climbs, long-distance endurance rides, and intense sprint sessions, the team built not only strength in their legs but also unity in their spirit.',
                'Today, Righteous God Sport stands as a symbol of perseverance and faith-driven excellence. They ride not just to win races, but to inspire others to keep moving forward—no matter how steep the road be.'
              ].map((text, i) => (
                <div key={i} className={`py-7 border-b border-[var(--border)] grid grid-cols-[60px_1fr] gap-5 items-start reveal ${i > 0 ? 'reveal-delay-3' : ''} hover:pl-2.5 transition-[padding]`}>
                  <div /><div className="text-sm font-light leading-[1.7] text-[var(--text-muted)]">{text}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ATHLETES */}
      <section className="py-[120px] px-20 max-md:py-20 max-md:px-8 bg-[var(--bg)]" id="athletes">
        <div className="reveal">
          <div className="font-['Barlow_Condensed'] text-[0.65rem] font-bold tracking-[0.25em] uppercase text-[var(--accent)] mb-4 flex items-center gap-3 before:content-[''] before:w-[30px] before:h-px before:bg-[var(--accent)]">Our Riders</div>
          <h2 className="font-['Bebas_Neue'] text-[clamp(2.5rem,5vw,5rem)] leading-[0.95] tracking-[0.02em] text-[var(--text)]">RIGHTEOUS<br />CHAMPIONS</h2>
        </div>
        <div className="grid grid-cols-3 max-md:grid-cols-2 gap-0.5 mt-[60px]">
          {athletes.map((a, i) => (
            <div key={a.id} className={`relative overflow-hidden aspect-[3/4] bg-[var(--bg2)] group reveal ${i > 0 ? `reveal-delay-${Math.min(i, 3)}` : ''}`}>
              {a.photoUrl && <div className="absolute inset-0 group-hover:scale-105 transition-transform duration-600"><img src={a.photoUrl} alt={a.name} className="w-full h-full object-cover" /></div>}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 to-transparent z-[1]" />
              <div className="absolute bottom-0 left-0 right-0 p-8 z-[2] translate-y-2.5 group-hover:translate-y-0 transition-transform">
                <div className="font-['Barlow_Condensed'] text-[0.6rem] font-bold tracking-[0.25em] uppercase text-[var(--accent)] mb-1">{a.role}</div>
                <div className="font-['Bebas_Neue'] text-3xl tracking-[0.05em] text-white">{a.name}</div>
                <div className="text-sm font-light text-white/60 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">{a.achievement}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* JERSEYS */}
      <section className="py-[120px] px-20 max-md:py-20 max-md:px-8 bg-[var(--bg)]" id="jerseys">
        <div className="reveal">
          <div className="font-['Barlow_Condensed'] text-[0.65rem] font-bold tracking-[0.25em] uppercase text-[var(--accent)] mb-4 flex items-center gap-3 before:content-[''] before:w-[30px] before:h-px before:bg-[var(--accent)]">Our Jerseys</div>
          <h2 className="font-['Bebas_Neue'] text-[clamp(2.5rem,5vw,5rem)] leading-[0.95] tracking-[0.02em] text-[var(--text)]">RIGHTEOUS<br />Jerseys</h2>
        </div>
        <div className="grid grid-cols-2 max-md:grid-cols-1 gap-4 mt-[60px]">
          {jerseys.map(j => (
            <div key={j.id}><img src={j.imageUrl} alt={j.name || 'Jersey'} className="w-full h-full object-cover rounded-lg" /></div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <div className="bg-[var(--accent)] py-[100px] px-20 max-md:px-8 flex max-md:flex-col items-center justify-between gap-10 relative overflow-hidden before:content-['RGS'] before:absolute before:right-20 before:top-1/2 before:-translate-y-1/2 before:font-['Bebas_Neue'] before:text-[20rem] before:leading-none before:text-black/[0.07] before:pointer-events-none max-md:before:hidden">
        <h2 className="font-['Bebas_Neue'] text-[clamp(3rem,6vw,7rem)] leading-[0.9] tracking-[0.02em] text-[#0a0a0a] max-w-[700px] reveal">BUILD YOUR DREAM TODAY</h2>
        <div className="shrink-0 relative z-[1] reveal">
          <a href="mailto:raphaelgamotea209@gmail.com" className="font-['Barlow_Condensed'] text-xs font-bold tracking-[0.18em] uppercase bg-[#0a0a0a] text-[var(--accent)] px-12 py-[18px] no-underline inline-block hover:bg-[#222] hover:-translate-y-0.5 transition-all" style={{ clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%)' }}>JOIN NOW</a>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="bg-[var(--bg2)] border-t border-[var(--border)] py-20 px-20 max-md:px-8" id="contact">
        <div className="grid grid-cols-[2fr_1fr_1fr_1fr] max-md:grid-cols-2 gap-[60px] mb-[60px]">
          <div>
            <a href="#" className="font-['Bebas_Neue'] text-[1.6rem] tracking-[0.12em] text-[var(--text)] no-underline inline-flex items-center gap-2.5 mb-5">
              <div className="w-8 h-8 border-2 border-[var(--accent)] rounded-full flex items-center justify-center text-[0.65rem] text-[var(--accent)] font-['Barlow_Condensed'] font-black">RGS</div>
              RIGHTEOUS<span className="text-[var(--accent)]">&nbsp;GOD</span>&nbsp;SPORTS
            </a>
            <p className="text-sm font-light leading-[1.8] text-[var(--text-muted)] max-w-[260px]">Righteous God Sports exists at the intersection of performance obsession and raw aesthetic power. Built for those who refuse limits.</p>
          </div>
          {[
            { title: 'Bikes', links: ['Road Racing', 'Mountain', 'Gravel', 'Track', 'E-Bike'] },
            { title: 'Company', links: ['About Us', 'Athletes', 'Careers', 'Press', 'Dealers'] },
            { title: 'Support', links: ['Bike Finder', 'Sizing Guide', 'Warranty', 'Service', 'Contact'] },
          ].map(col => (
            <div key={col.title}>
              <div className="font-['Barlow_Condensed'] text-[0.65rem] font-bold tracking-[0.25em] uppercase text-[var(--accent)] mb-5">{col.title}</div>
              <ul className="list-none flex flex-col gap-2.5">
                {col.links.map(link => <li key={link}><a href="#" className="text-sm font-light text-[var(--text-muted)] no-underline hover:text-[var(--text)] transition-colors">{link}</a></li>)}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-[var(--border)] pt-8 flex items-center justify-between">
          <div className="font-['Barlow_Condensed'] text-[0.65rem] font-bold tracking-[0.15em] uppercase text-[var(--text-muted)]">© 2025 Righteous God Sports. All Rights Reserved.</div>
        </div>
      </footer>
    </div>
  );
}
