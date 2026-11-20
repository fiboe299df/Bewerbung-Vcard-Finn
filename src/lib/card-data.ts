export type Lang = "de" | "en";
export type L = { de: string; en: string };

export const CONTACT = {
  name: "Finn Böttcher",
  firstName: "Finn",
  lastName: "Böttcher",
  tel: "+4915225231232",
  telShow: "01522 5231232",
  mail: "fiboe02@web.de",
  street: "Itzehoer Chaussee 32",
  zip: "24808",
  city: "Jevenstedt",
  birth: "2002-07-19",
  title: "Auszubildender Kaufmann für Büromanagement",
  org: "Diakonisches Werk Schleswig-Holstein",
} as const;

/** Links to the server-generated wallet passes; leave empty until they exist. */
export const WALLET = { apple: "", google: "" };

export const address = () => `${CONTACT.street}, ${CONTACT.zip} ${CONTACT.city}`;

export function ageOn(birthIso: string, now: Date): number {
  const [y, m, d] = birthIso.split("-").map(Number) as [number, number, number];
  let age = now.getFullYear() - y;
  const beforeBirthday = now.getMonth() + 1 < m || (now.getMonth() + 1 === m && now.getDate() < d);
  if (beforeBirthday) age -= 1;
  return age;
}

/** Plain text used by every "copy contact" button. */
export const contactText = () =>
  [CONTACT.name, CONTACT.telShow, CONTACT.mail, address()].join("\n");

export const vcardText = () =>
  [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `N:${CONTACT.lastName};${CONTACT.firstName};;;`,
    `FN:${CONTACT.name}`,
    `TITLE:${CONTACT.title}`,
    `ORG:${CONTACT.org}`,
    `TEL;TYPE=CELL:${CONTACT.tel}`,
    `EMAIL:${CONTACT.mail}`,
    `ADR;TYPE=HOME:;;${CONTACT.street};${CONTACT.city};;${CONTACT.zip};Deutschland`,
    "END:VCARD",
  ].join("\n");

export const mapsQuery = encodeURIComponent(address());

/* ---------- Documents ---------- */

const files = import.meta.glob("/src/assets/docs/*.asset.json", {
  eager: true,
  import: "default",
}) as Record<string, { url: string }>;

export const assetUrl = (file: string) => files[`/src/assets/docs/${file}.asset.json`]?.url ?? "";

export type Doc = { id: string; title: L; meta: L; pages: number };

const D = (id: string, pages: number, title: L, meta: L): Doc => ({ id, pages, title, meta });

export const DOCS = {
  lebenslauf: D("lebenslauf", 2, { de: "Lebenslauf 2026", en: "CV 2026" }, { de: "Stand 11/2026", en: "As of 11/2026" }),
  sosafe: D("sosafe", 3, { de: "Cyber Security Awareness", en: "Cyber Security Awareness" }, { de: "SoSafe · 23.01.2026", en: "SoSafe · 23 Jan 2026" }),
  excelDaten: D("excel-datenanalyse", 1, { de: "Excel 365 – Datenanalyse", en: "Excel 365 – Data analysis" }, { de: "Förde Campus · 19.06.2025", en: "Förde Campus · 19 Jun 2025" }),
  excelFormeln: D("excel-formeln", 1, { de: "Excel 365 – Formeln & Funktionen", en: "Excel 365 – Formulas & functions" }, { de: "Förde Campus · 18.06.2025", en: "Förde Campus · 18 Jun 2025" }),
  kiDatenschutz: D("ki-datenschutz", 1, { de: "KI-Führerschein: Datenschutz & Copyright", en: "AI licence: Data protection & copyright" }, { de: "soluzione · 23.01.2026", en: "soluzione · 23 Jan 2026" }),
  kiPrompting: D("ki-prompting", 1, { de: "KI-Führerschein: Prompting", en: "AI licence: Prompting" }, { de: "soluzione · 23.01.2026", en: "soluzione · 23 Jan 2026" }),
  kiGrundlagen: D("ki-grundlagen", 1, { de: "KI-Führerschein: Grundlagen KI", en: "AI licence: AI basics" }, { de: "soluzione · 23.01.2026", en: "soluzione · 23 Jan 2026" }),
  kiEthik: D("ki-ethik", 1, { de: "KI-Führerschein: KI und Ethik", en: "AI licence: AI and ethics" }, { de: "soluzione · 23.01.2026", en: "soluzione · 23 Jan 2026" }),
  kiRisiken: D("ki-risiken", 1, { de: "KI-Führerschein: Risiken & Gefahren", en: "AI licence: Risks & dangers" }, { de: "soluzione · 23.01.2026", en: "soluzione · 23 Jan 2026" }),
  ersteHilfe: D("erste-hilfe", 1, { de: "Erste-Hilfe-Ausbildung", en: "First aid training" }, { de: "Sanitätsschule Nord · 12.06.2025", en: "Sanitätsschule Nord · 12 Jun 2025" }),
  praktikum: D("praktikum-tsbw", 2, { de: "Praktikumsbescheinigung & Beurteilung", en: "Internship certificate & assessment" }, { de: "Theodor-Schäfer-Berufsbildungswerk · 2018", en: "Theodor-Schäfer-Berufsbildungswerk · 2018" }),
  bbz251: D("bbz-2025-1", 1, { de: "Schuljahr 2025/26 · 1. Halbjahr", en: "School year 2025/26 · 1st half" }, { de: "3. Ausbildungsjahr", en: "3rd year of training" }),
  bbz242: D("bbz-2024-2", 1, { de: "Schuljahr 2024/25 · 2. Halbjahr", en: "School year 2024/25 · 2nd half" }, { de: "2. Ausbildungsjahr", en: "2nd year of training" }),
  bbz241: D("bbz-2024-1", 1, { de: "Schuljahr 2024/25 · 1. Halbjahr", en: "School year 2024/25 · 1st half" }, { de: "2. Ausbildungsjahr", en: "2nd year of training" }),
  bbz232: D("bbz-2023-2", 1, { de: "Schuljahr 2023/24 · 2. Halbjahr", en: "School year 2023/24 · 2nd half" }, { de: "1. Ausbildungsjahr", en: "1st year of training" }),
  bbz231: D("bbz-2023-1", 1, { de: "Schuljahr 2023/24 · 1. Halbjahr", en: "School year 2023/24 · 1st half" }, { de: "1. Ausbildungsjahr", en: "1st year of training" }),
  kl10: D("zeugnis-kl10", 5, { de: "Zeugnis Klasse 10", en: "Report grade 10" }, { de: "Schuljahr 2019/20 · 1. Halbjahr", en: "School year 2019/20 · 1st half" }),
  kl9: D("zeugnis-kl9", 5, { de: "Zeugnis Klasse 9", en: "Report grade 9" }, { de: "Schuljahr 2018/19 · 2. Halbjahr", en: "School year 2018/19 · 2nd half" }),
  fuehrung: D("fuehrungszeugnis", 1, { de: "Erweitertes Führungszeugnis", en: "Enhanced certificate of conduct" }, { de: "Bundesamt für Justiz · 15.10.2024 · keine Eintragung", en: "Federal Office of Justice · 15 Oct 2024 · no record" }),
  ausweis: D("schwerbehindertenausweis", 2, { de: "Schwerbehindertenausweis", en: "Severe disability ID" }, { de: "GdB 50 · unbefristet", en: "Degree of disability 50 · unlimited" }),
} satisfies Record<string, Doc>;

export const CERTS: Doc[] = [
  DOCS.sosafe, DOCS.excelDaten, DOCS.excelFormeln, DOCS.ersteHilfe,
  DOCS.kiDatenschutz, DOCS.kiPrompting, DOCS.kiGrundlagen, DOCS.kiEthik, DOCS.kiRisiken,
];
export const BBZ_REPORTS: Doc[] = [DOCS.bbz251, DOCS.bbz242, DOCS.bbz241, DOCS.bbz232, DOCS.bbz231];
export const SCHOOL_REPORTS: Doc[] = [DOCS.kl10, DOCS.kl9];
export const OTHER_PROOFS: Doc[] = [DOCS.fuehrung, DOCS.ausweis];
