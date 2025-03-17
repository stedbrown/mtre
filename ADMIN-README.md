# Area Amministrativa M.T.R.E.

Questa è la documentazione per l'area amministrativa del sito M.T.R.E., che consente la gestione di clienti, preventivi e fatture.

## Configurazione

### Prerequisiti

- Account Supabase (https://supabase.com)
- Progetto Next.js 15+ esistente

### Configurazione di Supabase

1. Crea un nuovo progetto su Supabase
2. Esegui lo script SQL `supabase-schema.sql` nella sezione SQL Editor di Supabase per creare le tabelle necessarie
3. Nella sezione Authentication > Settings, abilita l'autenticazione con email/password
4. Crea un utente amministratore nella sezione Authentication > Users

### Configurazione del Progetto

1. Installa le dipendenze necessarie:
   ```bash
   npm install @supabase/ssr @supabase/supabase-js
   ```

2. Configura le variabili d'ambiente nel file `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://tuo-progetto.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=tua-chiave-anon
   ```

## Struttura dell'Area Amministrativa

L'area amministrativa è composta dalle seguenti sezioni:

- **Login**: Pagina di accesso per gli amministratori
- **Dashboard**: Panoramica generale con statistiche e accessi rapidi
- **Clienti**: Gestione dell'anagrafica clienti
- **Preventivi**: Creazione e gestione dei preventivi
- **Fatture**: Creazione e gestione delle fatture

## Funzionalità

### Gestione Clienti

- Visualizzazione elenco clienti
- Aggiunta di nuovi clienti
- Modifica dei dati dei clienti esistenti
- Eliminazione dei clienti

### Gestione Preventivi

- Visualizzazione elenco preventivi
- Creazione di nuovi preventivi
- Aggiunta di voci al preventivo
- Modifica dei preventivi esistenti
- Conversione di preventivi in fatture

### Gestione Fatture

- Visualizzazione elenco fatture
- Creazione di nuove fatture
- Modifica delle fatture esistenti
- Gestione dello stato delle fatture (bozza, inviata, pagata, scaduta)

## Sicurezza

L'area amministrativa è protetta da:

1. Autenticazione tramite Supabase Auth
2. Middleware che verifica l'autenticazione per tutte le rotte admin
3. Row Level Security (RLS) nel database Supabase

## Accesso all'Area Amministrativa

L'area amministrativa è accessibile all'URL `/admin/login`. Dopo l'autenticazione, si viene reindirizzati alla dashboard.

## Supporto

Per assistenza o segnalazione di problemi, contattare l'amministratore del sistema. 