import { Download, ExternalLink } from "lucide-react";

import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { assetUrl, type Doc, type Lang } from "@/lib/card-data";
import type { Dict } from "@/lib/i18n";

type Props = { doc: Doc | null; lang: Lang; t: Dict; onClose: () => void };

export function DocViewer({ doc, lang, t, onClose }: Props) {
  const pdf = doc ? assetUrl(`${doc.id}.pdf`) : "";
  return (
    <Dialog open={!!doc} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="glass flex h-[92dvh] w-[min(820px,96vw)] max-w-none flex-col gap-3 rounded-[var(--radius)] bg-popover p-4 sm:p-5">
        {doc && (
          <>
            <div className="pr-8">
              <DialogTitle className="font-serif text-xl">{doc.title[lang]}</DialogTitle>
              <DialogDescription className="meta mt-1">
                {doc.meta[lang]} · PDF · {doc.pages} {doc.pages === 1 ? t.page : t.pages}
              </DialogDescription>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto rounded-2xl bg-muted p-2 sm:p-3">
              <div className="mx-auto flex max-w-[680px] flex-col gap-3">
                {Array.from({ length: doc.pages }, (_, i) => (
                  <img
                    key={i}
                    src={assetUrl(`${doc.id}-${i + 1}.jpg`)}
                    alt={`${doc.title[lang]} – ${t.page} ${i + 1}`}
                    loading={i === 0 ? "eager" : "lazy"}
                    className="block w-full rounded-lg bg-background shadow-md"
                  />
                ))}
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <a className="btn primary" href={pdf} target="_blank" rel="noopener">
                <ExternalLink aria-hidden="true" />
                {t.openPdf}
              </a>
              <a className="btn" href={pdf} download={`Finn-Boettcher-${doc.id}.pdf`}>
                <Download aria-hidden="true" />
                {t.download}
              </a>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
