import { createFileRoute } from "@tanstack/react-router";
import {
  ChevronDown, Copy, Download, FileText, Files, Mail, MapPin, Menu, Moon, Navigation,
  Phone, QrCode, Share2, Sun, UserPlus, Wallet, Contact as ContactIcon,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";

import { DocViewer } from "@/components/card/DocViewer";
import { FlagDE, FlagGB, SignLanguageIcon } from "@/components/card/icons";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import portrait from "@/assets/finn-portrait.jpg.asset.json";
import avatar from "@/assets/finn-avatar.jpg.asset.json";
import {
  BBZ_REPORTS, CERTS, CONTACT, DOCS, OTHER_PROOFS, SCHOOL_REPORTS, WALLET,
  address, ageOn, assetUrl, contactText, mapsQuery, vcardText, type Doc, type Lang,
} from "@/lib/card-data";
import { DICT, type Dict } from "@/lib/i18n";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Finn Böttcher – Auszubildender Kaufmann für Büromanagement" },
      { name: "description", content: "Digitale Bewerbungsvisitenkarte von Finn Böttcher aus Jevenstedt: Werdegang, Kenntnisse, Zeugnisse und Kontakt." },
      { property: "og:title", content: "Finn Böttcher – Digitale Visitenkarte" },
      { property: "og:description", content: "Auszubildender Kaufmann für Büromanagement aus Jevenstedt – Lebenslauf, Zertifikate, Zeugnisse und Kontakt." },
      { property: "og:type", content: "profile" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const NAV = [
  ["ueber", "nAbout"], ["werdegang", "nCareer"], ["kenntnisse", "nSkills"], ["sprachen", "nLang"],
  ["zeugnisse", "nReports"], ["kontakt", "nContact"], ["standort", "nLocation"],
] as const;

function Index() {
  const [lang, setLang] = useState<Lang>("de");
  const [dark, setDark] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [doc, setDoc] = useState<Doc | null>(null);
  const [mapOpen, setMapOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [walletOpen, setWalletOpen] = useState(false);
  const [legalOpen, setLegalOpen] = useState(false);
  const [qr, setQr] = useState<string | null>(null);
  const [qrOpen, setQrOpen] = useState(false);
  const [moreTl, setMoreTl] = useState(false);
  const [moreCerts, setMoreCerts] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [active, setActive] = useState("");
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const t: Dict = DICT[lang];
  const age = ageOn(CONTACT.birth, new Date());

  useEffect(() => {
    try {
      const l = localStorage.getItem("lang");
      if (l === "de" || l === "en") setLang(l);
    } catch { /* storage blocked */ }
    setDark(document.documentElement.classList.contains("dark"));
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
    try { localStorage.setItem("lang", lang); } catch { /* ignore */ }
  }, [lang]);

  useEffect(() => {
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-45% 0px -50% 0px" },
    );
    document.querySelectorAll("main section[id]").forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    try { localStorage.setItem("theme", next ? "dark" : "light"); } catch { /* ignore */ }
  };

  const showToast = useCallback((m: string) => {
    setToast(m);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2400);
  }, []);

  const copy = useCallback(async (s: string, msg = t.copied) => {
    try {
      await navigator.clipboard.writeText(s);
    } catch {
      const a = document.createElement("textarea");
      a.value = s;
      document.body.append(a);
      a.select();
      document.execCommand("copy");
      a.remove();
    }
    showToast(msg);
  }, [showToast, t.copied]);

  const pageUrl = () => location.href.split("#")[0] ?? location.href;
  const share = async () => {
    const data = { title: `${CONTACT.name} – ${t.role}`, text: contactText(), url: pageUrl() };
    if (navigator.share) {
      try { await navigator.share(data); } catch { /* cancelled */ }
    } else {
      void copy(pageUrl(), t.linkCopied);
    }
  };
  const copyContact = () => void copy(contactText());
  const saveVcard = () => {
    const url = URL.createObjectURL(new Blob([vcardText()], { type: "text/vcard;charset=utf-8" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "Finn-Boettcher.vcf";
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 30_000);
    showToast(t.saved);
  };
  const toggleQr = async () => {
    if (qrOpen) return setQrOpen(false);
    setQrOpen(true);
    if (!qr) {
      const QR = await import("qrcode");
      setQr(await QR.toDataURL(vcardText(), { width: 440, margin: 1, errorCorrectionLevel: "M" }));
    }
  };

  const navLinks = (onClick?: () => void) =>
    NAV.map(([id, key]) => (
      <a
        key={id}
        href={`#${id}`}
        onClick={onClick}
        aria-current={active === id ? "true" : undefined}
        className="rounded-full px-3 py-1.5 text-[.95rem] text-muted-foreground no-underline aria-[current=true]:bg-muted aria-[current=true]:font-semibold aria-[current=true]:text-foreground"
      >
        {t[key]}
      </a>
    ));

  return (
    <>
      <a href="#main" className="btn primary absolute -left-[999px] top-2 z-[100] focus:left-2">{t.skip}</a>

      {/* ---------- Header ---------- */}
      <header className="sticky top-0 z-20 px-3 pb-2.5 pt-[calc(10px+env(safe-area-inset-top,0px))]">
        <div className="glass mx-auto flex max-w-[1000px] items-center gap-2 rounded-full px-2.5 py-1.5">
          <a href="#top" className="mr-auto flex items-center gap-2.5 font-bold text-foreground no-underline" aria-label={`${CONTACT.name} – ${t.toTop}`}>
            <img className="avatar" src={avatar.url} alt="" width={40} height={40} />
            <span className="hidden min-[900px]:inline">{CONTACT.name}</span>
          </a>
          <nav className="hidden gap-0.5 min-[900px]:flex" aria-label={t.menu}>{navLinks()}</nav>
          <div className="relative">
            <button className="btn" aria-haspopup="menu" aria-expanded={langOpen} aria-label={t.chooseLang} onClick={() => setLangOpen((o) => !o)}>
              {lang === "de" ? <FlagDE /> : <FlagGB />}
              <b>{lang.toUpperCase()}</b>
              <ChevronDown className="!h-4 !w-4" aria-hidden="true" />
            </button>
            {langOpen && (
              <div className="glass absolute right-0 top-[52px] z-40 flex min-w-[150px] flex-col gap-0.5 bg-popover p-1.5" role="menu">
                {(["de", "en"] as const).map((l) => (
                  <button
                    key={l}
                    role="menuitemradio"
                    aria-checked={lang === l}
                    onClick={() => { setLang(l); setLangOpen(false); }}
                    className="btn justify-start border-0 bg-transparent aria-checked:bg-muted aria-checked:font-semibold"
                  >
                    {l === "de" ? <FlagDE /> : <FlagGB />} {l.toUpperCase()}
                  </button>
                ))}
              </div>
            )}
          </div>
          <button className="btn ic" onClick={toggleTheme} aria-label={t.theme}>{dark ? <Sun /> : <Moon />}</button>
          <button className="btn ic min-[900px]:!hidden" onClick={() => setMenuOpen((o) => !o)} aria-expanded={menuOpen} aria-controls="dd" aria-label={t.menu}>
            <Menu />
          </button>
        </div>
        {menuOpen && (
          <nav id="dd" className="glass absolute left-3 right-3 top-[calc(70px+env(safe-area-inset-top,0px))] z-40 ml-auto flex max-w-[420px] flex-col bg-popover p-2 [&>a]:px-4 [&>a]:py-3" aria-label={t.menu}>
            {navLinks(() => setMenuOpen(false))}
          </nav>
        )}
      </header>

      <main id="main">
        <div className="wrap">
          {/* ---------- Hero ---------- */}
          <section id="top" className="grid gap-6 !pt-4 min-[800px]:min-h-[68vh] min-[800px]:grid-cols-[1.2fr_.8fr] min-[800px]:items-center">
            <div>
              <span className="tag">{t.tag}</span>
              <p className="eyebrow mt-[22px]">{t.hi}</p>
              <h1 className="mb-1.5 text-[clamp(2.6rem,9vw,4.4rem)]">Finn<br /><em className="text-primary">Böttcher</em></h1>
              <p className="m-0 mb-1.5 text-[1.2rem] font-semibold">{t.role}</p>
              <p className="m-0 mb-[18px] max-w-[46ch] text-muted-foreground">{t.lead}</p>
              <div className="flex flex-wrap gap-2.5">
                <a className="btn primary" href="#kontakt">{t.cta1}</a>
                <button className="btn" onClick={() => setDoc(DOCS.lebenslauf)}><FileText aria-hidden="true" />{t.cta2}</button>
              </div>
              {/* Contact quick actions, centred under the info text */}
              <div className="mt-6 flex justify-center">
                <div className="glass inline-flex flex-wrap justify-center gap-2 rounded-full p-1.5">
                  <a className="btn ic" href={`tel:${CONTACT.tel}`} aria-label={t.call}><Phone /></a>
                  <a className="btn ic" href={`mailto:${CONTACT.mail}`} aria-label={t.mail}><Mail /></a>
                  <button className="btn ic" onClick={() => setMapOpen(true)} aria-label={t.addrMap}><MapPin /></button>
                  <button className="btn ic" onClick={share} aria-label={t.share}><Share2 /></button>
                  <button className="btn ic" onClick={saveVcard} aria-label={t.saveContact}><UserPlus /></button>
                </div>
              </div>
            </div>
            <div className="glass relative mx-auto mt-1.5 aspect-[4/5] w-full max-w-[420px] overflow-hidden rounded-[28px] p-1.5 min-[800px]:mr-0">
              <img src={portrait.url} alt={t.photoAlt} width={720} height={992} fetchPriority="high" className="block h-full w-full rounded-[22px] object-cover object-[50%_15%]" />
              <div className="glass absolute inset-x-4 bottom-4 rounded-[14px] bg-popover px-3.5 py-2 text-[.82rem] uppercase leading-snug tracking-[.06em]">
                Jevenstedt · Schleswig-Holstein
                <b className="block font-semibold text-muted-foreground">{t.since}</b>
              </div>
            </div>
          </section>

          {/* ---------- About ---------- */}
          <section id="ueber">
            <p className="eyebrow">{t.nAbout}</p>
            <h2>{t.aboutH}</h2>
            <div className="card mb-3 max-w-[720px]">
              <p className="m-0 text-[1.02rem] leading-relaxed">{t.aboutText(age)}</p>
            </div>
            <dl className="m-0 grid grid-cols-[repeat(auto-fit,minmax(170px,1fr))] gap-3">
              <Fact label={t.fTraining} value={t.fTrainingV} />
              <Fact label={t.fHome} value="Jevenstedt" />
              <Fact label={t.fAge} value={`${age} ${t.years}`} />
            </dl>
          </section>

          {/* ---------- Career ---------- */}
          <section id="werdegang">
            <SectionHead eyebrow={t.nCareer} title={t.careerH}>
              <DocButton label={t.cvDoc} onClick={() => setDoc(DOCS.lebenslauf)} wide text={t.cvDoc} />
            </SectionHead>
            <ol className="tl">
              <Station pill={t.pTraining} date="09/2023 – heute" title="Kaufmann für Büromanagement" sub="Diakonisches Werk Schleswig-Holstein · Rendsburg" />
              <Station pill={t.pVolunteer} date="01/2024 – 12/2025" title="Co-Trainer Kinderfußball" sub={t.volunteer} />
              <Station pill={t.pJob} date="04/2023 – 07/2023" title="Mitarbeiter Freizeitbereich" sub="Dschungelland · Weißenhäuser Strand" />
              <Station pill={t.pJob} date="06/2022 – 09/2022" title="Aushilfe (Minijob)" sub="Matthies Druckguss · Rendsburg" />
              {moreTl && (
                <>
                  <Station pill={t.pTraining} date="09/2020 – 05/2022" title="Fluggerätemechatroniker" sub="Bundeswehr · Husum" />
                  <Station pill={t.pIntern} date="01/2023 – 02/2023" title="Hörakustiker" sub="KIND · Bad Bramstedt" />
                  <Station pill={t.pSchool} date="05/2020" title={t.msa} sub="Georg-Wilhelm-Pfingsten-Schule (LFZHuK) · Schleswig"
                    doc={<DocButton label={`${t.openDoc}: ${DOCS.kl10.title[lang]}`} onClick={() => setDoc(DOCS.kl10)} />} />
                  <Station pill={t.pIntern} date="01/2018 – 02/2018" title={t.office} sub="Theodor-Schäfer-Berufsbildungswerk · Husum"
                    doc={<DocButton label={`${t.openDoc}: ${DOCS.praktikum.title[lang]}`} onClick={() => setDoc(DOCS.praktikum)} />} />
                  <Station pill={t.pSchool} date="09/2015 – 05/2020" title="Gemeinschaftsschule" sub="LFZHuK, Georg-Wilhelm-Pfingsten-Schule · Schleswig" />
                  <Station pill={t.pSchool} date="09/2012 – 07/2015" title="Gemeinschaftsschule" sub="Schule am Ochsenweg · Jevenstedt" />
                  <Station pill={t.pSchool} date="08/2009 – 07/2012" title="Grundschule" sub="Mastbrook · Rendsburg" />
                </>
              )}
            </ol>
            <p className="m-0 text-center">
              <button className="btn" aria-expanded={moreTl} onClick={() => setMoreTl((v) => !v)}>{moreTl ? t.less : t.more}</button>
            </p>
          </section>

          {/* ---------- Skills & certificates ---------- */}
          <section id="kenntnisse">
            <p className="eyebrow">{t.nSkills}</p>
            <h2>{t.skillsH}</h2>
            <div className="card">
              <ul className="chips">
                {["Zuverlässigkeit", "Teamfähigkeit", "Empathie", "Kreativität", "Büroorganisation", "Korrespondenz", "Zeitmanagement", "MS Office", "Excel 365", "Canva", "IT-Sicherheit", "KI-Kompetenz", "Erste Hilfe"].map((c) => <li key={c}>{c}</li>)}
              </ul>
            </div>
            <div className="mb-3 mt-8 flex flex-wrap items-center justify-between gap-3">
              <h3>{t.certsH}</h3>
              <a className="btn" href={assetUrl("zertifikate.pdf")} download="Finn-Boettcher-Zertifikate.pdf"><Download aria-hidden="true" />{t.allCerts}</a>
            </div>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-3">
              {(moreCerts ? CERTS : CERTS.slice(0, 4)).map((d) => (
                <DocCard key={d.id} doc={d} lang={lang} t={t} onOpen={() => setDoc(d)} />
              ))}
            </div>
            <p className="m-0 mt-3.5 text-center">
              <button className="btn" aria-expanded={moreCerts} onClick={() => setMoreCerts((v) => !v)}>{moreCerts ? t.less : t.more}</button>
            </p>
          </section>

          {/* ---------- Languages ---------- */}
          <section id="sprachen">
            <p className="eyebrow">{t.nLang}</p>
            <h2>{t.langH}</h2>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-3">
              <LangCard icon={<FlagDE />} name="Deutsch" sub={t.native} level="C2" width={100} />
              <LangCard icon={<FlagGB />} name={t.english} sub={t.goodBasics} level="B1" width={55} />
              <LangCard
                icon={<span className="grid h-10 w-10 place-items-center rounded-xl bg-muted text-primary"><SignLanguageIcon className="h-7 w-8" /></span>}
                name={t.dgs} sub={t.basics} level="A2" width={35} />
            </div>
            <p className="meta mt-3">{t.cefr}</p>
          </section>

          {/* ---------- Reports (separate) ---------- */}
          <section id="zeugnisse">
            <p className="eyebrow">{t.nReports}</p>
            <h2>{t.reportsH}</h2>
            <ReportGroup title={t.bbz} sub={t.bbzSub} docs={BBZ_REPORTS} lang={lang} t={t} onOpen={setDoc} />
            <ReportGroup title={t.school} sub={t.schoolSub} docs={SCHOOL_REPORTS} lang={lang} t={t} onOpen={setDoc} />
            <ReportGroup title={t.proofs} sub={t.proofsSub} docs={OTHER_PROOFS} lang={lang} t={t} onOpen={setDoc} />
          </section>

          {/* ---------- Contact ---------- */}
          <section id="kontakt">
            <p className="eyebrow">{t.nContact}</p>
            <h2>{t.contactH}</h2>
            <div className="card max-w-[620px]">
              <ContactRows t={t} copy={copy} />
              <div className="my-3 flex flex-wrap gap-2.5">
                <a className="btn primary" href={`mailto:${CONTACT.mail}`}><Mail aria-hidden="true" />{t.mail}</a>
                <a className="btn" href={`tel:${CONTACT.tel}`}><Phone aria-hidden="true" />{t.call}</a>
              </div>
              <div className="flex flex-col gap-1.5 [&>button]:w-full [&>button]:justify-start [&>button]:rounded-[14px]">
                <button className="btn" onClick={saveVcard}><UserPlus aria-hidden="true" />{t.vcf}</button>
                <button className="btn" onClick={copyContact}><Copy aria-hidden="true" />{t.copyContact}</button>
                <button className="btn" onClick={toggleQr} aria-expanded={qrOpen}><QrCode aria-hidden="true" />{qrOpen ? t.qrHide : t.qr}</button>
                {qrOpen && (
                  <div className="my-1 flex justify-center rounded-2xl bg-[var(--paper)] p-3.5">
                    {qr ? <img src={qr} alt="QR-Code vCard" width={220} height={220} /> : <span className="h-[220px]" />}
                  </div>
                )}
                <button className="btn" onClick={share}><Share2 aria-hidden="true" />{t.share}</button>
                <button className="btn" onClick={() => setWalletOpen(true)}><Wallet aria-hidden="true" />{t.wallet}</button>
              </div>
            </div>
          </section>

          {/* ---------- Location ---------- */}
          <section id="standort">
            <p className="eyebrow">{t.nLocation}</p>
            <h2>{t.locH}</h2>
            <div className="card flex max-w-[620px] flex-wrap items-center gap-4">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-muted text-primary"><MapPin /></span>
              <div className="mr-auto">
                <b>{CONTACT.street}</b><br />
                <span className="meta">{CONTACT.zip} {CONTACT.city}</span>
              </div>
              <button className="btn primary" onClick={() => setMapOpen(true)} aria-haspopup="dialog"><MapPin aria-hidden="true" />{t.mapOpen}</button>
            </div>
          </section>
        </div>
      </main>

      {/* ---------- Footer ---------- */}
      <footer className="p-4 text-center text-[.9rem] text-muted-foreground">
        <div className="glass mx-auto mb-2 flex max-w-[620px] items-center gap-3 px-4 py-3.5">
          <img className="avatar" src={avatar.url} alt="" width={40} height={40} />
          <div className="text-left">
            <b className="text-foreground">{CONTACT.name}</b>
            <small className="block text-[.7rem] uppercase tracking-[.14em]">{t.ft}</small>
          </div>
        </div>
        <div className="mt-2.5 flex flex-wrap justify-center gap-2">
          <button className="btn" onClick={() => setLegalOpen(true)}>{t.legal}</button>
          <a className="btn" href="#top">{t.top}</a>
        </div>
        <p>© 2026 {CONTACT.name}</p>
      </footer>

      {/* ---------- Bottom bar ---------- */}
      <nav className="dock" aria-label={t.quick}>
        <button onClick={() => setWalletOpen(true)}><Wallet aria-hidden="true" /><span>{t.walletShort}</span></button>
        <button onClick={() => setContactOpen(true)}><ContactIcon aria-hidden="true" /><span>{t.nContact}</span></button>
        <button onClick={copyContact} aria-label={t.copyContact}><Copy aria-hidden="true" /><span>{t.copyShort}</span></button>
        <button onClick={share}><Share2 aria-hidden="true" /><span>{t.share}</span></button>
        <button onClick={saveVcard} aria-label={t.vcf}><UserPlus aria-hidden="true" /><span>{t.vcardShort}</span></button>
      </nav>

      {toast && <div className="toast-pill" role="status">{toast}</div>}

      {/* ---------- Windows ---------- */}
      <DocViewer doc={doc} lang={lang} t={t} onClose={() => setDoc(null)} />

      <Dialog open={mapOpen} onOpenChange={setMapOpen}>
        <DialogContent className="glass flex w-[min(760px,96vw)] max-w-none flex-col gap-3 rounded-[var(--radius)] bg-popover p-4 sm:p-5">
          <div className="pr-8">
            <DialogTitle className="font-serif text-xl">{t.mapTitle}</DialogTitle>
            <DialogDescription className="meta mt-1">{address()}</DialogDescription>
          </div>
          {mapOpen && (
            <iframe
              title={t.mapTitle}
              loading="lazy"
              referrerPolicy="no-referrer"
              className="h-[min(60dvh,440px)] w-full rounded-2xl border-0"
              src={`https://maps.google.com/maps?q=${mapsQuery}&output=embed`}
            />
          )}
          <div className="flex flex-wrap gap-2">
            <a className="btn primary" href={`https://www.google.com/maps/dir/?api=1&destination=${mapsQuery}`} target="_blank" rel="noopener"><Navigation aria-hidden="true" />{t.route}</a>
            <a className="btn" href={`https://www.google.com/maps/search/?api=1&query=${mapsQuery}`} target="_blank" rel="noopener">Google Maps</a>
            <a className="btn" href={`https://maps.apple.com/?q=${mapsQuery}`} target="_blank" rel="noopener">Apple Karten</a>
            <button className="btn" onClick={() => copy(address())}><Copy aria-hidden="true" />{t.copyAddr}</button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={contactOpen} onOpenChange={setContactOpen}>
        <DialogContent className="glass w-[min(520px,94vw)] rounded-[var(--radius)] bg-popover p-5">
          <div className="pr-8">
            <DialogTitle className="font-serif text-xl">{CONTACT.name}</DialogTitle>
            <DialogDescription className="meta mt-1">{t.contactH}</DialogDescription>
          </div>
          <div>
            <ContactRows t={t} copy={copy} />
            <div className="mt-2.5 flex flex-wrap gap-2.5">
              <a className="btn primary" href={`mailto:${CONTACT.mail}`}>{t.mail}</a>
              <a className="btn" href={`tel:${CONTACT.tel}`}>{t.call}</a>
              <button className="btn" onClick={copyContact}><Copy aria-hidden="true" />{t.copyContact}</button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={walletOpen} onOpenChange={setWalletOpen}>
        <DialogContent className="glass w-[min(480px,94vw)] rounded-[var(--radius)] bg-popover p-5">
          <DialogTitle className="font-serif text-xl">{t.wallet}</DialogTitle>
          {WALLET.apple || WALLET.google ? (
            <div className="flex flex-col gap-2">
              {WALLET.apple && <a className="btn primary" href={WALLET.apple}>Apple Wallet</a>}
              {WALLET.google && <a className="btn primary" href={WALLET.google}>Google Wallet</a>}
            </div>
          ) : (
            <>
              <DialogDescription className="text-muted-foreground">{t.walletMsg}</DialogDescription>
              <button className="btn primary" onClick={saveVcard}><UserPlus aria-hidden="true" />{t.vcf}</button>
            </>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={legalOpen} onOpenChange={setLegalOpen}>
        <DialogContent className="glass w-[min(520px,94vw)] rounded-[var(--radius)] bg-popover p-5">
          <DialogTitle className="font-serif text-xl">{t.legal}</DialogTitle>
          <DialogDescription asChild>
            <div className="text-foreground">
              <p><strong>Impressum.</strong> {t.legalImp}</p>
              <p><strong>Datenschutz.</strong> {t.legalDs}</p>
            </div>
          </DialogDescription>
        </DialogContent>
      </Dialog>
    </>
  );
}

/* ---------- small building blocks ---------- */

function SectionHead({ eyebrow, title, children }: { eyebrow: string; title: string; children?: ReactNode }) {
  return (
    <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h2 className="!mb-0">{title}</h2>
      </div>
      {children}
    </div>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="card">
      <dt className="text-[.85rem] text-muted-foreground">{label}</dt>
      <dd className="m-0 font-semibold">{value}</dd>
    </div>
  );
}

function DocButton({ label, onClick, wide, text }: { label: string; onClick: () => void; wide?: boolean; text?: string }) {
  if (wide) {
    return (
      <button className="btn" onClick={onClick} aria-haspopup="dialog">
        <FileText className="text-primary" aria-hidden="true" />{text}
      </button>
    );
  }
  return (
    <button className="docbtn" onClick={onClick} aria-label={label} title={label} aria-haspopup="dialog">
      <FileText aria-hidden="true" />
    </button>
  );
}

function Station({ pill, date, title, sub, doc }: { pill: string; date: string; title: string; sub: string; doc?: ReactNode }) {
  return (
    <li className="card flex items-start gap-3 !px-4 !py-3.5">
      <div className="min-w-0 flex-1">
        <span className="pill">{pill}</span> <span className="meta">{date}</span>
        <h3>{title}</h3>
        <div className="sub">{sub}</div>
      </div>
      {doc}
    </li>
  );
}

function DocCard({ doc, lang, t, onOpen }: { doc: Doc; lang: Lang; t: Dict; onOpen: () => void }) {
  return (
    <div className="card flex items-start gap-3">
      <div className="min-w-0 flex-1">
        <h3 className="font-serif">{doc.title[lang]}</h3>
        <p className="m-0 mt-1 text-[.93rem] text-muted-foreground">{doc.meta[lang]}</p>
      </div>
      <DocButton label={`${t.openDoc}: ${doc.title[lang]}`} onClick={onOpen} />
    </div>
  );
}

function ReportGroup({ title, sub, docs, lang, t, onOpen }: { title: string; sub: string; docs: Doc[]; lang: Lang; t: Dict; onOpen: (d: Doc) => void }) {
  return (
    <div className="mb-6">
      <div className="mb-2.5 flex items-center gap-2.5">
        <span className="grid h-9 w-9 place-items-center rounded-xl bg-muted text-primary"><Files className="h-5 w-5" aria-hidden="true" /></span>
        <div>
          <h3>{title}</h3>
          <span className="meta">{sub}</span>
        </div>
      </div>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-3">
        {docs.map((d) => <DocCard key={d.id} doc={d} lang={lang} t={t} onOpen={() => onOpen(d)} />)}
      </div>
    </div>
  );
}

function LangCard({ icon, name, sub, level, width }: { icon: ReactNode; name: string; sub: string; level: string; width: number }) {
  return (
    <div className="card">
      <div className="flex items-center gap-2.5 font-semibold">
        {icon}
        <div className="flex flex-col leading-tight">
          <span>{name}</span>
          <small className="font-normal text-muted-foreground">{sub}</small>
        </div>
        <span className="lv">{level}</span>
      </div>
      <div className="lvl"><i style={{ width: `${width}%` }} /></div>
      <div className="mt-1 flex justify-between text-[.72rem] text-muted-foreground"><span>A1</span><span>C2</span></div>
    </div>
  );
}

function ContactRows({ t, copy }: { t: Dict; copy: (s: string) => void }) {
  const rows = [
    { icon: <Mail />, label: t.lMail, value: CONTACT.mail, aria: t.copyMail },
    { icon: <Phone />, label: t.lTel, value: CONTACT.telShow, aria: t.copyTel },
    { icon: <MapPin />, label: t.lAddr, value: address(), aria: t.copyAddr },
  ];
  return (
    <>
      {rows.map((r) => (
        <div key={r.label} className="crow">
          <span className="flex-none text-primary [&>svg]:h-5 [&>svg]:w-5">{r.icon}</span>
          <div className="min-w-0 flex-1"><small>{r.label}</small><b>{r.value}</b></div>
          <button className="docbtn !h-[38px] !w-[38px]" onClick={() => copy(r.value)} aria-label={r.aria} title={r.aria}>
            <Copy className="!h-[18px] !w-[18px]" aria-hidden="true" />
          </button>
        </div>
      ))}
    </>
  );
}
