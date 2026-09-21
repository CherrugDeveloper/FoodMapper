import decodificaFodmapIT from '../content/decodifica-fodmap.it.md?raw';
import decodificaFodmapEN from '../content/decodifica-fodmap.en.md?raw';

export interface ArticleTranslation {
  title: string;
  summary: string;
  content: string;
}

export interface PubmedLink {
  text: string;
  url: string;
}

export interface Article {
  id: string;
  category: 'Biochimica Base' | 'Fisiopatologia' | 'Protocolli Clinici';
  pubmedLinks?: PubmedLink[];
  prerequisites?: string[];
  nextSteps?: string[];
  it: ArticleTranslation;
  en: ArticleTranslation;
}

export const EDUCATIONAL_ARTICLES: Article[] = [
  {
    id: 'decodifica-fodmap',
    category: 'Biochimica Base',
    pubmedLinks: [
      {
        text: 'Monash University - History and Science of the FODMAP Diet',
        url: 'https://www.monashfodmap.com'
      }
    ],
    prerequisites: ['diagnosi-differenziale'],
    nextSteps: [],
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