# Piano di Modifica - v2.12.134+

## Stato Attuale
Le modifiche per v2.12.133 sono state completate con successo:
- Badge pre-start funziona ma mostra testo ridondante
- Traduzioni aggiunte per `diet_phase_pre_start_days`
- Riso Bianco/Integrale separati in foodsData.ts
- Raspberries aggiunti a unitMap

## Obiettivi

### 1. Aggiornamento PhaseProgress.tsx

#### 1.1 Rimuovere testo ridondante dal badge pre-start
**File:** `src/components/dietPlan/PhaseProgress.tsx`

Modificare la riga 109 per mostrare solo il numero senza testo:
```tsx
// PRIMA:
`${preStartDaysFromPhase0} ${t('diet_phase_pre_start_days', ...)}`

// DOPO:
`${preStartDaysFromPhase0}`
```

#### 1.2 Aggiungere visualizzazione giorni personalizzazione/fase 3
**File:** `src/components/dietPlan/PhaseProgress.tsx`

Aggiungere nuova chiave di traduzione e logica:
```tsx
// Nell'unità di badge (riga 110-112):
: currentPhase === 'phase3'
  ? `${currentPhaseDayNumber}`
  : `${t('diet_phase_day', ...)} ${currentPhaseDayNumber} / ${totalPhaseDays}`
```

**Nuova traduzione richiesta:** `diet_phase_personalization_days` = "Giorni personalizzazione" (o equivalente in en, de, es, fr)

### 2. Aggiornamento mealGenerator.ts

#### 2.1 Aggiungere unità per alimenti specifici

| Food ID | Alimento | Unità corrente | Unità richiesta |
|---------|----------|----------------|-----------------|
| '57' | Tempeh | pz (150g) | pz (100g - panetto) |
| '29' | Banana | pz (100g) | pz (120g - medie) |
| '19' | Pomodori | g | pz (150g - medie) |
| '24' | Patate | g (escluso) | pz (180g - medie) |

**Modifiche necessarie:**
- Aggiornare `unitMap` in `snapToWholeUnits()`
- Aggiornare `unitGramsMap` in `getUnitGrams()`
- Aggiornare `unitTypeMap` in `getUnitType()`

#### 2.2 Implementare tracking per evitare ripetizione cibi nello stesso giorno
**File:** `src/utils/mealGenerator.ts`

Aggiungere un `Set<string>` per tracciare i foodId usati nello stesso giorno e filtrarli nel `pickRotating()`.

#### 2.3 Individuare ricette complesse e mostrare link
**File:** `src/utils/mealGenerator.ts`

Aggiungere logica per:
- Verificare se portions contiene più di 1 alimento
- Aggiungere riferimento alla ricetta corrispondente se esiste

### 3. Aggiornamento Traduzioni

**File:** `public/locales/{it,en,de,es,fr}/translation.json`

Aggiungere nuove chiavi:
```json
"diet_phase_personalization_days": "…"
```

Traduzioni richieste:
| Lingua | Testo |
|--------|-------|
| it | "Giorni personalizzazione" |
| en | "Personalization days" |
| de | "Personalisationstage" |
| es | "Días de personalización" |
| fr | "Jours de personnalisation" |

### 4. Aggiornamento CHANGELOG.md

Aggiungere sezione per v2.12.134 con le nuove features e fix.

## Ordine di Esecuzione

1. [ ] Aggiungere traduzione `diet_phase_personalization_days` in tutti i file di lingua
2. [ ] Modificare PhaseProgress.tsx per badge più pulito
3. [ ] Aggiornare mealGenerator.ts per unità alimenti specifici
4. [ ] Implementare tracking ripetizione cibi nello stesso giorno
5. [ ] Aggiungere rilevamento ricette complesse
6. [ ] Aggiornare CHANGELOG.md
7. [ ] Eseguire test per verificare tutto funzioni

## Diagramma delle Modifiche

```mermaid
flowchart TD
    A[PhaseProgress.tsx] --> B[Aggiorna badge pre-start]
    A --> C[Aggiungi logica fase 3]
    
    D[mealGenerator.ts] --> E[Aggiorna unitMap tempeh]
    D --> F[Aggiorna unitMap banana]
    D --> G[Aggiungi unità pomodori/patate]
    D --> H[Tracking ripetizione cibi]
    D --> I[Rilevazione ricette complesse]
    
    J[translation.json] --> K[Aggiungi chiave personalizzazione]
    
    L[CHANGELOG.md] --> M[Aggiorna v2.12.134]