import { useState, useEffect } from 'react';

interface MedicalDisclaimerProps {
  onAccept: () => void;
}

export default function MedicalDisclaimer({ onAccept }: MedicalDisclaimerProps) {
  const [isVisible, setIsVisible] = useState<boolean | null>(null);

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-2xl p-6 md:p-8 rounded-2xl bg-(--bg) border border-(--border) shadow-2xl text-left">
        
        {/* Intestazione */}
        <div className="flex items-center gap-3 mb-4">
          <span className="text-3xl">⚠️</span>
          <h2 className="text-2xl font-(--heading) text-(--text-h) m-0">
            Avviso Importante e Limitazione di Responsabilità
          </h2>
        </div>

        {/* Testo a vista senza scroll */}
        <div className="space-y-4 text-(--text) text-sm md:text-base leading-relaxed mb-6">
          <p>
            Questa application è uno <strong>strumento puramente informativo e di auto-tracciamento</strong> basato sulla letteratura scientifica attuale (comprese le linee guida della Monash University e studi indicizzati su PubMed).
          </p>
          <p className="font-semibold text-(--text-h)">
            Il software NON fornisce diagnosi mediche, NON prescrive terapie e NON sostituisce in alcun modo il parere di un medico, gastroenterologo o dietista professionista.
          </p>
          <p>
            I disturbi gastrointestinali, inclusi i sintomi riconducibili alla Sindrome dell'Intestino Irritabile (IBS), possono sovrapporsi a patologie organiche più severe (come la celiachia o le malattie infiammatorie croniche intestinali - IBD). 
          </p>
          <p>
            È fondamentale eseguire gli accertamenti clinici ed escludere altre patologie sotto la supervisione di uno specialista prima di intraprendere una dieta restrittiva a basso contenuto di FODMAP. Una dieta di esclusione prolungata e non guidata può alterare negativamente il microbiota intestinale.
          </p>
        </div>

        {/* Pulsante */}
        <div className="pt-4 border-t border-(--border) flex justify-end">
          <button
            onClick={handleAccept}
            className="w-full md:w-auto px-6 py-3 font-semibold rounded-xl text-white bg-(--accent) hover:opacity-90 active:scale-[0.98] transition-all cursor-pointer shadow-md text-center"
          >
            Ho letto, compreso e accetto
          </button>
        </div>

      </div>
    </div>
  );
}
