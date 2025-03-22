-- SQL functions for the financial dashboard

-- Function to count invoices by status
CREATE OR REPLACE FUNCTION count_fatture_by_stato()
RETURNS TABLE (stato text, totale bigint) 
LANGUAGE SQL 
AS $$
  SELECT 
    stato,
    COUNT(*) as totale
  FROM fatture
  GROUP BY stato
  ORDER BY totale DESC;
$$;

-- Function to summarize invoices by month for the last 12 months
CREATE OR REPLACE FUNCTION sum_fatture_by_month_last_12_months()
RETURNS TABLE (mese text, anno text, totale text) 
LANGUAGE SQL 
AS $$
  SELECT 
    EXTRACT(MONTH FROM data_emissione)::text as mese,
    EXTRACT(YEAR FROM data_emissione)::text as anno,
    SUM(importo_totale)::text as totale
  FROM fatture
  WHERE data_emissione >= NOW() - INTERVAL '12 months'
  GROUP BY mese, anno
  ORDER BY anno, mese;
$$;

-- Function to find top clients by total amount
CREATE OR REPLACE FUNCTION top_clienti_by_fatturato(limit_num int DEFAULT 5)
RETURNS TABLE (
  cliente_id uuid, 
  nome_cliente text, 
  numero_fatture bigint, 
  totale_fatturato text
) 
LANGUAGE SQL 
AS $$
  SELECT 
    f.cliente_id, 
    COALESCE(c.nome || ' ' || c.cognome, 'Cliente ' || f.cliente_id) as nome_cliente,
    COUNT(*) as numero_fatture, 
    SUM(f.importo_totale)::text as totale_fatturato
  FROM fatture f
  LEFT JOIN clienti c ON f.cliente_id = c.id
  GROUP BY f.cliente_id, nome_cliente
  ORDER BY SUM(f.importo_totale) DESC
  LIMIT limit_num;
$$; 