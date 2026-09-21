#!/usr/bin/env bash
# Esegui dalla root del repo: bash apply-fodmap-fix.sh
set -e
[ -f package.json ] && [ -d src/utils ] || { echo "Lancia lo script dalla root del repo"; exit 1; }

cat > src/content/decodifica-fodmap.it.md <<'MD_IT'
L'acronimo FODMAP identifica una classificazione biochimica di carboidrati e zuccheri a catena corta accomunati da tre caratteristiche: scarso assorbimento nell'intestino tenue, alta attività osmotica e rapida degradazione da parte del microbiota colonico.

## 1. FERMENTABLE (Fermentabili)

Non è un componente, ma la proprietà biologica di fondo. Descrive il processo con cui i batteri del colon scompongono anaerobicamente i legami di questi zuccheri non digeriti, ricavandone energia e sprigionando gas come sottoprodotto cinetico.

## 2. OLIGOSACCHARIDES (Oligosaccaridi - Fruttani e Galattani)

Molecole complesse a catena corta (3-10 unità). Gli esseri umani mancano totalmente degli enzimi necessari per spezzare questi legami.

- **Fruttani:** presenti nel frumento, nella segale, nell'aglio e nella cipolla.
- **Galattani (GOS):** presenti in quasi tutti i legumi (fagioli, lenticchie, ceci). Arrivano al 100% integri nel colon di chiunque.

## 3. DISACCHARIDES (Disaccaridi - Lattosio)

Zucchero a due unità (glucosio + galattosio). Richiede l'enzima intestinale lattasi per essere scisso. Se i livelli di lattasi sono geneticamente bassi o ridotti da stati infiammatori intestinali, il lattosio prosegue integro nel tratto gastrointestinale richiamando acqua per osmosi.

## 4. MONOSACCHARIDES (Monosaccaridi - Fruttosio)

Zucchero a singola unità presente nella frutta (mele, pere) e nel miele. Il suo assorbimento dipende dai trasportatori cellulari GLUT-5. Se la quantità di fruttosio in un cibo supera quella del glucosio (co-trasportatore facilitatore), i recettori si saturano rapidamente lasciando il fruttosio libero nel lume.

## 5. AND POLYOLS (Polioli - Sorbitolo, Mannitolo, Xilitolo)

Zuccheri alcolici idrofili presenti in alcune piante (anguria, funghi, cavolfiori) e usati come dolcificanti industriali. Vengono assorbiti per diffusione passiva estremamente lenta: l'80% della quota ingerita prosegue verso il colon esercitando una costante attrazione osmotica idrica.
MD_IT
echo "scritto src/content/decodifica-fodmap.it.md"

cat > src/content/decodifica-fodmap.en.md <<'MD_EN'
The FODMAP acronym outlines a specific biochemical classification of short-chain carbohydrates shared by three attributes: poor absorption in the small intestine, high osmotic activity, and rapid structural degradation by colonic microbiota.

## 1. FERMENTABLE

Not a single sugar group, but the underlying biological trait. It describes the anaerobic pathway used by colon bacteria to harvest energy from undigested bonds, generating fast gas production as a kinetic byproduct.

## 2. OLIGOSACCHARIDES (Fructans and Galactans)

Short polymers (3-10 sugar units). Humans lack the internal enzyme equipment required to sever these specific chemical bonds.

- **Fructans:** found heavily in wheat, rye, garlic, and onions.
- **Galactans (GOS):** found in legumes (beans, lentils, chickpeas). They reach the colon 100% intact in all individuals.

## 3. DISACCHARIDES (Lactose)

A two-unit sugar molecule (glucose + galactose). It requires the intestinal brush-border enzyme lactase to step in. If lactase levels are genetically deficient or reduced by localized gut inflammation, lactose proceeds unabsorbed, exerting fluid attraction.

## 4. MONOSACCHARIDES (Fructose)

A single-unit sugar abundant in specific fruits (apples, pears) and honey. Absorption relies strictly on intestinal GLUT-5 transporters. When fructose content in a food exceeds glucose levels (which acts as a facilitator), receptors saturate rapidly, leaving free fructose behind in the lumen.

## 5. AND POLYOLS (Sugar Alcohols - Sorbitol, Mannitol, Xylitol)

Hydrophilic sugar alcohols found natively in plants (watermelon, mushrooms) or manufactured as industrial sweeteners. They absorb via incredibly slow passive diffusion: up to 80% of the ingested payload migrates to the colon, triggering continuous osmotic water draw.
MD_EN
echo "scritto src/content/decodifica-fodmap.en.md"

cat > src/components/EducationalHub.tsx <<'HUB_TSX'
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import ReactMarkdown from 'react-markdown';
import type { Components } from 'react-markdown';
import { EDUCATIONAL_ARTICLES } from '../utils/educationalData';
import type { Article } from '../utils/educationalData';

// Stile per gli articoli scritti in markdown (Tailwind azzera i default di titoli e liste)
const markdownComponents: Components = {
  h2: ({ children }) => <h4 className="text-base md:text-lg font-bold text-(--text-h) mt-6 mb-2">{children}</h4>,
  p: ({ children }) => <p className="mb-3">{children}</p>,
  ul: ({ children }) => <ul className="list-disc pl-5 space-y-1.5 mb-3">{children}</ul>,
  strong: ({ children }) => <strong className="font-semibold text-(--text-h)">{children}</strong>,
};

export default function EducationalHub() {
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null);
  const { t, i18n } = useTranslation();

  const currentLang: 'it' | 'en' = i18n.language.startsWith('it') ? 'it' : 'en';
  const currentArticle = EDUCATIONAL_ARTICLES.find(art => art.id === selectedArticleId);

  const categoryTranslations: Record<string, Record<'it' | 'en', string>> = {
    'Biochimica Base': { it: 'Biochimica Base', en: 'Basic Biochemistry' },
    'Fisiopatologia': { it: 'Fisiopatologia', en: 'Pathophysiology' },
    'Protocolli Clinici': { it: 'Protocolli Clinici', en: 'Clinical Protocols' }
  };

  const handleNavigateToArticle = (id: string) => {
    setSelectedArticleId(id);
    document.getElementById('educational-hub-title')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6 text-left mt-8 border-t border-(--border)">
      <h2 id="educational-hub-title" className="text-2xl font-bold text-(--text-h) mb-6 text-center md:text-left">
        {t('hub_title')}
      </h2>

      {currentArticle ? (
        <div className="p-6 rounded-2xl bg-(--bg) border border-(--border) shadow-sm space-y-6 animate-fade-in">
          <button
            onClick={() => setSelectedArticleId(null)}
            className="text-xs md:text-sm font-semibold text-(--accent) hover:underline cursor-pointer mb-2"
          >
            {t('hub_back')}
          </button>

          <div>
            <span className="px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-purple-500/10 text-(--accent)">
              {categoryTranslations[currentArticle.category]?.[currentLang] || currentArticle.category}
            </span>
            <h3 className="text-xl md:text-2xl font-bold text-(--text-h) mt-3 mb-2 leading-tight">
              {currentArticle[currentLang].title}
            </h3>
          </div>

          {currentArticle.markdown ? (
            <div className="text-(--text) text-sm md:text-base leading-relaxed">
              <ReactMarkdown components={markdownComponents}>
                {currentArticle[currentLang].content}
              </ReactMarkdown>
            </div>
          ) : (
            <div className="text-(--text) text-sm md:text-base leading-relaxed whitespace-pre-line space-y-4">
              {currentArticle[currentLang].content}
            </div>
          )}

          {currentArticle.pubmedLinks && currentArticle.pubmedLinks.length > 0 && (
            <div className="p-4 rounded-xl bg-(--code-bg) border border-(--border) mt-4">
              <h4 className="text-xs font-bold text-(--text-h) uppercase tracking-wide mb-2">🔬 PubMed Sources:</h4>
              <ul className="list-disc pl-5 space-y-1.5">
                {currentArticle.pubmedLinks.map((link, idx) => (
                  <li key={idx} className="text-xs md:text-sm">
                    <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-(--accent) hover:underline font-medium break-all">
                      {link.text} ↗
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-(--border) mt-6">
            <div>
              {currentArticle.prerequisites && currentArticle.prerequisites.length > 0 && (
                <>
                  <span className="block text-xs font-bold text-(--text) uppercase tracking-wider mb-2">🧠 Prerequisites:</span>
                  {currentArticle.prerequisites.map(preId => {
                    const found = EDUCATIONAL_ARTICLES.find(a => a.id === preId);
                    return found ? (
                      <button key={preId} onClick={() => handleNavigateToArticle(preId)} className="w-full text-left p-2.5 rounded-xl border border-(--border) text-xs font-medium text-(--text-h) bg-(--code-bg) hover:border-(--accent) transition-all cursor-pointer">
                        📌 {found[currentLang].title}
                      </button>
                    ) : null;
                  })}
                </>
              )}
            </div>
            <div>
              {currentArticle.nextSteps && currentArticle.nextSteps.length > 0 && (
                <>
                  <span className="block text-xs font-bold text-(--text) uppercase tracking-wider mb-2">🚀 Next Steps:</span>
                  {currentArticle.nextSteps.map(nextId => {
                    const found = EDUCATIONAL_ARTICLES.find(a => a.id === nextId);
                    return found ? (
                      <button key={nextId} onClick={() => handleNavigateToArticle(nextId)} className="w-full text-left p-2.5 rounded-xl border border-(--accent-border) text-xs font-semibold text-(--accent) bg-purple-500/5 hover:bg-purple-500/10 transition-all cursor-pointer">
                        📖 {found[currentLang].title}
                      </button>
                    ) : null;
                  })}
                </>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {EDUCATIONAL_ARTICLES.map((article: Article) => (
            <div key={article.id} className="p-5 rounded-2xl bg-(--bg) border border-(--border) shadow-sm hover:border-(--accent-border) transition-all flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-(--accent) uppercase tracking-wider block mb-1">
                  {categoryTranslations[article.category]?.[currentLang] || article.category}
                </span>
                <h3 className="font-bold text-(--text-h) text-base md:text-lg mb-2 leading-snug">
                  {article[currentLang].title}
                </h3>
                <p className="text-xs md:text-sm text-(--text) leading-relaxed mb-4">
                  {article[currentLang].summary}
                </p>
              </div>
              <button onClick={() => setSelectedArticleId(article.id)} className="w-full text-center py-2 px-4 text-xs font-bold rounded-xl text-white bg-(--accent) hover:opacity-90 active:scale-[0.98] transition-all cursor-pointer">
                {t('hub_read')}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
HUB_TSX
echo "scritto src/components/EducationalHub.tsx"

f=src/utils/educationalData.ts
# 1) via eventuali import .md gia' presenti (rende lo script rieseguibile)
grep -v "\.md?raw'" $f | sed "/./,\$!d" > /tmp/edu0.ts
# 2) trovo dove inizia il blocco "it:" di decodifica-fodmap
s=$(grep -n "id: 'decodifica-fodmap'" /tmp/edu0.ts | cut -d: -f1)
i=$(awk -v s=$s 'NR>s && /^ *it: \{/ {print NR; exit}' /tmp/edu0.ts)
[ -n "$s" ] && [ -n "$i" ] || { echo "ERRORE: non trovo il blocco decodifica-fodmap"; exit 1; }
{
  echo "import decodificaFodmapIT from '../content/decodifica-fodmap.it.md?raw';"
  echo "import decodificaFodmapEN from '../content/decodifica-fodmap.en.md?raw';"
  echo
  head -n $((i-1)) /tmp/edu0.ts
  cat <<'EOT'
    it: {
      title: "Decodificare l'Acronimo FODMAP",
      summary: 'Chimica e fisiologia dei FODMAP.',
      content: decodificaFodmapIT
    },
    en: {
      title: 'Decoding the FODMAP Acronym',
      summary: 'Chemistry and physiology of FODMAPs.',
      content: decodificaFodmapEN
    }
  }
];
EOT
} > /tmp/edu1.ts
# 3) flag markdown: nell'interfaccia e nell'articolo (solo se mancano)
grep -q "markdown?: boolean" /tmp/edu1.ts || sed -i '0,/^  id: string;/s//  id: string;\n  markdown?: boolean;/' /tmp/edu1.ts
grep -q "markdown: true" /tmp/edu1.ts || sed -i "s/^    id: 'decodifica-fodmap',/    id: 'decodifica-fodmap',\n    markdown: true,/" /tmp/edu1.ts
cp /tmp/edu1.ts $f
echo "OK: educationalData.ts aggiornato"
