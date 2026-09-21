#!/usr/bin/env bash
# Esegui dalla root del repo: bash apply-disclaimer-i18n.sh
set -e
[ -f package.json ] && [ -d public/locales ] || { echo "Lancia lo script dalla root del repo"; exit 1; }

cat > src/components/MedicalDisclaimer.tsx <<'TSX_EOF'
import { useState, useEffect } from 'react';
import { useTranslation, Trans } from 'react-i18next';

interface MedicalDisclaimerProps {
  onAccept: () => void;
}

export default function MedicalDisclaimer({ onAccept }: MedicalDisclaimerProps) {
  const [isVisible, setIsVisible] = useState<boolean | null>(null);
  const { t, i18n } = useTranslation();
  const currentShortLang = i18n.language.startsWith('it') ? 'it' : 'en';

  useEffect(() => {
    const hasAccepted = localStorage.getItem('ibs_disclaimer_accepted');
    if (hasAccepted === 'true') {
      onAccept();
      setIsVisible(false);
    } else {
      setIsVisible(true);
    }
  }, [onAccept]);

  const handleAccept = () => {
    localStorage.setItem('ibs_disclaimer_accepted', 'true');
    setIsVisible(false);
    onAccept();
  };

  if (isVisible === null || !isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="w-full max-w-2xl p-6 md:p-8 rounded-2xl bg-(--bg) border border-(--border) shadow-2xl text-left">

        {/* Selettore lingua: il disclaimer compare prima dell'Header, quindi serve qui */}
        <div className="flex justify-end items-center gap-2 mb-2">
          <label htmlFor="disclaimer-lang" className="text-xs text-(--text) font-medium">
            🌐 {t('disclaimer.language')}:
          </label>
          <select
            id="disclaimer-lang"
            value={currentShortLang}
            onChange={(e) => i18n.changeLanguage(e.target.value)}
            className="p-1.5 rounded-lg text-xs font-bold border border-(--border) bg-(--code-bg) text-(--text-h) focus:outline-none focus:border-(--accent) cursor-pointer"
          >
            <option value="it">Italiano (IT)</option>
            <option value="en">English (EN)</option>
          </select>
        </div>

        {/* Intestazione */}
        <div className="flex items-center gap-3 mb-4">
          <span className="text-3xl">⚠️</span>
          <h2 className="text-2xl font-(--heading) text-(--text-h) m-0">
            {t('disclaimer.title')}
          </h2>
        </div>

        <div className="space-y-4 text-(--text) text-sm md:text-base leading-relaxed mb-6">
          <p>
            <Trans i18nKey="disclaimer.p1" components={{ b: <strong /> }} />
          </p>
          <p className="font-semibold text-(--text-h)">{t('disclaimer.p2')}</p>
          <p>{t('disclaimer.p3')}</p>
          <p>{t('disclaimer.p4')}</p>
          <p>{t('disclaimer.p5')}</p>
        </div>

        {/* Pulsante */}
        <div className="pt-4 border-t border-(--border) flex justify-end">
          <button
            onClick={handleAccept}
            className="w-full md:w-auto px-6 py-3 font-semibold rounded-xl text-white bg-(--accent) hover:opacity-90 active:scale-[0.98] transition-all cursor-pointer shadow-md text-center"
          >
            {t('disclaimer.accept')}
          </button>
        </div>

      </div>
    </div>
  );
}
TSX_EOF
echo "scritto src/components/MedicalDisclaimer.tsx"

python3 - <<'PY_EOF'
import json, re, sys
IT = {
  "title": "Avviso Importante e Limitazione di Responsabilità",
  "p1": "Questa applicazione è uno <b>strumento puramente informativo e di auto-tracciamento</b> basato sulla letteratura scientifica attuale (comprese le linee guida della Monash University e studi indicizzati su PubMed).",
  "p2": "Il software NON fornisce diagnosi mediche, NON prescrive terapie e NON sostituisce in alcun modo il parere di un medico, gastroenterologo o dietista professionista.",
  "p3": "I disturbi gastrointestinali, inclusi i sintomi riconducibili alla Sindrome dell'Intestino Irritabile (IBS), possono sovrapporsi a patologie organiche più severe (come la celiachia o le malattie infiammatorie croniche intestinali - IBD).",
  "p4": "È fondamentale eseguire gli accertamenti clinici ed escludere altre patologie sotto la supervisione di uno specialista prima di intraprendere una dieta restrittiva a basso contenuto di FODMAP. Una dieta di esclusione prolungata e non guidata può alterare negativamente il microbiota intestinale.",
  "p5": "Gli articoli formativi sono sintesi divulgative: citano le fonti ma possono non riflettere le evidenze più recenti, quindi verifica sempre gli studi originali. Non modificare terapie o alimentazione prescritte per patologie diagnosticate (come celiachia, IBD o tumori) senza consultare il tuo medico.",
  "accept": "Ho letto, compreso e accetto",
  "language": "Lingua"
}
EN = {
  "title": "Important Notice and Limitation of Liability",
  "p1": "This application is a <b>purely informational and self-tracking tool</b> based on the current scientific literature (including Monash University guidelines and studies indexed on PubMed).",
  "p2": "The software does NOT provide medical diagnoses, does NOT prescribe treatments and in no way replaces the advice of a physician, gastroenterologist or professional dietitian.",
  "p3": "Gastrointestinal disorders, including symptoms attributable to Irritable Bowel Syndrome (IBS), can overlap with more severe organic conditions (such as celiac disease or inflammatory bowel diseases - IBD).",
  "p4": "It is essential to undergo clinical evaluation and rule out other conditions under specialist supervision before starting a restrictive low-FODMAP diet. A prolonged, unsupervised elimination diet can negatively alter the gut microbiota.",
  "p5": "The educational articles are popular-science summaries: they cite their sources but may not reflect the latest evidence, so always check the original studies. Do not change therapies or diets prescribed for diagnosed conditions (such as celiac disease, IBD or cancer) without consulting your doctor.",
  "accept": "I have read, understood and accept",
  "language": "Language"
}
for lang, data in (('it', IT), ('en', EN)):
    p = f'public/locales/{lang}/translation.json'
    raw = open(p, encoding='utf-8').read()
    if '"disclaimer"' in raw:
        print(f'{lang}: chiave disclaimer gia presente, salto'); continue
    block = json.dumps({"disclaimer": data}, ensure_ascii=False, indent=2)
    inner = block[block.index('\n')+1 : block.rindex('\n')]   # senza le graffe esterne
    new = raw.replace('{\n', '{\n' + inner + ',\n', 1)
    json.loads(new)  # valida
    open(p, 'w', encoding='utf-8', newline='').write(new)
    print(f'{lang}: aggiunta chiave disclaimer')
PY_EOF
