#!/usr/bin/env bash
# Esegui dalla root del repo: bash apply-links-and-disclaimer-layout.sh
set -e
[ -f package.json ] && [ -d src/utils ] || { echo "Lancia lo script dalla root del repo"; exit 1; }

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      {/* Layout a flex + gap: index.css azzera i margini di h2/p e sovrascrive le utility Tailwind */}
      <div className="w-full max-w-3xl p-3 sm:p-6 rounded-2xl bg-(--bg) border border-(--border) shadow-2xl text-center flex flex-col gap-2 sm:gap-3">

        {/* Selettore lingua: il disclaimer compare prima dell'Header, quindi serve qui */}
        <div className="flex justify-center items-center gap-2">
          <label htmlFor="disclaimer-lang" className="text-xs text-(--text) font-medium">
            🌐 {t('disclaimer.language')}:
          </label>
          <select
            id="disclaimer-lang"
            value={currentShortLang}
            onChange={(e) => i18n.changeLanguage(e.target.value)}
            className="p-1 rounded-lg text-xs font-bold border border-(--border) bg-(--code-bg) text-(--text-h) focus:outline-none focus:border-(--accent) cursor-pointer"
          >
            <option value="it">Italiano (IT)</option>
            <option value="en">English (EN)</option>
          </select>
        </div>

        {/* Titolo (div con ruolo heading: un h2 erediterebbe i 24px globali di index.css) */}
        <div role="heading" aria-level={2} className="text-base sm:text-xl font-semibold text-(--text-h) leading-snug">
          <span className="mr-2">⚠️</span>
          {t('disclaimer.title')}
        </div>

        {/* Testo compatto e centrato, pensato per stare senza scorrimento */}
        <div className="flex flex-col gap-1.5 sm:gap-3 text-(--text) text-xs sm:text-sm leading-snug sm:leading-relaxed [@media(max-height:700px)]:text-[11px] [@media(max-height:700px)]:leading-tight">
          <p>
            <Trans i18nKey="disclaimer.p1" components={{ b: <strong /> }} />
          </p>
          <p className="font-semibold text-(--text-h)">{t('disclaimer.p2')}</p>
          <p>{t('disclaimer.p3')}</p>
          <p>{t('disclaimer.p4')}</p>
          <p>{t('disclaimer.p5')}</p>
        </div>

        {/* Pulsante */}
        <div className="pt-3 border-t border-(--border) flex justify-center">
          <button
            onClick={handleAccept}
            className="w-full sm:w-auto px-6 py-2.5 font-semibold rounded-xl text-white bg-(--accent) hover:opacity-90 active:scale-[0.98] transition-all cursor-pointer shadow-md text-center text-sm"
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

python3 - <<'PY_HUB'
import re
p = 'src/components/EducationalHub.tsx'
s = open(p, encoding='utf-8').read()
n = 0
for old, new in (('<p className="mb-3">{children}</p>', '<p className="pb-3">{children}</p>'),
                 ('list-disc pl-5 space-y-1.5 mb-3', 'list-disc pl-5 space-y-1.5 pb-3')):
    if old in s:
        s = s.replace(old, new); n += 1
open(p, 'w', encoding='utf-8', newline='').write(s)
print(f'EducationalHub.tsx: {n} correzioni di spaziatura applicate')
PY_HUB

python3 - <<'PY_LINKS'
import re
p = 'src/utils/educationalData.ts'
s = open(p, encoding='utf-8').read()
R = [
 ("ISSN Position Stand: Protein and Amino Acids",
  "Jäger R. et al. (2017) - International Society of Sports Nutrition Position Stand: protein and exercise. J Int Soc Sports Nutr 14:20",
  "https://doi.org/10.1186/s12970-017-0177-8"),
 ("Dietary Fats and Gastrointestinal Motility Review",
  "Feinle-Bisset C., Azpiroz F. (2013) - Dietary lipids and functional gastrointestinal disorders. Am J Gastroenterol 108(5):737-747",
  "https://hdl.handle.net/2440/79126"),
 ("Murray et al. - FODMAP Gastrointestinal Physiology",
  "Murray K. et al. (2014) - Differential effects of FODMAPs on small and large intestinal contents in healthy subjects shown by MRI. Am J Gastroenterol 109(1):110-119",
  "https://doi.org/10.1038/ajg.2013.386"),
 ("Visceral Hypersensitivity Mechanisms in IBS",
  "Deiteren A. et al. (2016) - Irritable bowel syndrome and visceral hypersensitivity: risk factors and pathophysiological mechanisms. Acta Gastroenterol Belg 79(1):29-38",
  "https://pubmed.ncbi.nlm.nih.gov/26852761/"),
 ("WGO Global Guidelines - Irritable Bowel Syndrome",
  "Quigley E.M.M. et al. (2016) - World Gastroenterology Organisation Global Guidelines: Irritable bowel syndrome, a global perspective (update September 2015). J Clin Gastroenterol 50(9):704-713",
  "https://doi.org/10.1097/MCG.0000000000000653"),
 ("Fecal Calprotectin Value in Gastrointestinal Workup",
  "Menees S.B. et al. (2015) - A meta-analysis of the utility of C-reactive protein, erythrocyte sedimentation rate, fecal calprotectin, and fecal lactoferrin to exclude inflammatory bowel disease in adults with IBS. Am J Gastroenterol 110(3):444-454",
  "https://doi.org/10.1038/ajg.2015.6"),
 ("Monash University - History and Science of the FODMAP Diet",
  "Monash University - The Low FODMAP Diet (sito ufficiale)",
  "https://www.monashfodmap.com/"),
 ("Review: Fermentable Oligosaccharides, Disaccharides, Monosaccharides, and Polyols",
  "Gibson P.R., Shepherd S.J. (2010) - Evidence-based dietary management of functional gastrointestinal symptoms: the FODMAP approach. J Gastroenterol Hepatol 25(2):252-258",
  "https://doi.org/10.1111/j.1440-1746.2009.06149.x"),
]
done = 0
for old, new_text, new_url in R:
    pat = re.compile(r"\{ text: '" + re.escape(old) + r"', url: '[^']*' \}")
    s, n = pat.subn("{ text: '" + new_text + "', url: '" + new_url + "' }", s)
    done += n
    if n == 0 and new_url not in s:
        print('ATTENZIONE: non trovato ->', old)
open(p, 'w', encoding='utf-8', newline='').write(s)
print(f'link sostituiti: {done}/8')
PY_LINKS
