export type MicroKey =
  | 'potassium'
  | 'magnesium'
  | 'calcium'
  | 'iron'
  | 'zinc'
  | 'folate'
  | 'vitamin_a'
  | 'vitamin_c'
  | 'vitamin_d'
  | 'vitamin_e'
  | 'b12'
  | 'omega3'
  | 'selenium'
  | 'iodine'
  | 'sodium'
  | 'vitamin_k'
  | 'vitamin_b6'
  | 'manganese'
  | 'copper'
  | 'phosphorus';

export interface MicroNutrientData {
  /** Unità di misura per 100 g (mg, µg, g) */
  unit: string;
  /** Descrizione per lingua: funzione, carenza, eccesso */
  it: { function: string; deficiency: string; excess: string };
  en: { function: string; deficiency: string; excess: string };
  de: { function: string; deficiency: string; excess: string };
  es: { function: string; deficiency: string; excess: string };
  fr: { function: string; deficiency: string; excess: string };
}

export const MICRO_NUTRIENT_INFO: Record<MicroKey, MicroNutrientData> = {
  potassium: {
    unit: 'mg/100g',
    it: {
      function: 'Regola la pressione arteriosa, la contrattilità muscolare e l\'equilibrio acido-base.',
      deficiency: 'Affaticamento, crampi, aritmie, stipsi e aumento della pressione arteriosa.',
      excess: 'Iperkaliemia: aritmie cardiache, debolezza muscolare; rischiosa in insufficienza renale.'
    },
    en: {
      function: 'Regulates blood pressure, muscle contraction, and acid-base balance.',
      deficiency: 'Fatigue, cramps, arrhythmias, constipation, and elevated blood pressure.',
      excess: 'Hyperkalemia: heart arrhythmias, muscle weakness; risky in kidney failure.'
    },
    de: {
      function: 'Reguliert Blutdruck, Muskelkontraktion und Säure-Basen-Haushalt.',
      deficiency: 'Müdigkeit, Krämpfe, Herzrhythmusstörungen, Verstopfung, Bluthochdruck.',
      excess: 'Hyperkaliämie: Herzrhythmusstörungen, Muskelschwäche; riskant bei Niereninsuffizienz.'
    },
    es: {
      function: 'Regula la presión arterial, la contracción muscular y el equilibrio ácido-base.',
      deficiency: 'Fatiga, calambres, arritmias, estreñimiento e hipertensión.',
      excess: 'Hiperkalemia: arritmias cardíacas, debilidad muscular; riesgosa en insuficiencia renal.'
    },
    fr: {
      function: 'Régule la pression artérielle, la contraction musculaire et l\'équilibre acido-basique.',
      deficiency: 'Fatigue, crampes, arythmies, constipation et hypertension artérielle.',
      excess: 'Hyperkaliémie : arythmies cardiaques, faiblesse musculaire ; risquée en insuffisance rénale.'
    }
  },
  magnesium: {
    unit: 'mg/100g',
    it: {
      function: 'Cofattore per >300 reazioni enzimatiche; supporta ossa, muscoli e sistema nervoso.',
      deficiency: 'Crampi, tremori, ansia, insonnia, stipsi, aritmie e affaticamento.',
      excess: 'Diarrea, nausea, ipotensione; tossicità rara ma pericolosa in insufficienza renale.'
    },
    en: {
      function: 'Cofactor for >300 enzymatic reactions; supports bones, muscles, and the nervous system.',
      deficiency: 'Cramps, tremors, anxiety, insomnia, constipation, arrhythmias, and fatigue.',
      excess: 'Diarrhea, nausea, low blood pressure; toxicity rare but dangerous in kidney failure.'
    },
    de: {
      function: 'Cofaktor für >300 enzymatische Reaktionen; unterstützt Knochen, Muskeln und Nervensystem.',
      deficiency: 'Krämpfe, Zittern, Angst, Schlafstörungen, Verstopfung, Herzrhythmusstörungen, Müdigkeit.',
      excess: 'Durchfall, Übelkeit, niedriger Blutdruck; Toxizität selten, aber gefährlich bei Niereninsuffizienz.'
    },
    es: {
      function: 'Cofactor de >300 reacciones enzimáticas; apoya huesos, músculos y sistema nervioso.',
      deficiency: 'Calambres, temblores, ansiedad, insomnio, estreñimiento, arritmias y fatiga.',
      excess: 'Diarrea, náuseas, hipotensión; toxicidad rara pero peligrosa en insuficiencia renal.'
    },
    fr: {
      function: 'Cofacteur de >300 réactions enzymatiques; soutient les os, les muscles et le système nerveux.',
      deficiency: 'Crampes, tremblements, anxiété, insomnie, constipation, arythmies et fatigue.',
      excess: 'Diarrhée, nausées, hypotension ; toxicité rare mais dangereuse en insuffisance rénale.'
    }
  },
  calcium: {
    unit: 'mg/100g',
    it: {
      function: 'Essenziale per ossa, denti, coagulazione e contrazione muscolare.',
      deficiency: 'Osteopenia/osteoporosi, crampi, intorpidimento, alterazioni dentali.',
      excess: 'Costipazione, calcoli renali, interferenza con ferro e zinco; ipercalcemia rara dalla dieta.'
    },
    en: {
      function: 'Essential for bones, teeth, blood clotting, and muscle contraction.',
      deficiency: 'Osteopenia/osteoporosis, cramps, numbness, dental changes.',
      excess: 'Constipation, kidney stones, interference with iron and zinc; dietary hypercalcemia is rare.'
    },
    de: {
      function: 'Wichtig für Knochen, Zähne, Blutgerinnung und Muskelkontraktion.',
      deficiency: 'Osteopenie/Osteoporose, Krämpfe, Taubheitsgefühl, Zahnveränderungen.',
      excess: 'Verstopfung, Nierensteine, Beeinträchtigung von Eisen und Zink; hyperkalzämie durch Nahrung selten.'
    },
    es: {
      function: 'Esencial para huesos, dientes, coagulación y contracción muscular.',
      deficiency: 'Osteopenia/osteoporosis, calambres, entumecimiento, alteraciones dentales.',
      excess: 'Estreñimiento, cálculos renales, interferencia con hierro y zinc; la hipercalcemia dietética es rara.'
    },
    fr: {
      function: 'Essentiel pour les os, les dents, la coagulation et la contraction musculaire.',
      deficiency: 'Ostéopénie/ostéoporose, crampes, engourdissement, modifications dentaires.',
      excess: 'Constipation, calculs rénaux, interférence avec le fer et le zinc ; hypercalcémie alimentaire rare.'
    }
  },
  iron: {
    unit: 'mg/100g',
    it: {
      function: 'Trasporto di ossigeno nel sangue e produzione di energia cellulare.',
      deficiency: 'Anemia ferropriva, stanchezza, pallore, calo delle prestazioni cognitive e immunitarie.',
      excess: 'Sovraccarico emocromatosi, nausea, danno epatico; rischio maggiore con integrazioni.'
    },
    en: {
      function: 'Oxygen transport in blood and cellular energy production.',
      deficiency: 'Iron-deficiency anemia, fatigue, pallor, reduced cognitive and immune performance.',
      excess: 'Hemochromatosis overload, nausea, liver damage; higher risk with supplements.'
    },
    de: {
      function: 'Sauerstofftransport im Blut und zelluläre Energieproduktion.',
      deficiency: 'Eisenmangelanämie, Müdigkeit, Blässe, verminderte kognitive und Immunleistung.',
      excess: 'Hämosiderose/Hämochromatose, Übelkeit, Leberschäden; höheres Risiko mit Nahrungsergänzungsmitteln.'
    },
    es: {
      function: 'Transporte de oxígeno en la sangre y producción de energía celular.',
      deficiency: 'Anemia ferropénica, fatiga, palidez, deterioro cognitivo e inmunológico.',
      excess: 'Sobrecarga hemocromatosis, náuseas, daño hepático; mayor riesgo con suplementos.'
    },
    fr: {
      function: 'Transport de l\'oxygène dans le sang et production d\'énergie cellulaire.',
      deficiency: 'Anémie ferriprive, fatigue, pâleur, baisse des performances cognitives et immunitaires.',
      excess: 'Surcharge en hémochromatose, nausées, lésions hépatiques ; risque accru avec les suppléments.'
    }
  },
  zinc: {
    unit: 'mg/100g',
    it: {
      function: 'Supporta immunità, crescita, guarigione delle ferite e sintesi proteica.',
      deficiency: 'Rallentamento cicatrizzazione, perdita gusto/olfatto, infezioni ricorrenti, caduta capelli.',
      excess: 'Nausea, vomito, mal di testa, calo HDL, ridotta assorbimento rame.'
    },
    en: {
      function: 'Supports immunity, growth, wound healing, and protein synthesis.',
      deficiency: 'Slow wound healing, loss of taste/smell, recurrent infections, hair loss.',
      excess: 'Nausea, vomiting, headaches, lowered HDL, reduced copper absorption.'
    },
    de: {
      function: 'Unterstützt Immunität, Wachstum, Wundheilung und Proteinsynthese.',
      deficiency: 'Langsame Wundheilung, Geschmacks-/Geruchsverlust, wiederkehrende Infekte, Haarausfall.',
      excess: 'Übelkeit, Erbrechen, Kopfschmerzen, erniedrigtes HDL, verminderte Kupferaufnahme.'
    },
    es: {
      function: 'Apoya la inmunidad, el crecimiento, la cicatrización y la síntesis de proteínas.',
      deficiency: 'Cicatrización lenta, pérdida de gusto/olfato, infecciones recurrentes, caída del cabello.',
      excess: 'Náuseas, vómitos, dolor de cabeza, reducción del HDL, menor absorción de cobre.'
    },
    fr: {
      function: 'Soutient l\'immunité, la croissance, la cicatrisation et la synthèse protéique.',
      deficiency: 'Cicatrisation lente, perte du goût/odorat, infections récurrentes, chute de cheveux.',
      excess: 'Nausées, vomissements, maux de tête, baisse du HDL, réduction de l\'absorption du cuivre.'
    }
  },
  folate: {
    unit: 'µg/100g',
    it: {
      function: 'Vitamina B9 per divisione cellulare, sintesi del DNA e sviluppo fetale.',
      deficiency: 'Anemia megaloblastica, stanchezza, difetti del tubo neurale in gravidanza.',
      excess: 'Mascheramento carenza B12; eccesso da integrazione associato a rischio oncologico discussibile.'
    },
    en: {
      function: 'Vitamin B9 for cell division, DNA synthesis, and fetal development.',
      deficiency: 'Megaloblastic anemia, fatigue, neural tube defects in pregnancy.',
      excess: 'Can mask B12 deficiency; high supplemental intake linked to debated cancer risk.'
    },
    de: {
      function: 'Vitamin B9 für Zellteilung, DNA-Synthese und fetale Entwicklung.',
      deficiency: 'Megaloblastäre Anämie, Müdigkeit, Neuralrohrdefekte in der Schwangerschaft.',
      excess: 'Kann B12-Mangel verschleiern; hohe Supplemente mit diskutiertem Krebsrisiko verbunden.'
    },
    es: {
      function: 'Vitamina B9 para división celular, síntesis de ADN y desarrollo fetal.',
      deficiency: 'Anemia megaloblástica, fatiga, defectos del tubo neural en el embarazo.',
      excess: 'Enmascaramiento de déficit de B12; alto consumo de suplementos asociado a riesgo oncológico discutido.'
    },
    fr: {
      function: 'Vitamine B9 pour la division cellulaire, la synthèse de l\'ADN et le développement fœtal.',
      deficiency: 'Anémie mégaloblastique, fatigue, anomalies du tube neural en cas de grossesse.',
      excess: 'Peut masquer une carence en B12 ; fortes doses de suppléments associées à un risque cancéreux discuté.'
    }
  },
  vitamin_a: {
    unit: 'µg RAE/100g',
    it: {
      function: 'Vista, immunità, differenziazione cellulare e salute della pelle.',
      deficiency: 'Cecità notturna, xeroftalmia, maggiore suscettibilità alle infezioni.',
      excess: 'Epatotossicità, malformazioni fetali, cefalea; l\'eccesso è raro con beta-carotene.'
    },
    en: {
      function: 'Vision, immunity, cell differentiation, and skin health.',
      deficiency: 'Night blindness, xerophthalmia, increased infection susceptibility.',
      excess: 'Hepatotoxicity, birth defects, headache; excess is rare with beta-carotene.'
    },
    de: {
      function: 'Sehkraft, Immunität, Zelldifferenzierung und Hautgesundheit.',
      deficiency: 'Nachtblindheit, Xerophthalmie, erhöhte Infektanfälligkeit.',
      excess: 'Lebertoxizität, Fehlbildungen, Kopfschmerzen; Überschuss mit Betacarotin selten.'
    },
    es: {
      function: 'Visión, inmunidad, diferenciación celular y salud de la piel.',
      deficiency: 'Ceguera nocturna, xeroftalmia, mayor susceptibilidad a infecciones.',
      excess: 'Hepatotoxicidad, malformaciones fetales, cefalea; el exceso es raro con betacaroteno.'
    },
    fr: {
      function: 'Vision, immunité, différenciation cellulaire et santé de la peau.',
      deficiency: 'Cécité nocturne, xérophtalmie, sensibilité accrue aux infections.',
      excess: 'Hépatotoxicité, malformations fœtales, céphalées ; excès rare avec le bêta-carotène.'
    }
  },
  vitamin_c: {
    unit: 'mg/100g',
    it: {
      function: 'Antiossidante, sintesi del collagene, assorbimento del ferro e difese immunitarie.',
      deficiency: 'Scorbuto, gengivopatie, cicatrizzazione lenta, affaticamento.',
      excess: 'Diarrea, calcoli renali (predisposti), disturbi gastrointestinali da alte dosi.'
    },
    en: {
      function: 'Antioxidant, collagen synthesis, iron absorption, and immune defense.',
      deficiency: 'Scurvy, gum disease, slow wound healing, fatigue.',
      excess: 'Diarrhea, kidney stones (in predisposed people), gastrointestinal upset at high doses.'
    },
    de: {
      function: 'Antioxidans, Kollagensynthese, Eisenaufnahme und Immunabwehr.',
      deficiency: 'Skorbut, Zahnfleischerkrankungen, langsame Wundheilung, Müdigkeit.',
      excess: 'Durchfall, Nierensteine (bei Prädisposition), Magen-Darm-Beschwerden bei hohen Dosen.'
    },
    es: {
      function: 'Antioxidante, síntesis de colágeno, absorción de hierro y defensas inmunitarias.',
      deficiency: 'Escorbuto, enfermedad de las encías, cicatrización lenta, fatiga.',
      excess: 'Diarrea, cálculos renales (en personas predispuestas), molestias gastrointestinales con dosis altas.'
    },
    fr: {
      function: 'Antioxydant, synthèse du collagène, absorption du fer et défenses immunitaires.',
      deficiency: 'Scorbut, maladies des gencives, cicatrisation lente, fatigue.',
      excess: 'Diarrhée, calculs rénaux (chez les personnes prédisposées), troubles gastro-intestinaux à fortes doses.'
    }
  },
  vitamin_d: {
    unit: 'µg/100g',
    it: {
      function: 'Assorbimento calcio, salute ossea, funzione immunitaria e regolazione dell\'umore.',
      deficiency: 'Rachitismo, osteomalacia, debolezza muscolare, maggiore rischio infezioni.',
      excess: 'Ipercalcemia, calcoli renali, calcificazioni vascolari; di solito da eccessi integrativi.'
    },
    en: {
      function: 'Calcium absorption, bone health, immune function, and mood regulation.',
      deficiency: 'Rickets, osteomalacia, muscle weakness, increased infection risk.',
      excess: 'Hypercalcemia, kidney stones, vascular calcification; usually from supplement overuse.'
    },
    de: {
      function: 'Kalziumaufnahme, Knochengesundheit, Immunfunktion und Stimmungsregulation.',
      deficiency: 'Rachitis, Osteomalazie, Muskelschwäche, erhöhtes Infektionsrisiko.',
      excess: 'Hyperkalzämie, Nierensteine, Gefäßverkalkung; meist durch übermäßige Supplementierung.'
    },
    es: {
      function: 'Absorción de calcio, salud ósea, función inmunitaria y regulación del estado de ánimo.',
      deficiency: 'Raquitismo, osteomalacia, debilidad muscular, mayor riesgo de infecciones.',
      excess: 'Hipercalcemia, cálculos renales, calcificación vascular; generalmente por uso excesivo de suplementos.'
    },
    fr: {
      function: 'Absorption du calcium, santé osseuse, fonction immunitaire et régulation de l\'humeur.',
      deficiency: 'Rachitisme, ostéomalacie, faiblesse musculaire, risque accru d\'infections.',
      excess: 'Hypercalcémie, calculs rénaux, calcifications vasculaires ; généralement dû à un excès de suppléments.'
    }
  },
  vitamin_e: {
    unit: 'mg/100g',
    it: {
      function: 'Antiossidante liposolubile che protegge membrane cellulari e vasi.',
      deficiency: 'Neuropatia periferica, anemia emolitica, debolezza muscolare (raro).',
      excess: 'Aumento rischio emorragico, interferenza con vitamina K; evitare alte dosi con anticoagulanti.'
    },
    en: {
      function: 'Fat-soluble antioxidant protecting cell membranes and blood vessels.',
      deficiency: 'Peripheral neuropathy, hemolytic anemia, muscle weakness (rare).',
      excess: 'Increased bleeding risk, interference with vitamin K; avoid high doses with anticoagulants.'
    },
    de: {
      function: 'Fettlösliches Antioxidans, das Zellmembranen und Blutgefäße schützt.',
      deficiency: 'Periphere Neuropathie, hämolytische Anämie, Muskelschwäche (selten).',
      excess: 'Erhöhtes Blutungsrisiko, Beeinträchtigung von Vitamin K; hohe Dosen mit Antikoagulanzien vermeiden.'
    },
    es: {
      function: 'Antioxidante liposoluble que protege las membranas celulares y los vasos sanguíneos.',
      deficiency: 'Neuropatía periférica, anemia hemolítica, debilidad muscular (rara).',
      excess: 'Mayor riesgo de sangrado, interferencia con la vitamina K; evitar dosis altas con anticoagulantes.'
    },
    fr: {
      function: 'Antioxydant liposoluble protégeant les membranes cellulaires et les vaisseaux sanguins.',
      deficiency: 'Neuropathie périphérique, anémie hémolytique, faiblesse musculaire (rare).',
      excess: 'Risque accru de saignement, interférence avec la vitamine K ; éviter les fortes doses avec les anticoagulants.'
    }
  },
  b12: {
    unit: 'µg/100g',
    it: {
      function: 'Funzionamento neurologico, produzione globuli rossi e sintesi del DNA.',
      deficiency: 'Anemia megaloblastica, neuropatia, affaticamento, disturbi cognitivi, glossite.',
      excess: 'Bassa tossicità; eccezionalmente acne o iperpigmentazione con integrazioni massicce.'
    },
    en: {
      function: 'Neurological function, red blood cell production, and DNA synthesis.',
      deficiency: 'Megaloblastic anemia, neuropathy, fatigue, cognitive issues, glossitis.',
      excess: 'Low toxicity; rarely acne or hyperpigmentation with massive supplementation.'
    },
    de: {
      function: 'Neurologische Funktion, rote Blutkörperchenbildung und DNA-Synthese.',
      deficiency: 'Megaloblastäre Anämie, Neuropathie, Müdigkeit, kognitive Störungen, Glossitis.',
      excess: 'Geringe Toxizität; selten Akne oder Hyperpigmentierung bei massiver Supplementierung.'
    },
    es: {
      function: 'Función neurológica, producción de glóbulos rojos y síntesis de ADN.',
      deficiency: 'Anemia megaloblástica, neuropatía, fatiga, problemas cognitivos, glositis.',
      excess: 'Baja toxicidad; raramente acné o hiperpigmentación con suplementación masiva.'
    },
    fr: {
      function: 'Fonction neurologique, production de globules rouges et synthèse de l\'ADN.',
      deficiency: 'Anémie mégaloblastique, neuropathie, fatigue, troubles cognitifs, glossite.',
      excess: 'Faible toxicité ; rarement acné ou hyperpigmentation avec une supplémentation massive.'
    }
  },
  omega3: {
    unit: 'mg/100g',
    it: {
      function: 'Anti-infiammatori, salute cardiovascolare, funzione cerebrale e retina.',
      deficiency: 'Pelle secca, calo cognitivo, umore basso, aumento trigliceridi.',
      excess: 'Rischio emorragico con dosi elevate, nausea, disturbi gastrointestinali.'
    },
    en: {
      function: 'Anti-inflammatory, cardiovascular health, brain function, and retina.',
      deficiency: 'Dry skin, cognitive decline, low mood, elevated triglycerides.',
      excess: 'Bleeding risk at high doses, nausea, gastrointestinal upset.'
    },
    de: {
      function: 'Entzündungshemmend, Herz-Kreislauf-Gesundheit, Gehirnfunktion und Netzhaut.',
      deficiency: 'Trockene Haut, kognitiver Abbau, schlechte Laune, erhöhte Triglyceride.',
      excess: 'Blutungsrisiko bei hohen Dosen, Übelkeit, Magen-Darm-Beschwerden.'
    },
    es: {
      function: 'Antiinflamatorio, salud cardiovascular, función cerebral y retina.',
      deficiency: 'Piel seca, deterioro cognitivo, estado de ánimo bajo, triglicéridos elevados.',
      excess: 'Riesgo de sangrado con dosis elevadas, náuseas, molestias gastrointestinales.'
    },
    fr: {
      function: 'Anti-inflammatoire, santé cardiovasculaire, fonction cérébrale et rétine.',
      deficiency: 'Peau sèche, déclin cognitif, humeur basse, triglycérides élevés.',
      excess: 'Risque de saignement à fortes doses, nausées, troubles gastro-intestinaux.'
    }
  },
  selenium: {
    unit: 'µg/100g',
    it: {
      function: 'Antiossidante (glutatione perossidasi), funzione tiroidea e immunitaria.',
      deficiency: 'Cardiomiopatia, indebolimento immunitario, distiroidismo, sterilità.',
      excess: 'Seleniosi: caduta capelli, unghie fragili, nausea, neuropatia; tossicità da integrazione.'
    },
    en: {
      function: 'Antioxidant (glutathione peroxidase), thyroid function, and immunity.',
      deficiency: 'Cardiomyopathy, weakened immunity, thyroid dysfunction, infertility.',
      excess: 'Selenosis: hair loss, brittle nails, nausea, neuropathy; usually from supplements.'
    },
    de: {
      function: 'Antioxidans (Glutathionperoxidase), Schilddrüsenfunktion und Immunität.',
      deficiency: 'Kardiomyopathie, geschwächte Immunität, Schilddrüsenfunktionsstörung, Infertilität.',
      excess: 'Selenose: Haarausfall, brüchige Nägel, Übelkeit, Neuropathie; meist durch Supplemente.'
    },
    es: {
      function: 'Antioxidante (glutation peroxidasa), función tiroidea e inmunidad.',
      deficiency: 'Cardiomiopatía, inmunidad debilitada, disfunción tiroidea, infertilidad.',
      excess: 'Selenosis: caída del cabello, uñas frágiles, náuseas, neuropatía; generalmente por suplementos.'
    },
    fr: {
      function: 'Antioxydant (glutathion peroxydase), fonction thyroïdienne et immunité.',
      deficiency: 'Cardiomyopathie, immunité affaiblie, dysfonctionnement thyroïdien, infertilité.',
      excess: 'Sélénose : chute de cheveux, ongles fragiles, nausées, neuropathie ; généralement due aux suppléments.'
    }
  },
  iodine: {
    unit: 'µg/100g',
    it: {
      function: 'Sintesi ormoni tiroidei, regolazione metabolismo e sviluppo neurologico.',
      deficiency: 'Gozzo, ipotiroidismo, ritardo mentale nello sviluppo fetale-neonatale.',
      excess: 'Ipertiroidismo, tiroiditi, disturbi gastrointestinali; soglia individuale variabile.'
    },
    en: {
      function: 'Thyroid hormone synthesis, metabolism regulation, and neurological development.',
      deficiency: 'Goiter, hypothyroidism, mental retardation in fetal/neonatal development.',
      excess: 'Hyperthyroidism, thyroiditis, gastrointestinal upset; individual threshold varies.'
    },
    de: {
      function: 'Schilddrüsenhormonsynthese, Stoffwechselregulation und neurologische Entwicklung.',
      deficiency: 'Kropf, Hypothyreose, geistige Behinderung bei fetal/neonataler Entwicklung.',
      excess: 'Hyperthyreose, Thyreoiditis, Magen-Darm-Beschwerden; individuelle Schwelle variiert.'
    },
    es: {
      function: 'Síntesis de hormonas tiroideas, regulación del metabolismo y desarrollo neurológico.',
      deficiency: 'Bocio, hipotiroidismo, retraso mental en desarrollo fetal/neonatal.',
      excess: 'Hipertiroidismo, tiroiditis, molestias gastrointestinales; el umbral individual varía.'
    },
    fr: {
      function: 'Synthèse des hormones thyroïdiennes, régulation du métabolisme et développement neurologique.',
      deficiency: 'Goitre, hypothyroïdie, retard mental chez le fœtus/nouveau-né.',
      excess: 'Hyperthyroïdie, thyroïdite, troubles gastro-intestinaux ; seuil individuel variable.'
    }
  },
  sodium: {
    unit: 'mg/100g',
    it: {
      function: 'Equilibrio idrico, trasmissione nervosa e contrazione muscolare.',
      deficiency: 'Crampi, confusione, iponatriemia, shock (raro con dieta normale).',
      excess: 'Ipertensione, sovraccarico cardiaco, edemi; ridurre negli ipertesi e in cardiopatici.'
    },
    en: {
      function: 'Fluid balance, nerve transmission, and muscle contraction.',
      deficiency: 'Cramps, confusion, hyponatremia, shock (rare with a normal diet).',
      excess: 'Hypertension, cardiac overload, edema; reduce in people with hypertension or heart disease.'
    },
    de: {
      function: 'Flüssigkeitsgleichgewicht, Nervenleitung und Muskelkontraktion.',
      deficiency: 'Krämpfe, Verwirrtheit, Hyponatriämie, Schock (bei normaler Ernährung selten).',
      excess: 'Bluthochdruck, Herzüberlastung, Ödeme; bei Hypertonikern und Herzkranken reduzieren.'
    },
    es: {
      function: 'Equilibrio hídrico, transmisión nerviosa y contracción muscular.',
      deficiency: 'Calambres, confusión, hiponatremia, shock (raro con una dieta normal).',
      excess: 'Hipertensión, sobrecarga cardíaca, edemas; reducir en hipertensos y cardiopatas.'
    },
    fr: {
      function: 'Équilibre hydrique, transmission nerveuse et contraction musculaire.',
      deficiency: 'Crampes, confusion, hyponatrémie, choc (rare avec une alimentation normale).',
      excess: 'Hypertension artérielle, surcharge cardiaque, œdèmes ; réduire chez les hypertendus et les cardiaques.'
    }
  },
  vitamin_k: {
    unit: 'µg/100g',
    it: {
      function: 'Coagulazione del sangue e salute ossea.',
      deficiency: 'Emorragie, facile comparsa di lividi; rara negli adulti.',
      excess: 'Interferenza con anticoagulanti; evitare bruschi aumenti con warfarin.'
    },
    en: {
      function: 'Blood clotting and bone health.',
      deficiency: 'Bleeding, easy bruising; rare in adults.',
      excess: 'Interferes with anticoagulants; avoid sudden increases with warfarin.'
    },
    de: {
      function: 'Blutgerinnung und Knochengesundheit.',
      deficiency: 'Blutungen, leichte Blutergüsse; selten bei Erwachsenen.',
      excess: 'Beeinträchtigung von Antikoagulanzien; plötzliche Erhöhung mit Warfarin vermeiden.'
    },
    es: {
      function: 'Coagulación sanguínea y salud ósea.',
      deficiency: 'Sangrado, fácil aparición de hematomas; rara en adultos.',
      excess: 'Interferencia con anticoagulantes; evitar aumentos bruscos con warfarina.'
    },
    fr: {
      function: 'Coagulation sanguine et santé osseuse.',
      deficiency: 'Saignements, hématomes faciles ; rare chez l\'adulte.',
      excess: 'Interférence avec les anticoagulants ; éviter les augmentations brutales avec la warfarine.'
    }
  },
  vitamin_b6: {
    unit: 'mg/100g',
    it: {
      function: 'Metabolismo delle proteine, sintesi neurotrasmettitori e funzione immunitaria.',
      deficiency: 'Anemia microcitica, depressione, confusione, dermatite, neuropatia periferica.',
      excess: 'Neuropatia sensoriale a lungo termine con alte dosi da integrazione.'
    },
    en: {
      function: 'Protein metabolism, neurotransmitter synthesis, and immune function.',
      deficiency: 'Microcytic anemia, depression, confusion, dermatitis, peripheral neuropathy.',
      excess: 'Sensory neuropathy with long-term high-dose supplementation.'
    },
    de: {
      function: 'Proteinmetabolismus, Neurotransmitter-Synthese und Immunfunktion.',
      deficiency: 'Mikrozytäre Anämie, Depression, Verwirrtheit, Dermatitis, periphere Neuropathie.',
      excess: 'Sensorische Neuropathie bei langfristiger hochdosierter Supplementierung.'
    },
    es: {
      function: 'Metabolismo de proteínas, síntesis de neurotransmisores y función inmunitaria.',
      deficiency: 'Anemia microcítica, depresión, confusión, dermatitis, neuropatía periférica.',
      excess: 'Neuropatía sensorial con suplementación a altas dosis a largo plazo.'
    },
    fr: {
      function: 'Métabolisme des protéines, synthèse des neurotransmetteurs et fonction immunitaire.',
      deficiency: 'Anémie microcytaire, dépression, confusion, dermatite, neuropathie périphérique.',
      excess: 'Neuropathie sensorielle avec une supplémentation à long terme à forte dose.'
    }
  },
  manganese: {
    unit: 'mg/100g',
    it: {
      function: 'Cofattore enzimatico per ossa, metabolismo dei carboidrati e difese antiossidanti.',
      deficiency: 'Rara; possibili disturbi ossei, rash, alterazioni del glucosio.',
      excess: 'Sintomi neurologici simili al parkinsonismo da esposizione professionale o idrosolubile elevata.'
    },
    en: {
      function: 'Enzymatic cofactor for bones, carbohydrate metabolism, and antioxidant defenses.',
      deficiency: 'Rare; possible bone issues, rash, glucose abnormalities.',
      excess: 'Neurological symptoms resembling parkinsonism from occupational exposure or high soluble intake.'
    },
    de: {
      function: 'Enzymatischer Cofaktor für Knochen, Kohlenhydratstoffwechsel und antioxidative Abwehr.',
      deficiency: 'Selten; mögliche Knochenprobleme, Ausschlag, Glukoseanomalien.',
      excess: 'Neurologische Symptome ähnlich wie Parkinsonismus durch berufliche Exposition oder hohe lösliche Zufuhr.'
    },
    es: {
      function: 'Cofactor enzimático para huesos, metabolismo de carbohidratos y defensas antioxidantes.',
      deficiency: 'Rara; posibles problemas óseos, erupciones, alteraciones de la glucosa.',
      excess: 'Síntomas neurológicos similares al parkinsonismo por exposición laboral o ingesta elevada soluble.'
    },
    fr: {
      function: 'Cofacteur enzymatique pour les os, le métabolisme des glucides et les défenses antioxydantes.',
      deficiency: 'Rare ; problèmes osseux possibles, éruptions, anomalies de la glycémie.',
      excess: 'Symptômes neurologiques ressemblant au parkinsonisme par exposition professionnelle ou apport soluble élevé.'
    }
  },
  copper: {
    unit: 'mg/100g',
    it: {
      function: 'Formazione del collagene, assorbimento del ferro, funzione immunitaria e nervosa.',
      deficiency: 'Anemia sideroblastica, neuropatia, osteopenia, depigmentazione.',
      excess: 'Nausea, vomito, danno epatico; Wilson rara malattia genetica di accumulo.'
    },
    en: {
      function: 'Collagen formation, iron absorption, immune and nerve function.',
      deficiency: 'Sideroblastic anemia, neuropathy, osteopenia, depigmentation.',
      excess: 'Nausea, vomiting, liver damage; Wilson disease is a rare genetic accumulation disorder.'
    },
    de: {
      function: 'Kollagenbildung, Eisenaufnahme, Immun- und Nervenfunktion.',
      deficiency: 'Sideroblastische Anämie, Neuropathie, Osteopenie, Depigmentierung.',
      excess: 'Übelkeit, Erbrechen, Leberschaden; Morbus Wilson ist eine seltene genetische Akkumulationskrankheit.'
    },
    es: {
      function: 'Formación de colágeno, absorción de hierro, función inmunitaria y nerviosa.',
      deficiency: 'Anemia sideroblástica, neuropatía, osteopenia, despigmentación.',
      excess: 'Náuseas, vómitos, daño hepático; la enfermedad de Wilson es un trastorno genético raro de acumulación.'
    },
    fr: {
      function: 'Formation du collagène, absorption du fer, fonction immunitaire et nerveuse.',
      deficiency: 'Anémie sidéroblastique, neuropathie, ostéopénie, dépigmentation.',
      excess: 'Nausées, vomissements, lésions hépatiques ; la maladie de Wilson est un trouble génétique rare d\'accumulation.'
    }
  },
  phosphorus: {
    unit: 'mg/100g',
    it: {
      function: 'Salute ossea e dentale, produzione ATP, regolazione pH.',
      deficiency: 'Osteomalacia, anoressia, debolezza muscolare, disturbi respiratori (raro).',
      excess: 'Iperparatiroidismo, calcoli renali, calcificazioni; attenzione con insufficienza renale.'
    },
    en: {
      function: 'Bone and dental health, ATP production, pH regulation.',
      deficiency: 'Osteomalacia, anorexia, muscle weakness, respiratory issues (rare).',
      excess: 'Hyperparathyroidism, kidney stones, calcifications; caution with kidney failure.'
    },
    de: {
      function: 'Knochen- und Zahngesundheit, ATP-Produktion, pH-Regulation.',
      deficiency: 'Osteomalazie, Appetitlosigkeit, Muskelschwäche, Atembeschwerden (selten).',
      excess: 'Hyperparathyreoidismus, Nierensteine, Verkalkungen; Vorsicht bei Niereninsuffizienz.'
    },
    es: {
      function: 'Salud ósea y dental, producción de ATP, regulación del pH.',
      deficiency: 'Osteomalacia, anorexia, debilidad muscular, problemas respiratorios (raro).',
      excess: 'Hiperparatiroidismo, cálculos renales, calcificaciones; precaución con insuficiencia renal.'
    },
    fr: {
      function: 'Santé osseuse et dentaire, production d\'ATP, régulation du pH.',
      deficiency: 'Ostéomalacie, anorexie, faiblesse musculaire, problèmes respiratoires (rare).',
      excess: 'Hyperparathyroïdisme, calculs rénaux, calcifications ; prudence en insuffisance rénale.'
    }
  }
};

export type SupportedLocale = 'it' | 'en' | 'de' | 'es' | 'fr';

export function getMicroInfo(key: MicroKey, locale: SupportedLocale) {
  const info = MICRO_NUTRIENT_INFO[key];
  return info ? { ...info[locale], unit: info.unit } : null;
}
